import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import useAuth from '../../../hoooks/useAuth';

const MyPickups = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const email = user?.email;

  useEffect(() => {
    if (!email) return;

    setLoading(true);
    axiosSecure
      .get(`pickups?email=${encodeURIComponent(email)}`)
      .then(res => {
        setPickups(res.data || []);
      })
      .catch(err => {
        console.error('Error loading pickups:', err);
        Swal.fire('Error', 'Failed to load pickup requests.', 'error');
      })
      .finally(() => setLoading(false));
  }, [email, axiosSecure]);

  const handleConfirmPickup = async (pickup) => {
    const confirm = await Swal.fire({
      title: 'Confirm Pickup?',
      text: 'Are you sure you have picked up this donation?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, confirm',
      cancelButtonText: 'Cancel'
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`donations/${pickup.donationId}/pickup`, {
        requestId: pickup._id
      });

      if (res.status === 200) {
        Swal.fire('Confirmed!', 'Pickup marked as completed.', 'success');
        setPickups(prev => prev.filter(item => item._id !== pickup._id));
      }
    } catch (error) {
      console.error('Pickup confirmation failed:', error);
      Swal.fire('Error', 'Failed to confirm pickup.', 'error');
    }
  };

  return (
    <div className="min-w-sm mx-auto max-w-11/12 w-full">
      <h2 className="text-3xl font-bold text-center mb-6 text-primary">My Pickups</h2>

      {loading && <p className="text-center">Loading your pickups...</p>}

      {!loading && pickups.length === 0 && (
        <p className="text-center text-primary">No assigned pickups available.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 min-w-sm">
        {pickups.map((pickup) => (
          <div key={pickup._id} className=" hover:shadow-secondary shadow-lg rounded-xl shadow p-4 bg-accent/70">
            <h3 className="font-semibold text-green-800 text-xl mb-2">{pickup.donationTitle}</h3>
            <p><strong>Restaurant:</strong> {pickup.restaurantName}</p>
            <p><strong>Location:</strong> {pickup.location}</p>
            <p><strong>Food Type:</strong> {pickup.foodType}</p>
            <p><strong>Quantity:</strong> {pickup.quantity}</p>
            <p><strong>Pickup Time:</strong> {pickup.pickupTime}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span className="text-yellow-600 font-semibold">
                Assigned
              </span>
            </p>

            <button
              onClick={() => handleConfirmPickup(pickup)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/70 w-full transition"
            >
              Confirm Pickup
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPickups;
