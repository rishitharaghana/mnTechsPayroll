import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../../Components/common/PageBreadcrumb';
import PageMeta from '../../Components/common/PageMeta';

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
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">
      <div className="flex justify-end">
        <PageMeta title="Payslip Management" description="Manage and generate employee payslips" />
        <PageBreadcrumb
          items={[
            { label: 'Home', link: '/' },
            { label: 'Payslip', link: '/admin/payslip' },
          ]}
        />
      </div>
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Payslips</h1>
            <p className="text-slate-500 text-lg mt-1">Generate and manage employee payslips</p>
          </div>
          <button
            onClick={() => navigate('/admin/payslip/payslip-form')}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105"
          >
            Generate Payslip
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 text-sm font-medium mb-1">Select Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
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
              <label className="block text-slate-500 text-sm font-medium mb-1">Select Pay Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
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
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-transform duration-300 transform hover:scale-105 disabled:bg-slate-300 disabled:cursor-not-allowed"
              disabled={filteredPayslips.length === 0}
            >
              Preview Payslip
            </button>
          </div>
        </div>
      </div>

      {/* Payslip Cards */}
      {filteredPayslips.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm text-center">
          <p className="text-slate-500">No payslips found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPayslips.map((slip) => (
            <div
              key={slip.id}
              className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{slip.employee}</h2>
              <p className="text-slate-500 text-sm mb-1">
                <strong>Month:</strong> {slip.month}
              </p>
              <p className="text-slate-500 text-sm mb-1">
                <strong>Department:</strong> {slip.department}
              </p>
              <p className="text-slate-500 text-sm mb-1">
                <strong>Position:</strong> {slip.position}
              </p>
              <p className="text-teal-600 font-bold text-lg mt-2">{slip.salary}</p>
              <button
                onClick={() => navigate(`/payslip/${slip.id}`)}
                className="mt-4 w-full flex items-center justify-center bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105"
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
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Payslip Preview</h2>
            {filteredPayslips.map((slip) => (
              <div key={slip.id} className="mb-4 border-b border-slate-200 pb-4 last:border-b-0">
                <p className="text-slate-500 text-sm mb-2">
                  <strong>Employee:</strong> {slip.employee}
                </p>
                <p className="text-slate-500 text-sm mb-2">
                  <strong>Month:</strong> {slip.month}
                </p>
                <p className="text-slate-500 text-sm mb-2">
                  <strong>Department:</strong> {slip.department}
                </p>
                <p className="text-slate-500 text-sm mb-2">
                  <strong>Position:</strong> {slip.position}
                </p>
                <p className="text-teal-600 font-bold text-sm">
                  <strong>Salary:</strong> {slip.salary}
                </p>
              </div>
            ))}
            <button
              onClick={closePreview}
              className="w-full bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-transform duration-300 transform hover:scale-105"
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