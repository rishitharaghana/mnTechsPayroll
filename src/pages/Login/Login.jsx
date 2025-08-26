import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { Lock, Mail, UserCircle, Phone, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [uiRole, setUiRole] = useState('Admin');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const backendRole =
        uiRole === 'Admin' ? 'super_admin' :
        uiRole === 'HR' ? 'hr' :
        uiRole === 'Department Head' ? 'dept_head' : 'employee';

      const result = await dispatch(
        login({ mobileNumber, password, role: backendRole })
      ).unwrap();

      if (result.token) {
        localStorage.setItem(
          'userToken',
          JSON.stringify({
            token: result.token,
            role: result.role,
            email: result.email || null,
            mobile: result.mobile || mobileNumber,
            name: result.name || null,
            id: result.id,
            isTemporaryPassword: result.isTemporaryPassword || false,
          })
        );
      }

      if (result.success) {
        if (result.isTemporaryPassword) {
          navigate('/change-password', { replace: true });
        } else {
          switch (backendRole) {
            case 'employee':
              navigate('/emp-dashboard', { replace: true });
              break;
            case 'hr':
            case 'super_admin':
            case 'dept_head':
              navigate('/admin/dashboard', { replace: true });
              break;
            default:
              navigate('/', { replace: true });
          }
        }
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-50 flex items-center justify-center px-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-sm">
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-xl p-2 mb-4">
          <h2 className="text-2xl font-extrabold text-center text-white font-sans">
            {uiRole === 'employee' ? 'Employee Login' : `${uiRole} Login`}
          </h2>
        </div>

        {error && (
          <div className="mb-3 text-center text-sm text-red-600 bg-red-100/50 rounded-lg p-1.5">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4" aria-label={`${uiRole} Login Form`}>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Role</label>
            <div className="flex items-center space-x-2">
              <UserCircle size={18} className="text-slate-400" />
              <select
                value={uiRole}
                onChange={(e) => setUiRole(e.target.value)}
                className="w-full px-3 py-2 bg-white/70 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 font-sans appearance-none"
                aria-label="Select Role"
              >
                <option value="Admin">Admin</option>
                <option value="HR">HR</option>
                <option value="Department Head">Department Head</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Mobile Number</label>
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

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Password</label>
            <div className="flex items-center space-x-2 relative">
              <Lock size={18} className="text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-white/70 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 font-sans"
                required
                aria-label="Password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600 text-white py-2.5 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-200 hover:shadow-md disabled:opacity-50"
          >
            {loading ? 'Logging in...' : `Login as ${uiRole}`}
          </button>
        </form>

        <div className="mt-3 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-teal-600 hover:text-teal-700 flex items-center justify-center space-x-1.5 transition-colors duration-200"
          >
            <Mail size={16} />
            <span>Forgot Password?</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;