import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import useAuth from '../../../hoooks/useAuth';

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

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Your Donation Statistics</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="foodType" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalQuantity" fill="#4CAF50" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DonationStats;
