import React, { useState, useEffect } from "react";
import { Trash2, Upload } from "lucide-react";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const debounce = (func, wait) => {
  let timeout;
  const debounced = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  debounced.cancel = () => {
    clearTimeout(timeout);
  };
  return debounced;
};

const expenseCategories = [
  "Transportation",
  "Lodging",
  "Meals",
  "Conference Fees",
  "Miscellaneous",
];

const EmployeeTravelExpenses = () => {
  const [expenses, setExpenses] = useState([
    { date: "", category: "", purpose: "", amount: "", receipt: null },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [employeeId, setEmployeeId] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("draft");
  const [showToast, setShowToast] = useState(false);

  const calculateTotal = debounce(() => {
    const total = expenses.reduce(
      (sum, exp) => sum + (parseFloat(exp.amount) || 0),
      0
    );
    setTotalAmount(total);
  }, 300);

  useEffect(() => {
    calculateTotal();
    return () => calculateTotal.cancel();
  }, [expenses]);

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    if (field === "amount" && value < 0) return;
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const handleFileChange = (index, file) => {
    if (file && file.size <= 5 * 1024 * 1024) {
      const newExpenses = [...expenses];
      newExpenses[index].receipt = file;
      setExpenses(newExpenses);
    } else {
      alert("File size exceeds 5MB limit.");
    }
  };

  const addExpenseRow = () => {
    setExpenses([...expenses, { date: "", category: "", purpose: "", amount: "", receipt: null }]);
  };

  const removeExpenseRow = (index) => {
    if (expenses.length > 1) {
      const newExpenses = expenses.filter((_, i) => i !== index);
      setExpenses(newExpenses);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeId) {
      alert("Please enter your Employee ID.");
      return;
    }
    if (
      expenses.some(
        (exp) =>
          !exp.date ||
          !exp.category ||
          !exp.purpose ||
          !exp.amount ||
          (!exp.receipt && exp.category !== "Miscellaneous")
      )
    ) {
      alert("Please fill in all required fields and upload receipts for non-miscellaneous expenses.");
      return;
    }

    // Simulate API call to submit expenses
    const submission = {
      employeeId,
      expenses,
      totalAmount,
      status: "pending",
      submissionDate: new Date().toISOString(),
    };
    console.log("Submitting:", submission); // Replace with actual API call
    setSubmissionStatus("pending");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-end">
        <PageMeta title="Travel Expenses" />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Travel Expenses", link: "/employee/travel-expenses" },
          ]}
        />
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6">
          Travel Expenses Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-slate-300 p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-md font-semibold text-slate-700 mb-1 block">
                  Employee ID
                </label>
                <input
                  type="text"
                  placeholder="Enter employee ID"
                  className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-md font-semibold text-slate-700 mb-1 block">
                  Travel Date
                </label>
                <input
                  type="date"
                  className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                  required
                />
              </div>
              <div>
                <label className="text-md font-semibold text-slate-700 mb-1 block">
                  Travel Destination
                </label>
                <input
                  type="text"
                  placeholder="Enter travel destination"
                  className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                />
              </div>
              <div>
                <label className="text-md font-semibold text-slate-700 mb-1 block">
                  Department
                </label>
                <input
                  type="text"
                  placeholder="Enter department"
                  className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                />
              </div>
            </div>
            <div className="pt-4">
              <label className="text-md font-semibold text-slate-700 mb-1 block">
                Purpose of the Travel
              </label>
              <textarea
                className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition resize"
                placeholder="Enter travel purpose"
              />
            </div>
          </div>

          <div className="border border-slate-300 p-4 rounded-lg shadow-sm">
            <label className="text-md font-semibold text-slate-700 mb-1 block">
              Travel Expenses
            </label>
            <table className="w-full border mt-2 rounded-lg shadow-sm bg-white">
              <thead className="bg-teal-700 text-white">
                <tr>
                  <th className="border border-teal-800 p-2 text-sm font-medium">Date</th>
                  <th className="border border-teal-800 p-2 text-sm font-medium">Category</th>
                  <th className="border border-teal-800 p-2 text-sm font-medium">Purpose</th>
                  <th className="border border-teal-800 p-2 text-sm font-medium">Amount</th>
                  <th className="border border-teal-800 p-2 text-sm font-medium">Receipt</th>
                  <th className="border border-teal-800 p-2 text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp, index) => (
                  <tr key={index} className="hover:bg-teal-50 transition">
                    <td className="border border-teal-200 p-2">
                      <input
                        type="date"
                        className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                        value={exp.date}
                        onChange={(e) => handleExpenseChange(index, "date", e.target.value)}
                      />
                    </td>
                    <td className="border border-teal-200 p-2">
                      <select
                        className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                        value={exp.category}
                        onChange={(e) => handleExpenseChange(index, "category", e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {expenseCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-teal-200 p-2">
                      <input
                        type="text"
                        className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                        placeholder="Purpose"
                        value={exp.purpose}
                        onChange={(e) => handleExpenseChange(index, "purpose", e.target.value)}
                      />
                    </td>
                    <td className="border border-teal-200 p-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                        value={exp.amount}
                        onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
                      />
                    </td>
                    <td className="border border-teal-200 p-2">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="text-sm text-gray-500"
                        onChange={(e) => handleFileChange(index, e.target.files[0])}
                      />
                      {exp.receipt && <span className="text-xs text-teal-600">{exp.receipt.name}</span>}
                    </td>
                    <td className="border border-teal-200 p-2 text-center">
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeExpenseRow(index)}
                          className="text-slate-500 hover:text-slate-700 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-lg text-sm shadow-md hover:from-teal-700 hover:to-teal-900 transition"
              onClick={addExpenseRow}
            >
              Add Row
            </button>
            <div className="mt-2 text-right font-semibold text-teal-800">
              Total: ₹{totalAmount.toFixed(2)}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Status: <span className="font-semibold">{submissionStatus}</span>
            </div>
            <button
              type="submit"
              disabled={submissionStatus !== "draft"}
              className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-lg text-sm shadow-md hover:from-teal-700 hover:to-teal-900 transition ${
                submissionStatus !== "draft" ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Submit for Approval
            </button>
          </div>
        </form>

        {showToast && (
          <div className="fixed bottom-4 right-4 bg-teal-700 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300">
            ✅ Your submission has been sent for approval.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTravelExpenses;