import React, { useState } from "react";

const PayslipForm = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    department: "",
    position: "",
    month: "",
    basicSalary: "",
    hra: "",
    allowance: "",
    deductions: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Payslip Data Submitted:", formData);
    alert("Payslip submitted successfully!");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Generate Payslip</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ["employeeId", "Employee ID"],
          ["name", "Employee Name"],
          ["department", "Department"],
          ["position", "Position"],
          ["month", "Month"],
          ["basicSalary", "Basic Salary"],
          ["hra", "HRA"],
          ["allowance", "Other Allowance"],
          ["deductions", "Deductions"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="block font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              name={name}
              value={formData[name]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Submit Payslip
        </button>
      </form>
    </div>
  );
};

export default PayslipForm;
