import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  List,
  AlertTriangle,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import Select from "react-select"; // Import react-select
import {
  fetchMyLeaves,
  fetchLeaveBalances,
  clearState,
} from "../../redux/slices/leaveSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

// Custom styles for react-select
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "2.5rem",
    borderRadius: "0.5rem",
    border: "1px solid #cbd5e1",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#2dd4bf",
    },
    "@media (max-width: 640px)": {
      fontSize: "0.75rem",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    border: "1px solid #cbd5e1",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    zIndex: 10,
  }),
  option: (provided, state) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    color: "#1e293b",
    backgroundColor: state.isSelected
      ? "#2dd4bf"
      : state.isFocused
      ? "#f0fdfa"
      : "#fff",
    "&:hover": {
      backgroundColor: "#f0fdfa",
    },
    // Individual styles for each option
    ...(state.data.value === "All" && {
      color: "#1e293b",
      fontWeight: "600",
    }),
    ...(state.data.value === "Approved" && {
      color: "#047857",
      backgroundColor: state.isSelected ? "#6ee7b7" : state.isFocused ? "#ecfdf5" : "#fff",
    }),
    ...(state.data.value === "Pending" && {
      color: "#d97706",
      backgroundColor: state.isSelected ? "#fed7aa" : state.isFocused ? "#fef3c7" : "#fff",
    }),
    ...(state.data.value === "Rejected" && {
      color: "#b91c1c",
      backgroundColor: state.isSelected ? "#f87171" : state.isFocused ? "#fee2e2" : "#fff",
    }),
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1e293b",
    fontSize: "0.875rem",
    "@media (max-width: 640px)": {
      fontSize: "0.75rem",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#64748b",
    fontSize: "0.875rem",
  }),
};

const LeaveDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    leaves = [],
    leaveBalances = { paid: 0 },
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.leaves);
  const { token } = useSelector((state) => state.auth);
  const [sortConfig, setSortConfig] = useState({
    key: "start_date",
    direction: "desc",
  });
  const [filterStatus, setFilterStatus] = useState("All");

  const leaveCategories = {
    casual: "Casual Leave",
    sick: "Sick Leave",
    vacation: "Vacation Leave",
    emergency: "Emergency Leave",
    maternity: "Maternity Leave",
    paternity: "Paternity Leave",
  };

  // Options for react-select
  const statusOptions = [
    { value: "All", label: "All" },
    { value: "Approved", label: "Approved" },
    { value: "Pending", label: "Pending" },
    { value: "Rejected", label: "Rejected" },
  ];

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
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

    dispatch(fetchMyLeaves());
    dispatch(fetchLeaveBalances());
  }, [dispatch, navigate, token]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        dispatch(clearState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const leaveBalance = useMemo(
    () => [
      {
        type: "Paid Leave",
        backendStatus: "Paid",
        allocated: leaveBalances.paid,
        taken: 0,
        isPaid: true,
      },
      {
        type: "Unpaid Leave",
        backendStatus: "Unpaid",
        allocated: 0,
        taken: 0,
        isPaid: false,
      },
    ],
    [leaveBalances]
  );

  const leaveHistory = useMemo(() => {
    return leaves.map((leave) => ({
      from: leave.start_date,
      to: leave.end_date,
      type: leaveCategories[leave.leave_category] || leave.leave_category || "N/A",
      status: leave.status || "Pending",
      isPaid: leave.leave_status === "Paid",
      reason: leave.reason || "N/A",
    }));
  }, [leaves]);

   const calculateDays = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    if (isNaN(start) || isNaN(end)) return 0;
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  const updatedLeaveBalance = useMemo(() => {
    return leaveBalance.map((balance) => {
      const taken = leaveHistory
        .filter((l) => l.isPaid === balance.isPaid && l.status === "Approved")
        .reduce((sum, l) => sum + calculateDays(l.from, l.to), 0);
      return { ...balance, taken };
    });
  }, [leaveBalance, leaveHistory]);

 

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

  const sortData = (data, key, direction) => {
    return [...data].sort((a, b) => {
      if (key === "from" || key === "to") {
        return direction === "asc"
          ? new Date(a[key] || 0) - new Date(b[key] || 0)
          : new Date(b[key] || 0) - new Date(a[key] || 0);
      }

      const valA = (a[key] || "").toString();
      const valB = (b[key] || "").toString();

      return direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const filteredHistory =
    filterStatus === "All"
      ? leaveHistory
      : leaveHistory.filter((leave) => leave.status === filterStatus);

  const sortedHistory = sortData(filteredHistory, sortConfig.key, sortConfig.direction);

  return (
    <div className="w-full mt-4 sm:mt-0">
      <div className="hidden sm:flex sm:justify-end sm:items-center">
        <PageMeta
          title="Leave Dashboard"
          description="View your leave balance and history"
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/emp-dashboard" },
            { label: "Leave Dashboard", link: "/employee/leave-dashboard" },
          ]}
        />
      </div>
      <div className="p-4 sm:p-6 bg-slate-50 shadow-xl rounded-xl space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-700 flex items-center gap-2">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-teal-700" /> Leave Dashboard
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="bg-teal-700 text-white px-4 py-2 sm:py-2.5 rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 flex items-center gap-2 text-sm sm:text-md"
              onClick={() => navigate("/employee/leave-application")}
              aria-label="Request a new leave"
            >
              <PlusCircle className="w-4 h-4" /> Request Leave
            </button>
            <button
              className="bg-slate-700 text-white px-4 py-2 sm:py-2.5 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 flex items-center gap-2 text-sm sm:text-md"
              onClick={() => {
                dispatch(fetchMyLeaves());
                dispatch(fetchLeaveBalances());
              }}
              aria-label="Refresh leave data"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>

        <div aria-live="polite">
          {loading && <p className="text-slate-700 text-sm sm:text-base">Loading...</p>}
          {error && (
            <p className="text-red-500 text-sm sm:text-base">
              {typeof error === "string" ? error : error?.message || "An error occurred"}
            </p>
          )}
          {successMessage && <p className="text-teal-700 text-sm sm:text-base">{successMessage}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { title: "Paid Leaves Used", value: paidUsed, icon: CheckCircle },
            { title: "Unpaid Leaves Used", value: unpaidUsed, icon: XCircle },
            { title: "Pending Leaves", value: pendingCount, icon: Clock },
            { title: "Total Used", value: totalUsed, icon: List },
          ].map((card, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-teal-700 to-slate-700 p-4 sm:p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10">
                <p className="text-xs sm:text-sm font-semibold flex items-center gap-2 text-white">
                  <card.icon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300" /> {card.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 text-white">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {unpaidUsed > 0 && (
          <div
            className="bg-teal-100 border-l-4 border-teal-700 text-slate-700 p-4 sm:p-5 rounded-lg shadow-md flex items-center gap-2"
            role="alert"
          >
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-700" />
            <p className="font-semibold text-sm sm:text-base">
              <strong>Salary Deduction:</strong> ₹{deductionAmount} for {unpaidUsed} unpaid leave(s)
            </p>
          </div>
        )}

        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-4">
            Leave Balance
          </h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-md">
            <table
              className="w-full text-left border-separate border-spacing-0 bg-white rounded-lg"
              aria-label="Leave balance table"
            >
              <thead className="bg-teal-50 text-slate-700">
                <tr>
                  {["Leave Type", "Paid?", "Allocated", "Taken", "Remaining"].map((header) => (
                    <th
                      key={header}
                      className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-700 border-b border-slate-200 first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {updatedLeaveBalance.map((leave, index) => (
                  <tr
                    key={index}
                    className="hover:bg-teal-50 transition-colors duration-150"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 border-b border-slate-200">
                      {leave.type}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 border-b border-slate-200">
                      <span
                        className={`inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium ${
                          leave.isPaid ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {leave.isPaid ? (
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        )}
                        {leave.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 border-b border-slate-200">
                      {leave.allocated}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 border-b border-slate-200">
                      {leave.taken}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 border-b border-slate-200">
                      {leave.allocated === 0 ? "N/A" : leave.allocated - leave.taken}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-700">
              Leave History
            </h3>
            <div className="w-full sm:w-48">
              <Select
                options={statusOptions}
                value={statusOptions.find((option) => option.value === filterStatus)}
                onChange={(selected) => setFilterStatus(selected.value)}
                styles={customSelectStyles}
                placeholder="Filter by status"
                aria-label="Filter leave history by status"
              />
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-md">
            <table
              className="w-full text-left border-separate border-spacing-0 bg-white rounded-lg"
              aria-label="Leave history table"
            >
              <thead className="bg-teal-50 text-slate-700">
                <tr>
                  {["From", "To", "Category", "Paid?", "Status", "Reason"].map(
                    (header, index) => (
                      <th
                        key={header}
                        className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-700 border-b border-slate-200 cursor-pointer ${
                          index === 0 ? "rounded-tl-lg" : index === 5 ? "rounded-tr-lg" : ""
                        }`}
                        onClick={() =>
                          ["from", "to", "type", "status"].includes(header.toLowerCase()) &&
                          handleSort(header.toLowerCase() === "category" ? "type" : header.toLowerCase())
                        }
                      >
                        {header}
                        {sortConfig.key ===
                          (header.toLowerCase() === "category" ? "type" : header.toLowerCase()) && (
                          <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
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
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 border-b border-slate-200">
                      {leave.from ? format(new Date(leave.from), "MMM dd, yyyy") : "N/A"}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 border-b border-slate-200">
                      {leave.to ? format(new Date(leave.to), "MMM dd, yyyy") : "N/A"}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 border-b border-slate-200">
                      {leave.type}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 border-b border-slate-200">
                      <span
                        className={`inline-flex items-center px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium ${
                          leave.isPaid ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {leave.isPaid ? (
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        ) : (
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        )}
                        {leave.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm border-b border-slate-200">
                      <span
                        className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                          leave.status === "Approved"
                            ? "bg-teal-100 text-teal-700"
                            : leave.status === "Rejected"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {leave.status === "Approved" ? (
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        ) : leave.status === "Rejected" ? (
                          <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        )}
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700 border-b border-slate-200">
                      {leave.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDashboard;