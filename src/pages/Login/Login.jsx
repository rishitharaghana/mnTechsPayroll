import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { Lock, UserCircle, Phone, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import LoginBackground from '/assets/login_background.png?url';

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [uiRole, setUiRole] = useState('Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'HR', label: 'HR' },
    { value: 'Department Head', label: 'Department Head' },
    { value: 'Manager', label: 'Manager' },
    { value: 'employee', label: 'Employee' },
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderColor: 'slate-200/50',
      borderRadius: '1rem',
      padding: '0.1rem 0.75rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'rgba(148, 163, 184, 0.5)',
      },
      '&:focus-within': {
        borderColor: '#0d9488',
        boxShadow: '0 0 0 2px rgba(13, 148, 136, 0.5)',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#1e293b',
      fontSize: '0.875rem',
      fontWeight: '500',
      fontFamily: 'sans-serif',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white',
      borderRadius: '1rem',
      marginTop: '0.25rem',
      border: '1px solid rgba(148, 163, 184, 0.5)',
      overflow: 'hidden',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'rgba(13, 148, 136, 0.1)'
        : state.isFocused
        ? 'rgba(13, 148, 136, 0.05)'
        : 'white',
      color: '#1e293b',
      fontSize: '0.875rem',
      fontWeight: '500',
      fontFamily: 'sans-serif',
      padding: '0.75rem 1rem',
      '&:hover': {
        backgroundColor: 'rgba(13, 148, 136, 0.05)',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#94a3b8',
      fontSize: '0.875rem',
      fontWeight: '600',
      fontFamily: 'sans-serif',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: '#94a3b8',
      '&:hover': {
        color: '#64748b',
      },
    }),
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const backendRole =
        uiRole === 'Admin' ? 'super_admin' :
        uiRole === 'HR' ? 'hr' :
        uiRole === 'Department Head' ? 'dept_head' :
        uiRole === 'Manager' ? 'manager' :
        'employee';

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
        localStorage.setItem('rememberMe', rememberMe);
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
            case 'manager':
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
    <div
      className="min-h-screen lg:pl-50 md:pl-25 flex items-center justify-center md:justify-start px-4 z-50"
      style={{
        background: `url(${LoginBackground}) no-repeat center center fixed`,
        backgroundSize: 'cover',
      }}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-sm 2xl:max-w-xl">
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-xl p-2 mb-4">
          <h2 className="sm:text-2xl text-lg font-extrabold text-center text-white font-sans">
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
              <Select
                options={roleOptions}
                value={roleOptions.find((option) => option.value === uiRole)}
                onChange={(selectedOption) => setUiRole(selectedOption.value)}
                styles={customSelectStyles}
                className="w-full  text-sm sm:text-base"
                placeholder="Select Role"
                aria-label="Select Role"
              />
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
                className="w-full px-3 py-2 text-sm sm:text-base bg-white/70 border border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 font-sans"
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
                className="w-full px-3 py-2 text-sm sm:text-base bg-white/70 border border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 font-sans"
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

          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3 w-3 text-teal-600 focus:ring-teal-600 border-slate-200/50 rounded"
                aria-label="Remember Me"
              />
              <span>Remember Me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-teal-600 hover:text-teal-700 transition-colors duration-200"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600 text-white py-2.5 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-200 hover:shadow-md disabled:opacity-50"
          >
            {loading ? 'Logging in...' : `Login as ${uiRole}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;