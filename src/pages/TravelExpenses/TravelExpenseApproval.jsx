import React, { useEffect, useState, useCallback } from "react";
import {
  FileText,
  Download,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  User,
  Calendar,
  MapPin,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchTravelExpenses,
  fetchTravelExpenseHistory,
  updateTravelExpenseStatus,
  clearState,
} from "../../redux/slices/travelExpensesSlice";
import { getCurrentUserProfile } from "../../redux/slices/employeeSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const TravelExpenseApproval = () => {
  const dispatch = useDispatch();
  const {
    profile,
    error: employeeError,
    loading: profileLoading,
  } = useSelector((state) => state.employee);
  const { user } = useSelector((state) => state.auth);
  const { submissions, history, loading, error, successMessage, pagination } =
    useSelector((state) => state.travelExpenses);
  const [adminComments, setAdminComments] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const [viewMode, setViewMode] = useState("pending");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const limit = 10;

  const userRole = profile?.role || user?.role;

  const fetchData = useCallback(() => {
    console.log("Fetching data:", {
      role: userRole,
      employee_id: profile?.employee_id,
      viewMode,
      page,
      statusFilter,
    });

    dispatch({ type: "employee/clearErrors" });

    if (userRole === "super_admin") {
      console.log("Super_admin: Skipping employee profile fetch");
    } else if (!profile) {
      console.log("No profile found, fetching profile (non-admin only)");
      dispatch(getCurrentUserProfile());
      return;
    }

    if (!profile?.employee_id && userRole !== "super_admin") {
      console.warn("Profile missing employee_id or role:", {
        profile,
        userRole,
      });
      toast.error(
        "Profile data incomplete. Please ensure your account is properly set up.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    if (["employee", "dept_head", "hr", "super_admin"].includes(userRole)) {
      if (["employee", "dept_head"].includes(userRole)) {
        console.log(
          "Fetching submissions for employee/dept_head:",
          profile.employee_id
        );
        dispatch(fetchTravelExpenses({ page, limit }));
      } else if (["hr", "super_admin"].includes(userRole)) {
        if (viewMode === "pending") {
          console.log("Fetching pending submissions for admin");
          dispatch(fetchTravelExpenses({ page, limit }));
        } else {
          console.log("Fetching history for admin");
          dispatch(fetchTravelExpenseHistory({ page, limit }));
        }
      }
    } else {
      console.warn("Invalid user role:", userRole);
      toast.error("Access denied: Invalid role.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [dispatch, profile, userRole, page, viewMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (shouldRefresh) {
      fetchData();
      setShouldRefresh(false);
    }
  }, [shouldRefresh, fetchData]);

  useEffect(() => {
    if (error) {
      console.error("Travel expense error:", error);
      toast.error(
        error === "No travel expense history records found"
          ? "No history records available"
          : error,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      dispatch(clearState());
    }
    if (employeeError) {
      if (employeeError.includes("Education")) {
        console.warn(
          "Non-critical employee error (education missing for admin):",
          employeeError
        );
      } else {
        console.error("Employee error:", employeeError);
        toast.error(employeeError || "Failed to load user profile.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
      dispatch({ type: "employee/clearErrors" });
      dispatch(clearState());
    }
    if (successMessage) {
      console.log("Success message:", successMessage);
      toast.success(successMessage, { position: "top-right", autoClose: 3000 });
      setShouldRefresh(true);
      dispatch(clearState());
    }
  }, [error, employeeError, successMessage, dispatch]);

  const handleStatusUpdate = (submissionId, status) => {
    setActionLoading((prev) => ({ ...prev, [submissionId]: true }));
    const adminComment = adminComments[submissionId] || "";
    dispatch(
      updateTravelExpenseStatus({
        id: submissionId,
        status,
        admin_comment: adminComment,
      })
    ).finally(() => {
      setActionLoading((prev) => ({ ...prev, [submissionId]: false }));
      setShouldRefresh(true);
    });
    setAdminComments((prev) => ({ ...prev, [submissionId]: "" }));
  };

  const handleCommentChange = (submissionId, value) => {
    setAdminComments((prev) => ({ ...prev, [submissionId]: value }));
  };

  const handleDownloadReceipt = async (submissionId) => {
    try {
      const userToken = localStorage.getItem("userToken");
      const token = userToken ? JSON.parse(userToken).token : null;
      if (!token) {
        toast.error("No authentication token found.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      const response = await fetch(
        `http://localhost:3007/api/travel-expenses/download/${submissionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download receipt");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "") ||
          `receipt-${submissionId}`
        : `receipt-${submissionId}`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download receipt error:", error.message);
      toast.error(error.message, { position: "top-right", autoClose: 3000 });
    }
  };

  const toggleRowExpansion = (submissionId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [submissionId]: !prev[submissionId],
    }));
  };

  const formatAmount = (amount) => {
    return amount !== null && !isNaN(Number(amount))
      ? `₹${Number(amount).toFixed(2)}`
      : "₹0.00";
  };

  const formatDate = (date) => {
    return date && !isNaN(Date.parse(date))
      ? new Date(date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "N/A";
  };

  if (profileLoading) {
    return (
      <div className="text-center text-gray-600 text-base font-medium py-10 animate-pulse">
        Loading user profile...
      </div>
    );
  }

  if ((!profile || employeeError) && userRole !== "super_admin") {
    return (
      <div className="text-center text-gray-600 text-base font-medium py-10">
        Unable to load user profile. Please try again or contact support.
      </div>
    );
  }

  if (!["employee", "dept_head", "hr", "super_admin"].includes(userRole)) {
    return (
      <div className="text-center text-gray-600 text-base font-medium py-10">
        Access denied: Insufficient permissions.
      </div>
    );
  }

  const dataToDisplay = ["employee", "dept_head"].includes(userRole)
    ? submissions
    : viewMode === "pending"
    ? submissions
    : history;
  const filteredData = statusFilter
    ? dataToDisplay.filter((s) => s.status === statusFilter)
    : dataToDisplay;
  const paginationData = ["employee", "dept_head"].includes(userRole)
    ? pagination.submissions
    : viewMode === "pending"
    ? pagination.submissions
    : pagination.history;

  // Debug: Log data to console
  console.log("Rendering data:", {
    viewMode,
    dataToDisplay,
    filteredData,
    statusFilter,
    submissions,
    history,
  });

  return (
    <div className="w-full p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3 items-center">
          {["employee", "dept_head"].includes(userRole) ? (
            <button
              onClick={() => {
                setViewMode("pending");
                setPage(1);
                setStatusFilter("");
              }}
              className="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-teal-600 to-teal-800 text-white hover:from-teal-700 hover:to-teal-900 transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              My Submissions
            </button>
          ) : (
            <div className="flex gap-2 bg-gray-50 p-1 rounded-full shadow-sm">
              <button
                onClick={() => {
                  setViewMode("pending");
                  setPage(1);
                  setStatusFilter("");
                }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  viewMode === "pending"
                    ? "bg-gradient-to-r from-teal-600 to-teal-800 text-white shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-teal-400`}
              >
                Pending
              </button>
              <button
                onClick={() => {
                  setViewMode("history");
                  setPage(1);
                  setStatusFilter("");
                }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  viewMode === "history"
                    ? "bg-gradient-to-r from-teal-600 to-teal-800 text-white shadow-md"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                } focus:outline-none focus:ring-2 focus:ring-teal-400`}
              >
                History
              </button>
            </div>
          )}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 text-sm border border-slate-300 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-700 transition-all duration-300"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={() => setShouldRefresh(true)}
            className="p-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-800 text-white hover:from-teal-700 hover:to-teal-900 transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400"
            title="Refresh Data"
          >
            <RefreshCw size={18} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <PageBreadcrumb
            items={[
              {
                label: "Home",
                link: ["employee", "dept_head"].includes(userRole)
                  ? "/employee/dashboard"
                  : "/admin/dashboard",
              },
              {
                label: "Travel Expenses",
                link: ["employee", "dept_head"].includes(userRole)
                  ? "/employee/travel-expense"
                  : "/admin/travel-expense",
              },
            ]}
          />
          <PageMeta
            title={
              ["employee", "dept_head"].includes(userRole)
                ? "My Travel Expenses"
                : "Travel Expense Approval"
            }
            description="View and manage travel expenses"
          />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6">
          {["employee", "dept_head"].includes(userRole)
            ? "My Travel Expenses"
            : viewMode === "pending"
            ? "Pending Approvals"
            : "Expense History"}
        </h2>

        {loading && (
          <div className="text-center text-gray-500 text-sm font-medium py-8 animate-pulse">
            Loading{" "}
            {["employee", "dept_head"].includes(userRole)
              ? "submissions"
              : viewMode === "pending"
              ? "submissions"
              : "history"}
            ...
          </div>
        )}
        {!loading && filteredData.length === 0 && (
          <div className="text-center text-gray-500 text-sm font-medium py-8">
            No{" "}
            {["employee", "dept_head"].includes(userRole)
              ? "travel expense submissions"
              : viewMode === "pending"
              ? "pending submissions"
              : `history records${
                  statusFilter ? ` for status: ${statusFilter}` : ""
                }`}{" "}
            found.
            {statusFilter === "Rejected" && viewMode === "history"
              ? " Try rejecting a pending submission to see it here."
              : ""}
          </div>
        )}
        {!loading && filteredData.length > 0 && (
          <div className="border border-slate-300 rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full border rounded-lg shadow-sm bg-white">
              {/* Header with Field Names and Icons */}
              <thead className="bg-gradient-to-r from-teal-600 to-teal-800 text-white">
                <tr>
                  <th className="border border-teal-700 p-3 text-left text-xs sm:text-sm font-semibold min-w-[150px]">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      Employee
                    </div>
                  </th>
                  <th className="border border-teal-700 p-3 text-left text-xs sm:text-sm font-semibold min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Travel Date
                    </div>
                  </th>
                  <th className="border border-teal-700 p-3 text-left text-xs sm:text-sm font-semibold min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      Destination
                    </div>
                  </th>
                  <th className="border border-teal-700 p-3 text-right text-xs sm:text-sm font-semibold min-w-[100px]">
                    <div className="flex items-center justify-end gap-2">
                      <DollarSign size={16} />
                      Amount
                    </div>
                  </th>
                  <th className="border border-teal-700 p-3 text-center text-xs sm:text-sm font-semibold min-w-[100px]">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle size={16} />
                      Status
                    </div>
                  </th>
                  <th className="border border-teal-700 p-3 text-center text-xs sm:text-sm font-semibold min-w-[80px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((submission) => {
                  if (!submission?.id) return null;
                  const isExpanded = expandedRows[submission.id];
                  return (
                    <React.Fragment key={submission.id}>
                      <tr className="hover:bg-teal-50 transition-all duration-300 border border-slate-200">
                        <td className="border border-slate-200 p-3">
                          <div className="font-medium text-sm text-slate-700">
                            {submission.employee_name || "N/A"} (
                            {submission.employee_id || "N/A"})
                          </div>
                        </td>
                        <td className="border border-slate-200 p-3">
                          <div className="text-sm text-slate-600">
                            {formatDate(submission.travel_date)}
                          </div>
                        </td>
                        <td className="border border-slate-200 p-3">
                          <div className="text-sm text-slate-600 truncate max-w-[120px]">
                            {submission.destination || "N/A"}
                          </div>
                        </td>
                        <td className="border border-slate-200 p-3 text-right">
                          <div className="font-semibold text-teal-800 text-sm">
                            {formatAmount(submission.total_amount)}
                          </div>
                        </td>
                        <td className="border border-slate-200 p-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md ${
                              submission.status === "Pending"
                                ? "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
                                : submission.status === "Approved"
                                ? "bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800"
                                : "bg-gradient-to-r from-red-100 to-red-200 text-red-800"
                            }`}
                          >
                            {submission.status}
                          </span>
                        </td>
                        <td className="border border-slate-200 p-3 text-center">
                          <button
                            onClick={() => toggleRowExpansion(submission.id)}
                            className="p-2 bg-teal-100 text-teal-600 hover:bg-teal-200 hover:text-teal-700 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 relative group"
                            aria-label={
                              isExpanded
                                ? `Hide Details for Submission ${submission.id}`
                                : `Show Details for Submission ${submission.id}`
                            }
                          >
                            {isExpanded ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                            <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 transition-all duration-200">
                              {isExpanded ? "Hide Details" : "Show Details"}
                            </span>
                          </button>
                        </td>
                      </tr>
                      {/* Expandable Details Row (Spans all columns) */}
                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan={6} className="p-0">
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isExpanded
                                  ? "max-h-[300px] opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <div className="p-4 border-t border-slate-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {/* Department */}
                                  <div className="flex flex-col min-h-[50px] justify-between">
                                    <span className="text-xs font-medium text-slate-700 mb-1">
                                      Department
                                    </span>
                                    <span className="text-xs text-slate-600 leading-tight">
                                      {submission.department_name || "N/A"}
                                    </span>
                                  </div>
                                  {/* Purpose */}
                                  <div className="flex flex-col min-h-[50px] justify-between md:col-span-1">
                                    <span className="text-xs font-medium text-slate-700 mb-1">
                                      Purpose
                                    </span>
                                    <span
                                      className="text-xs text-slate-600 leading-tight line-clamp-1"
                                      title={submission.travel_purpose}
                                    >
                                      {submission.travel_purpose || "N/A"}
                                    </span>
                                  </div>
                                  {/* Receipt */}
                                  <div className="flex flex-col min-h-[50px] justify-between md:col-span-1 lg:col-span-1">
                                    <span className="text-xs font-medium text-slate-700 mb-1">
                                      Receipt
                                    </span>
                                    <span className="text-xs text-slate-600 leading-tight">
                                      {submission.receipt_path &&
                                      submission.receipt_path.startsWith(
                                        "http://localhost:3007/uploads/"
                                      ) ? (
                                        <button
                                          onClick={() =>
                                            handleDownloadReceipt(submission.id)
                                          }
                                          className="text-teal-500 hover:text-teal-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 flex items-center gap-1 text-xs"
                                          aria-label={`Download Receipt for Submission ${submission.id}`}
                                        >
                                          <Download size={12} /> Download
                                        </button>
                                      ) : (
                                        "N/A"
                                      )}
                                    </span>
                                  </div>
                                  {/* Expenses */}
                                  <div className="md:col-span-2 lg:col-span-3 space-y-1">
                                    <span className="text-xs font-medium text-slate-700 block mb-1">
                                      Expenses
                                    </span>
                                    <div className="bg-white p-1.5 rounded-md border border-slate-300 max-h-20 overflow-y-auto">
                                      <ul className="space-y-0.5 text-xs text-slate-600 list-disc pl-3">
                                        {submission.expenses &&
                                        submission.expenses.length > 0 ? (
                                          submission.expenses
                                            .slice(0, 3)
                                            .map((exp, idx) => (
                                              <li
                                                key={idx}
                                                className="break-words"
                                              >
                                                <span className="font-medium">
                                                  {exp.purpose || "N/A"}:
                                                </span>{" "}
                                                {formatAmount(exp.amount)} on{" "}
                                                {formatDate(exp.expense_date)}
                                              </li>
                                            ))
                                        ) : (
                                          <li className="text-gray-500 italic">
                                            No expenses listed
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="md:col-span-2 lg:col-span-3 space-y-1">
                                    <span className="text-xs font-medium text-slate-700 block mb-1">
                                      Comment
                                    </span>
                                    <div className="bg-white p-1.5 rounded-md border border-slate-300 min-h-[40px]">
                                      {["hr", "super_admin"].includes(
                                        userRole
                                      ) && viewMode === "pending" ? (
                                        <textarea
                                          className="w-full border-0 text-xs text-slate-600 focus:outline-none  transition-all duration-300 disabled:bg-gray-50 resize-none"
                                          placeholder="Add a comment (optional)"
                                          value={
                                            adminComments[submission.id] || ""
                                          }
                                          onChange={(e) =>
                                            handleCommentChange(
                                              submission.id,
                                              e.target.value
                                            )
                                          }
                                          disabled={
                                            submission.status !== "Pending" ||
                                            actionLoading[submission.id]
                                          }
                                          aria-label={`Admin Comment for Submission ${submission.id}`}
                                          rows={1}
                                        />
                                      ) : (
                                        <span className="text-xs text-slate-600 leading-tight line-clamp-1">
                                          {submission.admin_comment || "N/A"}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {["hr", "super_admin"].includes(userRole) &&
                                    viewMode === "pending" &&
                                    submission.status === "Pending" && (
                                      <div className="md:col-span-2 lg:col-span-3 flex gap-2 justify-center pt-1">
                                        <button
                                          onClick={() =>
                                            handleStatusUpdate(
                                              submission.id,
                                              "Approved"
                                            )
                                          }
                                          className={`px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-600 to-green-800 text-white rounded-md hover:from-green-700 hover:to-green-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm ${
                                            actionLoading[submission.id]
                                              ? "opacity-50 cursor-not-allowed animate-pulse"
                                              : ""
                                          }`}
                                          disabled={
                                            actionLoading[submission.id]
                                          }
                                          aria-label={`Approve Submission ${submission.id}`}
                                        >
                                          <Check
                                            size={10}
                                            className="inline mr-1"
                                          />{" "}
                                          Approve
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleStatusUpdate(
                                              submission.id,
                                              "Rejected"
                                            )
                                          }
                                          className={`px-2 py-1 text-xs font-medium bg-gradient-to-r from-red-600 to-red-800 text-white rounded-md hover:from-red-700 hover:to-red-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm ${
                                            actionLoading[submission.id]
                                              ? "opacity-50 cursor-not-allowed animate-pulse"
                                              : ""
                                          }`}
                                          disabled={
                                            actionLoading[submission.id]
                                          }
                                          aria-label={`Reject Submission ${submission.id}`}
                                        >
                                          <X
                                            size={10}
                                            className="inline mr-1"
                                          />{" "}
                                          Reject
                                        </button>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-1.5 mb-2 ml-2 text-sm font-medium bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-full hover:from-teal-700 hover:to-teal-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from(
                  { length: paginationData?.totalPages || 1 },
                  (_, i) => i + 1
                ).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 ${
                      page === p
                        ? "bg-gradient-to-r from-teal-600 to-teal-800 text-white shadow-sm"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    } focus:outline-none focus:ring-2 focus:ring-teal-400`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page >= (paginationData?.totalPages || 1)}
                className="px-4 py-1.5 mb-1 mr-2 text-sm font-medium bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-full hover:from-teal-700 hover:to-teal-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelExpenseApproval;
