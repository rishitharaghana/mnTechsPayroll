import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail, UserCircle } from 'lucide-react';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // Default to admin
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const mockAdmins = [
    { id: 'ADMIN001', name: 'Admin One', password: 'adminpass123', role: 'admin' },
    { id: 'ADMIN002', name: 'Admin Two', password: 'adminpass123', role: 'admin' },
  ];

  const mockEmployees = [
    { id: 'EMP001', name: 'Employee One', password: 'emppass123', role: 'employee' },
    { id: 'EMP002', name: 'Employee Two', password: 'emppass123', role: 'employee' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { adminId, password, role }); // Debug log

    const users = role === 'admin' ? mockAdmins : mockEmployees;
    const user = users.find(
      (u) => u.id === adminId && u.password === password && u.role === role
    );

    if (user) {
      localStorage.setItem('userToken', JSON.stringify({ id: user.id, role: user.role }));
      navigate(role === 'admin' ? '/admin/dashboard' : '/emp-dashboard', { replace: true });
    } else {
      setError('Invalid ID, Password, or Role');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log('Forgot Password requested for ID:', adminId, 'Role:', role);
    alert(`Password reset link sent to your ${role} email (mock action).`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-100 flex items-center justify-center px-4 z-50">
      <div className="bg-white/95 backdrop-blur-lg rounded-xl p-8 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-md">
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg p-4 mb-6">
          <h2 className="text-4xl font-extrabold text-center text-white font-sans">
            {role === 'admin' ? 'Admin Login' : 'Employee Login'}
          </h2>
        </div>
        {error && (
          <div className="mb-4 text-center text-sm text-red-600 bg-red-100/70 rounded-lg p-2 animate-slide-in">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6" aria-label={`${role} Login Form`}>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Role
            </label>
            <div className="flex items-center space-x-2">
              <UserCircle size={20} className="text-slate-400 transform hover:scale-110 transition-transform duration-200" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-sans"
                aria-label="Select Role"
              >
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              {role === 'admin' ? 'Admin ID' : 'Employee ID'}
            </label>
            <div className="flex items-center space-x-2">
              <User size={20} className="text-slate-400 transform hover:scale-110 transition-transform duration-200" />
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder={role === 'admin' ? 'ADMIN001' : 'EMP001'}
                className="w-full px-4 py-3 bg-white/50 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-sans"
                required
                aria-label={`${role} ID`}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Password
            </label>
            <div className="flex items-center space-x-2">
              <Lock size={20} className="text-slate-400 transform hover:scale-110 transition-transform duration-200" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white/50 border border-slate-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 font-sans"
                required
                aria-label="Password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600 text-white py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-300 transform hover:scale-105"
          >
            Login as {role === 'admin' ? 'Admin' : 'Employee'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a
            href="#"
            onClick={handleForgotPassword}
            className="text-sm text-teal-600 hover:text-teal-700 flex items-center justify-center space-x-2 transition-colors duration-200"
          >
            <Mail size={16} className="transform hover:scale-110 transition-transform duration-200" />
            <span>Forgot Password?</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;