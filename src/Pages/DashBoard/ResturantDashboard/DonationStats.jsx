import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import useAuth from '../../../hoooks/useAuth';
import { FaBox, FaUtensils, FaChartBar } from 'react-icons/fa';

const DonationStats = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: stats = [], isLoading } = useQuery({
        queryKey: ['donationStats', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`donation-stats/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email
    });

    if (isLoading) return <div className="text-center p-10">Loading chart...</div>;

    const totalQuantity = stats.reduce((sum, item) => sum + item.totalQuantity, 0);
    const topFood = stats.reduce((prev, curr) => (curr.totalQuantity > (prev?.totalQuantity || 0) ? curr : prev), null);

    return (
        <div className="bg-base-100 p-6 rounded-xl  space-y-8">
            <h2 className="text-4xl font-bold text-center text-primary">Your Donation Statistics</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-green-100 p-4 rounded-xl flex items-center gap-4 shadow">
                    <FaBox className="text-green-600 text-3xl" />
                    <div>
                        <p className="text-sm text-gray-600">Total Quantity</p>
                        <h3 className="text-lg font-semibold">{totalQuantity} Portions</h3>
                    </div>
                </div>
                <div className="bg-blue-100 p-4 rounded-xl flex items-center gap-4 shadow">
                    <FaUtensils className="text-blue-600 text-3xl" />
                    <div>
                        <p className="text-sm text-gray-600">Top Food Type</p>
                        <h3 className="text-lg font-semibold">
                            {topFood ? `${topFood.foodType}` : 'N/A'}
                        </h3>
                    </div>
                </div>
                <div className="bg-yellow-100 p-4 rounded-xl flex items-center gap-4 shadow">
                    <FaChartBar className="text-yellow-600 text-3xl" />
                    <div>
                        <p className="text-sm text-gray-600">Food Types</p>
                        <h3 className="text-lg font-semibold">{stats.length}</h3>
                    </div>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-gray-50 p-4 rounded-xl shadow-inner">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="foodType" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="totalQuantity" fill="#0097a7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DonationStats;
