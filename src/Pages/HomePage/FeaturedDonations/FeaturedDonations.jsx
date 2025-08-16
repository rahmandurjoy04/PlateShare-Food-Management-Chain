import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';

const FeaturedDonations = () => {
  const [donations, setDonations] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const cardsPerPage = 4;

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchFeaturedDonations = async () => {
      try {
        const response = await axiosSecure.get('featuredDonations');
        setDonations(response.data);
      } catch (error) {
        console.error('Failed to fetch featured donations:', error);
      }
    };

    fetchFeaturedDonations();
  }, [axiosSecure]);

  // Auto-slide effect
  useEffect(() => {
    if (donations.length === 0) return;

    const interval = setInterval(() => {
      setStartIndex(prev => {
        // If reaching the end, reset back to 0
        return (prev + 1) % donations.length;
      });
    }, 5000); // change card every 5 seconds

    return () => clearInterval(interval);
  }, [donations]);

  // Slice ensures 4 cards are always visible
  const visibleDonations = [
    ...donations.slice(startIndex, startIndex + cardsPerPage),
    ...donations.slice(0, Math.max(0, (startIndex + cardsPerPage) - donations.length))
  ];



  return (
    <div className="py-10 bg-base-100 min-w-sm">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-text">Featured Donations</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {visibleDonations.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No featured donations found.</p>
        )}

        {visibleDonations.map(donation => (
          <div
            key={donation._id}
            className="bg-base-100 rounded-lg shadow-md p-5 flex flex-col hover:shadow-xl transition"
          >
            <img
              src={donation.image}
              alt={donation.title || 'Food Donation'}
              className="w-full h-48 object-cover rounded-md mb-4"
            />

            <div className="mb-2">
              <span className="font-bold text-gray-700">Food Type: </span>
              <span className="text-gray-600">{donation.foodType}</span>
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
                className={`font-semibold ${donation.delivery_status === 'Available' ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                {donation.delivery_status || donation.status}
              </span>
            </div>

            <button
              onClick={() => navigate(`/donation/${donation._id}`)}
              className="mt-auto bg-primary text-white font-semibold py-2 rounded hover:bg-primary/70 transition"
            >
              Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedDonations;
