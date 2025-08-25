import React from 'react';

const LeaveDashboard = () => {
  const leaveBalance = [
    { type: 'Casual Leave (CL)', allocated: 12, taken: 4, isPaid: true },
    { type: 'Sick Leave (SL)', allocated: 8, taken: 2, isPaid: true },
    { type: 'Earned Leave (EL)', allocated: 15, taken: 5, isPaid: true },
    { type: 'Work From Home', allocated: 'Unlimited', taken: 3, isPaid: true },
    { type: 'Unpaid Leave', allocated: 0, taken: 2, isPaid: false },
  ];

  const leaveHistory = [
    {
      from: '2025-08-01',
      to: '2025-08-03',
      type: 'Sick Leave',
      status: 'Approved',
      isPaid: true,
      reason: 'Fever',
    },
    {
      from: '2025-07-15',
      to: '2025-07-15',
      type: 'Unpaid Leave',
      status: 'Approved',
      isPaid: false,
      reason: 'Emergency',
    },
    {
      from: '2025-07-05',
      to: '2025-07-06',
      type: 'Earned Leave',
      status: 'Pending',
      isPaid: true,
      reason: 'Function',
    },
    {
      from: '2025-06-10',
      to: '2025-06-10',
      type: 'Casual Leave',
      status: 'Rejected',
      isPaid: true,
      reason: 'Travel',
    },
  ];

  const calculateDays = (from, to) =>
    (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24) + 1;

  const approvedLeaves = leaveHistory.filter((l) => l.status === 'Approved');
  const pendingLeaves = leaveHistory.filter((l) => l.status === 'Pending');
  const rejectedLeaves = leaveHistory.filter((l) => l.status === 'Rejected');

  const paidUsed = approvedLeaves
    .filter((l) => l.isPaid)
    .reduce((sum, l) => sum + calculateDays(l.from, l.to), 0);

  const unpaidUsed = approvedLeaves
    .filter((l) => !l.isPaid)
    .reduce((sum, l) => sum + calculateDays(l.from, l.to), 0);

  const pendingCount = pendingLeaves.reduce(
    (sum, l) => sum + calculateDays(l.from, l.to),
    0
  );

  const totalUsed = paidUsed + unpaidUsed;
  const deductionAmount = unpaidUsed * 500; 

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-md space-y-6">
      <h2 className="text-2xl font-semibold mb-4">🗓️ Leave Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-green-100 text-green-800 px-4 py-3 rounded shadow">
          <p className="text-lg font-medium">✅ Paid Leaves Used</p>
          <p className="text-2xl font-bold">{paidUsed}</p>
        </div>
        <div className="bg-red-100 text-red-800 px-4 py-3 rounded shadow">
          <p className="text-lg font-medium">❌ Unpaid Leaves Used</p>
          <p className="text-2xl font-bold">{unpaidUsed}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 px-4 py-3 rounded shadow">
          <p className="text-lg font-medium">⏳ Pending Leaves</p>
          <p className="text-2xl font-bold">{pendingCount}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded shadow col-span-2 md:col-span-1">
          <p className="text-lg font-medium">📋 Total Used</p>
          <p className="text-2xl font-bold">{totalUsed}</p>
        </div>
      </div>

      {unpaidUsed > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <p>
            ⚠️ <strong>Salary Deduction:</strong> ₹{deductionAmount} for {unpaidUsed} unpaid leave(s)
          </p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium mb-2">Leave Balance</h3>
        <table className="w-full text-left border rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Leave Type</th>
              <th className="px-4 py-2">Paid?</th>
              <th className="px-4 py-2">Allocated</th>
              <th className="px-4 py-2">Taken</th>
              <th className="px-4 py-2">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {leaveBalance.map((leave, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{leave.type}</td>
                <td className="px-4 py-2">
                  {leave.isPaid ? '✅ Paid' : '❌ Unpaid'}
                </td>
                <td className="px-4 py-2">{leave.allocated}</td>
                <td className="px-4 py-2">{leave.taken}</td>
                <td className="px-4 py-2">
                  {leave.allocated === 'Unlimited' || leave.allocated === 0
                    ? 'N/A'
                    : leave.allocated - leave.taken}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leave History Table */}
      <div>
        <h3 className="text-lg font-medium mb-2">Leave History</h3>
        <table className="w-full text-left border rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">From</th>
              <th className="px-4 py-2">To</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Paid?</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.map((leave, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{leave.from}</td>
                <td className="px-4 py-2">{leave.to}</td>
                <td className="px-4 py-2">{leave.type}</td>
                <td className="px-4 py-2">{leave.isPaid ? '✅' : '❌'}</td>
                <td
                  className={`px-4 py-2 font-medium ${
                    leave.status === 'Approved'
                      ? 'text-green-600'
                      : leave.status === 'Rejected'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {leave.status}
                </td>
                <td className="px-4 py-2">{leave.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveDashboard;
