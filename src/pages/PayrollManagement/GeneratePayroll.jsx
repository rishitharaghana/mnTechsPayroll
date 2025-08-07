import React, { useState } from 'react';

const GeneratePayroll = () => {
  const [payrollEntries, setPayrollEntries] = useState([]);
  const [form, setForm] = useState({
    name: '',
    id: '',
    department: '',
    grossSalary: 0,
    pfDeduction: 0,
    esicDeduction: 0,
    netSalary: 0,
    status: 'Processed',
    paymentMethod: 'Direct Deposit',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = {
      ...form,
      [name]: ['grossSalary', 'pfDeduction'].includes(name) ? parseFloat(value) || 0 : value,
    };

    // Calculate ESIC deduction (0.75% for gross salary < ₹25,000)
    updatedForm.esicDeduction =
      updatedForm.grossSalary < 25000 ? updatedForm.grossSalary * 0.0075 : 0;

    // Calculate net salary
    updatedForm.netSalary =
      updatedForm.grossSalary - updatedForm.pfDeduction - updatedForm.esicDeduction;

    setForm(updatedForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPayrollEntries([...payrollEntries, form]);
    setForm({
      name: '',
      id: '',
      department: '',
      grossSalary: 0,
      pfDeduction: 0,
      esicDeduction: 0,
      netSalary: 0,
      status: 'Processed',
      paymentMethod: 'Direct Deposit',
    });
  };

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h1 className="text-3xl font-bold text-white">💼 Generate Payroll</h1>
      </div>

      {/* Payroll Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 max-w-3xl space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Employee Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
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
              placeholder="e.g. EMP1023"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
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
              placeholder="e.g. HR, Engineering"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
            >
              <option value="Direct Deposit">Direct Deposit</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Gross Salary (₹)</label>
            <input
              type="number"
              name="grossSalary"
              value={form.grossSalary}
              onChange={handleChange}
              placeholder="₹0"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">PF Deduction (₹)</label>
            <input
              type="number"
              name="pfDeduction"
              value={form.pfDeduction}
              onChange={handleChange}
              placeholder="₹0"
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">ESIC Deduction (₹)</label>
            <input
              type="number"
              name="esicDeduction"
              value={form.esicDeduction.toFixed(2)}
              readOnly
              className="w-full px-4 py-2 border border-slate-200/50 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="text-right mt-2 text-lg text-slate-500">
          <span className="font-semibold">Net Salary:</span>{' '}
          <span className="text-teal-600 font-bold">₹{form.netSalary.toLocaleString('en-IN')}</span>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto mt-4 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105"
        >
          ➕ Add to Payroll
        </button>
      </form>

      {/* Payroll Entries Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">🧾 Payroll Entries</h2>
        <div className="overflow-auto">
          <table className="w-full table-auto text-sm text-left" aria-label="Payroll Entries Table">
            <thead className="bg-gradient-to-r from-teal-600 to-slate-700 text-white">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Gross Salary (₹)</th>
                <th className="px-4 py-3 font-medium">PF Deduction (₹)</th>
                <th className="px-4 py-3 font-medium">ESIC Deduction (₹)</th>
                <th className="px-4 py-3 font-medium">Net Salary (₹)</th>
                <th className="px-4 py-3 font-medium">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50">
              {payrollEntries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-slate-400 py-4">
                    No entries yet.
                  </td>
                </tr>
              ) : (
                payrollEntries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors duration-200">
                    <td className="px-4 py-3 text-slate-900">
                      {entry.name} ({entry.id})
                    </td>
                    <td className="px-4 py-3 text-slate-900">₹{entry.grossSalary.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-red-600">₹{entry.pfDeduction.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-red-600">₹{entry.esicDeduction.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-teal-600 font-semibold">
                      ₹{entry.netSalary.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-slate-900">{entry.paymentMethod}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeneratePayroll;