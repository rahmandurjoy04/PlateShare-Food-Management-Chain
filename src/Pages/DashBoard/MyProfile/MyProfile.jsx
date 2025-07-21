import React from 'react';
import { useQuery } from '@tanstack/react-query';
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
  const { user } = useAuth(); // From Firebase Auth
  const axiosSecure = useAxiosSecure();

  const { data: userInfo, isLoading, error } = useQuery({
    queryKey: ['user', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`users?email=${user?.email}`);
      return res.data;
    },
  });

  console.log(userInfo);

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (error) return <div className="text-center text-red-600 py-10">Failed to load profile.</div>;

  const { name, email, photo, role, created_at, last_login_at } = userInfo;

  return (
    <div className="p-6 md:p-10 mx-auto h-screen  max-w-3xl min-w-sm">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col items-center space-y-4">
        <div className="avatar">
          <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={photo} alt="Profile" referrerPolicy="no-referrer"/>
          </div>
        </div>

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
