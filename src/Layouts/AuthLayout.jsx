import React from 'react';
import { Outlet } from 'react-router';
import authAni from '../assets/authAni.json'
import Lottie from 'lottie-react';
import Navbar from '../Shared/Navbar';

const AuthLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className="flex flex-col-reverse min-h-screen md:flex-row min-w-sm p-12 bg-blue-100">
                {/* Left: Auth Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12 lg:px-10 py-12">
                    <div className="w-full min-w-sm max-w-xl rounded-xl bg-blue-300">
                        <Outlet />
                    </div>
                </div>

                {/* Right: Image or Animation */}
                <div className="w-full md:w-1/2  rounded-xl relative flex justify-center items-center overflow-hidden">
                    <div className="w-3/4 max-h-[600px]">
                        <Lottie animationData={authAni} loop={true} />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
