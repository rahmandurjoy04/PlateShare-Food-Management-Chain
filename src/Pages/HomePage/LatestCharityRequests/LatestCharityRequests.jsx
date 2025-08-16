import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';

const LatestCharityRequests = () => {
  const axiosSecure = useAxiosSecure();

  const { data: charityRequests = [], isLoading } = useQuery({
    queryKey: ['latestCharityRequests'],
    queryFn: async () => {
      const res = await axiosSecure.get('charity-requests');
      return res.data;
    },
  });

  const latestThree = charityRequests
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <span className="loading loading-spinner text-error"></span>
      </div>
    );
  }

  return (
    <div className="py-5 min-w-sm">
      <h2 className="text-4xl justify-center font-bold text-text mb-10 flex items-center gap-2">
         Latest Charity Requests
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mx-auto">
        {latestThree.map((request) => (
          <div
            key={request._id}
            className=" rounded-xl p-4 shadow-md hover:shadow-lg transform hover:scale-[1.01] transition duration-200 bg-gray-50"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={request.image || `https://api.dicebear.com/7.x/initials/svg?seed=${request.charityName}`}
                alt={request.charityName}
                className="w-14 h-14 object-cover rounded-full border"
              />
              <div>
                <p className="font-semibold text-gray-800">{request.charityName}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <h3 className="text-base font-semibold text-gray-700 mb-2">
              Donation: <span className="text-blue-600">{request.donationTitle}</span>
            </h3>

            <p className="text-gray-600 text-sm mb-1">
              <strong>Pickup:</strong> {request.pickupTime}
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Request:</strong> {request.requestDescription}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestCharityRequests;
