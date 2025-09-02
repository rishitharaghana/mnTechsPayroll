// src/components/TravelExpenseApproval.jsx
import React, { useEffect, useState } from "react";
import { FileText, Download, Check, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchTravelExpenses,
  updateTravelExpenseStatus,
  clearState,
} from "../../redux/slices/travelExpensesSlice";
import { fetchUserProfile } from "../../redux/slices/userSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const TravelExpenseApproval = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { profile, error: userError } = useSelector((state) => state.user);
  const { submissions, loading, error, successMessage } = useSelector(
    (state) => state.travelExpenses
  );
  const [adminComments, setAdminComments] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    console.log("Current user:", user);
    if (["hr", "super_admin"].includes(user?.role)) {
      if (!profile) {
        dispatch(fetchUserProfile());
      }
      dispatch(fetchTravelExpenses());
    }
    return () => {
      dispatch(clearState());
    };
  }, [dispatch, profile, user?.role, page]);

  useEffect(() => {
    console.log("Submissions:", submissions);
    if (error) {
      const message = error.includes("Insufficient permissions")
        ? "You do not have permission to perform this action."
        : error.includes("not found")
        ? "Submission not found."
        : error.includes("Only pending")
        ? "This submission cannot be updated."
        : error.includes("User not found in employees")
        ? "Your account is not linked to an employee record."
        : error;
      toast.error(message, { position: "top-right", autoClose: 3000 });
      setTimeout(() => dispatch(clearState()), 2000);
    }
    if (userError) {
      toast.error(userError, { position: "top-right", autoClose: 3000 });
      setTimeout(() => dispatch(clearState()), 2000);
    }
    if (successMessage) {
      toast.success(successMessage, { position: "top-right", autoClose: 3000 });
      dispatch(fetchTravelExpenses()); 
      setTimeout(() => dispatch(clearState()), 2000);
    }
  }, [error, userError, successMessage, dispatch]);

  const handleStatusUpdate = (submissionId, status) => {
    console.log(`Updating submission ${submissionId} to ${status}`);
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

  const handleDownloadReceipt = (receiptId) => {
    console.log(`Downloading receipt ${receiptId}`);
    toast.info("Receipt download not implemented in this slice.", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) {
      console.warn("Invalid amount:", amount);
      return "N/A";
    }
    const parsed = Number(amount);
    return isNaN(parsed) ? "N/A" : `₹${parsed.toFixed(2)}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center text-gray-600 text-lg font-medium py-10">
        Please log in to approve travel expenses.
      </div>
    );
  }

  if (!["hr", "super_admin"].includes(user?.role)) {
    return (
      <div className="text-center text-gray-600 text-lg font-medium py-10">
        Access denied: Insufficient permissions.
      </div>
    );
  }

  return (
    <div className="w-78/100">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Travel Expenses", link: "/admin/travel-expenses" },
          ]}
        />
        <PageMeta title="Travel Expense Approval" description="Approve travel expenses" />
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6">
          Travel Expense Approval
        </h2>

        {loading && (
          <div className="text-center text-gray-600 text-lg font-medium py-10 animate-pulse">
            Loading submissions...
          </div>
        )}
        {!loading && submissions.length === 0 && (
          <div className="text-center text-gray-600 text-lg font-medium py-10">
            No travel expense submissions found.
          </div>
        )}
        {!loading && submissions.length > 0 && (
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
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[18%]">Expenses</th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[12%]">Comment</th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[8%]">Status</th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[10%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
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
                      {submission.travel_date
                        ? new Date(submission.travel_date).toLocaleDateString()
                        : "N/A"}
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
                    <td className="border border-teal-200 p-2 text-xs text-gray-700">
                      <ul className="list-disc pl-4 space-y-1">
                        {submission.expenses && submission.expenses.length > 0 ? (
                          submission.expenses.map((exp, idx) => (
                            <li key={idx} className="text-[10px] truncate">
                              {exp.purpose || "N/A"} - {formatAmount(exp.amount)} (
                              {exp.expense_date
                                ? new Date(exp.expense_date).toLocaleDateString()
                                : "N/A"}
                              )
                              {exp.receipt && (
                                <button
                                  onClick={() => handleDownloadReceipt(exp.receipt.id)}
                                  className="ml-1 text-teal-500 hover:text-teal-700 transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-teal-500 rounded"
                                  aria-label={`Download Receipt for ${exp.purpose || "expense"}`}
                                >
                                  <Download size={12} className="inline" />
                                </button>
                              )}
                            </li>
                          ))
                        ) : (
                          <li className="text-[10px] text-gray-500">No expenses</li>
                        )}
                      </ul>
                    </td>
                    <td className="border border-teal-200 p-2">
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-1 text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors duration-150 disabled:bg-gray-100 resize-none"
                        placeholder="Comment (optional)"
                        value={adminComments[submission.id] || ""}
                        onChange={(e) => handleCommentChange(submission.id, e.target.value)}
                        disabled={submission.status !== "Pending" || actionLoading[submission.id]}
                        aria-label={`Admin Comment for Submission ${submission.id}`}
                        rows={2}
                      />
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
                    <td className="border border-teal-200 p-2 text-center">
                      {submission.status === "Pending" ? (
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => handleStatusUpdate(submission.id, "Approved")}
                            className={`p-1 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-teal-400 ${
                              actionLoading[submission.id]
                                ? "opacity-50 cursor-not-allowed animate-pulse"
                                : ""
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
                              actionLoading[submission.id]
                                ? "opacity-50 cursor-not-allowed animate-pulse"
                                : ""
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
                  </tr>
                ))}
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
              <span className="text-xs text-gray-600">Page {page}</span>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={submissions.length < limit}
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