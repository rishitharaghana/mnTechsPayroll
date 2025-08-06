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
      [name]: ['grossSalary', 'pfDeduction'].includes(name) ? parseFloat(value) : value,
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
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700">💼 Generate Payroll</h1>

      {/* Payroll Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-6 max-w-3xl space-y-6 border border-gray-200"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <input
              type="text"
              name="id"
              value={form.id}
              onChange={handleChange}
              placeholder="e.g. EMP1023"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="e.g. HR, Engineering"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="Direct Deposit">Direct Deposit</option>
              <option value="Check">Check</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gross Salary</label>
            <input
              type="number"
              name="grossSalary"
              value={form.grossSalary}
              onChange={handleChange}
              placeholder="$0.00"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PF Deduction</label>
            <input
              type="number"
              name="pfDeduction"
              value={form.pfDeduction}
              onChange={handleChange}
              placeholder="$0.00"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <div className="text-right mt-2 text-lg text-gray-700">
          <span className="font-semibold">Net Salary:</span>{' '}
          <span className="text-indigo-700 font-bold">${form.netSalary.toLocaleString()}</span>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto mt-4 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
        >
          ➕ Add to Payroll
        </button>
      </form>

      {/* Payroll Entries Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">🧾 Payroll Entries</h2>
        <div className="overflow-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Employee</th>
                <th className="px-4 py-2">Gross Salary</th>
                <th className="px-4 py-2">PF Deduction</th>
                <th className="px-4 py-2">Net Salary</th>
                <th className="px-4 py-2">Method</th>
              </tr>
            </thead>
            <tbody>
              {payrollEntries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-400 py-4">
                    No entries yet.
                  </td>
                </tr>
              ) : (
                payrollEntries.map((entry, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{entry.name} ({entry.id})</td>
                    <td className="px-4 py-2">${entry.grossSalary.toLocaleString()}</td>
                    <td className="px-4 py-2 text-red-600">${entry.pfDeduction.toLocaleString()}</td>
                    <td className="px-4 py-2 text-indigo-700 font-semibold">${entry.netSalary.toLocaleString()}</td>
                    <td className="px-4 py-2">{entry.paymentMethod}</td>
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
