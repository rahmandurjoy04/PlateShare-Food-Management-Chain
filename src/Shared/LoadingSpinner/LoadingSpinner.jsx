import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-9 h-9">
        {/* Outer gradient ring */}
        <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-transparent border-t-blue-500 border-b-purple-500 animate-spin"></div>

        {/* Glowing core dot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-purple-400/50 animate-pulse"></div>

        {/* Halo effect */}
        <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full border border-blue-400/20 transform -translate-x-1/2 -translate-y-1/2 blur-sm"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
