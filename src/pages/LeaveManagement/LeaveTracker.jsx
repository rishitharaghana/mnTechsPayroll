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
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
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
  const [expandedLeaveId, setExpandedLeaveId] = useState(null); // Track expanded leave
  const [currentPage, setCurrentPage] = useState(1); // Pagination: current page
  const [itemsPerPage, setItemsPerPage] = useState(5); // Pagination: items per page

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    leaves = [],
    pendingLeaves = [],
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.leaves);
  const { role, token, employee_id } = useSelector((state) => state.auth);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (!token || !userToken) {
      console.log("No token found, redirecting to login", { token, userToken });
      navigate("/login");
      return;
    }

    let storedToken;
    try {
      const parsed = JSON.parse(userToken);
      storedToken = parsed.token || userToken;
    } catch (error) {
      storedToken = userToken;
    }

    if (storedToken !== token) {
      console.log("Token mismatch, redirecting to login", { storedToken, token });
      navigate("/login");
      return;
    }

    if (role !== "hr" && role !== "super_admin") {
      console.log(`Unauthorized role: ${role}, redirecting to /unauthorized`);
      navigate("/unauthorized");
      return;
    }

    dispatch(fetchAllLeaves()).unwrap().catch((err) => {
      console.error("Failed to fetch all leaves:", err);
      if (err?.message?.includes("No authentication token")) {
        navigate("/login");
      }
    });
    dispatch(fetchPendingLeaves()).unwrap().catch((err) => {
      console.error("Failed to fetch pending leaves:", err);
      if (err?.message?.includes("No authentication token")) {
        navigate("/login");
      }
    });
    dispatch(fetchLeaveBalances()).unwrap().catch((err) => {
      console.error("Failed to fetch leave balances:", err);
    });
  }, [dispatch, navigate, token, role]);

  useEffect(() => {
    console.log("Auth state:", { role, employee_id, token });
    console.log("Leaves:", leaves);
    console.log("Pending Leaves:", pendingLeaves);
  }, [role, employee_id, token, leaves, pendingLeaves]);

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
    if (isNaN(start) || isNaN(end)) {
      console.warn(`Invalid dates: start=${startDate}, end=${endDate}`);
      return 0;
    }
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const canApproveReject = (req) => {
    if (!req.employee_id) {
      console.warn(`Missing employee_id for leave ID ${req.id}`);
      return false;
    }
    if (role === "hr") {
      console.log("HR canApproveReject:", {
        leaveId: req.id,
        recipient_id: req.recipient_id,
        employee_id,
        canApprove: true,
      });
      return true; // Allow HR to approve/reject all pending requests
    }
    if (role === "super_admin") {
      const canApprove = req.employee_role === "hr";
      console.log("Super Admin canApproveReject:", {
        leaveId: req.id,
        employee_role: req.employee_role,
        canApprove,
      });
      return canApprove;
    }
    return false;
  };

  const filteredLeaveData = useMemo(() => {
    const sourceLeaves = filterStatus === "pending" ? pendingLeaves : leaves;
    const leavesArray = Array.isArray(sourceLeaves) ? sourceLeaves : [];
    const filtered = leavesArray
      .map((req) => ({
        ...req,
        days: req.days || calculateDays(req.start_date, req.end_date),
        employee_name: req.employee_name || "Unknown",
        employee_role: req.employee_role || "unknown",
        recipient_id: req.recipient_id || null,
        recipients: req.recipients || [],
      }))
      .filter((req) => {
        console.log("Leave request data:", {
          id: req.id,
          status: req.status,
          recipient_id: req.recipient_id,
          employee_id: req.employee_id,
          canApprove: canApproveReject(req),
        });
        const reqStartDate = new Date(req.start_date);
        const reqEndDate = new Date(req.end_date);
        if (isNaN(reqStartDate) || isNaN(reqEndDate)) {
          console.warn(`Invalid dates for leave ID ${req.id}:`, {
            start_date: req.start_date,
            end_date: req.end_date,
          });
          return false;
        }

        if (!selectDate) {
          return filterStatus === "all" || req.status?.toLowerCase() === filterStatus;
        }

        const selected = new Date(selectDate.setHours(0, 0, 0, 0));
        const start = new Date(reqStartDate.setHours(0, 0, 0, 0));
        const end = new Date(reqEndDate.setHours(0, 0, 0, 0));

        return (
          (filterStatus === "all" || req.status?.toLowerCase() === filterStatus) &&
          selected >= start &&
          selected <= end
        );
      });
    console.log("Filtered leave data:", filtered);
    return filtered;
  }, [leaves, pendingLeaves, filterStatus, selectDate]);

  // Pagination logic
  const totalItems = filteredLeaveData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedLeaves = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredLeaveData.slice(startIndex, endIndex);
  }, [filteredLeaveData, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page
  };

  const toggleDetails = (leaveId) => {
    setExpandedLeaveId(expandedLeaveId === leaveId ? null : leaveId);
  };

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
      dispatch(approveLeave(id)).unwrap().then(() => {
        dispatch(fetchAllLeaves());
        dispatch(fetchPendingLeaves());
        dispatch(fetchLeaveBalances());
      }).catch((err) => {
        console.error(`Approve error for leave ID ${id}:`, err);
        if (err?.message?.includes("No authentication token")) {
          navigate("/login");
        }
      });
    },
    [dispatch, navigate]
  );

  const handleReject = useCallback(
    (id) => {
      dispatch(rejectLeave(id)).unwrap().then(() => {
        dispatch(fetchAllLeaves());
        dispatch(fetchPendingLeaves());
        dispatch(fetchLeaveBalances());
      }).catch((err) => {
        console.error(`Reject error for leave ID ${id}:`, err);
        if (err?.message?.includes("No authentication token")) {
          navigate("/login");
        }
      });
    },
    [dispatch, navigate]
  );

  const handleFilter = useCallback((status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page on filter change
  }, []);

  const handleSpecialLeaveChange = (name, value) => {
    setSpecialLeaveData({ ...specialLeaveData, [name]: value });
  };

  const handleAllocateMonthlyLeaves = () => {
    dispatch(allocateMonthlyLeaves()).unwrap().then(() => {
      dispatch(fetchLeaveBalances());
    }).catch((err) => {
      console.error("Allocate monthly leaves error:", err);
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
    ).unwrap().then(() => {
      setSpecialLeaveData({
        employee_id: "",
        leave_type: "maternity",
        days: "",
      });
      dispatch(fetchLeaveBalances());
    }).catch((err) => {
      console.error("Allocate special leave error:", err);
    });
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className="w-full">
      <style>{`
        .details-section {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out, padding 0.3s ease-in-out;
        }
        .details-section.open {
          max-height: 200px; /* Adjust based on content */
          padding: 1rem;
        }
        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
        }
        .pagination-button {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          background: linear-gradient(to right, #0f766e, #1e293b);
          color: white;
          transition: background 0.3s ease;
        }
        .pagination-button:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }
        .pagination-button:hover:not(:disabled) {
          background: linear-gradient(to right, #0d9488, #334155);
        }
        .items-per-page-select {
          padding: 0.5rem;
          border-radius: 0.375rem;
          border: 1px solid #0f766e;
          background: white;
          color: #1e293b;
        }
      `}</style>

      <div className="hidden sm:flex sm:justify-end">
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
      <div className="p-6 space-y-6 bg-white rounded-2xl font-sans">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-7/12 md:w-8/12">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-slate-700 bg-clip-text text-transparent">
              Leave Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and process{" "}
              {role === "hr" ? "employee and department head" : "HR"} leave
              requests
            </p>
          </div>
          <div className="w-full sm:w-5/12 md:w-4/12 flex gap-4">
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
            {loading && paginatedLeaves.length === 0 ? (
              <p className="text-gray-600 text-center">
                Loading leave requests...
              </p>
            ) : paginatedLeaves.length > 0 ? (
              paginatedLeaves.map((req) => (
                <div
                  key={req.id}
                  className="p-6 bg-white/95 rounded-2xl border-1 border-teal-200/50 shadow-md transform hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
                    <div className="col-span-2 flex-col sm:flex-row flex sm:items-start gap-4">
                      <div className="w-16 h-16 m-auto sm:m-0 rounded-full bg-gradient-to-r from-teal-600 to-slate-700 text-white flex items-center justify-center text-2xl font-bold shadow-md">
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
                      <button
                        onClick={() => toggleDetails(req.id)}
                        className="px-4 py-1.5 bg-gradient-to-r from-teal-600 to-slate-700 text-white text-xs rounded-lg hover:from-teal-700 hover:to-slate-800 transition-all duration-300 shadow-md"
                      >
                        {expandedLeaveId === req.id ? "Hide " : "View "}
                        {expandedLeaveId === req.id ? (
                          <ChevronUp className="inline ml-2" size={16} />
                        ) : (
                          <ChevronDown className="inline ml-2" size={16} />
                        )}
                      </button>
                      {req.status?.toLowerCase() === "pending" && canApproveReject(req) && (
                        <div className="flex sm:flex-col md:flex-row gap-2">
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
                  <div className={`details-section ${expandedLeaveId === req.id ? "open" : ""}`}>
                    <div className="border-t border-teal-200/50 pt-4 mt-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Reason:</span>{" "}
                        {req.reason || "N/A"}
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="font-medium">Recipients:</span>{" "}
                        {req.recipients?.join(", ") || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center">
                No leave requests available for your approval.
              </p>
            )}
          </div>

          {/* Pagination Controls */}
          {totalItems > 0 && (
            <div className="pagination-container p-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Show:
                </span>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="items-per-page-select"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-sm text-gray-600">
                  items per page
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  <ChevronLeft size={16} className="inline" />
                  <span className="ml-2">Previous</span>
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  <span className="mr-2">Next</span>
                  <ChevronRight size={16} className="inline" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveTracker;