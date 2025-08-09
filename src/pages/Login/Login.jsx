import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, UserCircle, Phone } from 'lucide-react';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('super-admin'); 
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const mockUsers = [
    { mobile: '9876543210', name: 'Super Admin', password: 'adminpass123', role: 'super-admin' },
    { mobile: '9123456789', name: 'HR Manager', password: 'hrpass123', role: 'hr' },
    { mobile: '9988776655', name: 'IT Department Head', password: 'itheadpass', role: 'dept-head' },
    { mobile: '9876123456', name: 'Employee One', password: 'emppass123', role: 'employee' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { mobileNumber, password, role });

    const user = mockUsers.find(
      (u) => u.mobile === mobileNumber && u.password === password && u.role === role
    );

    if (user) {
      localStorage.setItem('userToken', JSON.stringify({ mobile: user.mobile, role: user.role }));
      if (role === 'employee') {
        navigate('/emp-dashboard', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    } else {
      setError('Invalid Mobile Number, Password, or Role');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log('Forgot Password requested for Mobile:', mobileNumber, 'Role:', role);
    alert(`Password reset link sent to your ${role} registered mobile (mock action).`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-50 flex items-center justify-center px-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-sm">
        
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-xl p-2 mb-4">
          <h2 className="text-2xl font-extrabold text-center text-white font-sans">
            {role === 'employee' ? 'Employee Login' : 'Admin Login'}
          </h2>
        </div>

        {error && (
          <div className="mb-3 text-center text-sm text-red-600 bg-red-100/50 rounded-lg p-1.5">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4" aria-label={`${role} Login Form`}>
          
          {/* Role Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Role
            </label>
            <div className="flex items-center space-x-2">
              <UserCircle size={18} className="text-slate-400" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-white/70 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 font-sans appearance-none"
                aria-label="Select Role"
              >
                <option value="super-admin">Admin </option>
                <option value="hr">HR</option>
                <option value="dept-head">Department Head</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Mobile Number
            </label>
            <div className="flex items-center space-x-2">
              <Phone size={18} className="text-slate-400" />
              <input
                type="tel"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter Mobile Number"
                pattern="[0-9]{10}"
                className="w-full px-3 py-2 bg-white/70 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 font-sans"
                required
                aria-label="Mobile Number"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Password
            </label>
            <div className="flex items-center space-x-2">
              <Lock size={18} className="text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-white/70 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 font-sans"
                required
                aria-label="Password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600 text-white py-2.5 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-200 hover:shadow-md"
          >
            Login as {role === 'super-admin' ? 'Admin' : role.toUpperCase()}
          </button>
        </form>

        {/* Forgot Password */}
        <div className="mt-3 text-center">
          <a
            href="#"
            onClick={handleForgotPassword}
            className="text-sm text-teal-600 hover:text-teal-700 flex items-center justify-center space-x-1.5 transition-colors duration-200"
          >
            <Mail size={16} />
            <span>Forgot Password?</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
