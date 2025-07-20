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
        const response = await axiosSecure.get('/featuredDonations');
        setDonations(response.data);
      } catch (error) {
        console.error('Failed to fetch featured donations:', error);
      }
    };

    fetchFeaturedDonations();
  }, [axiosSecure]);

  const handlePrev = () => {
    setStartIndex(prev => Math.max(prev - cardsPerPage, 0));
  };

  const handleNext = () => {
    setStartIndex(prev => {
      if (prev + cardsPerPage >= donations.length) return prev;
      return prev + cardsPerPage;
    });
  };

  const visibleDonations = donations.slice(startIndex, startIndex + cardsPerPage);

  return (
    <div className="py-8 bg-blue-50 rounded-lg shadow-lg mx-auto">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-blue-900">Featured Donations</h2>

      <div className="flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
        >
          &lt;
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 flex-grow">
          {visibleDonations.length === 0 && (
            <p className="col-span-full text-center text-gray-500">No featured donations found.</p>
          )}

          {visibleDonations.map(donation => (
            <div
              key={donation._id}
              className="bg-white rounded-lg shadow-md p-5 flex flex-col hover:shadow-xl transition"
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
                <span className={`font-semibold ${
                  donation.delivery_status === 'Available' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {donation.delivery_status || donation.status}
                </span>
              </div>

              <button
                onClick={() => navigate(`/donation/${donation._id}`)}
                className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Details
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={startIndex + cardsPerPage >= donations.length}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default FeaturedDonations;
