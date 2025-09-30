import React, { useEffect, useState, useCallback } from "react";
import { FileText, Download, Check, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchTravelExpenses,
  fetchTravelExpenseHistory,
  updateTravelExpenseStatus,
} from "../../redux/slices/travelExpensesSlice";
import { getCurrentUserProfile } from "../../redux/slices/employeeSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const TravelExpenseApproval = () => {
  const dispatch = useDispatch();
  const { profile, error: employeeError } = useSelector((state) => state.employee);
  const { submissions, history, loading, error, successMessage, pagination } = useSelector(
    (state) => state.travelExpenses
  );
  const [adminComments, setAdminComments] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const [viewMode, setViewMode] = useState("pending"); // "pending" or "history"
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(""); // For debugging
  const limit = 10;

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(() => {
    console.log("Fetching data:", { role: profile?.role, employee_id: profile?.employee_id, viewMode, page });
    if (!profile) {
      console.log("No profile found, fetching profile");
      dispatch(getCurrentUserProfile());
      return;
    }

    if (!profile.employee_id) {
      console.warn("Profile employee_id is undefined");
      toast.error("Employee ID not found. Please ensure your profile is complete.", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (["employee", "hr", "super_admin"].includes(profile?.role)) {
      if (profile.role === "employee") {
        console.log("Fetching employee submissions for employee_id:", profile.employee_id);
        dispatch(fetchTravelExpenses({ page, limit }));
      } else {
        if (viewMode === "pending") {
          console.log("Fetching pending submissions for admin");
          dispatch(fetchTravelExpenses({ page, limit }));
        } else {
          console.log("Fetching history for admin");
          dispatch(fetchTravelExpenseHistory({ page, limit }));
        }
      }
    } else {
      console.warn("Invalid user role:", profile?.role);
      toast.error("Access denied: Invalid role.", { position: "top-right", autoClose: 3000 });
    }
  }, [dispatch, profile, page, viewMode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (error) {
      console.error("Travel expense error:", error);
      const message = error.includes("Insufficient permissions")
        ? "You do not have permission to perform this action."
        : error.includes("not found")
        ? "No submissions found or endpoint unavailable."
        : error.includes("Only pending")
        ? "This submission cannot be updated."
        : error.includes("User not found")
        ? "Your account is not linked to an employee record."
        : error;
      toast.error(message, { position: "top-right", autoClose: 3000 });
    }
    if (employeeError) {
      console.error("Employee error:", employeeError);
      toast.error(employeeError, { position: "top-right", autoClose: 3000 });
    }
    if (successMessage) {
      console.log("Success message:", successMessage);
      toast.success(successMessage, { position: "top-right", autoClose: 3000 });
      fetchData(); // Refresh data after success
    }
  }, [error, employeeError, successMessage, fetchData]);

  const handleStatusUpdate = (submissionId, status) => {
    console.log("Updating status for submissionId:", submissionId, "to", status);
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
    });
    setAdminComments((prev) => ({ ...prev, [submissionId]: "" }));
  };

  const handleCommentChange = (submissionId, value) => {
    setAdminComments((prev) => ({ ...prev, [submissionId]: value }));
  };

  const handleDownloadReceipt = async (submissionId) => {
    console.log("Downloading receipt for submissionId:", submissionId);
    try {
      const userToken = localStorage.getItem("userToken");
      const token = userToken ? JSON.parse(userToken).token : null;
      if (!token) {
        toast.error("No authentication token found.", { position: "top-right", autoClose: 3000 });
        return;
      }

      const response = await fetch(`http://localhost:3007/api/travel-expenses/download/${submissionId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to download receipt");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `receipt-${submissionId}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download receipt error:", error.message);
      toast.error(error.message, { position: "top-right", autoClose: 3000 });
    }
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined || isNaN(Number(amount))) {
      return "₹0.00";
    }
    return `₹${Number(amount).toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date || isNaN(Date.parse(date))) {
      return "N/A";
    }
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (!profile) {
    return (
      <div className="text-center text-gray-600 text-lg font-medium py-10">
        Loading user profile...
      </div>
    );
  }

  if (!["employee", "hr", "super_admin"].includes(profile?.role)) {
    return (
      <div className="text-center text-gray-600 text-lg font-medium py-10">
        Access denied: Insufficient permissions.
      </div>
    );
  }

  const dataToDisplay = profile.role === "employee" ? submissions : viewMode === "pending" ? submissions : history;
  const filteredData = statusFilter ? dataToDisplay.filter((s) => s.status === statusFilter) : dataToDisplay;
  const paginationData = profile.role === "employee" ? pagination.submissions : viewMode === "pending" ? pagination.submissions : pagination.history;

  console.log("Data to display:", JSON.stringify(filteredData, null, 2));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setViewMode("pending");
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              viewMode === "pending" ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700"
            } hover:bg-teal-700 hover:text-white transition`}
          >
            {profile.role === "employee" ? "My Submissions" : "Pending Submissions"}
          </button>
          <button
            onClick={() => {
              setViewMode("history");
              setPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              viewMode === "history" ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-700"
            } hover:bg-teal-700 hover:text-white transition`}
          >
            History
          </button>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-2 py-1 border rounded-md text-sm"
          >
            <option value="">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <div className="flex justify-end">
          <PageBreadcrumb
            items={[
              { label: "Home", link: profile.role === "employee" ? "/employee/dashboard" : "/admin/dashboard" },
              { label: "Travel Expenses", link: profile.role === "employee" ? "/employee/travel-expense" : "/admin/travel-expense" },
            ]}
          />
          <PageMeta
            title={profile.role === "employee" ? "My Travel Expenses" : "Travel Expense Approval"}
            description="View and manage travel expenses"
          />
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-4">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6">
          {profile.role === "employee"
            ? viewMode === "pending"
              ? "My Travel Expense Submissions"
              : "My Travel Expense History"
            : viewMode === "pending"
            ? "Travel Expense Approval"
            : "Travel Expense History"}
        </h2>

        {loading && (
          <div className="text-center text-gray-600 text-lg font-medium py-10 animate-pulse">
            Loading {profile.role === "employee" ? "submissions" : viewMode === "pending" ? "submissions" : "history"}...
          </div>
        )}
        {!loading && filteredData.length === 0 && (
          <div className="text-center text-gray-600 text-lg font-medium py-10">
            No {profile.role === "employee" ? "travel expense submissions" : viewMode === "pending" ? "travel expense submissions" : "travel expense history"} found.
          </div>
        )}
        {!loading && filteredData.length > 0 && (
          <div>
            <table className="w-full border mt-2 rounded-lg shadow-sm bg-white table-fixed">
              <thead className="bg-gradient-to-r from-teal-600 to-slate-700 text-white">
                <tr>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[12%]">Employee</th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[10%]">Department</th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[10%]">Travel Date</th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[10%]">Destination</th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[12%]">Purpose</th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[8%]">Total Amount</th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[8%]">Receipt</th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[18%]">Expenses</th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[12%]">Comment</th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[8%]">Status</th>
                  {profile.role !== "employee" && viewMode === "pending" && (
                    <th className="border border-teal-800 p-2 text-xs font-medium w-[10%]">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((submission) => {
                  console.log("Rendering submission:", submission);
                  if (!submission.id) {
                    console.warn("Skipping submission with missing id:", submission);
                    return null;
                  }
                  return (
                    <tr
                      key={submission.id}
                      className={`border-b border-teal-200 transition-colors duration-150 ${
                        submission.status === "Approved"
                          ? "bg-teal-100 hover:bg-teal-200"
                          : submission.status === "Rejected"
                          ? "bg-red-100 hover:bg-red-200"
                          : "bg-white hover:bg-teal-50"
                      }`}
                    >
                      <td className="border border-teal-200 p-2 text-xs text-gray-700 truncate">
                        {submission.employee_name || "N/A"} ({submission.employee_id || "N/A"})
                      </td>
                      <td className="border border-teal-200 p-2 text-xs text-gray-700 truncate">
                        {submission.department_name || "N/A"}
                      </td>
                      <td className="border border-teal-200 p-2 text-xs text-gray-700">
                        {formatDate(submission.travel_date)}
                      </td>
                      <td className="border border-teal-200 p-2 text-xs text-gray-700 truncate">
                        {submission.destination || "N/A"}
                      </td>
                      <td className="border border-teal-200 p-2 text-xs text-gray-700 truncate">
                        {submission.travel_purpose || "N/A"}
                      </td>
                      <td className="border border-teal-200 p-2 text-xs text-gray-700">
                        {formatAmount(submission.total_amount)}
                      </td>
                      <td className="border border-teal-200 p-2 text-xs text-gray-700 text-center">
                        {submission.receipt_path && submission.receipt_path.startsWith("http://localhost:3007/Uploads/") ? (
                          <button
                            onClick={() => handleDownloadReceipt(submission.id)}
                            className="text-teal-500 hover:text-teal-700 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-teal-500 rounded"
                            aria-label={`Download Receipt for Submission ${submission.id}`}
                          >
                            <Download size={12} className="inline" />
                          </button>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="border border-teal-200 p-2 text-xs text-gray-700">
                        <ul className="list-disc pl-4 space-y-1">
                          {submission.expenses && submission.expenses.length > 0 ? (
                            submission.expenses.map((exp, idx) => (
                              <li key={idx} className="text-[10px] truncate">
                                {exp.purpose || "N/A"} - {formatAmount(exp.amount)} (
                                {formatDate(exp.expense_date)})
                              </li>
                            ))
                          ) : (
                            <li className="text-[10px] text-gray-500">No expenses</li>
                          )}
                        </ul>
                      </td>
                      <td className="border border-teal-200 p-2">
                        {profile.role !== "employee" && viewMode === "pending" ? (
                          <textarea
                            className="w-full border border-gray-300 rounded-md p-1 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors duration-150 disabled:bg-gray-100 resize-none"
                            placeholder="Comment (optional)"
                            value={adminComments[submission.id] || ""}
                            onChange={(e) => handleCommentChange(submission.id, e.target.value)}
                            disabled={submission.status !== "Pending" || actionLoading[submission.id]}
                            aria-label={`Admin Comment for Submission ${submission.id}`}
                            rows={2}
                          />
                        ) : (
                          <span className="text-xs text-gray-700 truncate">
                            {submission.admin_comment || "N/A"}
                          </span>
                        )}
                      </td>
                      <td className="border border-teal-200 p-2 text-center">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            submission.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : submission.status === "Approved"
                              ? "bg-teal-100 text-teal-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      {profile.role !== "employee" && viewMode === "pending" && (
                        <td className="border border-teal-200 p-2 text-center">
                          {submission.status === "Pending" ? (
                            <div className="flex gap-1 justify-center">
                              <button
                                onClick={() => handleStatusUpdate(submission.id, "Approved")}
                                className={`p-1 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-teal-400 ${
                                  actionLoading[submission.id] ? "opacity-50 cursor-not-allowed animate-pulse" : ""
                                }`}
                                disabled={actionLoading[submission.id]}
                                aria-label={`Approve Submission ${submission.id}`}
                                title="Approve"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(submission.id, "Rejected")}
                                className={`p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-red-400 ${
                                  actionLoading[submission.id] ? "opacity-50 cursor-not-allowed animate-pulse" : ""
                                }`}
                                disabled={actionLoading[submission.id]}
                                aria-label={`Reject Submission ${submission.id}`}
                                title="Reject"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-teal-500 text-white rounded-md text-xs font-medium hover:bg-teal-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                Previous
              </button>
              <span className="text-xs text-gray-600">
                Page {page} of {paginationData?.totalPages || 1}
              </span>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page >= (paginationData?.totalPages || 1)}
                className="px-3 py-1 bg-teal-500 text-white rounded-md text-xs font-medium hover:bg-teal-600 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-teal-400"
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