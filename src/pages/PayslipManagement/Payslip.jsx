import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Payslip = () => {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const payslips = [
    {
      id: 1,
      employee: 'John Smith',
      month: 'August 2025',
      department: 'Engineering',
      position: 'Software Engineer',
      salary: '$7,500',
    },
    {
      id: 2,
      employee: 'Jane Doe',
      month: 'August 2025',
      department: 'Design',
      position: 'UI/UX Designer',
      salary: '$6,200',
    },
    {
      id: 3,
      employee: 'John Smith',
      month: 'July 2025',
      department: 'Engineering',
      position: 'Software Engineer',
      salary: '$7,500',
    },
  ];

  // Get unique employees and pay periods for dropdowns
  const employees = [...new Set(payslips.map((slip) => slip.employee))];
  const payPeriods = [...new Set(payslips.map((slip) => slip.month))];

  // Filter payslips based on selected employee and pay period
  const filteredPayslips = payslips.filter(
    (slip) =>
      (!selectedEmployee || slip.employee === selectedEmployee) &&
      (!selectedPeriod || slip.month === selectedPeriod)
  );

  // Handle preview modal
  const openPreview = () => setShowPreview(true);
  const closePreview = () => setShowPreview(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Payslips</h1>
          <p className="text-gray-500">Generate and manage employee payslips</p>
        </div>
        <button
          onClick={() => navigate('/admin/payslip/payslip-form')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          Generate Payslip
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Select Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">All Employees</option>
            {employees.map((employee) => (
              <option key={employee} value={employee}>
                {employee}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 mb-1">Select Pay Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Periods</option>
              {payPeriods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={openPreview}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition"
            disabled={filteredPayslips.length === 0}
          >
            Preview Payslip
          </button>
        </div>
      </div>

      {filteredPayslips.length === 0 ? (
        <p className="text-gray-500 text-center">No payslips found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPayslips.map((slip) => (
            <div
              key={slip.id}
              className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {slip.employee}
              </h2>
              <p className="text-gray-600 mb-1">
                <strong>Month:</strong> {slip.month}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Department:</strong> {slip.department}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>Position:</strong> {slip.position}
              </p>
              <p className="text-indigo-600 font-bold mt-2">{slip.salary}</p>
              <button
                onClick={() => navigate(`/payslip/${slip.id}`)}
                className="mt-4 w-full flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg transition"
              >
                <Eye size={18} className="mr-2" />
                View Payslip
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full relative">
            <button
              onClick={closePreview}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Payslip Preview
            </h2>
            {filteredPayslips.map((slip) => (
              <div key={slip.id} className="mb-4 border-b pb-4 last:border-b-0">
                <p className="text-gray-600 mb-2">
                  <strong>Employee:</strong> {slip.employee}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Month:</strong> {slip.month}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Department:</strong> {slip.department}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Position:</strong> {slip.position}
                </p>
                <p className="text-indigo-600 font-bold">
                  <strong>Salary:</strong> {slip.salary}
                </p>
              </div>
            ))}
            <button
              onClick={closePreview}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payslip;