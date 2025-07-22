import React from 'react';
import { useNavigate } from 'react-router';
import { FaBan } from 'react-icons/fa'; // React Icon for forbidden

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12 text-center">
      <FaBan className="text-red-600 text-7xl mb-6" />
      <h1 className="text-4xl font-bold text-red-600 mb-2">403 - Forbidden</h1>
      <p className="text-lg text-gray-600 mb-6">
        You don’t have permission to access this page.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
      >
        Return Home
      </button>
    </div>
  );
};

export default Forbidden;
