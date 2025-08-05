import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Lock, User, Mail } from 'lucide-react';

const EmployeeLogin = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Mock employee credentials for demonstration
  const mockEmployees = [
    { id: 'EMP001', name: 'John Smith', password: 'password123', role: 'employee' },
    { id: 'EMP002', name: 'Sarah Wilson', password: 'password123', role: 'employee' },
    { id: 'EMP003', name: 'Mike Johnson', password: 'password123', role: 'employee' },
    { id: 'EMP004', name: 'Emily Davis', password: 'password123', role: 'employee' },
    { id: 'EMP005', name: 'Robert Brown', password: 'password123', role: 'employee' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const employee = mockEmployees.find(
      (emp) => emp.id === employeeId && emp.password === password
    );
    if (employee) {
      login({ id: employee.id, role: employee.role, name: employee.name });
      navigate('/employee/dashboard');
    } else {
      setError('Invalid Employee ID or Password');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Mock action for forgot password
    console.log('Forgot Password requested for Employee ID:', employeeId);
    alert('Password reset link sent to your registered email (mock action).');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Employee Login
        </h2>
        {error && (
          <div className="mb-4 text-center text-sm text-red-600 bg-red-100/50 rounded-lg p-2">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
            <div className="flex items-center space-x-2">
              <User size={20} className="text-gray-400" />
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="EMP123"
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
          >
            Login as Employee
          </button>
        </form>
        <div className="mt-4 text-center">
          <a
            href="#"
            onClick={handleForgotPassword}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center space-x-2"
          >
            <Mail size={16} />
            <span>Forgot Password?</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;