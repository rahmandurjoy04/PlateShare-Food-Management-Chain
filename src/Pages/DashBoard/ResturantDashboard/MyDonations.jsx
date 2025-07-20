import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../../hoooks/useAuth';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';

const MyDonations = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['myDonations', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`donations/my-donations?email=${user.email}`);
      return res.data.donations;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`donations/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myDonations']);
      Swal.fire('Deleted!', 'Donation has been deleted.', 'success');
    },
    onError: () => {
      Swal.fire('Error!', 'Failed to delete donation.', 'error');
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this donation!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <div className="text-center py-10 text-lg">Loading your donations...</div>;

  return (
    <div className=" min-w-sm px-4 py-8">
      <h2 className="text-4xl font-bold text-blue-900 text-center mb-6">My Donations</h2>
      {donations.length === 0 ? (
        <p className="text-gray-600 text-4xl yext-center">No donations found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((donation) => (
            <div key={donation._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <img src={donation.image} alt={donation.title} className="w-full h-48 object-cover" />
              <div className="p-4 space-y-2">
                <h3 className="text-xl font-semibold text-blue-800">{donation.title}</h3>
                <p><span className="font-medium"><span className='font-semibold'>Food Type</span>:</span> {donation.foodType}</p>
                <p><span className="font-medium"><span className='font-semibold'>Quantity</span>:</span> {donation.quantity}</p>
                <p><span className="font-medium"><span className='font-semibold'>Restaurant</span>:</span> {donation.restaurantName}</p>
                <p>
                  <span className="font-medium"><span className='font-semibold'>Status</span>:</span>{' '}
                  <span
                    className={`font-bold capitalize ${
                      donation.status === 'pending'
                        ? 'text-yellow-600'
                        : donation.status === 'verified'
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}
                  >
                    {donation.status}
                  </span>
                </p>

                <div className="flex gap-3 pt-2">
                  {donation.status !== 'rejected' && (
                    <button
                      onClick={() => navigate(`/dashboard/restaurant/update-donation/${donation._id}`, { state: donation })}
                      className="bg-blue-900 text-white px-4 py-1 rounded hover:bg-blue-800"
                    >
                      Update
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(donation._id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;
