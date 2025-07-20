import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hoooks/useAxiosSecure';
import useAuth from '../../hoooks/useAuth';
import useGetUserRole from '../../hoooks/useGetUserRole';

// Dummy user info - replace with your auth/user context
const dummyUser = {
    role: 'charity', // 'user' or 'charity'
};


const DonationDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const {role,roleLoading} = useGetUserRole();

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

    // Fetch reviews
    const { data: reviews = [], refetch: refetchReviews } = useQuery({
        queryKey: ['donationReviews', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`donations/${id}/reviews`);
            return res.data;
        },
        enabled: !!id,
    });

    // Save to Favorites mutation
    const saveFavoriteMutation = useMutation({
        mutationFn: async () => {
            return axiosSecure.post('/favorites', {
                donationId: id,
                userEmail: user.email,
            });
        },
        onSuccess: () => {
            Swal.fire('Saved!', 'Donation saved to your favorites.', 'success');
        },
        onError: () => {
            Swal.fire('Error', 'Failed to save favorite.', 'error');
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
                location:donation.location
            });
        },
        onSuccess: () => {
            Swal.fire('Request Sent', 'Your request is pending approval.', 'success');
            setShowRequestModal(false);
        },
        onError: () => {
            Swal.fire('Error', 'Failed to send request.', 'error');
        },
    });

    // Confirm Pickup mutation
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
            return axiosSecure.post(`donations/${id}/reviews`, {
                reviewerName: user.name,
                description: reviewDescription,
                rating: reviewRating,
            });
        },
        onSuccess: () => {
            Swal.fire('Thank you!', 'Your review has been added.', 'success');
            setShowReviewModal(false);
            setReviewDescription('');
            setReviewRating(5);
            refetchReviews();
        },
        onError: () => {
            Swal.fire('Error', 'Failed to add review.', 'error');
        },
    });

    if (isLoading || roleLoading) return <div className="text-center mt-10">Loading details...</div>;
    if (!donation) return <div className="text-center mt-10">Donation not found.</div>;

    // Example condition: show Confirm Pickup if charity and donation request status accepted
    // You'll need to adapt this based on your real data structure
    const canConfirmPickup = role === 'charity' && donation.delivery_status === 'Requested';
    console.log(role);

    return (
        <div className="max-w-xl min-w-sm mx-auto bg-white shadow-lg rounded p-8 my-10 space-y-6">
            {/* Image */}
            <img src={donation.image} alt={donation.title} className="w-full rounded-md mb-6" />

            {/* Titles and info */}
            <h1 className="text-4xl font-bold text-blue-900">{donation.title}</h1>

            <div className="flex items-center space-x-3 mt-1">

                <span
                    className={`px-3 py-1 rounded-full font-semibold uppercase tracking-wide ${donation.delivery_status === 'Available'
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
            <div className="flex flex-col space-y-4 ">
                {/* Save to Favorites */}
                <button
                    onClick={() => saveFavoriteMutation.mutate()}
                    disabled={saveFavoriteMutation.isLoading}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-md transition"
                >
                    {saveFavoriteMutation.isLoading ? 'Saving...' : 'Save to Favorites'}
                </button>

                {/* Request Donation (Charity only) */}
                {role === 'charity' && donation.delivery_status === 'Available' && (
                    <button
                        onClick={() => setShowRequestModal(true)}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-md transition"
                    >
                        Request Donation
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
                        {reviews.map((r) => (
                            <li key={r._id} className="border rounded p-4 bg-gray-50 shadow-sm">
                                <p className="font-semibold">{r.reviewerName}</p>
                                <p>⭐ {r.rating} / 5</p>
                                <p>{r.description}</p>
                            </li>
                        ))}
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
                                    value={dummyUser.name}
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
