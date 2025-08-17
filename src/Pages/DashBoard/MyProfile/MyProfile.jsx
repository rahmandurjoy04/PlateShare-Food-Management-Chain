import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import useAuth from '../../../hoooks/useAuth';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import LoadingSpinner from '../../../Shared/LoadingSpinner/LoadingSpinner';

const formatDateTime = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

const MyProfile = () => {
  const { user, updateUserProfilePhoto } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);
  const [preview, setPreview] = useState(null);

  const imgbbAPIKey = import.meta.env.VITE_imgbbAPIKey;

  const { data: userInfo, isLoading, error } = useQuery({
    queryKey: ['user', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`users/email?email=${user?.email}`);
      return res.data;
    },
  });

  const { register, handleSubmit, watch } = useForm();
  const watchedFile = watch('image');

  // Show preview when a file is selected
  React.useEffect(() => {
    if (watchedFile && watchedFile.length > 0) {
      const file = watchedFile[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [watchedFile]);

  const onSubmit = async (data) => {
    const file = data?.image?.[0];
    if (!file) {
      Swal.fire('Error', 'Please select an image to update', 'error');
      return;
    }

    try {
      setUpdating(true);

      // Upload image to imgbb
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
        method: 'POST',
        body: formData,
      });

      const imgbbData = await res.json();
      const imageUrl = imgbbData?.data?.url;

      if (!imageUrl) throw new Error('Image upload failed');

      //  Update Firebase Auth profile
      updateUserProfilePhoto(imageUrl);

      // Update backend user photo
      await axiosSecure.patch(`users/photo?email=${user?.email}`, {
        photo: imageUrl,
      });

      // Refresh user data
      queryClient.invalidateQueries(['user', user?.email]);

      Swal.fire('Success', 'Profile picture updated successfully!', 'success');
      setPreview(null);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update profile picture', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600 py-10">Failed to load profile.</div>;

  const { name, email, photo, role, created_at, last_login_at } = userInfo;

  return (
    <div className="p-6 md:p-10 mx-auto h-screen max-w-3xl min-w-sm">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col items-center space-y-4">
        {/* Profile Picture */}
        <div className="avatar flex items-center gap-4 relative">
          <div className="w-1/4 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
            <img
              src={preview || photo}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Upload Form */}
          <form onSubmit={handleSubmit(onSubmit)} className=" w-2/3 flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              {...register('image')}
              className="file-input file-input-bordered w-full"
            />
            <button
              type="submit"
              disabled={updating}
              className="mt-2 btn bg-primary text-white w-full border-none hover:bg-primary/70"
            >
              {updating ? 'Updating...' : 'Change Photo'}
            </button>
          </form>
        </div>

        {/* User Info */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-900">{name}</h2>
          <p className="text-sm text-gray-600">{email}</p>
          {role !== 'user' && (
            <p className="mt-2 inline-block px-3 py-1 text-sm rounded-full font-medium capitalize bg-blue-100 text-blue-700 border border-blue-200">
              {role}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm w-full text-center text-gray-700 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
            <p className="font-medium text-gray-800">Joined</p>
            <p>{formatDateTime(created_at)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border">
            <p className="font-medium text-gray-800">Last Login</p>
            <p>{formatDateTime(last_login_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
