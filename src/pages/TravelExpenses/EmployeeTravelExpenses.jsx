import React, { useState, useEffect, useCallback } from "react";
import {
  Trash2,
  User,
  Upload,
  FileText,
  Calendar,
  MapPin,
  Grid3X3,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  submitTravelExpense,
  fetchTravelExpenses,
  fetchTravelExpenseHistory,
  clearState,
} from "../../redux/slices/travelExpensesSlice";
import { fetchUserProfile } from "../../redux/slices/userSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const debounce = (func, wait) => {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => clearTimeout(timeout);
  return debounced;
};

const EmployeeTravelExpenses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { profile, error: userError, loading: profileLoading } = useSelector((state) => state.user);
  const { submissions, history, loading, error, successMessage, pagination } = useSelector(
    (state) => state.travelExpenses
  );

  const [viewMode, setViewMode] = useState("form"); // "form" for submission form, "history" for history view
  const [expenses, setExpenses] = useState([{ date: "", purpose: "", amount: "" }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [travelDate, setTravelDate] = useState("");
  const [destination, setDestination] = useState("");
  const [travelPurpose, setTravelPurpose] = useState("");
  const [department, setDepartment] = useState(profile?.department_name || "");
  const [submissionStatus, setSubmissionStatus] = useState("draft");
  const [receipt, setReceipt] = useState(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const limit = 10;

  const employeeName = profile ? `${profile.full_name} (${profile.employee_id})` : "Unknown";
  const userRole = profile?.role || user?.role;

  const calculateTotal = debounce(() => {
    const total = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
    setTotalAmount(total);
  }, 300);

  const fetchData = useCallback(() => {
    if (!["employee", "dept_head"].includes(userRole)) {
      toast.error("Access denied: Invalid role.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!profile?.employee_id) {
      dispatch(fetchUserProfile());
      return;
    }

    if (viewMode === "form") {
      dispatch(fetchTravelExpenses({ page, limit }));
    } else {
      dispatch(fetchTravelExpenseHistory({ page, limit }));
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
      toast.error(error === "No travel expense history records found" ? "No history records available" : error, {
        position: "top-right",
        autoClose: 3000,
      });
      dispatch(clearState());
    }
    if (userError) {
      toast.error(userError, {
        position: "top-right",
        autoClose: 3000,
      });
      dispatch(clearState());
    }
    if (successMessage) {
      setSubmissionStatus(userRole === "employee" ? "Pending" : "Approved");
      toast.success(successMessage, { position: "top-right", autoClose: 3000 });
      setTimeout(() => {
        dispatch(clearState());
        setExpenses([{ date: "", purpose: "", amount: "" }]);
        setTravelDate("");
        setDestination("");
        setTravelPurpose("");
        setReceipt(null);
        setSubmissionStatus("draft");
      }, 2000);
    }
  }, [error, userError, successMessage, dispatch, userRole]);

  useEffect(() => {
    if (profile?.department_name) {
      setDepartment(profile.department_name);
    }
    calculateTotal();
    return () => calculateTotal.cancel();
  }, [profile, expenses]);

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    if (field === "amount" && value < 0) return;
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setReceipt(file);
    } else {
      toast.error("File size exceeds 5MB limit.");
    }
  };

  const addExpenseRow = () => {
    setExpenses([...expenses, { date: "", purpose: "", amount: "" }]);
  };

  const removeExpenseRow = (index) => {
    if (expenses.length > 1) {
      const newExpenses = expenses.filter((_, i) => i !== index);
      setExpenses(newExpenses);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!profile?.employee_id || !travelDate || !destination || !travelPurpose) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (expenses.some((exp) => !exp.date || !exp.purpose || !exp.amount)) {
      toast.error("Please fill in all required fields for expenses.");
      return;
    }

    dispatch(
      submitTravelExpense({
        employee_id: profile.employee_id,
        travel_date: travelDate,
        destination,
        travel_purpose: travelPurpose,
        total_amount: totalAmount,
        expenses,
        receipt,
      })
    );
  };

  const handleViewSubmission = (submission) => {
    navigate(`/employee/travel-expenses/${submission.id}`, {
      state: { submission },
    });
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
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "") || `receipt-${submissionId}`
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

  if (!isAuthenticated) {
    return <div>Please log in to submit travel expenses.</div>;
  }

  if (profileLoading) {
    return (
      <div className="text-center text-gray-600 text-base font-medium py-10 animate-pulse">
        Loading user profile...
      </div>
    );
  }

  if (!profile || userError) {
    return (
      <div className="text-center text-gray-600 text-base font-medium py-10">
        Unable to load user profile. Please try again or contact support.
      </div>
    );
  }

  if (!["employee", "dept_head"].includes(userRole)) {
    return (
      <div className="text-center text-gray-600 text-base font-medium py-10">
        Access denied: Insufficient permissions.
      </div>
    );
  }

  const dataToDisplay = viewMode === "form" ? submissions : history;
  const filteredData = statusFilter
    ? dataToDisplay.filter((s) => s.status === statusFilter)
    : dataToDisplay;
  const paginationData = viewMode === "form" ? pagination.submissions : pagination.history;

  return (
    <div className="w-full mt-4 sm:mt-0">
      <div className="hidden sm:flex sm:justify-end sm:items-center">
        <PageMeta title="Travel Expenses" />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/emp-dashboard" },
            { label: "Travel Expenses", link: "/employee/travel-expenses" },
          ]}
        />
      </div>
      <div className="flex gap-2 bg-gray-50 p-1 rounded-full shadow-sm mb-6">
        <button
          onClick={() => {
            setViewMode("form");
            setPage(1);
            setStatusFilter("");
          }}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
            viewMode === "form"
              ? "bg-gradient-to-r from-teal-600 to-teal-800 text-white shadow-md"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          } focus:outline-none focus:ring-2 focus:ring-teal-400`}
        >
          Submit New Expense
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
          My History
        </button>
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
      <div className="bg-white rounded-2xl shadow-lg p-6">
        {viewMode === "form" ? (
          <>
            <h2 className="text-2xl font-semibold text-slate-700 mb-6">Travel Expenses Form</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border border-slate-300 p-4 rounded-lg shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-md font-semibold text-slate-700 mb-1 block">Employee</label>
                    <div className="flex items-center space-x-2">
                      <User size={20} className="text-teal-600" />
                      <input
                        type="text"
                        value={employeeName}
                        disabled
                        className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 cursor-not-allowed"
                        aria-label="Employee"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-md font-semibold text-slate-700 mb-1 block">Travel Date</label>
                    <div className="flex items-center space-x-2">
                      <Calendar size={20} className="text-teal-600" />
                      <input
                        type="date"
                        className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        required
                        aria-label="Travel Date"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-md font-semibold text-slate-700 mb-1 block">Travel Destination</label>
                    <div className="flex items-center space-x-2">
                      <MapPin size={20} className="text-teal-600" />
                      <input
                        type="text"
                        placeholder="Enter travel destination"
                        className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                        aria-label="Travel Destination"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-md font-semibold text-slate-700 mb-1 block">Department</label>
                    <div className="flex items-center space-x-2">
                      <Grid3X3 size={20} className="text-teal-600" />
                      <input
                        type="text"
                        value={department}
                        disabled
                        className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 cursor-not-allowed"
                        aria-label="Department"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <label className="text-md font-semibold text-slate-700 mb-1 block">Purpose of the Travel</label>
                  <div className="flex items-start space-x-2">
                    <FileText size={20} className="text-teal-600 mt-2" />
                    <textarea
                      className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition resize"
                      placeholder="Enter travel purpose"
                      value={travelPurpose}
                      onChange={(e) => setTravelPurpose(e.target.value)}
                      required
                      aria-label="Purpose of the Travel"
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <label className="text-md font-semibold text-slate-700 mb-1 block">Receipt (Optional)</label>
                  <div className="flex items-center space-x-2">
                    <Upload size={20} className="text-teal-600" />
                    <input
                      type="file"
                      accept="image/jpeg,image/png,application/pdf"
                      className="text-sm text-gray-500"
                      onChange={handleFileChange}
                      aria-label="Receipt Upload"
                    />
                    {receipt && (
                      <span className="text-xs text-teal-600">{receipt.name}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="border border-slate-300 p-2 sm:p-4 rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full border rounded-lg shadow-sm bg-white">
                  <caption className="text-md sm:text-lg font-semibold text-slate-700 py-2 text-left">
                    Travel Expenses
                  </caption>
                  <thead className="bg-teal-700 text-white">
                    <tr>
                      <th className="border border-teal-800 p-2 text-xs sm:text-sm font-medium min-w-[120px]">
                        Date
                      </th>
                      <th className="border border-teal-800 p-2 text-xs sm:text-sm font-medium min-w-[150px]">
                        Purpose
                      </th>
                      <th className="border border-teal-800 p-2 text-xs sm:text-sm font-medium min-w-[100px]">
                        Amount
                      </th>
                      <th className="border border-teal-800 p-2 text-xs sm:text-sm font-medium min-w-[80px]">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp, index) => (
                      <tr key={index} className="hover:bg-teal-50 transition">
                        <td className="border border-teal-200 p-1 sm:p-2">
                          <input
                            type="date"
                            className="w-full border border-slate-300 shadow-sm p-1 sm:p-2 rounded text-xs sm:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                            value={exp.date}
                            onChange={(e) => handleExpenseChange(index, "date", e.target.value)}
                            aria-label={`Expense Date ${index + 1}`}
                          />
                        </td>
                        <td className="border border-teal-200 p-1 sm:p-2">
                          <input
                            type="text"
                            className="w-full border border-slate-300 shadow-sm p-1 sm:p-2 rounded text-xs sm:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                            placeholder="Purpose"
                            value={exp.purpose}
                            onChange={(e) => handleExpenseChange(index, "purpose", e.target.value)}
                            aria-label={`Expense Purpose ${index + 1}`}
                          />
                        </td>
                        <td className="border border-teal-200 p-1 sm:p-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full border border-slate-300 shadow-sm p-1 sm:p-2 rounded text-xs sm:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                            value={exp.amount}
                            onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
                            aria-label={`Expense Amount ${index + 1}`}
                          />
                        </td>
                        <td className="border border-teal-200 p-1 sm:p-2 text-center">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeExpenseRow(index)}
                              className="text-slate-500 hover:text-slate-700 transition"
                              aria-label={`Remove Expense Row ${index + 1}`}
                            >
                              <Trash2 size={16} className="sm:h-5 sm:w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-4 gap-2">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-lg text-xs sm:text-sm shadow-md hover:from-teal-700 hover:to-teal-900 transition"
                    onClick={addExpenseRow}
                    aria-label="Add Expense Row"
                  >
                    Add Row
                  </button>
                  <div className="text-right font-semibold text-teal-800 text-sm sm:text-base">
                    Total: ₹{totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Status: <span className="font-semibold">{submissionStatus}</span>
                </div>
                <button
                  type="submit"
                  disabled={submissionStatus !== "draft" || loading}
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-lg text-sm shadow-md hover:from-teal-700 hover:to-teal-900 transition ${
                    submissionStatus !== "draft" || loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  aria-label="Submit Travel Expenses"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-slate-700 mb-6">My Expense History</h2>
            {loading && (
              <div className="text-center text-gray-500 text-sm font-medium py-8 animate-pulse">
                Loading history...
              </div>
            )}
            {!loading && filteredData.length === 0 && (
              <div className="text-center text-gray-500 text-sm font-medium py-8">
                No {statusFilter ? `history records for status: ${statusFilter}` : "history records"} found.
                {statusFilter === "Rejected" ? " Try submitting and getting a rejection to see it here." : ""}
              </div>
            )}
            {!loading && filteredData.length > 0 && (
              <div className="border border-slate-300 rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full border rounded-lg shadow-sm bg-white">
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
                                {submission.employee_name || "N/A"} ({submission.employee_id || "N/A"})
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
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleViewSubmission(submission)}
                                  className="p-2 bg-teal-100 text-teal-600 hover:bg-teal-200 hover:text-teal-700 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 relative group"
                                  aria-label={`View Submission ${submission.id}`}
                                >
                                  <FileText size={18} />
                                  <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 transition-all duration-200">
                                    View Details
                                  </span>
                                </button>
                                <button
                                  onClick={() => toggleRowExpansion(submission.id)}
                                  className="p-2 bg-teal-100 text-teal-600 hover:bg-teal-200 hover:text-teal-700 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 relative group"
                                  aria-label={
                                    isExpanded
                                      ? `Hide Details for Submission ${submission.id}`
                                      : `Show Details for Submission ${submission.id}`
                                  }
                                >
                                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                  <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 transition-all duration-200">
                                    {isExpanded ? "Hide Details" : "Show Details"}
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="bg-gray-50">
                              <td colSpan={6} className="p-0">
                                <div
                                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    isExpanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                                  }`}
                                >
                                  <div className="p-4 border-t border-slate-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      <div className="flex flex-col min-h-[50px] justify-between">
                                        <span className="text-xs font-medium text-slate-700 mb-1">
                                          Department
                                        </span>
                                        <span className="text-xs text-slate-600 leading-tight">
                                          {submission.department_name || "N/A"}
                                        </span>
                                      </div>
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
                                              onClick={() => handleDownloadReceipt(submission.id)}
                                              className="text-teal-500 hover:text-teal-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 flex items-center gap-1 text-xs"
                                              aria-label={`Download Receipt for Submission ${submission.id}`}
                                            >
                                              <Upload size={12} /> Download
                                            </button>
                                          ) : (
                                            "N/A"
                                          )}
                                        </span>
                                      </div>
                                      <div className="md:col-span-2 lg:col-span-3 space-y-1">
                                        <span className="text-xs font-medium text-slate-700 block mb-1">
                                          Expenses
                                        </span>
                                        <div className="bg-white p-1.5 rounded-md border border-slate-300 max-h-20 overflow-y-auto">
                                          <ul className="space-y-0.5 text-xs text-slate-600 list-disc pl-3">
                                            {submission.expenses && submission.expenses.length > 0 ? (
                                              submission.expenses.slice(0, 3).map((exp, idx) => (
                                                <li key={idx} className="break-words">
                                                  <span className="font-medium">{exp.purpose || "N/A"}:</span>{" "}
                                                  {formatAmount(exp.amount)} on {formatDate(exp.expense_date)}
                                                </li>
                                              ))
                                            ) : (
                                              <li className="text-gray-500 italic">No expenses listed</li>
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                      <div className="md:col-span-2 lg:col-span-3 space-y-1">
                                        <span className="text-xs font-medium text-slate-700 block mb-1">
                                          Admin Comment
                                        </span>
                                        <div className="bg-white p-1.5 rounded-md border border-slate-300 min-h-[40px]">
                                          <span className="text-xs text-slate-600 leading-tight line-clamp-1">
                                            {submission.admin_comment || "N/A"}
                                          </span>
                                        </div>
                                      </div>
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
                    className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-full hover:from-teal-700 hover:to-teal-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: paginationData?.totalPages || 1 }, (_, i) => i + 1).map((p) => (
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
                    className="px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-full hover:from-teal-700 hover:to-teal-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeTravelExpenses;