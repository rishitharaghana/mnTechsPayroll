import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail } from 'lucide-react';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Mock admin credentials
  const mockAdmins = [
    { id: 'ADMIN001', name: 'Admin One', password: 'adminpass123', role: 'admin' },
    { id: 'ADMIN002', name: 'Admin Two', password: 'adminpass123', role: 'admin' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const admin = mockAdmins.find(
      (admin) => admin.id === adminId && admin.password === password
    );
    if (admin) {
      // Add your login function here
      // login({ id: admin.id, role: admin.role, name: admin.name });
      navigate('/admin/dashboard');
    } else {
      setError('Invalid Admin ID or Password');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log('Forgot Password requested for Admin ID:', adminId);
    alert('Password reset link sent to your admin email (mock action).');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Admin Login
        </h2>
        {error && (
          <div className="mb-4 text-center text-sm text-red-600 bg-red-100/50 rounded-lg p-2">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin ID</label>
            <div className="flex items-center space-x-2">
              <User size={20} className="text-gray-400" />
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="ADMIN001"
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="flex items-center space-x-2">
              <Lock size={20} className="text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
          >
            Login as Admin
          </button>
        </form>
        <div className="mt-4 text-center">
          <a
            href="#"
            onClick={handleForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center space-x-2"
          >
            <Mail size={16} />
            <span>Forgot Password?</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
