import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../../../Shared/LoadingSpinner/LoadingSpinner';

const DashBoardHome = () => {
  const axiosSecure = useAxiosSecure();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['donationStatsAll'],
    queryFn: async () => {
      const response = await axiosSecure.get('donation-stats-all');
      return response.data;
    },
  });

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (isError) return <div className="text-center py-10 text-error">Error: {error.message}</div>;

  const stats = data || { byFoodType: [], totalStats: {} };

  // Prepare chart data with percentages as numbers
  const totalQuantity = stats.totalStats.totalQuantityAll || 1;
  const chartData = stats.byFoodType.map(stat => ({
    name: stat.foodType,
    value: parseFloat(((stat.overallTotalQuantity || 0) / totalQuantity * 100).toFixed(1)), // Convert to number
  }));

  // Colors for pie chart slices
  const COLORS = ['#4B5EAA', '#6B7280', '#8B5CF6', '#EF4444', '#10B981'];

  // Check if chart data is valid
  if (chartData.length === 0 || chartData.every(d => d.value === 0)) {
    return <div className="text-center py-10 text-warning">No data available for pie chart.</div>;
  }

  return (
    <section className="py-12 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-primary text-center mb-12 bg-gradient-to-r from-primary to-secondary  bg-clip-text">All Donation Statistics</h2>
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-primary/70 mb-6 text-center">Total Statistics Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-primary hover:bg-base-200">
              <div className="card-body">
                <h4 className="card-title text-lg text-primary">Total Quantity</h4>
                <p className="text-3xl font-bold text-primary">{stats.totalStats.totalQuantityAll || 0} Portions</p>
                <span className="text-sm text-secondary/70">Donated across all categories</span>
              </div>
            </div>
            <div className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-success hover:bg-base-200">
              <div className="card-body">
                <h4 className="card-title text-lg text-primary">Total Donations</h4>
                <p className="text-3xl font-bold text-success">{stats.totalStats.totalDonations || 0}</p>
                <span className="text-sm text-secondary/70">Number of donations made</span>
              </div>
            </div>
            <div className="card bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-accent hover:bg-base-200">
              <div className="card-body">
                <h4 className="card-title text-lg text-primary">Unique Restaurants</h4>
                <p className="text-3xl font-bold text-primary">{stats.totalStats.uniqueRestaurantsCount || 0}</p>
                <span className="text-sm text-secondary/70">Active contributors</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-primary mb-6 text-center">Charts</h3>
          <div className="card bg-white shadow-md p-6 h-[600px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`} 
                  outerRadius={120}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-primary mb-6 text-center">Detailed View by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.byFoodType.map((stat, index) => (
              <div
                key={index}
                className="card bg-white shadow-md hover:bg-base-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-l-4 border-info"
              >
                <div className="card-body">
                  <h4 className="card-title text-lg text-primary">{stat.foodType}</h4>
                  <p className="text-2xl font-bold text-info mb-2">{stat.overallTotalQuantity || 0} Portions</p>
                  <p className="text-secondary">Donations: {stat.restaurants.reduce((sum, rest) => sum + rest.donationCount, 0)}</p>
                  <div className="mt-4 h-2 bg-base-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-info transition-all duration-300"
                      style={{ width: `${(stat.overallTotalQuantity || 0) / (stats.totalStats.totalQuantityAll || 1) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
            {stats.byFoodType.length === 0 && (
              <p className="text-center text-primary col-span-full">No verified donations found.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashBoardHome;