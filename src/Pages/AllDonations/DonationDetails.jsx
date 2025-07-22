import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hoooks/useAxiosSecure';
import useAuth from '../../hoooks/useAuth';
import useGetUserRole from '../../hoooks/useGetUserRole';
import LoadingSpinner from '../../Shared/LoadingSpinner/LoadingSpinner';

const DonationDetails = () => {
    const { id } = useParams(); // This is the donationId, e.g., "687f7f194c3081a6d6d219c8"
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useAuth(); // Contains user.email, e.g., "charity@plateshare.com"
    const { role, roleLoading } = useGetUserRole();

    // States for modals and forms
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [requestDescription, setRequestDescription] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [reviewDescription, setReviewDescription] = useState('');
    const [reviewRating, setReviewRating] = useState(5);

    // Fetch donation details
    const { data: donation, isLoading } = useQuery({
        queryKey: ['donation', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`donations/${id}`);
            return res.data;
        },
    });

    // Fetch donation requests to check if the current user has already requested
    const { data: donationRequests = [], isLoading: requestsLoading } = useQuery({
        queryKey: ['donationRequests', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`donation-requests/${id}`);
            return res.data; // Expects array of requests like the one you provided
        },
        enabled: !!id,
    });

    // Check if the current user has already requested this donation
    const hasRequested = donationRequests.some(
        (request) => request.charityEmail === user?.email
    ); // Matches "charity@plateshare.com" in your data

    // Fetch reviews (unchanged)
    const { data: reviews = [], refetch: refetchReviews } = useQuery({
        queryKey: ['donationReviews', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`donations/${id}/reviews`);
            return res.data;
        },
        enabled: !!id,
    });

    // Save to Favorites mutation (unchanged)
    const saveFavoriteMutation = useMutation({
        mutationFn: async () => {
            return axiosSecure.post('favorites', {
                donationId: donation._id,
                userEmail: user.email,
                donationTitle: donation.title,
                donationImage: donation.image,
                restaurantName: donation.restaurantName,
                location: donation.location,
                status: donation.delivery_status,
                quantity: donation.quantity,
            });
        },
        onSuccess: () => {
            Swal.fire('Saved!', 'Donation saved to your favorites.', 'success');
        },
        onError: (error) => {
            if (error.response?.status === 409) {
                Swal.fire('Already Saved', 'This donation is already in your favorites.', 'info');
            } else {
                Swal.fire('Error', 'Failed to save favorite.', 'error');
            }
        },
    });

    // Request Donation mutation
    const requestDonationMutation = useMutation({
        mutationFn: async () => {
            return axiosSecure.post('donation-requests', {
                donationId: id,
                donationTitle: donation.title,
                restaurantName: donation.restaurantName,
                charityName: user.displayName,
                charityEmail: user.email,
                requestDescription,
                pickupTime,
                foodType: donation.foodType,
                quantity: donation.quantity,
                location: donation.location,
                image: user.photoURL,
            });
        },
        onSuccess: () => {
            Swal.fire('Request Sent', 'Your request is pending approval.', 'success');
            setShowRequestModal(false);
            queryClient.invalidateQueries(['donationRequests', id]); // Refresh requests to update hasRequested
        },
        onError: () => {
            Swal.fire('Error', 'Failed to send request.', 'error');
        },
    });

    // Confirm Pickup mutation (unchanged)
    const canConfirmPickup = role === 'charity' && donation?.delivery_status === 'Requested';
    const confirmPickupMutation = useMutation({
        mutationFn: async () => {
            return axiosSecure.patch(`donations/${id}/pickup`);
        },
        onSuccess: () => {
            Swal.fire('Success', 'Donation marked as Picked Up.', 'success');
            queryClient.invalidateQueries(['donation', id]);
        },
        onError: () => {
            Swal.fire('Error', 'Failed to confirm pickup.', 'error');
        },
    });

    // Add Review mutation
