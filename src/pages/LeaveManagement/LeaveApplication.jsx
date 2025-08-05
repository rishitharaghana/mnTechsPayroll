import React, { useState } from 'react';
import { Calendar, FileText, Briefcase } from 'lucide-react';

const LeaveApplication = () => {
  const [employeeId, setEmployeeId] = useState('EMP001');
  const [leaveType, setLeaveType] = useState('vacation');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [submissions, setSubmissions] = useState([]);

  const employees = [
    { id: 'EMP001', name: 'John Smith' },
    { id: 'EMP002', name: 'Sarah Wilson' },
    { id: 'EMP003', name: 'Mike Johnson' },
    { id: 'EMP004', name: 'Emily Davis' },
    { id: 'EMP005', name: 'Robert Brown' },
  ];

  const leaveTypes = [
    { value: 'vacation', label: 'Vacation' },
    { value: 'sick', label: 'Sick' },
    { value: 'personal', label: 'Personal' },
    { value: 'maternity', label: 'Maternity' },
  ];

  const calculateDays = (from, to) => {
    if (!from || !to) return 0;
    const fromDateObj = new Date(from);
    const toDateObj = new Date(to);
    const diffTime = toDateObj - fromDateObj;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays >= 0 ? diffDays : 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reason) return;
    const newSubmission = {
      id: `LEAVE${(submissions.length + 1).toString().padStart(3, '0')}`,
      employeeId,
      type: leaveType,
      from: fromDate,
      to: toDate,
      days: calculateDays(fromDate, toDate),
      reason,
    };
    setSubmissions([...submissions, newSubmission]);
    setFromDate('');
    setToDate('');
    setReason('');
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Leave Request
        </h1>
        <p className="text-gray-600 mt-1">Submit your leave request details</p>
      </div>

      {/* Form */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
            <div className="flex items-center space-x-2">
              <Briefcase size={20} className="text-gray-400" />
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Leave Type</label>
            <div className="flex items-center space-x-2">
              <Briefcase size={20} className="text-gray-400" />
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {leaveTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-gray-400" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-gray-400" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for leave"
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
            />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition"
            >
              <FileText size={20} />
              <span>Submit Leave Request</span>
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Leave Requests */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Leave Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions
                .filter((sub) => sub.employeeId === employeeId)
                .map(({ id, from, to, type, reason }) => (
                  <tr key={id} className="hover:bg-white/30 transition">
                    <td className="px-4 py-3 text-sm text-gray-900">{new Date(from).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{new Date(to).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 capitalize">{type}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{reason}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveApplication;