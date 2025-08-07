import React, { useState } from 'react';
import {
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Calculator,
  FileSpreadsheet,
} from 'lucide-react';
import PayslipGenerator from '../PayslipManagement/PaySlipGenerator';
import PageMeta from '../../Components/common/PageMeta';
import PageBreadcrumb from '../../Components/common/PageBreadcrumb';

const Payroll = ({ employees = [] }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [filters, setFilters] = useState({ search: '', department: '', status: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payrollData, setPayrollData] = useState(employees.length > 0 ? employees : [
    {
      id: 'EMP001', name: 'John Smith', department: 'Engineering',
      grossSalary: 75000, deductions: { pf: 1200 },
      netSalary: 73800, paidLeave: 2, unpaidLeave: 0,
      paymentMethod: 'Direct Deposit', bankDetails: { accountNumber: 'XXXX1234', bankName: 'Bank of America' },
      status: 'Processed'
    },
    {
      id: 'EMP002', name: 'Sarah Wilson', department: 'Marketing',
      grossSalary: 65000, deductions: { pf: 1000 },
      netSalary: 64000, paidLeave: 1, unpaidLeave: 1,
      paymentMethod: 'Check', bankDetails: {}, status: 'Processed'
    },
    {
      id: 'EMP003', name: 'Mike Johnson', department: 'Design',
      grossSalary: 50000, deductions: { pf: 800 },
      netSalary: 49200, paidLeave: 0, unpaidLeave: 2,
      paymentMethod: 'Direct Deposit', bankDetails: { accountNumber: 'XXXX5678', bankName: 'Chase' },
      status: 'Pending'
    }
  ]);
  const itemsPerPage = 5;

  const summaryStats = [
    { title: 'Total Payroll', value: '$159,400', change: '+5.2%', icon: DollarSign, color: 'bg-teal-600' },
    { title: 'Employees Paid', value: '248', change: '+2', icon: Users, color: 'bg-slate-700' },
    { title: 'Avg. Gross Salary', value: '$4,830', change: '+3.1%', icon: TrendingUp, color: 'bg-teal-600' },
    { title: 'Total PF Deductions', value: '$42,000', change: '-1.2%', icon: Calculator, color: 'bg-slate-700' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  // Filtering and sorting logic
  const filteredData = payrollData
    .filter((emp) =>
      emp.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (!filters.department || emp.department === filters.department) &&
      (!filters.status || emp.status === filters.status)
    )
    .sort((a, b) => {
      if (sortConfig.key) {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        return sortConfig.direction === 'asc'
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1;
      }
      return 0;
    });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = ['ID,Name,Department,Gross Salary,PF Deduction,Net Salary,Status'];
    const rows = paginatedData.map(emp =>
      `${emp.id},${emp.name},${emp.department},${emp.grossSalary},${emp.deductions.pf},${emp.netSalary},${emp.status}`
    );
    const csvContent = [...headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Payroll_${selectedMonth}.csv`;
    link.click();
  };

  const handleProcessPayroll = () => {
    alert(`Processing payroll for ${selectedMonth}...`);
  };

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-end">
        <PageMeta title="Payroll Management" description="Manage employee payroll and deductions." />
        <PageBreadcrumb
          items={[
            { label: 'Home', link: '/' },
            { label: 'Payroll', link: '/admin/payroll' },
          ]}
        />
      </div>
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Payroll Management</h1>
            <p className="text-slate-500 text-lg mt-1">Manage employee deductions and payroll processing</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-slate-400" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
            <button
              onClick={handleProcessPayroll}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105"
            >
              Process Payroll
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map(({ title, value, change, icon: Icon, color }, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                <Icon className="text-white" size={24} />
              </div>
              <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                {change}
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            name="search"
            placeholder="Search by name..."
            value={filters.search}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Design">Design</option>
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <option value="">All Statuses</option>
            <option value="Processed">Processed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center flex-wrap gap-4 p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Monthly Payroll Details</h2>
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-transform duration-300 transform hover:scale-105"
          >
            <FileSpreadsheet size={16} /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {["Employee", "Gross Salary", "PF Deduction", "Net Salary", "Status", "Actions"].map((col, idx) => (
                  <th
                    key={idx}
                    onClick={() => col === "Employee" ? handleSort('name') : col === "Gross Salary" ? handleSort('grossSalary') : col === "Net Salary" ? handleSort('netSalary') : null}
                    className={`px-6 py-4 text-left font-medium text-slate-500 uppercase tracking-wider ${['Employee', 'Gross Salary', 'Net Salary'].includes(col) ? 'cursor-pointer hover:text-slate-700' : ''}`}
                  >
                    {col} {sortConfig.key === (col === "Employee" ? 'name' : col === "Gross Salary" ? 'grossSalary' : 'netSalary') && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedData.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{emp.name}</div>
                    <div className="text-slate-500 text-xs">{emp.id} • {emp.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">${emp.grossSalary.toLocaleString()}</div>
                    <div className="text-slate-500 text-xs">Base</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-red-600 font-medium">${emp.deductions.pf.toLocaleString()}</div>
                    <div className="text-slate-500 text-xs">Provident Fund</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-teal-600">${emp.netSalary.toLocaleString()}</div>
                    <div className="text-slate-500 text-xs">Take-home</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(emp.status)}`}>{emp.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="text-teal-600 hover:text-teal-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                      View Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center p-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-transform duration-300 transform hover:scale-105"
          >
            Previous
          </button>
          <span className="text-slate-500">Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-transform duration-300 transform hover:scale-105"
          >
            Next
          </button>
        </div>
      </div>

      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <PayslipGenerator employee={selectedEmployee} selectedMonth={selectedMonth} />
            <button
              onClick={() => setSelectedEmployee(null)}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full transition-transform duration-300 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;