import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';

const RequestedDonations = () => {
  const [requests, setRequests] = useState([]);
  const [selectedDescription, setSelectedDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get('donation-requests')
      .then(res => setRequests(res.data))
      .catch(err => console.error('Error fetching donation requests:', err));
  }, [axiosSecure]);

  const handleStatusChange = async (requestId, donationId, newStatus) => {
    try {
      const res = await axiosSecure.patch(`donation-requests/status/${requestId}`, {
        status: newStatus,
        donationId
      });

      if (res.data.modifiedCount > 0 || res.data.matchedCount > 0) {
        Swal.fire('Success', `Request ${newStatus}`, 'success');
        const updated = await axiosSecure.get('donation-requests');
        setRequests(updated.data);
      }
    } catch (error) {
      console.error('Status update failed:', error);
      Swal.fire('Error', 'Something went wrong.', 'error');
    }
  };

  const openModal = (description) => {
    setSelectedDescription(description);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDescription('');
  };

  return (
    <div className='min-w-sm px-4'>
      <h2 className="text-4xl text-blue-900 text-center font-bold m-4">Requested Donations</h2>
      <div className="overflow-x-auto">
        <table className="table w-full border">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th>Title</th>
              <th>Food Type</th>
              <th>Charity Name</th>
              <th>Charity Email</th>
              <th>Description</th>
              <th>Pickup Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="font-medium">{req.donationTitle}</td>
                <td>{req.foodType}</td>
                <td>{req.charityName}</td>
                <td>{req.charityEmail}</td>
                <td>
                  <button
                    onClick={() => openModal(req.requestDescription)}
                    className="text-blue-600 btn rounded btn-outline btn-sm hover:text-blue-800"
                  >
                    View
                  </button>
                </td>
                <td>{req.pickupTime}</td>
                <td className={`font-semibold ${req.status === 'Accepted' ? 'text-green-600' : req.status === 'Rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {req.status}
                </td>
                <td>
                  {req.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded"
                        onClick={() => handleStatusChange(req._id, req.donationId, 'Accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded"
                        onClick={() => handleStatusChange(req._id, req.donationId, 'Rejected')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {requests.length === 0 && <p className="text-center text-gray-500 mt-6">No requests found.</p>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl relative">
            <h3 className="text-xl font-bold mb-2 text-gray-800">Request Description</h3>
            <p className="text-gray-700 mb-4">{selectedDescription}</p>
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-600 text-xl font-bold"
            >
              ×
            </button>
            <button
              onClick={closeModal}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestedDonations;
