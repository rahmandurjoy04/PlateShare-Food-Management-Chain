import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../../hoooks/useAuth';
import Swal from 'sweetalert2';
// import { useNavigate } from 'react-router';

const RequestCharityRole = () => {
    const { user } = useAuth();
    // const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const currentTimestamp = new Date().toISOString();

    const onSubmit = async (data) => {
        const requestData = {
            name: user?.displayName,
            requested_by: user?.email,
            organization: data.organization,
            reason: data.reason,
            amount: 25,
            role_status: 'pending',
            payment_status:'unpaid',
            creation_date:currentTimestamp
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
            customClass: {
                popup: 'rounded-xl'
            }
        });

        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Redirecting to Payment...',
                showConfirmButton: false,
                timer: 1500
            });

            // You can handle the payment/redirection here
            console.log(requestData);

            // navigate('/dashboard/payment/charity', {
            //   state: { ...requestData }
            // });

            reset();
        }
    };




    return (
        <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">
                Request Charity Role
            </h2>

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
                    {errors.organization && (
                        <p className="text-red-500 text-sm">{errors.organization.message}</p>
                    )}
                </div>

                {/* Reason */}
                <div>
                    <label className="label">Why do you need this role?</label>
                    <textarea
                        className="textarea w-full"
                        rows="4"
                        {...register('reason', { required: 'Please provide a reason' })}
                    ></textarea>
                    {errors.reason && (
                        <p className="text-red-500 text-sm">{errors.reason.message}</p>
                    )}
                </div>

                {/* Payment Amount */}
                <div>
                    <label className="label">Payment Amount</label>
                    <input
                        type="text"
                        value="25"
                        readOnly
                        className="input w-full bg-gray-100 cursor-not-allowed"
                    />
                </div>

                {/* Pay Button */}
                <button type="submit" className="btn btn-primary w-full">
                    Pay & Submit Request
                </button>
            </form>
        </div>
    );
};

export default RequestCharityRole;
