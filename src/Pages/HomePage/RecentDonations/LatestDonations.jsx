import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';

const LatestDonations = () => {
  const [allDonations, setAllDonations] = useState([]);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchAllDonations = async () => {
      try {
        const response = await axiosSecure.get('alldonations/verified');
        setAllDonations(response.data);
      } catch (error) {
        console.error('Failed to fetch verified donations:', error);
      }
    };

    fetchAllDonations();
  }, [axiosSecure]);

  // Sort by createdAt descending and take the latest 4 donations
  const latestDonations = allDonations
    .filter(d => d.status === 'Verified')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="pb-10 bg-base-100 min-w-sm">
      <h2 className="text-4xl font-extrabold mb-10 text-center text-text">
        Latest Donations
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {latestDonations.length === 0 && (
          <p className="col-span-full text-center text-primary">
            No donations found.
          </p>
        )}

        {latestDonations.map(donation => (
          <div
            key={donation._id}
            className="bg-white rounded-lg shadow-md p-5 flex flex-col hover:shadow-xl transition hover:shadow-secondary"
          >
            <img
              src={donation.image}
              alt={donation.title || 'Food Donation'}
              className="w-full h-48 object-cover rounded-md mb-4"
            />

            <div className="mb-2">
              <span className="text-primary font-semibold">{donation.title}</span>
            </div>

            <div className="mb-2">
              <span className="font-bold text-gray-700">Restaurant: </span>
              <span className="text-gray-600">{donation.restaurantName}</span>
            </div>

            <div className="mb-2">
              <span className="font-bold text-gray-700">Location: </span>
              <span className="text-gray-600">{donation.location}</span>
            </div>

            <div className="mb-4">
              <span className="font-bold text-gray-700">Status: </span>
              <span
                className={`font-semibold ${
                  donation.delivery_status === 'Available'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {donation.delivery_status || donation.status}
              </span>
            </div>

            <button
              onClick={() => navigate(`/donation/${donation._id}`)}
              className="mt-auto bg-primary text-white font-semibold py-2 rounded hover:bg-primary/70 transition"
            >
              See More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestDonations;
