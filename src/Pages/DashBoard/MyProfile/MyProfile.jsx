import React, { useState, useEffect } from 'react';
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
  const { user, updateUserProfilePhoto} = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [updatingPhoto, setUpdatingPhoto] = useState(false);
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

  const { register, handleSubmit, watch, setValue } = useForm();
  const watchedFile = watch('image');

  useEffect(() => {
    if (watchedFile && watchedFile.length > 0) {
      const file = watchedFile[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [watchedFile]);

  useEffect(() => {
    if (userInfo) {
      setValue('phone', userInfo.phone || '');
      setValue('location', userInfo.location || '');
    }
  }, [userInfo, setValue]);

  const onSubmitProfile = async (data) => {
    const {  phone, location } = data;
    const updateFields = { phone, location, email: user?.email };


    try {
      await axiosSecure.patch(`user/profile`, updateFields);
      queryClient.invalidateQueries(['user', user?.email]);
      Swal.fire('Success', 'Profile updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
  };

  const onSubmitPhoto = async (data) => {
    const file = data?.image?.[0];
    if (!file) return Swal.fire('Error', 'Please select an image', 'error');

    try {
      setUpdatingPhoto(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
        method: 'POST',
        body: formData,
      });

      const imgbbData = await res.json();
      const imageUrl = imgbbData?.data?.url;
      if (!imageUrl) throw new Error('Image upload failed');

      await updateUserProfilePhoto(imageUrl);
      await axiosSecure.patch(`users/photo?email=${user?.email}`, { photo: imageUrl });
      queryClient.invalidateQueries(['user', user?.email]);
      Swal.fire('Success', 'Profile picture updated successfully!', 'success');
      setPreview(null);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Failed to update profile picture', 'error');
    } finally {
      setUpdatingPhoto(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center text-red-600 py-10">Failed to load profile.</div>;

  const { email, photo, role, created_at, last_login_at } = userInfo;

  return (
    <div className="min-h-screen min-w-sm max-w-11/12 mx-auto flex items-center justify-center my-10">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-8 space-y-8">

        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full overflow-hidden ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={preview || photo} alt="Profile" className="w-full h-full object-cover" />
          </div>

          <form onSubmit={handleSubmit(onSubmitPhoto)} className="w-full flex flex-col gap-2 items-center">
            <input type="file" accept="image/*" {...register('image')} className="file-input file-input-bordered w-full max-w-xs" />
            <button
              type="submit"
              disabled={updatingPhoto}
              className="btn bg-primary text-white w-full max-w-xs border-none hover:bg-primary/70 mt-1"
            >
              {updatingPhoto ? 'Updating...' : 'Change Photo'}
            </button>
          </form>
        </div>

        {/* Profile Info Form */}
        <form onSubmit={handleSubmit(onSubmitProfile)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-medium text-secondary mb-1">Phone</label>
            <input type="tel" {...register('phone', { required: 'Phone is required' })} className="input input-bordered w-full" />
          </div>

          <div className="flex flex-col">
            <label className="font-medium text-secondary mb-1">Location</label>
            <input type="text" {...register('location')} className="input input-bordered w-full" />
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="btn bg-primary text-white w-full border-none hover:bg-primary/70">
              Update Profile
            </button>
          </div>
        </form>

        {/* Display Email & Role */}
        <div className="text-center border-t pt-4 space-y-2">
          <p className="text-sm text-gray-600">{email}</p>
          {role !== 'user' && (
            <span className="inline-block px-3 py-1 text-sm rounded-full font-medium capitalize bg-blue-100 text-blue-700 border border-blue-200">
              {role}
            </span>
          )}
          <div className="grid grid-cols-2 gap-4 text-sm mt-2 text-gray-700">
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="font-medium text-gray-800">Joined</p>
              <p>{formatDateTime(created_at)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="font-medium text-gray-800">Last Login</p>
              <p>{formatDateTime(last_login_at)}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyProfile;
