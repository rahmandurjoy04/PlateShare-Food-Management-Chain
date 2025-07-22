import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hoooks/useAxiosSecure';
import { useLocation, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../../../Shared/LoadingSpinner/LoadingSpinner';

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const location = useLocation();
    const navigate = useNavigate();

    const requestData = location.state;
    const { name, requested_by, organization, amount, reason } = requestData || {};
    const amountInCents = amount * 100;

    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState('');

    const { isPending, data } = useQuery({
        queryKey: ['users', requested_by],
        queryFn: async () => {
            const res = await axiosSecure.get(`users/email?email=${requested_by}`);
            return res.data;
        }
    });

    if (isPending) {
        return (
            <div className='flex flex-col justify-center items-center gap-3 py-30'>
                <h1 className='text-3xl'>Redirecting....</h1>
                <LoadingSpinner />
            </div>
        );
    }

    console.log(data);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        setProcessing(true);

        // Step 1: Create payment intent
        const { data: intentRes } = await axiosSecure.post('create-payment-intent', {
            amount: amountInCents,
            requested_by,
        });
        const clientSecret = intentRes.clientSecret;
        if (!clientSecret) {
            Swal.fire('Error', 'Failed to create payment intent.', 'error');
            setProcessing(false);
            return;
        }

        // Step 2: Confirm payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: name || 'Anonymous',
                    email: requested_by,
                },
            },
        });

        if (error) {
            Swal.fire('Payment Error', error.message, 'error');
            setProcessing(false);
            return;
        }

        if (paymentIntent.status === 'succeeded') {
            Swal.fire('Payment Success', 'Your payment was successful!', 'success');

            //Save payment record

            // 1. Save transaction details
            const transactionData = {
                transactionId: paymentIntent.id,
                amount,
                date: new Date().toISOString(),
                email: data.email,
                purpose: "Charity Role Request",
            };
            await axiosSecure.post('transactions', transactionData);

            // Save role Request
            const roleRequestData = {
                name:name,
                email: data.email,
                amount:amount,
                organization: organization,
                mission: reason,
                transactionId: paymentIntent.id,
                payment_status: 'paid',
                user_status: "pending",
                charity_role_status: "pending",
                created_at: new Date().toISOString(),
            };
            await axiosSecure.post('roleRequest', roleRequestData);
        };

        setProcessing(false);

        navigate('/dashboard/request-charity-role')
    };




    return (
        <div className="max-w-lg mx-auto mt-10 bg-white shadow-xl rounded-xl p-6 border border-blue-200">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">Complete Payment</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#1e293b',
                                    '::placeholder': {
                                        color: '#94a3b8',
                                    },
                                    fontFamily: 'Inter, sans-serif',
                                    padding: '10px',
                                },
                                invalid: {
                                    color: '#e11d48',
                                },
                            },
                        }}
                        onChange={(event) => {
                            if (event.error) {
                                setCardError(event.error.message);
                            } else {
                                setCardError('');
                            }
                        }}
                    />
                </div>

                {cardError && (
                    <p className="text-red-600 text-sm mt-2">{cardError}</p>
                )}

                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="w-full bg-blue-900 text-white py-3 px-4 rounded-md hover:bg-blue-800 transition-colors duration-300 disabled:opacity-50"
                >
                    {processing ? 'Processing...' : `Pay $${amount}`}
                </button>
            </form>
        </div>
    );
};

export default CheckoutForm;
