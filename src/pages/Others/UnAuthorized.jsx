import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
        <p className="mt-2">You do not have permission to access this page.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 bg-teal-600 text-white py-2 px-4 rounded"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;