import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import useAxiosSecure from '../../hoooks/useAxiosSecure';

const AllDonations = () => {
    const axiosSecure = useAxiosSecure();

    const { data: donations = [], isLoading } = useQuery({
        queryKey: ['verifiedDonations'],
        queryFn: async () => {
            const res = await axiosSecure.get('alldonations/verified');
            return res.data;
        },
    });

    if (isLoading) return <div className="text-center mt-10 text-xl text-blue-700">Loading donations...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-4xl font-extrabold text-center mb-2 text-blue-800 drop-shadow-sm">🍱 All Donations</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {donations.map((donation) => (
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
                                <h3 className="text-3xl font-bold text-blue-800">{donation.title}</h3>
                                <p className="text-sm text-gray-600">
                                    <strong className="text-blue-700 text-lg">Restaurant:</strong> {donation.restaurantName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong className="text-blue-700 text-lg">Location:</strong> {donation.location}
                                </p>
                                {donation.charityName && (
                                    <p className="text-sm text-gray-600">
                                        <strong className="text-blue-700 text-lg">Charity Assigned:</strong> {donation.charityName}
                                    </p>
                                )}
                                <p className="text-sm text-gray-600">
                                    <strong className="text-blue-700 text-lg">Quantity:</strong> {donation.quantity}
                                </p>

                                {/* Beautiful Status Badge */}
                                <p className="">
                                    <strong className="text-blue-700 text-xl mr-3">Status:</strong>
                                    <span
                                        className={`inline-block text-xs px-4 py-1 rounded-full font-semibold uppercase tracking-wide bg-green-100 text-green-800 border border-green-300`}
                                    >
                                        {donation.status}
                                    </span>
                                </p>
                            </div>

                            {/* Full-width Button */}
                            <div className="mt-5">
                                <Link
                                    to={`/donation/${donation._id}`}
                                    className="block w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2 text-center rounded-lg transition-all"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {donations.length === 0 && (
                <div className="text-center text-gray-500 text-lg mt-10">
                    No verified donations found.
                </div>
            )}
        </div>
    );
};

export default AllDonations;
