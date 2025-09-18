import React, { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchTravelExpenseHistory,
  clearState,
} from "../../redux/slices/travelExpensesSlice";
import { fetchUserProfile } from "../../redux/slices/userSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const TravelExpenseHistory = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { profile, error: userError } = useSelector((state) => state.user);
  const { history, loading, error, successMessage, pagination } = useSelector(
    (state) => state.travelExpense
  );
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (isAuthenticated && ["hr", "super_admin"].includes(user?.role)) {
      if (!profile) {
        dispatch(fetchUserProfile());
      }
      dispatch(fetchTravelExpenseHistory({ page, limit }));
    }
    return () => {
      dispatch(clearState());
    };
  }, [dispatch, profile, user?.role, page, isAuthenticated]);

  useEffect(() => {
    console.log("History submissions:", JSON.stringify(history, null, 2));
    console.log("Pagination:", pagination);
    if (error) {
      const message = error.includes("Insufficient permissions")
        ? "You do not have permission to view travel expense history."
        : error.includes("not found")
        ? "No travel expense submissions found."
        : error.includes("Failed to fetch")
        ? "Unable to fetch travel expense history. Please try again."
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
      setTimeout(() => dispatch(clearState()), 2000);
    }
  }, [error, userError, successMessage, dispatch]);

  const handleDownloadReceipt = async (submissionId) => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        toast.error("No authentication token found. Please log in.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      const token = JSON.parse(userToken).token;
      const response = await fetch(
        `http://localhost:3007/api/travel-expenses/${submissionId}/receipt`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `receipt_${submissionId}`;
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        toast.error("Failed to download receipt.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Download receipt error:", error);
      toast.error("Error downloading receipt.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined || isNaN(Number(amount))) {
      console.warn("Invalid amount:", amount);
      return "₹0.00";
    }
    return `₹${Number(amount).toFixed(2)}`;
  };

  const formatDate = (date) => {
    if (!date || isNaN(Date.parse(date))) {
      console.warn("Invalid date:", date);
      return "N/A";
    }
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center text-gray-600 text-lg font-medium py-10">
        Please log in to view travel expense history.
      </div>
    );
  }

  if (!["hr", "super_admin"].includes(user?.role)) {
    return (
      <div className="text-center text-gray-600 text-lg font-medium py-10">
        Access denied: Only HR and Super Admin can view travel expense history.
      </div>
    );
  }

  return (
    <div className="w-full lg:w-[78%]">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/admin/dashboard" },
            {
              label: "Travel Expense History",
              link: "/admin/travel-expense-history",
            },
          ]}
        />
        <PageMeta
          title="Travel Expense History"
          description="View travel expense history"
        />
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6">
          Travel Expense History
        </h2>

        {error && (
          <div className="text-center text-red-600 text-lg font-medium py-4">
            {error.includes("Insufficient permissions")
              ? "You do not have permission to view travel expense history."
              : error.includes("not found")
              ? "No travel expense submissions found."
              : "Unable to fetch travel expense history."}
            <button
              onClick={() => dispatch(fetchTravelExpenseHistory({ page, limit }))}
              className="ml-4 px-3 py-1 bg-teal-500 text-white rounded-md text-xs font-medium hover:bg-teal-600 transition-all duration-150"
            >
              Retry
            </button>
          </div>
        )}
        {loading && (
          <div className="text-center text-gray-600 text-lg font-medium py-10 animate-pulse">
            Loading history...
          </div>
        )}
        {!loading && !error && history.length === 0 && (
          <div className="text-center text-gray-600 text-lg font-medium py-10">
            No travel expense history found.
          </div>
        )}
        {!loading && !error && history.length > 0 && (
          <div>
            <table className="w-full border mt-2 rounded-lg shadow-sm bg-white table-fixed">
              <thead className="bg-gradient-to-r from-teal-600 to-slate-700 text-white">
                <tr>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[12%]">
                    Employee
                  </th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[10%]">
                    Department
                  </th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[10%]">
                    Travel Date
                  </th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[10%]">
                    Destination
                  </th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[12%]">
                    Purpose
                  </th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[8%]">
                    Total Amount
                  </th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[8%]">
                    Receipt
                  </th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[18%]">
                    Expenses
                  </th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[12%]">
                    Admin Comment
                  </th>
                  <th className="border border-teal-800 p-2 text-xs font-medium w-[8%]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((submission) => (
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
                      {submission.employee_name ||
                        submission.employee_id ||
                        "N/A"}
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
                      {submission.receipt_path ? (
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
                          <li className="text-[10px] text-gray-500">
                            No expenses
                          </li>
                        )}
                      </ul>
                    </td>
                    <td className="border border-teal-200 p-2 text-xs text-gray-700 truncate">
                      {submission.admin_comment || "N/A"}
                    </td>
                    <td className="border border-teal-200 p-2 text-center">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          submission.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : submission.status === "Approved"
                            ? "bg-teal-100 text-teal-800"
                            : submission.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {submission.status || "N/A"}
                      </span>
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
              <span className="text-xs text-gray-600">
                Page {page} of{" "}
                {(pagination.history && pagination.history.totalPages) || 1}
              </span>
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={
                  page >=
                  ((pagination.history && pagination.history.totalPages) || 1)
                }
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

export default TravelExpenseHistory;