import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { changePassword, logout } from '../../redux/slices/authSlice';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const validateForm = () => {
    const newErrors = {};
    if (!currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    if (newPassword.length < 8) newErrors.newPassword = 'New password must be at least 8 characters';
    if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(changePassword({ currentPassword, newPassword })).unwrap();
      alert('Password changed successfully! Please log in with your new password.');
      
      // Dispatch logout to clear authentication state
      dispatch(logout());
      
      // Redirect to login page
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Password change failed:', err);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'current') setShowCurrentPassword((prev) => !prev);
    else setShowNewPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-50 flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 shadow-md w-full max-w-md">
        <h2 className="text-2xl font-extrabold text-center text-teal-600 mb-6">
          Change Password
        </h2>
        {error && (
          <div className="mb-4 text-center text-sm text-red-600 bg-red-100/50 rounded-lg p-1.5">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Current Password
            </label>
            <div className="flex items-center space-x-2 relative">
              <Lock size={18} className="text-slate-400" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={`w-full px-3 py-2 bg-white/70 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 ${
                  errors.currentPassword ? 'border-red-500' : ''
                }`}
                required
                aria-label="Current Password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400"
                aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              New Password
            </label>
            <div className="flex items-center space-x-2 relative">
              <Lock size={18} className="text-slate-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full px-3 py-2 bg-white/70 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 ${
                  errors.newPassword ? 'border-red-500' : ''
                }`}
                required
                aria-label="New Password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400"
                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Confirm New Password
            </label>
            <div className="flex items-center space-x-2">
              <Lock size={18} className="text-slate-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className={`w-full px-3 py-2 bg-white/70 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 ${
                  errors.confirmNewPassword ? 'border-red-500' : ''
                }`}
                required
                aria-label="Confirm New Password"
              />
            </div>
            {errors.confirmNewPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmNewPassword}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600 text-white py-2.5 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;