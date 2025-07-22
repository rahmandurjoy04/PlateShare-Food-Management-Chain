import React from 'react';
import { Link } from 'react-router';
import Lottie from 'lottie-react';
import animationData from '../../assets/404-error.json';

const ErrorPage = () => {
  return (
    <div className="min-h-screen min-w-sm bg-white flex items-center justify-center p-6">
      <div className=" text-center">
        <Lottie
          animationData={animationData}
          loop={true}
          className="w-60 md:w-140 mx-auto"
        />

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Oops! Page not found.
        </h2>

        <p className="text-gray-600 mb-6 text-sm md:text-base">
          The page you're looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          ⬅ Back to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
