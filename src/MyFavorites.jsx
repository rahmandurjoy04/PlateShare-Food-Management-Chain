import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from './hoooks/useAxiosSecure';
import useAuth from './hoooks/useAuth';

const MyFavorites = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const fetchFavorites = async () => {
    const { data } = await axiosSecure.get(`favorites?email=${user?.email}`);
    return data.favorites || [];
  };

  const removeFavorite = async (donationId) => {
    if (!user?.email) throw new Error("User email is missing");
    await axiosSecure.delete(`favorites`, { data: { donationId, email: user.email } });
  };

  const { data: favorites, isLoading, isError, error } = useQuery({
    queryKey: ['favorites', user?.email],
    queryFn: fetchFavorites,
    enabled: !!user?.email,
    staleTime: 5 * 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: (_, donationId) => {
      queryClient.setQueryData(['favorites', user?.email], (old = []) =>
        old.filter((fav) => fav.donationId !== donationId)
      );
      Swal.fire({
        icon: 'success',
        title: 'Removed!',
        text: 'Favorite item has been removed.',
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message || 'Failed to remove favorite.',
      });
    },
  });

  const handleRemoveFavorite = (donationId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to remove this favorite item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(donationId);
      }
    });
  };

  if (isLoading) return <p className="text-center mt-8">Loading favorites...</p>;
  if (isError) return <p className="text-center mt-8 text-red-600">Error: {error.message}</p>;
  if (!favorites || favorites.length === 0) return <p className="text-center mt-8">No favorites found.</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl text-blue-800 font-semibold mb-6 text-center">My Favorites</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((fav) => (
          <div key={fav._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <img
              src={fav.donationImage}
              alt={fav.donationTitle}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-bold mb-1 truncate">{fav.donationTitle}</h3>
              <p className="text-sm text-gray-600 mb-1 truncate">
                {fav.restaurantName} - {fav.location}
              </p>
              <p className="text-sm mb-1">
                <span className="font-semibold">Status:</span> {fav.status}
              </p>
              <p className="text-sm mb-4">
                <span className="font-semibold">Quantity:</span> {fav.quantity}
              </p>

              <div className="mt-auto flex gap-3">
                <button
                  onClick={() => navigate(`/donation/${fav.donationId}`)}
                  className="flex-grow bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
                >
                  Details
                </button>
                <button
                  onClick={() => handleRemoveFavorite(fav.donationId)}
                  disabled={mutation.isLoading}
                  className={`flex-grow py-2 rounded-md transition text-white ${
                    mutation.isLoading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {mutation.isLoading ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyFavorites;
