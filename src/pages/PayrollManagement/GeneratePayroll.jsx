import React, { useState } from 'react';

const GeneratePayroll = () => {
  const [payrollEntries, setPayrollEntries] = useState([]);
  const [form, setForm] = useState({
    name: '',
    id: '',
    department: '',
    grossSalary: 0,
    pfDeduction: 0,
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

    if (['grossSalary', 'pfDeduction'].includes(name)) {
      updatedForm.netSalary = updatedForm.grossSalary - updatedForm.pfDeduction;
    }

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
      netSalary: 0,
      status: 'Processed',
      paymentMethod: 'Direct Deposit',
    });
  };

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-slate-800">💼 Generate Payroll</h1>

      {/* Payroll Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300 max-w-3xl space-y-6"
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
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
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
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
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
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
            >
              <option value="Direct Deposit">Direct Deposit</option>
              <option value="Check">Check</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Gross Salary</label>
            <input
              type="number"
              name="grossSalary"
              value={form.grossSalary}
              onChange={handleChange}
              placeholder="$0.00"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">PF Deduction</label>
            <input
              type="number"
              name="pfDeduction"
              value={form.pfDeduction}
              onChange={handleChange}
              placeholder="$0.00"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
            />
          </div>
        </div>

        <div className="text-right mt-2 text-lg text-slate-500">
          <span className="font-semibold">Net Salary:</span>{' '}
          <span className="text-teal-600 font-bold">${form.netSalary.toLocaleString()}</span>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto mt-4 px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105"
        >
          ➕ Add to Payroll
        </button>
      </form>

      {/* Payroll Entries Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">🧾 Payroll Entries</h2>
        <div className="overflow-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Gross Salary</th>
                <th className="px-4 py-3 font-medium">PF Deduction</th>
                <th className="px-4 py-3 font-medium">Net Salary</th>
                <th className="px-4 py-3 font-medium">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payrollEntries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-slate-400 py-4">
                    No entries yet.
                  </td>
                </tr>
              ) : (
                payrollEntries.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors duration-200">
                    <td className="px-4 py-3 text-slate-900">{entry.name} ({entry.id})</td>
                    <td className="px-4 py-3 text-slate-900">${entry.grossSalary.toLocaleString()}</td>
                    <td className="px-4 py-3 text-red-600">${entry.pfDeduction.toLocaleString()}</td>
                    <td className="px-4 py-3 text-teal-600 font-semibold">${entry.netSalary.toLocaleString()}</td>
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