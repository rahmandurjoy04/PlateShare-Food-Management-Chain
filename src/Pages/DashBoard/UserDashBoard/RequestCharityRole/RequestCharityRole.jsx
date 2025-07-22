import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../../hoooks/useAuth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../../hoooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../../Shared/LoadingSpinner/LoadingSpinner';

const RequestCharityRole = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const currentTimestamp = new Date().toISOString();

    // Fetch role requests for current user, no args needed since user.email is in scope
    const fetchRoleRequests = async () => {
        const response = await axiosSecure.get(`roleRequests?email=${user.email}`);
        return response.data;
    };

    // Use TanStack Query v5 syntax: single object argument
    const { data, isLoading, error } = useQuery({
        queryKey: ['roleRequests', user?.email],
        queryFn: fetchRoleRequests,
        enabled: !!user?.email,
    });


    const onSubmit = async (formData) => {
        const requestData = {
            name: user?.displayName,
            requested_by: user?.email,
            organization: formData.organization,
            reason: formData.reason,
            amount: 25,
            role_status: 'pending',
            payment_status: 'unpaid',
            creation_date: currentTimestamp,
        };

        const result = await Swal.fire({
            title: 'Confirm Your Charity Role Request',
            html: `
        <div style="text-align: left; font-size: 20px;">
          <p><strong>Organization:</strong> ${requestData.organization}</p>
          <p><strong>Reason:</strong> ${requestData.reason}</p>
          <p><strong>Requested Role:</strong> <span style="color:#2563eb;">Charity</span></p>
          <p><strong>Payment Amount:</strong> <span style="color:#16a34a;">$${requestData.amount}</span></p>
        </div>
      `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Confirm & Pay',
            cancelButtonText: 'Edit',
            focusConfirm: false,
            customClass: { popup: 'rounded-xl' },
        });

        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Redirecting to Payment...',
                showConfirmButton: false,
                timer: 1500,
            });

            console.log(requestData);

            navigate('/dashboard/payment/charity', { state: { ...requestData } });

            reset();
        }
    };

    if (isLoading) return <LoadingSpinner></LoadingSpinner>;
    if (error) return <div>Error loading role requests: {error.message}</div>;

    if (data?.charity_role_status === 'pending') {
        return <>
            <div className="max-w-2xl min-w-sm mx-auto p-6  mt-30 bg-yellow-50 border border-yellow-300 rounded-lg shadow-md flex items-center space-x-4">
                <svg
                    className="w-10 h-10 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <div>
                    <h3 className="text-lg font-semibold text-yellow-800">Role Request Pending</h3>
                    <p className="text-yellow-700">
                        Your request for the <strong>{data.organization}</strong> organization is currently pending approval.
                        Please wait for confirmation.
                    </p>
                    <p className="text-sm text-yellow-600 mt-1">
                        Requested on: {new Date(data.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </>
    }

    if (data?.charity_role_status === 'approved') {
        return (
            <div className="max-w-2xl min-w-sm mx-auto p-6 mt-30 bg-green-50 border border-green-300 rounded-lg shadow-md flex items-center space-x-4">
                <svg
                    className="w-10 h-10 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                    />
                </svg>
                <div>
                    <h3 className="text-lg font-semibold text-green-800">Role Request Approved</h3>
                    <p className="text-green-700">
                        Congratulations! Your request for the <strong>{data.organization}</strong> organization has been approved.
                        You now have the charity role access.
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                        Approved on: {new Date(data.updated_at ?? data.creation_date ?? data.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Request Charity Role</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name */}
                <div>
                    <label className="label">Your Name</label>
                    <input
                        type="text"
                        className="input w-full bg-gray-100"
                        defaultValue={user?.displayName}
                        readOnly
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="label">Your Email</label>
                    <input
                        type="email"
                        className="input w-full bg-gray-100"
                        defaultValue={user?.email}
                        readOnly
                    />
                </div>

                {/* Organization */}
                <div>
                    <label className="label">Organization Name</label>
                    <input
                        type="text"
                        className="input w-full"
                        {...register('organization', { required: 'Organization name is required' })}
                    />
                    {errors.organization && <p className="text-red-500 text-sm">{errors.organization.message}</p>}
                </div>

                {/* Reason */}
                <div>
                    <label className="label">Why do you need this role?</label>
                    <textarea
                        className="textarea w-full"
                        rows="4"
                        {...register('reason', { required: 'Please provide a reason' })}
                    ></textarea>
                    {errors.reason && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
                </div>

                {/* Payment Amount */}
                <div>
                    <label className="label">Payment Amount</label>
                    <input
                        type="text"
                        value="$ 25"
                        readOnly
                        className="input w-full bg-gray-100 cursor-not-allowed"
                    />
                </div>

                {/* Pay Button */}
                <button type="submit" className="btn btn-primary w-full font-semibold">
                    Pay <span className="text-yellow-300">$ 25</span>
                </button>
            </form>
        </div>
    );
};

export default RequestCharityRole;
