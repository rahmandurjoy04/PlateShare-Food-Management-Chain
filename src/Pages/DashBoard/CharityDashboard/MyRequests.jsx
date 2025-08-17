import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import useAuth from '../../../hoooks/useAuth';
import LoadingSpinner from '../../../Shared/LoadingSpinner/LoadingSpinner';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;

  // Fetch all donation requests made by this charity
  useEffect(() => {
    if (!email) return;

    setLoading(true);
    axiosSecure
      .get(`donation-requests?charityEmail=${encodeURIComponent(email)}`)
      .then((res) => {
        setRequests(res.data || []);
      })
      .catch((err) => {
        console.error('Error fetching requests:', err);
        Swal.fire('Error', 'Failed to load your requests.', 'error');
      })
      .finally(() => setLoading(false));
  }, [email, axiosSecure]);

  // Cancel a pending request
  const handleCancel = async (requestId) => {
    const result = await Swal.fire({
      title: 'Cancel Request?',
      text: 'Are you sure you want to cancel this pending request?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`donation-requests/charity/${requestId}`);
        if (res.status === 200) {
          Swal.fire('Cancelled', 'Your request has been cancelled.', 'success');
          setRequests((prev) => prev.filter((r) => r._id !== requestId));
        }
      } catch (error) {
        console.error('Cancel failed:', error);
        Swal.fire('Error', 'Failed to cancel the request.', 'error');
      }
    }
  };

  return (
    <div className="max-w-11/12 min-w-sm w-full mx-auto py-6">
      <h2 className="text-4xl font-bold text-center mb-8 text-primary">My Requests</h2>

      {loading && <LoadingSpinner></LoadingSpinner>}

      {!loading && requests.length === 0 && (
        <p className="text-center text-gray-500">You have not made any donation requests yet.</p>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {requests.map((req) => (
          <div key={req._id} className="bg-accent/70 rounded-lg shadow-md p-5 hover:shadow-secondary">
            <h3 className="text-xl font-extrabold text-primary mb-2 truncate">{req.donationTitle}</h3>
            <p className="text-gray-700 mb-1"><strong>Restaurant:</strong> {req.restaurantName}</p>
            <p className="text-gray-700 mb-1"><strong>Food Type:</strong> {req.foodType}</p>
            <p className="text-gray-700 mb-1"><strong>Quantity:</strong> {req.quantity}</p>
            <p className="text-gray-700 mb-3">
              <strong>Status:</strong>{' '}
              <span
                className={
                  req.status === 'Accepted'
                    ? 'text-green-600 font-medium'
                    : req.status === 'Rejected'
                    ? 'text-red-600 font-medium'
                    : 'text-yellow-600 font-medium'
                }
              >
                {req.status}
              </span>
            </p>

            {req.status === 'Pending' && (
              <button
                onClick={() => handleCancel(req._id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Cancel Request
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRequests;
