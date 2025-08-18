import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';

const TopRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchTopRestaurants = async () => {
            try {
                const res = await axiosSecure.get('/restaurants/top-donors');
                setRestaurants(res.data);
            } catch (err) {
                console.error('Failed to fetch top donating restaurants:', err);
            }
        };

        fetchTopRestaurants();
    }, [axiosSecure]);

    return (
        <section className="py-5">
            <h2 className="text-4xl font-extrabold mb-10 text-center text-text">
                Top Donating Restaurants
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {restaurants.length === 0 && (
                    <p className="col-span-full text-center text-text">
                        No top donating restaurants found.
                    </p>
                )}

                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.email}
                        className="bg-white rounded-lg shadow-md p-3 flex flex-col items-center hover:shadow-xl transition hover:shadow-secondary"
                    >
                        <img
                            src={restaurant.photo}
                            alt={restaurant.name}
                            className="w-24 h-24 object-cover rounded-full mb-4"
                        />
                        <h3 className="text-lg text-primary font-bold mb-1 text-center">{restaurant.name}</h3>
                        <p className="text-gray-600 mb-2 text-center">
                            Donations: <span className="font-semibold">{restaurant.donationCount}</span>
                        </p>

                        {/* Partner since */}
                        {restaurant.joinedAt && (
                            <p className="text-gray-500 text-sm mb-4 text-center">
                                Partner since: {new Date(restaurant.joinedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                })}
                            </p>
                        )}

                        <a
                            href={`mailto:${restaurant.email}`}
                            className="mt-auto w-full btn bg-primary border-none text-white font-semibold py-2 px-4 rounded hover:bg-primary/70 transition"
                        >
                            Contact
                        </a>
                    </div>
                ))}

            </div>
        </section>
    );
};

export default TopRestaurants;
