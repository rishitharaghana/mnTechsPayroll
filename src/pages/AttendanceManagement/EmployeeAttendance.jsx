import React, { useState } from 'react';
import { Calendar, Clock, FileText } from 'lucide-react';

const EmployeeAttendance = () => {
  const [employeeId, setEmployeeId] = useState('EMP001');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loginTime, setLoginTime] = useState('');
  const [logoutTime, setLogoutTime] = useState('');
  const [submissions, setSubmissions] = useState([]);

  const employees = [
    { id: 'EMP001', name: 'John Smith' },
    { id: 'EMP002', name: 'Sarah Wilson' },
    { id: 'EMP003', name: 'Mike Johnson' },
    { id: 'EMP004', name: 'Emily Davis' },
    { id: 'EMP005', name: 'Robert Brown' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loginTime || !logoutTime) return;
    const newSubmission = {
      id: `SUB${(submissions.length + 1).toString().padStart(3, '0')}`,
      employeeId,
      date,
      loginTime,
      logoutTime,
    };
    setSubmissions([...submissions, newSubmission]);
    setLoginTime('');
    setLogoutTime('');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Mark Attendance
        </h1>
        <p className="text-gray-600 mt-1">Submit your daily attendance here!</p>
      </div>

      {/* Form */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Login Time</label>
              <div className="flex items-center space-x-2">
                <Clock size={20} className="text-gray-400" />
                <input
                  type="time"
                  value={loginTime}
                  onChange={(e) => setLoginTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logout Time</label>
              <div className="flex items-center space-x-2">
                <Clock size={20} className="text-gray-400" />
                <input
                  type="time"
                  value={logoutTime}
                  onChange={(e) => setLogoutTime(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition"
            >
              <FileText size={20} />
              <span>Submit Attendance</span>
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Attendance */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Attendance Submissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time</th>
                <th className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logout Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions
                .filter((sub) => sub.employeeId === employeeId)
                .map(({ id, date, loginTime, logoutTime }) => (
                  <tr key={id} className="hover:bg-white/30 transition">
                    <td className="px-4 py-3 text-sm text-gray-900">{new Date(date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{loginTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{logoutTime}</td>
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