import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../../hoooks/useAuth';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import LoadingSpinner from '../../../Shared/LoadingSpinner/LoadingSpinner';

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

  if (isLoading) return <LoadingSpinner></LoadingSpinner>

  return (
    <div className=" min-w-sm px-4 py-8">
      <h2 className="text-4xl font-bold text-primary text-center mb-6">My Donations</h2>
      {donations.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-blue-100 shadow-md rounded-xl border border-gray-200">
          
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Donations Found</h2>
          <p className="text-gray-500 mb-4 max-w-md">
            Looks like there are no donations available right now. Please check back later or explore other sections.
          </p>
          <button
            className="mt-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition"
            onClick={() => navigate('/dashboard/restaurant/add-donation')} // change route if needed
          >
            Add Donation
          </button>
        </div>
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
                    className={`font-bold capitalize ${donation.status === 'pending'
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
