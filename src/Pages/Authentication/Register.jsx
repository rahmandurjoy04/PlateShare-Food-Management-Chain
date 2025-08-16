import React from 'react';
import { useForm } from 'react-hook-form';
import { updateProfile } from 'firebase/auth';
import Swal from 'sweetalert2';
import { Link, useLocation, useNavigate } from 'react-router';
import PlateShareLogo from '../../Shared/PlateShareLogo/PlateShareLogo';
import SocialLogin from './SocialLogin';
import useAuth from '../../hoooks/useAuth';
import useAxios from '../../hoooks/useAxios';

const Register = () => {
    const { registerUser } = useAuth();
    const axiosInstance = useAxios();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const imgbbAPIKey = import.meta.env.VITE_imgbbAPIKey;

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        const { name, email, password, image } = data;
        const file = image[0];

        try {
            // Upload to imgbb
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
                method: 'POST',
                body: formData
            });

            const imgbbData = await res.json();
            const imageUrl = imgbbData?.data?.url;

            if (!imageUrl) throw new Error('Image upload failed');

            // Create Firebase user
            const userCredential = await registerUser(email, password);

            // Update Firebase user profile
            await updateProfile(userCredential.user, {
                displayName: name,
                photoURL: imageUrl
            });

            // Convert Firebase timestamps to ISO string format
            const created_at = new Date(userCredential.user.metadata.creationTime).toISOString();
            const last_login_at = new Date(userCredential.user.metadata.lastSignInTime).toISOString();
            const firebaseUid = userCredential.user.uid;
            // Prepare user data to store in your backend
            const savedUser = {
                name,
                email,
                photo: imageUrl,
                role: 'user',
                firebaseUid,
                created_at,
                last_login_at
            };

            // Save user via Axios
            await axiosInstance.post('users', savedUser);

            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'Welcome to PlateShare!',
            });

            reset();
            navigate(from, { replace: true });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed!',
                text: error.message,
            });
        }
    };

    return (
        <div className="p-6 md:p-12 min-w-sm bg-accent rounded-xl mx-auto">
            <Link to={'/'} className='relative hidden md:block -top-25 -left-25 text-xl text-center p-1 w-10 h-10 rounded-full bg-primary text-white'>x</Link>
            <form onSubmit={handleSubmit(onSubmit)} className="p-0">
                <div className="flex flex-col items-center text-text">
                    <h1 className="text-3xl font-bold mb-3">Create An Account In</h1>
                    <PlateShareLogo />
                </div>

                {/* Full Name */}
                <label className="label mt-4">Full Name</label>
                <input
                    type="text"
                    placeholder="Full Name"
                    className="input input-bordered w-full"
                    {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}

                {/* Profile Photo */}
                <label className="label mt-4">Upload Profile Photo</label>
                <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered w-full"
                    {...register('image', { required: 'Please upload a profile photo' })}
                />
                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}

                {/* Email */}
                <label className="label mt-4">Email</label>
                <input
                    type="email"
                    placeholder="Email"
                    className="input input-bordered w-full"
                    {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

                {/* Password */}
                <label className="label mt-4">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    className="input input-bordered w-full"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                        },
                        pattern: {
                            value: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                            message: 'Must include one capital letter and one special character'
                        }
                    })}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

                {/* Confirm Password */}
                <label className="label mt-4">Confirm Password</label>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="input input-bordered w-full"
                    {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === password || 'Passwords do not match'
                    })}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}

                {/* Submit */}
                <button type="submit" className="btn bg-primary text-white hover:bg-primary/70 border-none mt-6 w-full">
                    Register
                </button>

                {/* Already have account */}
                <p className="text-lg text-center text-gray-600 mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 font-medium hover:underline">
                        Login
                    </Link>
                </p>
            </form>

            {/* Social Login */}
            <div className="mt-6">
                <SocialLogin />
            </div>
            <Link to={'/'} className='btn mt-8 w-full bg-primary md:hidden border-none hover:bg-primary/70 text-white'>Back to Home</Link>

        </div>
    );
};

export default Register;
