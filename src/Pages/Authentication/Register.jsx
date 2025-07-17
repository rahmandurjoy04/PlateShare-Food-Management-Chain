import React from 'react';
import { useForm } from 'react-hook-form';
import { updateProfile } from 'firebase/auth';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import PlateShareLogo from '../../Shared/PlateShareLogo/PlateShareLogo';
import SocialLogin from './SocialLogin';
import useAuth from '../../hoooks/useAuth';

const Register = () => {
    const { registerUser } = useAuth();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm();

    const password = watch('password');
    const imgbbAPIKey = import.meta.env.VITE_imgbbAPIKey;

    const onSubmit = async (data) => {
        const { name, email, password, image } = data;
        const file = image[0];

        try {
            // 1. Upload image to imgbb
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, {
                method: 'POST',
                body: formData
            });

            const imgbbData = await res.json();
            const imageUrl = imgbbData?.data?.url;

            if (!imageUrl) throw new Error('Image upload failed');

            // 2. Create Firebase user
            const userCredential = await registerUser(email, password);
            // 3. Update Firebase profile
            await updateProfile(userCredential.user, {
                displayName: name,
                photoURL: imageUrl
            });

            // 4. Save user to your database
            const savedUser = {
                name,
                email,
                photo: imageUrl,
                role: 'user' // default role
            };

            console.log(savedUser);

            // await fetch('https://your-server-url.com/users', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(savedUser)
            // });

            // 5. Show success message
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'Welcome to PlateShare!',
            });

            reset();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed!',
                text: error.message,
            });
        }
    };

    return (
        <div className="p-6 md:p-12 min-w-sm mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="p-0">
                <div className="flex flex-col items-center text-blue-900">
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
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}

                {/* Photo Upload */}
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
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}

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
                            message: 'Must contain at least one capital letter and one special character'
                        }
                    })}
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}

                {/* Confirm Password */}
                <label className="label mt-4">Confirm Password</label>
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="input input-bordered w-full"
                    {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                            value === password || 'Passwords do not match'
                    })}
                />
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}

                {/* Submit Button */}
                <button type="submit" className="btn btn-neutral mt-6 w-full">
                    Register
                </button>

                {/* Login Link */}
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
        </div>
    );
};

export default Register;
