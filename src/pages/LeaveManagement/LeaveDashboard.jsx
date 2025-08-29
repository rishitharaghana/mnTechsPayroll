import React, { useState } from "react";
import { format } from "date-fns"; // For better date formatting
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  List,
  AlertTriangle,
  PlusCircle,
} from "lucide-react"; // Import Lucide icons

const LeaveDashboard = () => {
  const leaveBalance = [
    { type: "Casual Leave (CL)", allocated: 12, taken: 4, isPaid: true },
    { type: "Sick Leave (SL)", allocated: 8, taken: 2, isPaid: true },
    { type: "Earned Leave (EL)", allocated: 15, taken: 5, isPaid: true },
    { type: "Work From Home", allocated: "Unlimited", taken: 3, isPaid: true },
    { type: "Unpaid Leave", allocated: 0, taken: 2, isPaid: false },
  ];

  const leaveHistory = [
    {
      from: "2025-08-01",
      to: "2025-08-03",
      type: "Sick Leave",
      status: "Approved",
      isPaid: true,
      reason: "Fever",
    },
    {
      from: "2025-07-15",
      to: "2025-07-15",
      type: "Unpaid Leave",
      status: "Approved",
      isPaid: false,
      reason: "Emergency",
    },
    {
      from: "2025-07-05",
      to: "2025-07-06",
      type: "Earned Leave",
      status: "Pending",
      isPaid: true,
      reason: "Function",
    },
    {
      from: "2025-06-10",
      to: "2025-06-10",
      type: "Casual Leave",
      status: "Rejected",
      isPaid: true,
      reason: "Travel",
    },
  ];

  const [sortConfig, setSortConfig] = useState({
    key: "from",
    direction: "desc",
  });
  const [filterStatus, setFilterStatus] = useState("All");

  const calculateDays = (from, to) =>
    (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24) + 1;

  const approvedLeaves = leaveHistory.filter((l) => l.status === "Approved");
  const pendingLeaves = leaveHistory.filter((l) => l.status === "Pending");
  const rejectedLeaves = leaveHistory.filter((l) => l.status === "Rejected");

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

  // Sorting function
  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      if (key === "from" || key === "to") {
        return direction === "asc"
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      return direction === "asc"
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  // Filter leave history by status
  const filteredHistory =
    filterStatus === "All"
      ? leaveHistory
      : leaveHistory.filter((leave) => leave.status === filterStatus);

  const sortedHistory = sortData(
    filteredHistory,
    sortConfig.key,
    sortConfig.direction
  );

  return (
    <div className="max-w-7xl mx-auto p-6 bg-slate-50 shadow-xl rounded-xl space-y-8">
      {/* Header with Action Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-700 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-teal-700" /> Leave Dashboard
        </h2>
        <button
          className="bg-teal-700 text-white px-5 py-2.5 rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 flex items-center gap-2"
          onClick={() => alert("Redirect to leave request form")}
          aria-label="Request a new leave"
        >
          <PlusCircle className="w-5 h-5" /> Request Leave
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Paid Leaves Used", value: paidUsed, icon: CheckCircle },
          { title: "Unpaid Leaves Used", value: unpaidUsed, icon: XCircle },
          { title: "Pending Leaves", value: pendingCount, icon: Clock },
          { title: "Total Used", value: totalUsed, icon: List },
        ].map((card, index) => (
          <div
            key={index}
            className="relative bg-gradient-to-br from-teal-700 to-slate-700 p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 overflow-hidden"
          >
            {/* Optional overlay for better text readability */}
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <p className="text-sm font-semibold flex items-center gap-2 text-white">
                <card.icon className="w-5 h-5 text-teal-300" /> {card.title}
              </p>
              <p className="text-3xl font-bold mt-1 text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Salary Deduction Alert */}
      {unpaidUsed > 0 && (
        <div
          className="bg-teal-100 border-l-4 border-teal-700 text-slate-700 p-5 rounded-lg shadow-md flex items-center gap-2"
          role="alert"
        >
          <AlertTriangle className="w-5 h-5 text-teal-700" />
          <p className="font-semibold text-base">
            <strong>Salary Deduction:</strong> ₹{deductionAmount} for{" "}
            {unpaidUsed} unpaid leave(s)
          </p>
        </div>
      )}

      {/* Leave Balance Table */}
      <div>
        <h3 className="text-xl font-semibold text-slate-700 mb-4">
          Leave Balance
        </h3>
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table
            className="w-full text-left border-separate border-spacing-0 bg-white rounded-lg"
            aria-label="Leave balance table"
          >
            <thead className="bg-teal-50 text-slate-700">
              <tr>
                {["Leave Type", "Paid?", "Allocated", "Taken", "Remaining"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-sm font-semibold text-slate-700 border-b border-slate-200 first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {leaveBalance.map((leave, index) => (
                <tr
                  key={index}
                  className="hover:bg-teal-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                    {leave.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        leave.isPaid
                          ? "bg-teal-100 text-teal-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {leave.isPaid ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {leave.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                    {leave.allocated}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                    {leave.taken}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                    {leave.allocated === "Unlimited" || leave.allocated === 0
                      ? "N/A"
                      : leave.allocated - leave.taken}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave History Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-700">
            Leave History
          </h3>
          <select
            className="border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white shadow-sm text-slate-700"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter leave history by status"
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table
            className="w-full text-left border-separate border-spacing-0 bg-white rounded-lg"
            aria-label="Leave history table"
          >
            <thead className="bg-teal-50 text-slate-700">
              <tr>
                {["From", "To", "Type", "Paid?", "Status", "Reason"].map(
                  (header, index) => (
                    <th
                      key={header}
                      className={`px-6 py-4 text-sm font-semibold text-slate-700 border-b border-slate-200 cursor-pointer ${
                        index === 0
                          ? "rounded-tl-lg"
                          : index === 5
                          ? "rounded-tr-lg"
                          : ""
                      }`}
                      onClick={() =>
                        ["from", "to", "type", "status"].includes(
                          header.toLowerCase()
                        ) && handleSort(header.toLowerCase())
                      }
                    >
                      {header}
                      {sortConfig.key === header.toLowerCase() && (
                        <span className="ml-1">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {sortedHistory.map((leave, index) => (
                <tr
                  key={index}
                  className="hover:bg-teal-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                    {format(new Date(leave.from), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                    {format(new Date(leave.to), "MMM dd, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                    {leave.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        leave.isPaid
                          ? "bg-teal-100 text-teal-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {leave.isPaid ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {leave.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm border-b border-slate-200">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        leave.status === "Approved"
                          ? "bg-teal-100 text-teal-700"
                          : leave.status === "Rejected"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {leave.status === "Approved" ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : leave.status === "Rejected" ? (
                        <XCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <Clock className="w-4 h-4 mr-1" />
                      )}
                      {leave.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 border-b border-slate-200">
                    {leave.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveDashboard;
