import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  UserCheck,
  Calendar,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingLeaves, approveLeave, rejectLeave } from "../../redux/slices/leaveSlice";
import DatePicker from "../../Components/ui/date/DatePicker";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const statusColors = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

const typeColors = {
  vacation: "from-teal-600 to-slate-700",
  sick: "from-teal-600 to-slate-700",
  casual: "from-teal-600 to-slate-700",
  maternity: "from-teal-600 to-slate-700",
};

const LeaveTracker = () => {
  const [filterStatus, setFilterStatus] = useState("pending");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const dispatch = useDispatch();
  const { pendingLeaves, loading, error } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchPendingLeaves());
  }, [dispatch]);

  const filteredLeaveData = useMemo(() => {
    return pendingLeaves.filter((req) => {
      const from = fromDate ? new Date(fromDate) : new Date("1970-01-01");
      const to = toDate ? new Date(toDate) : new Date("9999-12-31");
      const reqFrom = new Date(req.start_date);
      return (
        (filterStatus === "all" || req.status.toLowerCase() === filterStatus) &&
        reqFrom >= from &&
        reqFrom <= to
      );
    });
  }, [pendingLeaves, filterStatus, fromDate, toDate]);

  const summary = useMemo(() => {
    const counts = {
      pending: pendingLeaves.filter((req) => req.status.toLowerCase() === "pending").length,
      approved: pendingLeaves.filter((req) => req.status.toLowerCase() === "approved").length,
      rejected: pendingLeaves.filter((req) => req.status.toLowerCase() === "rejected").length,
      total: pendingLeaves.length,
    };

    return [
      {
        label: "Pending",
        count: counts.pending,
        icon: <Clock className="text-yellow-500" />,
        color: "from-teal-600 to-slate-700",
        status: "pending",
      },
      {
        label: "Approved",
        count: counts.approved,
        icon: <CheckCircle className="text-green-500" />,
        color: "from-teal-600 to-slate-700",
        status: "approved",
      },
      {
        label: "Rejected",
        count: counts.rejected,
        icon: <XCircle className="text-red-500" />,
        color: "from-teal-600 to-slate-700",
        status: "rejected",
      },
      {
        label: "Total Requests",
        count: counts.total,
        icon: <UserCheck className="text-indigo-500" />,
        color: "from-teal-600 to-slate-700",
        status: "all",
      },
    ];
  }, [pendingLeaves]);

  const handleApprove = useCallback((id) => {
    dispatch(approveLeave(id));
  }, [dispatch]);

  const handleReject = useCallback((id) => {
    dispatch(rejectLeave(id));
  }, [dispatch]);

  const handleFilter = useCallback((status) => {
    setFilterStatus(status);
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen font-sans">
      <div className="flex justify-end">
        <PageMeta
          title="Leave Tracker"
          description="Manage and track employee leave requests"
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Leave Tracker", link: "/admin/leave-tracker" },
          ]}
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-8/12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-slate-700 bg-clip-text text-transparent">
            Leave Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and process employee leave requests
          </p>
        </div>
        <div className="w-4/12">
          <DatePicker
            type="date"
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            labelFrom="From Date"
            labelTo="To Date"
            className="rounded-lg border-teal-200 bg-gray-100 text-gray-900 focus:ring-teal-600"
          />
        </div>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((item, i) => (
          <div
            key={i}
            onClick={() => item.status && handleFilter(item.status)}
            className={`p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-teal-200/50 hover:shadow-md transition-all duration-300 cursor-pointer ${
              item.status === filterStatus ? "ring-2 ring-teal-600" : ""
            }`}
            role="button"
            aria-label={`Filter by ${item.label} leave requests`}
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && item.status && handleFilter(item.status)
            }
          >
            <div className="flex justify-between items-center mb-4">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-center shadow-md`}
              >
                {item.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {item.count}
              </div>
            </div>
            <div className="text-gray-600 font-medium text-sm">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-6 border-b border-teal-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Leave Requests</h2>
          <div className="flex gap-2">
            <button
              onClick={() => handleFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filterStatus === "all"
                  ? "bg-gradient-to-r from-teal-600 to-slate-700 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition-all duration-300`}
              aria-label="Show all leave requests"
            >
              Show All
            </button>
            <button
              onClick={() => handleFilter("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filterStatus === "pending"
                  ? "bg-gradient-to-r from-teal-600 to-slate-700 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition-all duration-300`}
              aria-label="Show pending leave requests"
            >
              Pending
            </button>
          </div>
        </div>
        <div className="space-y-6 p-6">
          {filteredLeaveData.length > 0 ? (
            filteredLeaveData.map((req) => (
              <div
                key={req.id}
                className="p-6 bg-white/90 rounded-2xl border border-teal-200/50 hover:shadow-md transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Employee Details */}
                  <div className="col-span-2 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-600 to-slate-700 text-white flex items-center justify-center shadow-md">
                      <User size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {req.employee_name}
                      </h3>
                      <p className="text-sm font-medium text-gray-600">
                        {req.department}
                      </p>
                      <p className="text-xs text-gray-500">ID: {req.employee_id}</p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Reason:</span>{" "}
                        {req.reason}
                      </p>
                    </div>
                  </div>

                  {/* Leave Details */}
                  <div className="col-span-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-teal-600" />
                      <span>
                        <strong>From:</strong>{" "}
                        {new Date(req.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-teal-600" />
                      <span>
                        <strong>To:</strong>{" "}
                        {new Date(req.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Duration:</strong> {req.days} days
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs text-white font-semibold bg-gradient-to-r ${
                          typeColors[req.leave_type]
                        }`}
                      >
                        {req.leave_type}
                      </span>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="col-span-1 flex flex-col items-start md:items-end gap-3">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        Status
                      </span>
                      <p
                        className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[req.status.toLowerCase()]
                        }`}
                      >
                        {req.status}
                      </p>
                    </div>
                    {req.status.toLowerCase() === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-green-700 text-white text-xs rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md"
                          aria-label={`Approve leave request for ${req.employee_name}`}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-md"
                          aria-label={`Reject leave request for ${req.employee_name}`}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center">
              No leave requests found for the selected criteria.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveTracker;