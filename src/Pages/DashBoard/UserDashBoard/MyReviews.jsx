import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import useAuth from '../../../hoooks/useAuth';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import LoadingSpinner from '../../../Shared/LoadingSpinner/LoadingSpinner';

const MyReviews = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['user-reviews', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`my-reviews?email=${user?.email}`);
      return res.data.reviews;
    },
    enabled: !!user?.email,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`reviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-reviews', user?.email]);
      Swal.fire('Deleted!', 'Review has been removed.', 'success');
    },
    onError: () => {
      Swal.fire('Error!', 'Failed to delete review.', 'error');
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This review will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-blue-800 mb-8 text-center">My Reviews</h2>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">You haven't submitted any reviews yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
  key={review._id}
  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-md space-y-4 transition hover:shadow-lg"
>
  <div className="bg-blue-50 p-3 rounded-md">
    <h3 className="text-lg font-bold text-blue-800">🍽️ Donation: <span className="text-gray-800 text-md">{review.donationTitle || 'Untitled Donation'}</span>
</h3>

    <h4 className="text-lg font-bold text-green-800">🏪 Restaurant Name: <span className="text-gray-800">{review.resturant_name || 'Unknown Restaurant'}</span>
</h4>

    <h4 className="text-lg font-bold text-yellow-800">📅 Review Date: <span className="text-gray-800">{format(new Date(review.createdAt), 'PPP')}</span>
</h4>
  </div>

  <div className="bg-gray-200 p-3 rounded-md">
    <h4 className="text-lg font-semibold text-gray-800">💬 Review</h4>
    <p className="text-gray-700 bg-gray-100 p-2 my-2 rounded">{review.description}</p>
  </div>

  <div className="text-right">
    <button
      onClick={() => handleDelete(review._id)}
      className="btn btn-sm w-full bg-red-500 text-white hover:bg-red-600"
    >
      Delete
    </button>
  </div>
</div>

          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
