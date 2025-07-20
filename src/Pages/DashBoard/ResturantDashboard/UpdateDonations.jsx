import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import axios from 'axios';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';

const UpdateDonation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const imgbbAPIKey = import.meta.env.VITE_imgbbAPIKey;
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    // Fetch the donation details
    useEffect(() => {
        const fetchDonation = async () => {
            try {
                const res = await axiosSecure.get(`donations/${id}`);
                const donation = res.data;
                setValue('title', donation.title);
                setValue('foodType', donation.foodType);
                setValue('quantity', donation.quantity);
                setValue('pickupTime', donation.pickupTime);
                setValue('location', donation.location);
                setValue('imageURL', donation.image);
                setLoading(false);
            } catch (error) {
                console.error('Failed to load donation', error);
            }
        };

        fetchDonation();
    }, [id, setValue, axiosSecure]);

    const onSubmit = async (data) => {
        try {
            let imageUrl = data.imageURL;

            if (data.image?.[0]) {
                const formData = new FormData();
                formData.append('image', data.image[0]);
                const imgbbRes = await axios.patch(
                    `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
                    formData
                );
                imageUrl = imgbbRes.data.data.url;
            }

            const updatedDonation = {
                title: data.title,
                foodType: data.foodType,
                quantity: data.quantity,
                pickupTime: data.pickupTime,
                location: data.location,
                image: imageUrl,
                updatedAt: new Date().toISOString()
            };

            const res = await axiosSecure.patch(`donations/${id}`, updatedDonation);

            if (res.data.modifiedCount > 0) {
                Swal.fire('Success', 'Donation updated successfully!', 'success');
                navigate('/dashboard/restaurant/my-donations');
            } else {
                Swal.fire('No Changes', 'No fields were updated.', 'info');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Something went wrong while updating.', 'error');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading donation data...</div>;

    return (
        <div className="min-w-sm max-w-2xl mx-auto mt-10 bg-blue-200 p-10 shadow-md rounded-lg">
            <h2 className="text-3xl text-center font-bold mb-4 text-blue-900">Update Donation</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div>
                    <label className="block font-medium">Donation Title</label>
                    <input
                        type="text"
                        {...register('title', { required: true })}
                        className="w-full bg-white border rounded p-2"
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
                    />
                    {errors.quantity && <p className="text-red-600 text-sm">Quantity is required</p>}
                </div>

                <div>
                    <label className="block font-medium">Pickup Time Window</label>
                    <input
                        type="text"
                        {...register('pickupTime', { required: true })}
                        className="w-full border rounded p-2 bg-white"
                    />
                    {errors.pickupTime && <p className="text-red-600 text-sm">Pickup time is required</p>}
                </div>

                <div>
                    <label className="block font-medium">Location</label>
                    <input
                        type="text"
                        {...register('location', { required: true })}
                        className="w-full border rounded p-2 bg-white"
                    />
                    {errors.location && <p className="text-red-600 text-sm">Location is required</p>}
                </div>

                <div>
                    <label className="block font-medium">Current Image (unchanged if no file selected)</label>
                    <input type="hidden" {...register('imageURL')} />
                    <input
                        type="file"
                        accept="image/*"
                        {...register('image')}
                        className="w-full border rounded p-2 bg-white"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-blue-900 w-full text-white py-2 px-6 rounded hover:bg-blue-800"
                >
                    Update Donation
                </button>
            </form>
        </div>
    );
};

export default UpdateDonation;
