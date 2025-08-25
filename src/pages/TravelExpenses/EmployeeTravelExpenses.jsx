import React, { useState, useRef, useEffect } from "react";
import { Trash, Trash2, Upload } from "lucide-react";
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

const EmployeeTravelExpenses = () => {
  const [expenses, setExpenses] = useState([
    { date: "", purpose: "", amount: "" },
  ]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [files, setFiles] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const ctxRef = useRef(null);

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

  const addExpenseRow = () => {
    setExpenses([...expenses, { date: "", purpose: "", amount: "" }]);
  };

  const removeExpenseRow = (index) => {
    if (expenses.length > 1) {
      const newExpenses = expenses.filter((_, i) => i !== index);
      setExpenses(newExpenses);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.size <= 5 * 1024 * 1024
    );
    if (newFiles.length < e.dataTransfer.files.length) {
      alert("Some files were ignored due to size exceeding 5MB.");
    }
    setFiles([...files, ...newFiles]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        (file) => file.size <= 5 * 1024 * 1024
      );
      if (newFiles.length < e.target.files.length) {
        alert("Some files were ignored due to size exceeding 5MB.");
      }
      setFiles([...files, ...newFiles]);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = 150 * dpr;
      canvas.style.height = "150px";
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);
      ctx.lineWidth = 1; // Thinner line
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#0f766e";
      ctxRef.current = ctx;
    }
  }, []);

  const getCoordinates = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    return { x, y };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getCoordinates(e, canvas);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing || !ctxRef.current) return;
    const canvas = canvasRef.current;
    const { x, y } = getCoordinates(e, canvas);
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    if (ctxRef.current) ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (expenses.some((exp) => !exp.date || !exp.purpose || !exp.amount)) {
      alert("Please fill in all expense fields.");
      return;
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-end">
        <PageMeta title="Travel Expenses" />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Travel Expenses", link: "/employee/travel-expenses" },
          ]}
        />
      </div>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-slate-700 mb-6">
          Travel Expenses Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="border border-slate-300 p-4 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Employer Name
                </label>
                <input
                  type="text"
                  placeholder="Enter employer name"
                  className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                />
              </div>
              <div>
                <label className="text-md font-semibold text-slate-700 mb-1 block">
                  Unit/Department
                </label>
                <input
                  type="text"
                  placeholder="Enter department"
                  className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                />
              </div>
              <div>
                <label className="text-md font-semibold text-slate-700 mb-1 block">
                  Position/Title
                </label>
                <input
                  type="text"
                  placeholder="Enter position"
                  className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                />
              </div>
              <div>
                <label className="text-md font-semibold text-slate-700 mb-1 block">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                />
              </div>
              <div>
                <label className="text-md font-semibold text-slate-700 mb-1 block">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
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
                  Receiver's Name
                </label>
                <input
                  type="text"
                  placeholder="Enter receiver name"
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

          {/* Expenses Table */}
          <div className="border border-slate-300 p-4 rounded-lg shadow-sm">
            <label className="text-md font-semibold text-slate-700 mb-1 block">
              Travel Expenses
            </label>
            <table className="w-full border mt-2 rounded-lg shadow-sm bg-white">
              <thead className="bg-teal-700 text-white">
                <tr>
                  <th className="border border-teal-800 p-2 text-sm font-medium">
                    Date
                  </th>
                  <th className="border border-teal-800 p-2 text-sm font-medium">
                    Purpose
                  </th>
                  <th className="border border-teal-800 p-2 text-sm font-medium">
                    Amount
                  </th>
                  <th className="border border-teal-800 p-2 text-sm font-medium">
                    Action
                  </th>
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
                        onChange={(e) =>
                          handleExpenseChange(index, "date", e.target.value)
                        }
                      />
                    </td>
                    <td className="border border-teal-200 p-2">
                      <input
                        type="text"
                        className="w-full border border-slate-300 shadow-sm p-2 rounded text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-700 transition"
                        placeholder="Purpose"
                        value={exp.purpose}
                        onChange={(e) =>
                          handleExpenseChange(index, "purpose", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleExpenseChange(index, "amount", e.target.value)
                        }
                      />
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

          {/* File Upload */}
          <div className="border border-slate-300 p-4 rounded-lg shadow-sm">
            <label className="text-md font-semibold text-slate-700 mb-1 block">
              Upload Receipts
            </label>
            <div
              className="border-dashed border-2 border-slate-300 rounded-lg p-6 text-center shadow-sm"
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <p className="text-sm text-gray-500">Drag & drop receipts here</p>
              <p className="text-sm text-gray-500">or</p>
              <label className="cursor-pointer mt-2 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-lg text-sm shadow-md hover:from-teal-700 hover:to-teal-900 transition">
                <Upload size={16} /> Browse
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <ul className="mt-2 text-sm text-gray-500">
                {files.map((file, i) => (
                  <li key={i} className="truncate">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Signature */}
          {/* <div className="border border-slate-300 p-4 rounded-lg shadow-sm">
            <label className="text-md font-semibold text-slate-700 mb-1 block">
              Employee Signature
            </label>
            <div className="relative w-full">
              <canvas
                ref={canvasRef}
                height={150}
                className="w-full border border-slate-300 rounded mt-2 bg-white shadow-sm"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-500 mt-1">
                  Sign above using your mouse or touch screen
                </p>
                <button
                  type="button"
                  className="flex items-center gap-1 px-2 py-2 bg-gradient-to-r from-slate-600 to-teal-700 text-white rounded-lg text-sm shadow-md hover:from-slate-700 hover:to-teal-800 transition"
                  onClick={clearSignature}
                  title="Clear Signature"
                >
                  <Trash size={14} /> Clear
                </button>
              </div>
            </div>
          </div> */}

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-800 text-white rounded-lg text-sm shadow-md hover:from-teal-700 hover:to-teal-900 transition"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Toast Message */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-teal-700 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300">
            ✅ Thank You! Your submission has been received.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeTravelExpenses;