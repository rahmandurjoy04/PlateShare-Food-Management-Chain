import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hoooks/useAxiosSecure';
import useAuth from '../../hoooks/useAuth';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const MyReviews = () => {
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch user-specific reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['user-reviews', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews?email=${user?.email}`);
      return res.data.reviews;
    },
    enabled: !!user?.email,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/reviews/${id}`);
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

  if (isLoading) return <p className="text-center text-lg">Loading your reviews...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">My Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">You haven't submitted any reviews yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map(review => (
            <div key={review._id} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold text-blue-800">{review.donationTitle}</h3>
              <p className="text-sm text-gray-600 mb-1">From: {review.restaurantName}</p>
              <p className="text-sm text-gray-500 mb-2">Reviewed on: {format(new Date(review.createdAt), 'PPP')}</p>
              <p className="text-gray-700 mb-4">{review.description}</p>
              <button
                onClick={() => handleDelete(review._id)}
                className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
