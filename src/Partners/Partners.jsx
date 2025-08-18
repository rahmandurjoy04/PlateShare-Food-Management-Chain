import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../hoooks/useAxiosSecure';
import LoadingSpinner from '../Shared/LoadingSpinner/LoadingSpinner';
const PartnerCard = ({ partner }) => (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col items-center hover:shadow-xl transition">
        <img
            src={partner.photo || 'https://i.ibb.co/placeholder.png'}
            alt={partner.name}
            className="w-24 h-24 rounded-full mb-4 object-cover"
        />
        <h3 className="text-lg text-primary font-bold">{partner.name}</h3>
        <p className="text-gray-500 text-sm">
            Partner since: {new Date(partner.created_at).toLocaleDateString()}
        </p>
        <p className="text-gray-400 text-sm capitalize">{partner.role}</p>
    </div>
);

const Partners = () => {
    const [partners, setPartners] = useState([]);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const res = await axiosSecure.get('/partners'); // Fetch all partners from backend
                setPartners(res.data);
            } catch (err) {
                console.error('Failed to fetch partners:', err);
            }
        };
        fetchPartners();
    }, [axiosSecure]);

    // Separate partners by role
    const restaurants = partners.filter(p => p.role === "restaurant");
    const charities = partners.filter(p => p.role === "charity");

    return (
        <div className="bg-base-100 min-h-screen max-w-11/12 mx-auto">
            <h1 className="text-4xl font-bold my-5 text-center">Our Partners</h1>

            {/* Restaurants Section */}
            {restaurants.length > 0 && (
                <>
                    <h2 className="text-2xl font-semibold mb-4">Restaurants</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                        {restaurants.map(r => (
                            <PartnerCard key={r.email} partner={r} />
                        ))}
                    </div>
                </>
            )}

            {/* Charities Section */}
            {charities.length > 0 && (
                <>
                    <h2 className="text-2xl font-semibold mb-4">Charities</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {charities.map(c => (
                            <PartnerCard key={c.email} partner={c} />
                        ))}
                    </div>
                </>
            )}

            {partners.length === 0 && (
                <LoadingSpinner></LoadingSpinner>
                )}
        </div>
    );
};

export default Partners;
