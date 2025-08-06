import React, { useState } from 'react';
import { Calendar, FileText, Briefcase, Mail } from 'lucide-react';

const LeaveApplication = () => {
  const [employeeId, setEmployeeId] = useState('EMP001');
  const [leaveType, setLeaveType] = useState('vacation');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [email, setEmail] = useState('');
  const [submissions, setSubmissions] = useState([]);

  const employees = [
    { id: 'EMP001', name: 'John Smith' },
    { id: 'EMP002', name: 'Sarah Wilson' },
    { id: 'EMP003', name: 'Mike Johnson' },
    { id: 'EMP004', name: 'Emily Davis' },
    { id: 'EMP005', name: 'Robert Brown' },
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
    if (!fromDate || !toDate || !reason || !email) return;

    const employee = employees.find((emp) => emp.id === employeeId);
    const newSubmission = {
      id: `LEAVE${(submissions.length + 1).toString().padStart(3, '0')}`,
      employeeId,
      employeeName: employee?.name || '',
      leaveType,
      from: fromDate,
      to: toDate,
      reason,
    };

    setSubmissions([...submissions, newSubmission]);
    setFromDate('');
    setToDate('');
    setReason('');
    setEmail('');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leave Request</h1>
        <p className="text-gray-600 mt-1">Submit your leave request details</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
            <div className="flex items-center space-x-2">
              <Briefcase size={20} className="text-gray-400" />
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none"
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
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none"
            >
              <option value="vacation">Vacation</option>
              <option value="sick">Sick</option>
              <option value="casual">Casual</option>
              
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-gray-400" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-gray-400" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="flex items-center space-x-2">
              <Mail size={20} className="text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for leave"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none"
              rows={4}
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-xl"
            >
              <FileText size={20} />
              <span>Submit Leave Request</span>
            </button>
          </div>
        </form>
      </div>

      {submissions.length > 0 && (
        <div className="bg-white rounded-xl p-4 mt-10 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Leave Requests</h2>
          <table className="min-w-full table-auto ">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Employee</th>
                <th className="px-4 py-2 text-left">Leave Type</th>
                <th className="px-4 py-2 text-left">From</th>
                <th className="px-4 py-2 text-left">To</th>
                <th className="px-4 py-2 text-left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{sub.employeeName}</td>
                  <td className="px-4 py-2">{sub.leaveType}</td>
                  <td className="px-4 py-2">{sub.from}</td>
                  <td className="px-4 py-2">{sub.to}</td>
                  <td className="px-4 py-2">{sub.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveApplication;
