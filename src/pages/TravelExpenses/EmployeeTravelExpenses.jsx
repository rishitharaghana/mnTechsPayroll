import React, { useState, useEffect } from "react";
import { Trash2, User, Upload, FileText, Calendar, MapPin, Grid3X3 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { submitTravelExpense, clearState } from "../../redux/slices/travelExpensesSlice";
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
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { profile, error: userError } = useSelector((state) => state.user);
  const { loading, error, successMessage } = useSelector((state) => state.travelExpenses);

  const [expenses, setExpenses] = useState([{ date: "", purpose: "", amount: "" }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [travelDate, setTravelDate] = useState("");
  const [destination, setDestination] = useState("");
  const [travelPurpose, setTravelPurpose] = useState("");
  const [department, setDepartment] = useState(profile?.department_name || "");
  const [submissionStatus, setSubmissionStatus] = useState("draft");
  const [receipt, setReceipt] = useState(null); // Single receipt file

  const employeeName = profile ? `${profile.full_name} (${profile.employee_id})` : "Unknown";

  const calculateTotal = debounce(() => {
    const total = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
    setTotalAmount(total);
  }, 300);

  useEffect(() => {
    if (["employee", "hr", "super_admin"].includes(user?.role)) {
      if (!profile) {
        dispatch(fetchUserProfile());
      }
    }
    calculateTotal();
    return () => {
      calculateTotal.cancel();
      dispatch(clearState());
    };
  }, [dispatch, expenses, profile, user?.role]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setTimeout(() => dispatch(clearState()), 2000);
    }
    if (userError) {
      toast.error(userError);
      setTimeout(() => dispatch(clearState()), 2000);
    }
    if (successMessage) {
      setSubmissionStatus(user?.role === "employee" ? "Pending" : "Approved");
      toast.success(successMessage);
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
  }, [error, userError, successMessage, dispatch, user?.role]);

  useEffect(() => {
    if (profile?.department_name) {
      setDepartment(profile.department_name);
    }
  }, [profile]);

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

  if (!isAuthenticated) {
    return <div>Please log in to submit travel expenses.</div>;
  }

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
      <div className="bg-white rounded-2xl shadow-lg p-6">
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
      </div>
    </div>
  );
};

export default EmployeeTravelExpenses;