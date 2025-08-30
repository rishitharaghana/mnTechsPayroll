import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import { createPayroll, generatePayroll, fetchPayroll, clearState, downloadPayrollPDF } from "../../redux/slices/payrollSlice";

const GeneratePayroll = () => {
  const dispatch = useDispatch();
  const { payrollList, loading, error, successMessage } = useSelector((state) => state.payroll);

  const [form, setForm] = useState({
    name: "",
    id: "",
    department: "",
    basicSalary: 0,
    allowances: 0,
    bonuses: 0,
    pfDeduction: 0,
    esicDeduction: 0,
    taxDeduction: 0,
    netSalary: 0,
    status: "Pending",
    paymentMethod: "Bank Transfer",
    month: "2025-08", // Default to 2025-08
    paymentDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = {
      ...form,
      [name]: ["basicSalary", "allowances", "bonuses", "pfDeduction", "esicDeduction", "taxDeduction"].includes(name)
        ? parseFloat(value) || 0
        : value,
    };

    updatedForm.netSalary =
      (updatedForm.basicSalary || 0) +
      (updatedForm.allowances || 0) +
      (updatedForm.bonuses || 0) -
      (updatedForm.pfDeduction || 0) -
      (updatedForm.esicDeduction || 0) -
      (updatedForm.taxDeduction || 0);

    setForm(updatedForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearState());
    const payrollData = {
      name: form.name,
      id: form.id,
      department: form.department,
      grossSalary: (form.basicSalary || 0) + (form.allowances || 0) + (form.bonuses || 0),
      pfDeduction: form.pfDeduction,
      esicDeduction: form.esicDeduction,
      taxDeduction: form.taxDeduction,
      netSalary: form.netSalary,
      status: form.status,
      paymentMethod: form.paymentMethod,
      month: form.month,
      paymentDate: form.paymentDate,
    };

    console.log("Submitting payrollData:", payrollData); // Debug log
    dispatch(createPayroll(payrollData)).then((result) => {
      if (createPayroll.fulfilled.match(result)) {
        console.log("createPayroll success, refetching for month:", form.month); // Debug log
        dispatch(fetchPayroll({ month: form.month }));
        setForm({
          name: "",
          id: "",
          department: "",
          basicSalary: 0,
          allowances: 0,
          bonuses: 0,
          pfDeduction: 0,
          esicDeduction: 0,
          taxDeduction: 0,
          netSalary: 0,
          status: "Pending",
          paymentMethod: "Bank Transfer",
          month: "2025-08",
          paymentDate: "",
        });
      }
    });
  };

  const handleGenerateAll = () => {
    if (!form.month) return alert("Please select a month first.");
    dispatch(clearState());
    console.log("Generating payroll for month:", form.month); // Debug log
    dispatch(generatePayroll({ month: form.month })).then((result) => {
      if (generatePayroll.fulfilled.match(result)) {
        console.log("generatePayroll success, refetching for month:", form.month); // Debug log
        dispatch(fetchPayroll({ month: form.month }));
      }
    });
  };

  const handleDownloadPDF = () => {
    if (!form.month) return alert("Please select a month first.");
    dispatch(clearState());
    dispatch(downloadPayrollPDF({ month: form.month }));
  };

  return (
    <div className="space-y-8 bg-white rounded-2xl min-h-screen p-6">
      <PageMeta title="Generate Payroll" description="Create and manage payroll entries for employees." />
      <PageBreadcrumb
        items={[
          { label: "Home", link: "/" },
          { label: "Generate Payroll", link: "/admin/generate-payroll" },
        ]}
      />

      <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h1 className="text-3xl font-bold text-white">💼 Generate Payroll</h1>
      </div>

      {(error || successMessage) && (
        <div
          className={`p-4 rounded-lg ${
            error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {error || successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full bg-white backdrop-blur-sm rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Employee Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Employee ID</label>
            <input
              type="text"
              name="id"
              value={form.id}
              onChange={handleChange}
              placeholder="EMP001"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="IT"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Month</label>
            <input
              type="month"
              name="month"
              value={form.month}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Basic Salary</label>
            <input
              type="number"
              name="basicSalary"
              value={form.basicSalary}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Allowances</label>
            <input
              type="number"
              name="allowances"
              value={form.allowances}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Bonuses</label>
            <input
              type="number"
              name="bonuses"
              value={form.bonuses}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">PF Deduction</label>
            <input
              type="number"
              name="pfDeduction"
              value={form.pfDeduction}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">ESIC Deduction</label>
            <input
              type="number"
              name="esicDeduction"
              value={form.esicDeduction}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Tax Deduction</label>
            <input
              type="number"
              name="taxDeduction"
              value={form.taxDeduction}
              onChange={handleChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Payment Date</label>
            <input
              type="date"
              name="paymentDate"
              value={form.paymentDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Payment Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg"
            >
              <option value="Pending">Pending</option>
              <option value="Processed">Processed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg"
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Check">Check</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        <div className="text-right mt-2 text-lg text-slate-500">
          <span className="font-semibold">Net Salary:</span>{" "}
          <span className="text-teal-600 font-bold">
            ₹{form.netSalary.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600"
          >
            ➕ Add to Payroll
          </button>

          <button
            type="button"
            onClick={handleGenerateAll}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600"
          >
            ⚡ Generate Payroll for All
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600"
          >
            📄 Download Payroll PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneratePayroll;