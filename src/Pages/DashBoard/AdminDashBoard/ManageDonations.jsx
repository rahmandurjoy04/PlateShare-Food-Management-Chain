import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import Swal from 'sweetalert2';
import LoadingSpinner from '../../../Shared/LoadingSpinner/LoadingSpinner';

const ManageDonations = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all donations
  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      const res = await axiosSecure.get('donations');
      return res.data;
    },
  });

  // Mutation for updating donation status
  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`donations/${id}/status`, { status });
      return res.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['donations']);
      Swal.fire('Success', `Donation ${variables.status}`, 'success');
    },
    onError: () => {
      Swal.fire('Error', 'Failed to update status', 'error');
    },
  });

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Manage Donations</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="table w-full">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th>Title</th>
              <th>Food Type</th>
              <th>Quantity</th>
              <th>Restaurant</th>
              <th>Email</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation._id}>
                <td>{donation.title}</td>
                <td>{donation.foodType}</td>
                <td>{donation.quantity}</td>
                <td>{donation.restaurantName}</td>
                <td>{donation.restaurantEmail}</td>
                <td>
                  <span
                    className={`font-semibold px-2 py-1 rounded text-white ${
                      donation.status === 'Verified'
                        ? 'bg-green-600'
                        : donation.status === 'Rejected'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {donation.status}
                  </span>
                </td>
                <td className="space-x-2 text-center">
                  {donation.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus({ id: donation._id, status: 'Verified' })}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => updateStatus({ id: donation._id, status: 'Rejected' })}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-10">
                  No donations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageDonations;
