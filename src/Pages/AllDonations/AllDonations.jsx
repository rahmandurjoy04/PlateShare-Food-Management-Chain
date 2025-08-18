import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxiosSecure from '../../hoooks/useAxiosSecure';
import LoadingSpinner from '../../Shared/LoadingSpinner/LoadingSpinner';

const AllDonations = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortType, setSortType] = useState('');

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['verifiedDonations'],
    queryFn: async () => {
      const res = await axiosSecure.get('alldonations/verified');
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  // Parse quantity string to number (e.g., "20 portions" => 20)
  const parseQuantity = (q) => {
    const match = q?.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // Convert pickup time range (e.g., "12am-5pm") to numeric starting hour for comparison
  const getPickupStartHour = (timeRange) => {
    const match = timeRange?.match(/^(\d{1,2})(am|pm)/i);
    if (!match) return 0;
    let hour = parseInt(match[1]);
    const period = match[2].toLowerCase();
    if (period === 'pm' && hour !== 12) hour += 12;
    if (period === 'am' && hour === 12) hour = 0;
    return hour;
  };

  // Filter and sort donations
  let filteredDonations = donations;
  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
    filteredDonations = donations.filter((donation) =>
      searchRegex.test(donation.location || '')
    );
  }

  if (sortType === 'quantity-asc') {
    filteredDonations.sort((a, b) => parseQuantity(a.quantity) - parseQuantity(b.quantity));
  } else if (sortType === 'quantity-desc') {
    filteredDonations.sort((a, b) => parseQuantity(b.quantity) - parseQuantity(a.quantity));
  } else if (sortType === 'pickup-early') {
    filteredDonations.sort((a, b) => getPickupStartHour(a.pickupTime) - getPickupStartHour(b.pickupTime));
  } else if (sortType === 'pickup-late') {
    filteredDonations.sort((a, b) => getPickupStartHour(b.pickupTime) - getPickupStartHour(a.pickupTime));
  }

  return (
    <div className="min-w-sm max-w-11/12 mx-auto">
      <h2 className="text-4xl font-extrabold text-center my-5 text-primary ">🍱 All Donations</h2>

      {/* Search & Sort Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-center items-center">
        <input
          type="text"
          placeholder="Search by city..."
          className="input input-bordered input-primary w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="select select-bordered select-primary w-full max-w-md"
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="quantity-asc">Quantity (Low to High)</option>
          <option value="quantity-desc">Quantity (High to Low)</option>
          <option value="pickup-early">Pickup Time (Early First)</option>
          <option value="pickup-late">Pickup Time (Late First)</option>
        </select>
      </div>

      {/* Donations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {filteredDonations.length > 0 ? (
          filteredDonations.map((donation) => (
            <div
              key={donation._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col border border-blue-100"
            >
              <img
                src={donation.image}
                alt={donation.title}
                className="h-52 w-full object-cover"
              />
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-primary">{donation.title}</h3>
                  
                  <p className="text-sm text-secondary">
                    <strong className="text-primary text-lg">Location:</strong> {donation.location}
                  </p>
                  {donation.charityName && (
                    <p className="text-sm text-secondary">
                      <strong className="text-primary text-lg">Charity Assigned:</strong> {donation.charityName}
                    </p>
                  )}
                  <p className="text-sm text-secondary">
                    <strong className="text-primary text-lg">Quantity:</strong> {donation.quantity}
                  </p>
                  <p className="text-sm text-secondary">
                    <strong className="text-primary text-lg">Pickup Time:</strong> {donation.pickupTime}
                  </p>
                  <p className="">
                    <strong className="text-primary text-xl mr-3">Status:</strong>
                    <span
                      className={`inline-block text-xs px-4 py-1 rounded-full font-semibold uppercase tracking-wide bg-green-100 text-green-800 border border-green-300`}
                    >
                      {donation.delivery_status}
                    </span>
                  </p>
                </div>
                <div className="mt-5">
                  <Link
                    to={`/donation/${donation._id}`}
                    className="block w-full bg-primary hover:bg-primary/70 text-white font-semibold px-5 py-2 text-center rounded-lg transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-lg mt-10 col-span-full">
            No verified donations found for '{searchTerm}'.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDonations;
