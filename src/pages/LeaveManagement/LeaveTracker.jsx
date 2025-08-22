import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllLeaves, fetchPendingLeaves, approveLeave, rejectLeave, clearState } from "../../redux/slices/leaveSlice";
import { Clock, CheckCircle, XCircle, User, UserCheck, Calendar } from "lucide-react";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const DatePicker = ({ fromDate, toDate, onFromDateChange, onToDateChange, labelFrom, labelTo, className }) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">{labelFrom}</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-600"
          aria-label={labelFrom}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-600">{labelTo}</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToDateChange(e.target.value)}
          className="px-4 py-2 border border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-600"
          aria-label={labelTo}
        />
      </div>
    </div>
  );
};

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
  const navigate = useNavigate();
  const { leaves = [], pendingLeaves = [], loading, error, successMessage } = useSelector((state) => state.leaves);
  const { role, token, user_id } = useSelector((state) => state.auth);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    console.log("userToken from localStorage:", userToken);
    console.log("Redux auth state:", { role, token, user_id });
    if (!token || !userToken) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }
    try {
      const { token: parsedToken } = JSON.parse(userToken);
      if (parsedToken !== token) {
        console.warn("Token mismatch between Redux and localStorage");
        navigate("/login");
        return;
      }
    } catch (error) {
      console.error("Error parsing userToken:", error);
      navigate("/login");
      return;
    }

    if (role !== "hr" && role !== "super_admin") {
      console.log("Unauthorized role, redirecting:", role);
      navigate("/unauthorized");
      return;
    }

    console.log("Fetching all leaves and pending leaves for role:", role, "user_id:", user_id);
    dispatch(fetchAllLeaves());
    dispatch(fetchPendingLeaves());
  }, [dispatch, navigate, token, role, user_id]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        console.log("Clearing state due to success or error");
        dispatch(clearState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      console.warn("Invalid dates for days calculation:", { startDate, endDate });
      return 0;
    }
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const filteredLeaveData = useMemo(() => {
    const sourceLeaves = filterStatus === "pending" ? pendingLeaves : leaves;
    const leavesArray = Array.isArray(sourceLeaves) ? sourceLeaves : [];
    console.log(`Filtered leave data source (${filterStatus}):`, leavesArray);
    const filtered = leavesArray
      .map((req) => ({
        ...req,
        days: req.days || calculateDays(req.start_date, req.end_date),
      }))
      .filter((req) => {
        const from = fromDate ? new Date(fromDate) : new Date("1970-01-01");
        const to = toDate ? new Date(toDate) : new Date("9999-12-31");
        const reqFrom = new Date(req.start_date);
        if (isNaN(reqFrom)) {
          console.warn("Invalid start_date for leave:", req);
          return false;
        }
        return (
          (filterStatus === "all" || req.status?.toLowerCase() === filterStatus) &&
          reqFrom >= from &&
          reqFrom <= to
        );
      });
    console.log("Filtered leave data output:", filtered);
    return filtered;
  }, [leaves, pendingLeaves, filterStatus, fromDate, toDate]);

  const summary = useMemo(() => {
    const leavesArray = Array.isArray(leaves) ? leaves : [];
    const counts = {
      pending: pendingLeaves.length,
      approved: leavesArray.filter((req) => req.status?.toLowerCase() === "approved").length,
      rejected: leavesArray.filter((req) => req.status?.toLowerCase() === "rejected").length,
      total: leavesArray.length,
    };
    console.log("Summary counts:", counts);

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
  }, [leaves, pendingLeaves]);

  const handleApprove = useCallback(
    (id) => {
      console.log("Approving leave ID:", id);
      dispatch(approveLeave(id)).then((result) => {
        if (result.error) {
          console.error("approveLeave error:", result.error.message);
          if (result.error.message.includes("No authentication token")) {
            navigate("/login");
          }
        } else {
          console.log("Leave approved, refetching leaves");
          dispatch(fetchAllLeaves());
          dispatch(fetchPendingLeaves());
        }
      });
    },
    [dispatch, navigate]
  );

  const handleReject = useCallback(
    (id) => {
      console.log("Rejecting leave ID:", id);
      dispatch(rejectLeave(id)).then((result) => {
        if (result.error) {
          console.error("rejectLeave error:", result.error.message);
          if (result.error.message.includes("No authentication token")) {
            navigate("/login");
          }
        } else {
          console.log("Leave rejected, refetching leaves");
          dispatch(fetchAllLeaves());
          dispatch(fetchPendingLeaves());
        }
      });
    },
    [dispatch, navigate]
  );

  const handleFilter = useCallback((status) => {
    console.log("Setting filter status:", status);
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
            Monitor and process {role === "hr" ? "employee and department head" : "HR"} leave requests
          </p>
        </div>
        <div className="w-4/12">
          <DatePicker
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

      <div aria-live="polite">
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-600">{successMessage}</p>}
      </div>

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
          {loading && leaves.length === 0 && pendingLeaves.length === 0 ? (
            <p className="text-gray-600 text-center">Loading leave requests...</p>
          ) : filteredLeaveData.length > 0 ? (
            filteredLeaveData.map((req) => (
              <div
                key={req.id}
                className="p-6 bg-white/90 rounded-2xl border border-teal-200/50 hover:shadow-md transition-all duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="col-span-2 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-600 to-slate-700 text-white flex items-center justify-center shadow-md">
                      <User size={28} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {req.employee_name || "Unknown"}
                      </h3>
                      <p className="text-sm font-medium text-gray-600">
                        {req.department || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">ID: {req.employee_id || "N/A"}</p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Reason:</span> {req.reason || "N/A"}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Recipients:</span>{" "}
                        {req.recipients?.join(", ") || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-teal-600" />
                      <span>
                        <strong>From:</strong>{" "}
                        {req.start_date ? new Date(req.start_date).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} className="text-teal-600" />
                      <span>
                        <strong>To:</strong>{" "}
                        {req.end_date ? new Date(req.end_date).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Duration:</strong> {req.days || "N/A"} days
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs text-white font-semibold bg-gradient-to-r ${
                          typeColors[req.leave_type] || "from-gray-600 to-gray-700"
                        }`}
                      >
                        {req.leave_type || "Unknown"}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-1 flex flex-col items-start md:items-end gap-3">
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase">Status</span>
                      <p
                        className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[req.status?.toLowerCase()] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {req.status || "Unknown"}
                      </p>
                    </div>
                    {req.status?.toLowerCase() === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-green-700 text-white text-xs rounded-lg hover:from-green-600 hover:to-green-800 transition-all duration-300 shadow-md"
                          aria-label={`Approve leave request for ${req.employee_name || "employee"}`}
                          disabled={loading}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-md"
                          aria-label={`Reject leave request for ${req.employee_name || "employee"}`}
                          disabled={loading}
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