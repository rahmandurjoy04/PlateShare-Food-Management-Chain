import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import useAuth from '../../../hoooks/useAuth';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const{user} = useAuth();
  const email=user.email;

  // Fetch requests made by this charity
  useEffect(() => {
    if (!email) return;

    setLoading(true);
    axiosSecure.get(`donation-requests?charityEmail=${encodeURIComponent(email)}`)
      .then(res => {
        setRequests(res.data || []);
      })
      .catch(err => {
        console.error('Error fetching requests:', err);
        Swal.fire('Error', 'Failed to load your requests.', 'error');
      })
      .finally(() => setLoading(false));
  }, [email, axiosSecure]);

  // Cancel request if pending
  const handleCancel = async (requestId) => {
    const confirmResult = await Swal.fire({
      title: 'Cancel Request?',
      text: "Are you sure you want to cancel this pending request?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No'
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/donation-requests/${requestId}`);
        if (res.status === 200) {
          Swal.fire('Cancelled', 'Your request was cancelled.', 'success');
          // Remove cancelled request from state
          setRequests(prev => prev.filter(r => r._id !== requestId));
        }
      } catch (error) {
        console.error('Cancel failed:', error);
        Swal.fire('Error', 'Failed to cancel the request.', 'error');
      }
    }
  };

  return (
    <div className="min-w-sm mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">My Requests</h2>

      {loading && <p className="text-center">Loading your requests...</p>}

      {!loading && requests.length === 0 && (
        <p className="text-center text-gray-500">You have not made any donation requests yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {requests.map((req) => (
          <div key={req._id} className="border rounded-xl shadow p-4 bg-white">
            <h3 className="font-semibold text-blue-800 text-xl mb-2">{req.donationTitle}</h3>
            <p><strong>Restaurant:</strong> {req.restaurantName}</p>
            <p><strong>Food Type:</strong> {req.foodType}</p>
            <p><strong>Quantity:</strong> {req.quantity}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={
                req.status === 'Accepted' ? 'text-green-600 font-semibold' :
                req.status === 'Rejected' ? 'text-red-600 font-semibold' :
                'text-yellow-600 font-semibold'
              }>
                {req.status}
              </span>
            </p>

            {req.status === 'Pending' && (
              <button
                onClick={() => handleCancel(req._id)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
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
