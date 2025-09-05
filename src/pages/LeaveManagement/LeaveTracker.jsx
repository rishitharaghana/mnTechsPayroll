import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllLeaves,
  fetchPendingLeaves,
  approveLeave,
  rejectLeave,
  fetchLeaveBalances,
  allocateMonthlyLeaves,
  allocateSpecialLeave,
  clearState,
} from "../../redux/slices/leaveSlice";
import {
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  Calendar,
  PlusCircle,
} from "lucide-react";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import DatePicker from "../../Components/ui/date/DatePicker";

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
  paternity: "from-teal-600 to-slate-700",
  unpaid: "from-gray-600 to-gray-700",
};

const LeaveTracker = () => {
  const [filterStatus, setFilterStatus] = useState("pending");
  const [selectDate, setSelectDate] = useState(null);
  const [specialLeaveData, setSpecialLeaveData] = useState({
    employee_id: "",
    leave_type: "maternity",
    days: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    leaves = [],
    pendingLeaves = [],
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.leaves);
  const { role, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (!token || !userToken) {
      navigate("/login");
      return;
    }
    try {
      const { token: parsedToken } = JSON.parse(userToken);
      if (parsedToken !== token) {
        navigate("/login");
        return;
      }
    } catch (error) {
      navigate("/login");
      return;
    }

    if (role !== "hr" && role !== "super_admin") {
      navigate("/unauthorized");
      return;
    }

    dispatch(fetchAllLeaves());
    dispatch(fetchPendingLeaves());
    dispatch(fetchLeaveBalances());
  }, [dispatch, navigate, token, role]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) return 0;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const filteredLeaveData = useMemo(() => {
    const sourceLeaves = filterStatus === "pending" ? pendingLeaves : leaves;
    const leavesArray = Array.isArray(sourceLeaves) ? sourceLeaves : [];
    return leavesArray
      .map((req) => ({
        ...req,
        days: req.days || calculateDays(req.start_date, req.end_date),
      }))
      .filter((req) => {
        const reqStartDate = new Date(req.start_date);
        const reqEndDate = new Date(req.end_date);
        if (isNaN(reqStartDate) || isNaN(reqEndDate)) return false;

        if (!selectDate) {
          return filterStatus === "all" || req.status?.toLowerCase() === filterStatus;
        }

        // Normalize dates to remove time component
        const selected = new Date(selectDate.setHours(0, 0, 0, 0));
        const start = new Date(reqStartDate.setHours(0, 0, 0, 0));
        const end = new Date(reqEndDate.setHours(0, 0, 0, 0));

        // Check if selected date falls within the leave period
        return (
          (filterStatus === "all" || req.status?.toLowerCase() === filterStatus) &&
          selected >= start &&
          selected <= end
        );
      });
  }, [leaves, pendingLeaves, filterStatus, selectDate]);

  const summary = useMemo(() => {
    const leavesArray = Array.isArray(leaves) ? leaves : [];
    const counts = {
      pending: pendingLeaves.length,
      approved: leavesArray.filter(
        (req) => req.status?.toLowerCase() === "approved"
      ).length,
      rejected: leavesArray.filter(
        (req) => req.status?.toLowerCase() === "rejected"
      ).length,
      total: leavesArray.length,
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
  }, [leaves, pendingLeaves]);

  const handleApprove = useCallback(
    (id) => {
      dispatch(approveLeave(id)).then((result) => {
        if (!result.error) {
          dispatch(fetchAllLeaves());
          dispatch(fetchPendingLeaves());
          dispatch(fetchLeaveBalances());
        } else if (result.error?.message?.includes("No authentication token")) {
          navigate("/login");
        }
      });
    },
    [dispatch, navigate]
  );

  const handleReject = useCallback(
    (id) => {
      dispatch(rejectLeave(id)).then((result) => {
        if (!result.error) {
          dispatch(fetchAllLeaves());
          dispatch(fetchPendingLeaves());
          dispatch(fetchLeaveBalances());
        } else if (result.error?.message?.includes("No authentication token")) {
          navigate("/login");
        }
      });
    },
    [dispatch, navigate]
  );

  const handleFilter = useCallback((status) => {
    setFilterStatus(status);
  }, []);

  const handleSpecialLeaveChange = (name, value) => {
    setSpecialLeaveData({ ...specialLeaveData, [name]: value });
  };

  const handleAllocateMonthlyLeaves = () => {
    dispatch(allocateMonthlyLeaves()).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(fetchLeaveBalances());
      }
    });
  };

  const handleAllocateSpecialLeave = (e) => {
    e.preventDefault();
    const { employee_id, leave_type, days } = specialLeaveData;
    const daysNum = parseInt(days, 10);
    if (!employee_id || !leave_type || isNaN(daysNum) || daysNum <= 0) {
      dispatch({
        type: "leaves/allocateSpecialLeave/rejected",
        payload: "Employee ID, leave type, and valid days are required",
      });
      return;
    }
    dispatch(
      allocateSpecialLeave({ employee_id, leave_type, days: daysNum })
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        setSpecialLeaveData({
          employee_id: "",
          leave_type: "maternity",
          days: "",
        });
        dispatch(fetchLeaveBalances());
      }
    });
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className="w-full lg:w-[78%]">
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
      <div className="px-6 p-10 space-y-6 bg-white rounded-2xl font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-8/12">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-slate-700 bg-clip-text text-transparent">
              Leave Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and process{" "}
              {role === "hr" ? "employee and department head" : "HR"} leave
              requests
            </p>
          </div>
          <div className="w-4/12 flex gap-4">
            <DatePicker
              title="Select Date"
              value={selectDate}
              onChange={setSelectDate}
            />
          </div>
        </div>

        <div aria-live="polite">
          {loading && <p className="text-gray-600">Loading...</p>}
          {error && (
            <p className="text-red-500">
              {typeof error === "string"
                ? error
                : error?.message || "An error occurred"}
            </p>
          )}
          {successMessage && <p className="text-green-600">{successMessage}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {summary.map((item, i) => (
            <button
              key={i}
              onClick={() => item.status && handleFilter(item.status)}
              className={`relative p-4 rounded-xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:bg-teal-50/10 transition-all duration-300 cursor-pointer group overflow-hidden ${
                item.status === filterStatus ? "ring-2 ring-teal-700" : ""
              }`}
            >
              <div
                className={`absolute top-0 left-0 w-16 h-16 bg-teal-700/10 rounded-full -translate-x-8 -translate-y-8 group-hover:-translate-x-6 group-hover:-translate-y-6 transition-transform duration-400`}
              ></div>
              <div className="relative flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-md bg-teal-700 flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
                  >
                    {React.cloneElement(item.icon, {
                      className: "text-white w-5 h-5",
                    })}
                  </div>
                  <p className="text-2xl font-bold text-slate-700">
                    {item.count}
                  </p>
                </div>
                <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  {item.label}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white backdrop-blur-sm rounded-2xl border-1 border-teal-200/50 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
          <div className="p-6 border-b border-teal-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Leave Requests</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filterStatus === "all"
                    ? "bg-gradient-to-r from-teal-600 to-slate-700 text-white shadow-md"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } transition-all duration-300`}
              >
                Show All
              </button>
              <button
                onClick={() => handleFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filterStatus === "pending"
                    ? "bg-gradient-to-r from-teal-600 to-slate-700 text-white shadow-md"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } transition-all duration-300`}
              >
                Pending
              </button>
            </div>
          </div>

          <div className="space-y-6 p-6">
            {loading && leaves.length === 0 && pendingLeaves.length === 0 ? (
              <p className="text-gray-600 text-center">
                Loading leave requests...
              </p>
            ) : filteredLeaveData.length > 0 ? (
              filteredLeaveData.map((req) => (
                <div
                  key={req.id}
                  className="p-6 bg-white/95 rounded-2xl border-1 border-teal-200/50 shadow-md transform hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="col-span-2 flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-600 to-slate-700 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                        {getInitial(req.employee_name)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-gray-900">
                          {req.employee_name || "Unknown"}
                        </h3>
                        <p className="text-sm font-medium text-gray-600">
                          {req.department || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {req.employee_id || "N/A"}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Reason:</span>{" "}
                          {req.reason || "N/A"}
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
                          {req.start_date
                            ? new Date(req.start_date).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} className="text-teal-600" />
                        <span>
                          <strong>To:</strong>{" "}
                          {req.end_date
                            ? new Date(req.end_date).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Duration:</strong> {req.days || "N/A"} days
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs text-white font-semibold bg-gradient-to-r ${
                            typeColors[req.leave_type] ||
                            "from-gray-600 to-gray-700"
                          }`}
                        >
                          {req.leave_type || "Unknown"}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-1 flex flex-col items-start md:items-end gap-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          Status
                        </span>
                        <p
                          className={`mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[req.status?.toLowerCase()] ||
                            "bg-gray-100 text-gray-700"
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
                            disabled={loading}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="px-4 py-1.5 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs rounded-lg hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-md"
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
        {(role === "hr" || role === "super_admin") && (
          <div className="bg-white/90 p-6 rounded-2xl border-1 border-teal-700/50 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PlusCircle size={24} className="text-teal-700" />
              <h2 className="text-xl font-bold text-slate-700">
                Allocate Leaves
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Monthly Leave Allocation
                </h3>
                <button
                  onClick={handleAllocateMonthlyLeaves}
                  disabled={loading}
                  className="flex items-center gap-2 bg-teal-700 text-white px-6 py-3 rounded-xl hover:bg-slate-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-700 transition duration-150 ease-in-out"
                >
                  <PlusCircle size={20} />
                  <span>
                    {loading ? "Allocating..." : "Allocate Monthly Leaves"}
                  </span>
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Special Leave Allocation
                </h3>
                <form
                  onSubmit={handleAllocateSpecialLeave}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      name="employee_id"
                      value={specialLeaveData.employee_id}
                      onChange={(e) =>
                        handleSpecialLeaveChange("employee_id", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-teal-700 bg-white py-2.5 px-3 text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 transition duration-150 ease-in-out"
                      placeholder="Enter employee ID"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Leave Type
                    </label>
                    <select
                      name="leave_type"
                      value={specialLeaveData.leave_type}
                      onChange={(e) =>
                        handleSpecialLeaveChange("leave_type", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-teal-700 bg-white py-2.5 px-3 text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 transition duration-150 ease-in-out"
                      required
                    >
                      <option value="maternity">Maternity</option>
                      <option value="paternity">Paternity</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Days
                    </label>
                    <input
                      type="number"
                      name="days"
                      value={specialLeaveData.days}
                      onChange={(e) =>
                        handleSpecialLeaveChange("days", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-teal-700 bg-white py-2.5 px-3 text-slate-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 transition duration-150 ease-in-out"
                      placeholder="Enter number of days"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-teal-700 text-white px-6 py-3 rounded-xl hover:bg-slate-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-700 transition duration-150 ease-in-out"
                  >
                    <PlusCircle size={20} />
                    <span>
                      {loading ? "Allocating..." : "Allocate Special Leave"}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveTracker;