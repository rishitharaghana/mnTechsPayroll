import React, { useState } from 'react';
import { Calendar, Clock, FileText } from 'lucide-react';

const EmployeeAttendance = () => {
  const [employeeId] = useState('EMP001'); // Fixed employee ID
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loginTime, setLoginTime] = useState('');
  const [logoutTime, setLogoutTime] = useState('');
  const [recipient, setRecipient] = useState('HR');
  const [submissions, setSubmissions] = useState([]);

  const employeeName = 'John Smith (EMP001)'; // Fixed employee display
  const recipients = ['Admin', 'HR', 'Manager'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeId || !date || !loginTime || !logoutTime || !recipient) {
      alert('Please fill in all required fields.');
      return;
    }
    const newSubmission = {
      id: `SUB${(submissions.length + 1).toString().padStart(3, '0')}`,
      employeeId,
      date,
      loginTime,
      logoutTime,
      recipient,
      submittedAt: new Date().toISOString(),
    };
    setSubmissions([...submissions, newSubmission]);
    // Simulate submission to backend
    console.log('Submitting to backend:', newSubmission);
    // Reset form fields
    setLoginTime('');
    setLogoutTime('');
    setRecipient('HR');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2 tracking-tight">
          Mark Attendance
        </h1>
        <p className="text-gray-600 text-center">Submit your daily attendance for review</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">
              Employee
            </label>
            <div className="flex items-center space-x-2">
              <FileText size={20} className="text-black" />
              <input
                type="text"
                value={employeeName}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 cursor-not-allowed"
                disabled
                aria-label="Employee"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">
              Date
            </label>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-black" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                required
                aria-label="Date"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">
              Login Time
            </label>
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-black" />
              <input
                type="time"
                value={loginTime}
                onChange={(e) => setLoginTime(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                required
                aria-label="Login Time"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">
              Logout Time
            </label>
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-black" />
              <input
                type="time"
                value={logoutTime}
                onChange={(e) => setLogoutTime(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                required
                aria-label="Logout Time"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">
              Submit To
            </label>
            <div className="flex items-center space-x-2">
              <FileText size={20} className="text-black" />
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                required
                aria-label="Submit To"
              >
                {recipients.map((rec) => (
                  <option key={rec} value={rec}>
                    {rec}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300 text-sm font-medium"
              aria-label="Submit Attendance"
            >
              <FileText size={20} />
              <span>Submit Attendance</span>
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Attendance */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Attendance Submissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/4 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-tight">
                  Date
                </th>
                <th className="w-1/4 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-tight">
                  Login Time
                </th>
                <th className="w-1/4 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-tight">
                  Logout Time
                </th>
                <th className="w-1/4 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-tight">
                  Submitted To
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions
                .filter((sub) => sub.employeeId === employeeId)
                .map(({ id, date, loginTime, logoutTime, recipient }) => (
                  <tr key={id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{loginTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{logoutTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{recipient}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;