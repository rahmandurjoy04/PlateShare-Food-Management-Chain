import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hoooks/useAxiosSecure';
import LoadingSpinner from '../../../Shared/LoadingSpinner/LoadingSpinner';

const ManageRequests = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedRequest, setSelectedRequest] = useState(null);

    const { data: requests = [], isLoading, refetch } = useQuery({
        queryKey: ['donationRequests'],
        queryFn: async () => {
            const res = await axiosSecure.get('donation-requests');
            return res.data;
        },
    });

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`donation-requests/${id}`);
                if (res.data?.deletedCount > 0) {
                    await Swal.fire('Deleted!', 'The request has been deleted.', 'success');
                    refetch();
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Not Deleted',
                        text: 'The request could not be deleted.',
                    });
                }

            } catch (error) {
                console.error('Delete error:', error);

                Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: error?.response?.data?.message || error?.message || 'Something went wrong',
                });
            }
        }
    };

    if (isLoading) return <LoadingSpinner></LoadingSpinner>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold mb-6">Manage Requests</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th>#</th>
                            <th>Donation Title</th>
                            <th>Restaurant</th>
                            <th>Charity Name</th>
                            <th>Charity Email</th>
                            <th>Pickup Time</th>
                            <th>Status</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center py-8 text-gray-500 font-semibold text-lg">
                                    No Donation Requests Found
                                </td>
                            </tr>
                        ) : (
                            requests.map((req, index) => (
                                <tr key={req._id}>
                                    <td>{index + 1}</td>
                                    <td className="font-semibold">{req.donationTitle}</td>
                                    <td>{req.restaurantName}</td>
                                    <td>{req.charityName}</td>
                                    <td>{req.charityEmail}</td>
                                    <td>{req.pickupTime}</td>
                                    <td >
                                        <span className={` ${req.status === 'Pending' ? 'badge-warning' : 'badge-success'} btn bg-secondary rounded-xl text-xs py-1`}>
                                            {req.status.split(' ')[0]}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => setSelectedRequest(req)}
                                            className="btn btn-sm btn-outline btn-info"
                                        >
                                            View
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(req._id)}
                                            className="btn btn-sm btn-outline btn-error"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>

            {/* Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md max-w-lg w-full shadow-lg relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                            onClick={() => setSelectedRequest(null)}
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold mb-2">Request Description</h3>
                        <p className="text-gray-700">{selectedRequest.requestDescription}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRequests;