const addReviewMutation = useMutation({
    mutationFn: async () => {
        return axiosSecure.post('reviews', {
            post_id: id,
            reviewerName: user.displayName || user.name,
            reviewerEmail: user.email,
            description: reviewDescription,
            rating: reviewRating,
            resturant_name: donation.restaurantName,
            donationTitle: donation.title,
        });
    },
    onSuccess: () => {
        Swal.fire('Thank you!', 'Your review has been added.', 'success');
        setShowReviewModal(false); // Corrected line
        setReviewDescription('');
        setReviewRating(5);
        refetchReviews();
    },
    onError: () => {
        Swal.fire('Error', 'Failed to add review.', 'error');
    },
});

    if (isLoading || roleLoading || requestsLoading) return <LoadingSpinner />;
    if (!donation) return <div className="text-center mt-10">Donation not found.</div>;

    return (
        <div className="max-w-xl min-w-sm mx-auto bg-white shadow-lg rounded p-8 my-10 space-y-6">
            {/* Image */}
            <img src={donation.image} alt={donation.title} className="w-full rounded-md mb-6" />

            {/* Titles and info */}
            <h1 className="text-4xl font-bold text-blue-900">{donation.title}</h1>

            <div className="flex items-center space-x-3 mt-1">
                <span
                    className={`px-3 py-1 rounded-full font-semibold uppercase tracking-wide ${
                        donation.delivery_status === 'Available'
                            ? 'bg-green-500 text-white'
                            : donation.delivery_status === 'Requested'
                            ? 'bg-yellow-500 text-black'
                            : donation.delivery_status === 'Picked Up'
                            ? 'bg-gray-500 text-white'
                            : 'bg-blue-500 text-white'
                    }`}
                >
                    {donation.delivery_status}
                </span>
            </div>

            <div className="space-y-2 mt-4">
                <p><strong className="text-lg font-semibold">Food Type:</strong> {donation.foodType}</p>
                <p><strong className="text-lg font-semibold">Quantity:</strong> {donation.quantity}</p>
                <p><strong className="text-lg font-semibold">Restaurant:</strong> {donation.restaurantName}</p>
                <p><strong className="text-lg font-semibold">Location:</strong> {donation.location}</p>
                <p><strong className="text-lg font-semibold">Pickup Time:</strong> {donation.pickupTime}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col space-y-4">
                {/* Save to Favorites */}
                {(role === 'charity' || role === 'user') && (
                    <button
                        onClick={() => saveFavoriteMutation.mutate()}
                        disabled={saveFavoriteMutation.isLoading}
                        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition"
                    >
                        {saveFavoriteMutation.isLoading ? 'Saving...' : 'Save to Favorites'}
                    </button>
                )}

                {/* Request Donation (Charity only) */}
                {role === 'charity' && donation.delivery_status === 'Available' && (
                    <button
                        onClick={() => setShowRequestModal(true)}
                        disabled={hasRequested || requestDonationMutation.isLoading}
                        className={`w-full font-semibold py-2 rounded-md transition ${
                            hasRequested
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                        }`}
                    >
                        {hasRequested
                            ? 'Already Requested'
                            : requestDonationMutation.isLoading
                            ? 'Requesting...'
                            : 'Request Donation'}
                    </button>
                )}

                {/* Confirm Pickup (Charity only, when request accepted) */}
                {canConfirmPickup && (
                    <button
                        onClick={() => confirmPickupMutation.mutate()}
                        disabled={confirmPickupMutation.isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
                    >
                        {confirmPickupMutation.isLoading ? 'Confirming...' : 'Confirm Pickup'}
                    </button>
                )}
            </div>

            {/* Reviews Section */}
            <section className="mt-10">
                <h2 className="text-2xl font-bold mb-4">Reviews</h2>
                {reviews.length === 0 ? (
                    <p className="text-gray-600">No reviews yet.</p>
                ) : (
                    <ul className="space-y-4 max-h-60 overflow-y-auto">
                        <div className="flex flex-col gap-6 mt-6">
                            {reviews.map((review) => (
                                <div
                                    key={review._id}
                                    className="bg-white shadow-md border border-gray-200 rounded-xl p-5 transition hover:shadow-lg"
                                >
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full text-xl font-bold">
                                            {review.reviewerName?.charAt(0) || 'U'}
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-semibold text-gray-800">{review.reviewerName}</h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mb-3 p-3 rounded-xl bg-gray-100">
                                        <p className="text-gray-700">{review.description}</p>
                                    </div>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.259 3.89a1 1 0 00.95.69h4.104c.969 0 1.371 1.24.588 1.81l-3.32 2.413a1 1 0 00-.364 1.118l1.26 3.889c.3.921-.755 1.688-1.54 1.118l-3.32-2.413a1 1 0 00-1.176 0l-3.32 2.413c-.784.57-1.838-.197-1.539-1.118l1.26-3.889a1 1 0 00-.364-1.118L2.107 9.317c-.783-.57-.38-1.81.588-1.81h4.104a1 1 0 00.951-.69l1.259-3.89z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ul>
                )}
                <button
                    onClick={() => setShowReviewModal(true)}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md"
                >
                    Add Review
                </button>
            </section>

            {/* Request Donation Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                        <h3 className="text-xl font-bold mb-4">Request Donation</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                requestDonationMutation.mutate();
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block font-semibold mb-1">Donation Title</label>
                                <input
                                    type="text"
                                    value={donation.title}
                                    readOnly
                                    className="w-full border rounded p-2 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Restaurant Name</label>
                                <input
                                    type="text"
                                    value={donation.restaurantName}
                                    readOnly
                                    className="w-full border rounded p-2 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Charity Name</label>
                                <input
                                    type="text"
                                    value={user.displayName}
                                    readOnly
                                    className="w-full border rounded p-2 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Charity Email</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    readOnly
                                    className="w-full border rounded p-2 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Request Description</label>
                                <textarea
                                    value={requestDescription}
                                    onChange={(e) => setRequestDescription(e.target.value)}
                                    required
                                    className="w-full border rounded p-2"
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Pickup Time</label>
                                <input
                                    type="text"
                                    value={pickupTime}
                                    onChange={(e) => setPickupTime(e.target.value)}
                                    placeholder="E.g. 12pm-2pm"
                                    required
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowRequestModal(false)}
                                    className="px-4 py-2 rounded border border-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={requestDonationMutation.isLoading}
                                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 font-semibold rounded text-black"
                                >
                                    {requestDonationMutation.isLoading ? 'Sending...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                        <h3 className="text-xl font-bold mb-4">Add Review</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addReviewMutation.mutate();
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block font-semibold mb-1">Reviewer Name</label>
                                <input
                                    type="text"
                                    value={user?.displayName}
                                    readOnly
                                    className="w-full border rounded p-2 bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Rating</label>
                                <select
                                    value={reviewRating}
                                    onChange={(e) => setReviewRating(Number(e.target.value))}
                                    className="w-full border rounded p-2"
                                    required
                                >
                                    {[5, 4, 3, 2, 1].map((r) => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-semibold mb-1">Review Description</label>
                                <textarea
                                    value={reviewDescription}
                                    onChange={(e) => setReviewDescription(e.target.value)}
                                    required
                                    className="w-full border rounded p-2"
                                    rows={3}
                                />
                            </div>
                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowReviewModal(false)}
                                    className="px-4 py-2 rounded border border-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addReviewMutation.isLoading}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 font-semibold rounded text-white"
                                >
                                    {addReviewMutation.isLoading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DonationDetails;