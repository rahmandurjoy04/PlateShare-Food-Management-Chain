import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import axios from 'axios';
import useAuth from '../../../hoooks/useAuth';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
const AddDonationForm = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const imgbbAPIKey = import.meta.env.VITE_imgbbAPIKey;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        try {
        // 1. Upload image to imgbb
        const imageFile = data.image[0];
        const formData = new FormData();
        formData.append('image', imageFile);

        const imgbbRes = await axios.post(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, formData);
        const imageUrl = imgbbRes.data.data.url;

        // 2. Prepare and send donation data
        const donationData = {
            title: data.title,
            foodType: data.foodType,
            quantity: data.quantity,
            pickupTime: data.pickupTime,
            location: data.location,
            image: imageUrl,
            restaurantName: user?.displayName,
            restaurantEmail: user?.email,
            status: 'pending',
            createdAt: new Date().toISOString()
        };


        const res = await axiosSecure.post('donations', donationData);
        if (res.data.insertedId) {
            Swal.fire('Thank You', 'Your Donation added successfully!', 'success');
            reset();
        }
    } catch (error) {
        Swal.fire('Error', 'Something went wrong while uploading or saving data.', 'error');
        console.error(error);
    }
};

return (
    <div className=" min-w-sm max-w-2xl mx-auto mt-10 bg-blue-200 p-10 shadow-md rounded-lg">
        <h2 className="text-3xl text-center font-bold mb-4 text-blue-900">Add Donation</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div>
                <label className="block font-medium">Donation Title</label>
                <input
                    type="text"
                    {...register('title', { required: true })}
                    className="w-full bg-white border rounded p-2"
                    placeholder="e.g., Surplus Bread"
                />
                {errors.title && <p className="text-red-600 text-sm">Title is required</p>}
            </div>

            <div>
                <label className="block font-medium">Food Type</label>
                <select
                    {...register('foodType', { required: true })}
                    className="w-full border rounded p-2 bg-white"
                >
                    <option value="">Select Type</option>
                    <option value="Produce">Produce</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Prepared">Prepared</option>
                    <option value="Others">Others</option>
                </select>
                {errors.foodType && <p className="text-red-600 text-sm">Food type is required</p>}
            </div>

            <div>
                <label className="block font-medium">Quantity</label>
                <input
                    type="text"
                    {...register('quantity', { required: true })}
                    className="w-full border rounded p-2 bg-white"
                    placeholder="e.g., 10kg or 15 portions"
                />
                {errors.quantity && <p className="text-red-600 text-sm">Quantity is required</p>}
            </div>

            <div>
                <label className="block font-medium">Pickup Time Window</label>
                <input
                    type="text"
                    {...register('pickupTime', { required: true })}
                    className="w-full border rounded p-2 bg-white"
                    placeholder="e.g., 3pm - 6pm"
                />
                {errors.pickupTime && <p className="text-red-600 text-sm">Pickup time is required</p>}
            </div>

            <div>
                <label className="block font-medium">Location</label>
                <input
                    type="text"
                    {...register('location', { required: true })}
                    className="w-full border rounded p-2 bg-white"
                    placeholder="e.g., 123 Street, City"
                />
                {errors.location && <p className="text-red-600 text-sm">Location is required</p>}
            </div>

            <div>
                <label className="block font-medium">Upload Food Image</label>
                <input
                    type="file"
                    accept="image/*"
                    {...register('image', { required: true })}
                    className="w-full border rounded p-2 bg-white"
                />
                {errors.image && <p className="text-red-600 text-sm">Image is required</p>}
            </div>

            <button
                type="submit"
                className="bg-blue-900 w-full text-white py-2 px-6 rounded hover:bg-blue-800"
            >
                Add Donation
            </button>
        </form>
    </div>
);
};

export default AddDonationForm;
