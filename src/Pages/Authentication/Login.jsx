import React from 'react';
import PlateShareLogo from '../../Shared/PlateShareLogo/PlateShareLogo';
import { Link, useNavigate, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import SocialLogin from './SocialLogin';
import Swal from 'sweetalert2';
import useAuth from '../../hoooks/useAuth';

const Login = () => {
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = (data) => {
        const { email, password } = data;

        loginUser(email, password)
            .then(() => {
                // PATCH request to update last_login_at
                fetch(`http://localhost:3000/users?email=${email}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ last_login_at: new Date().toISOString() }),
                })
                    .then(res => {
                        if (!res.ok) {
                            console.error('Failed to update last login time');
                        }
                    })
                    .catch(err => {
                        console.error('Error updating last login:', err);
                    });

                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate(from, { replace: true });
            })
            .catch((error) => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: error.message
                });
            });
    };


    return (
        <div className='p-6'>
            <form onSubmit={handleSubmit(onSubmit)} >
                <fieldset className="fieldset text-xl rounded-box w-full p-4">
                    <div className='flex flex-col justify-center items-center text-blue-900'>
                        <h1 className='text-3xl font-bold mb-3'>Welcome to</h1>
                        <PlateShareLogo />
                    </div>

                    <label className="label">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        className="input w-full"
                        {...register('email', { required: 'Email is required' })}
                    />
                    {errors.email && (
                        <p className="text-red-500 mt-1 text-center text-lg">{errors.email.message}</p>
                    )}

                    <label className="label mt-4">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        className="input w-full"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        })}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-md text-center mt-1">{errors.password.message}</p>
                    )}

                    <button type="submit" className="btn btn-neutral mt-6 w-full">
                        Login
                    </button>

                    <p className="text-lg text-center text-gray-600 mt-4">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 font-medium hover:underline">
                            Register
                        </Link>
                    </p>
                </fieldset>
            </form>

            <SocialLogin />
        </div>
    );
};

export default Login;
