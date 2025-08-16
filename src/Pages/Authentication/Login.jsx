import React from 'react';
import PlateShareLogo from '../../Shared/PlateShareLogo/PlateShareLogo';
import { Link, useNavigate, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import SocialLogin from './SocialLogin';
import Swal from 'sweetalert2';
import useAuth from '../../hoooks/useAuth';
import useAxios from '../../hoooks/useAxios';

const Login = () => {
    const { loginUser } = useAuth();
    const axiosInstance = useAxios();
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
            .then(async () => {
                // PATCH request to update last_login_at
                await axiosInstance.patch(`users/email?email=${email}`, {
                    last_login_at: new Date().toISOString(),
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
        <div className='p-10 bg-accent min-w-sm rounded-xl'>
            <Link to={'/'} className='relative hidden md:block -top-20 -left-20 text-xl text-center p-1 w-10 h-10 rounded-full bg-primary text-white'>x</Link>

            <form onSubmit={handleSubmit(onSubmit)} >
                <fieldset className="fieldset text-xl rounded-box w-full p-4">
                    <div className='flex flex-col justify-center items-center text-text'>
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

                    <button type="submit" className="btn bg-primary text-white hover:bg-primary/70 border-none mt-6 w-full">
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
            <Link to={'/'} className='btn mt-8 w-full bg-primary md:hidden border-none hover:bg-primary/70 text-white'>Back to Home</Link>
        </div>
    );
};

export default Login;
