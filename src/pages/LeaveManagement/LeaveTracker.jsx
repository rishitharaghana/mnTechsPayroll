import React from 'react';
import { Clock, CheckCircle, XCircle, User, Plus, UserCheck, Calendar } from 'lucide-react';

const leaveData = [
  {
    id: '1',
    name: 'John Doe',
    department: 'Engineering',
    type: 'vacation',
    from: '2024-04-01',
    to: '2024-04-05',
    days: 5,
    status: 'pending',
    reason: 'Family vacation',
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    department: 'HR',
    type: 'sick',
    from: '2024-03-18',
    to: '2024-03-20',
    days: 3,
    status: 'approved',
    reason: 'Medical treatment',
  },
];

const statusColors = {
  approved: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
};

const typeColors = {
  vacation: 'from-blue-500 to-blue-700',
  sick: 'from-red-500 to-red-700',
  personal: 'from-gray-500 to-gray-700',
  maternity: 'from-purple-500 to-purple-700',
};

const LeaveTracker = () => {
  const summary = [
    { label: 'Pending', count: 4, icon: <Clock className="text-yellow-500" />, color: 'from-yellow-400 to-yellow-600' },
    { label: 'Approved', count: 12, icon: <CheckCircle className="text-green-500" />, color: 'from-green-400 to-green-600' },
    { label: 'Rejected', count: 3, icon: <XCircle className="text-red-500" />, color: 'from-red-400 to-red-600' },
    { label: 'Total Requests', count: 19, icon: <UserCheck className="text-indigo-500" />, color: 'from-indigo-400 to-indigo-600' },
  ];

  const handleApprove = (id) => {
    console.log(`Approved leave request ID: ${id}`);
  };

  const handleReject = (id) => {
    console.log(`Rejected leave request ID: ${id}`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Leave Management
          </h1>
          <p className="text-gray-600 mt-1">Monitor and process employee leave requests</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg flex items-center gap-2">
          <Plus size={18} />
          New Request
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((item, i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/20 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                {item.icon}
              </div>
              <div className="text-2xl font-bold text-gray-800">{item.count}</div>
            </div>
            <div className="text-gray-500 font-medium text-sm">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Leave Requests List */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Leave Requests</h2>
        </div>
        <div className="space-y-6 p-6">
          {leaveData.map((req) => (
            <div
              key={req.id}
              className="p-6 bg-white/50 rounded-xl border border-gray-200 hover:shadow-lg transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Employee Details */}
                <div className="col-span-2 flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center">
                    <User size={28} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900">{req.name}</h3>
                    <p className="text-sm font-medium text-gray-600">{req.department}</p>
                    <p className="text-xs text-gray-500">ID: {req.id}</p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Reason:</span> {req.reason}
                    </p>
                  </div>
                </div>

                {/* Leave Details */}
                <div className="col-span-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>
                      <strong>From:</strong> {new Date(req.from).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span>
                      <strong>To:</strong> {new Date(req.to).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Duration:</strong> {req.days} days
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs text-white font-semibold bg-gradient-to-r ${typeColors[req.type]}`}>
                      {req.type}
                    </span>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="col-span-1 flex flex-col items-start md:items-end gap-3">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase">Status</span>
                    <p className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[req.status]}`}>
                      {req.status}
                    </p>
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-xl"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs rounded-xl"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveTracker;