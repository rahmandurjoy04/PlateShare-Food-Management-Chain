import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import LoadingSpinner from '../../../Shared/LoadingSpinner/LoadingSpinner';

const FeatureDonations = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all verified donations
  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['verifiedDonations'],
    queryFn: async () => {
      const res = await axiosSecure.get('donations');
      return res.data.filter(donation => donation.status === 'Verified');
    }
  });

  // Mutation for marking as featured
  const { mutate: markAsFeatured, isPending } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`donations/${id}/feature`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['verifiedDonations']);
      Swal.fire('Success', 'Donation marked as featured!', 'success');
    },
    onError: () => {
      Swal.fire('Error', 'Failed to mark donation as featured.', 'error');
    }
  });

  if (isLoading) return <LoadingSpinner/>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Verified Donations</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Food Type</th>
              <th>Restaurant</th>
              <th className="text-center">Feature</th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-10">No verified donations available.</td>
              </tr>
            ) : (
              donations.map((donation) => (
                <tr key={donation._id}>
                  <td>
                    <img src={donation.image} alt={donation.title} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="font-semibold">{donation.title}</td>
                  <td>{donation.foodType}</td>
                  <td>{donation.restaurantName}</td>
                  <td className="text-center">
                    <button
                      onClick={() => markAsFeatured(donation._id)}
                      className={`btn btn-sm w-full ${
                        donation.featured ? 'btn-success cursor-not-allowed' : 'btn-primary'
                      }`}
                      disabled={donation.featured || isPending}
                    >
                      {donation.featured ? 'Featured' : 'Feature'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeatureDonations;
