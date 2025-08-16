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

  ];

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
    <div className="p-6 space-y-6 bg-white min-h-screen text-slate-700">
      <div>
        <h1 className="text-3xl font-bold">Leave Request</h1>
        <p className="text-slate-500 mt-1">Submit your leave request details</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-300">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Employee</label>
            <div className="flex items-center space-x-2">
              <Briefcase size={20} className="text-slate-400" />
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none"
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
            <label className="block text-sm font-medium mb-2">Leave Type</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none"
            >
              <option value="vacation">Vacation</option>
              <option value="sick">Sick</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">From</label>
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-slate-400" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To</label>
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-slate-400" />
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="flex items-center space-x-2">
              <Mail size={20} className="text-slate-400" />
              <input
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-2">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for leave"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none"
              rows={4}
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-gray-100 text-slate-700 px-6 py-3 rounded-xl hover:bg-teal-100 border border-slate-300"
            >
              <FileText size={20} />
              <span>Submit Leave Request</span>
            </button>
          </div>
        </form>
      </div>

      {submissions.length > 0 && (
        <div className="bg-white rounded-xl p-4 mt-10 overflow-x-auto border border-slate-300">
          <h2 className="text-xl font-semibold mb-4">Leave Requests</h2>
          <table className="min-w-full table-auto text-slate-700">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Employee</th>
                <th className="px-4 py-2">Leave Type</th>
                <th className="px-4 py-2">From</th>
                <th className="px-4 py-2">To</th>
                <th className="px-4 py-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub.id} className="border-t border-slate-200">
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
