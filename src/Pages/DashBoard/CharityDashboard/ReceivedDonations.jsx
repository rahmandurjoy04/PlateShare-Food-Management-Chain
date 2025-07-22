import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import useAuth from '../../../hoooks/useAuth';
import LoadingSpinner from '../../../Shared/LoadingSpinner/LoadingSpinner';

const ReceivedDonations = () => {
  const [receivedDonations, setReceivedDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [currentDonation, setCurrentDonation] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const charityEmail = user?.email;

  useEffect(() => {
    const fetchReceivedDonations = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosSecure.get('received-donations', {
          params: { email: charityEmail },
        });

        // Filter donations with status === "Picked Up"
        const pickedUpDonations = response.data.filter(d => d.status === 'Picked Up');

        setReceivedDonations(pickedUpDonations);
      } catch (err) {
        setError('Failed to load received donations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (charityEmail) {
      fetchReceivedDonations();
    }
  }, [charityEmail, axiosSecure]);

  const openReviewModal = (donation) => {
    setCurrentDonation(donation);
    setReviewText('');
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setCurrentDonation(null);
  };

  const submitReview = async () => {
    if (!reviewText.trim()) return;

    try {
      // Example API call to submit review — adjust endpoint as needed
      await axiosSecure.post('donation-reviews', {
        donationId: currentDonation._id,
        review: reviewText.trim(),
        charityEmail,
      });
      alert('Review submitted successfully!');
      closeReviewModal();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner></LoadingSpinner>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (receivedDonations.length === 0)
    return <p className="text-center text-4xl mt-8 text-gray-500">No received donations found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">Received Donations</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {receivedDonations.map((donation) => (
          <div
            key={donation._id}
            className="card bg-base-100 shadow-lg border border-gray-200 rounded-lg flex flex-col justify-between"
          >
            <div className="card-body">
              <h3 className="card-title text-2xl font-bold text-blue-900 mb-2">
                {donation.donationTitle}
              </h3>
              <p>
                <span className="font-semibold">Restaurant:</span> {donation.restaurantName}
              </p>
              <p>
                <span className="font-semibold">Food Type:</span> {donation.foodType}
              </p>
              <p>
                <span className="font-semibold">Quantity:</span> {donation.quantity}
              </p>
              <p>
                <span className="font-semibold">Pickup Date:</span>{' '}
                {new Date(donation.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="card-actions justify-end p-4 pt-0">
              <button
                className="btn btn-primary btn-sm w-full"
                onClick={() => openReviewModal(donation)}
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeReviewModal}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">Add Review for {currentDonation.donationTitle}</h3>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              rows={5}
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button className="btn btn-ghost" onClick={closeReviewModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submitReview}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceivedDonations;
