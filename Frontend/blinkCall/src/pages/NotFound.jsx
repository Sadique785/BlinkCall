import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
      <button
        onClick={handleHomeClick}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;