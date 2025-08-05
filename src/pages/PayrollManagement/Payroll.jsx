import React, { useState } from 'react';
import {
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Calculator,
  FileSpreadsheet
} from 'lucide-react';

const Payroll = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const payrollData = [
    {
      id: 'EMP001', name: 'John Smith', department: 'Engineering',
      basicSalary: 75000, allowances: 5000, bonus: 2000, overtime: 1500,
      deductions: 1200, tax: 18000, grossSalary: 83500, netSalary: 64300,
      paidLeave: 2, unpaidLeave: 0, workingDays: 22, status: 'Processed'
    },
    {
      id: 'EMP002', name: 'Sarah Wilson', department: 'Marketing',
      basicSalary: 65000, allowances: 4000, bonus: 1500, overtime: 800,
      deductions: 1000, tax: 15000, grossSalary: 71300, netSalary: 55300,
      paidLeave: 1, unpaidLeave: 1, workingDays: 21, status: 'Processed'
    },
    {
      id: 'EMP003', name: 'Mike Johnson', department: 'Design',
      basicSalary: 45000, allowances: 3000, bonus: 1000, overtime: 600,
      deductions: 800, tax: 9000, grossSalary: 49600, netSalary: 39800,
      paidLeave: 0, unpaidLeave: 2, workingDays: 20, status: 'Pending'
    }
  ];

  const summaryStats = [
    { title: 'Total Payroll', value: '$159,400', change: '+5.2%', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { title: 'Employees Paid', value: '248', change: '+2', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { title: 'Avg. Salary', value: '$4,830', change: '+3.1%', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { title: 'Total Deductions', value: '$42,000', change: '-1.2%', icon: Calculator, color: 'from-orange-500 to-red-500' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderProgress = (label, value, width, color) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-600">
        <span>{label}</span><span className="font-semibold text-gray-900">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full bg-gradient-to-r ${color}`} style={{ width }}></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Payroll Management</h1>
          <p className="text-gray-600 mt-1">Manage employee salaries, deductions, and payroll processing</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 bg-white/70 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all">Process Payroll</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map(({ title, value, change, icon: Icon, color }, idx) => (
          <div key={idx} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl">
            <div className="flex justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="text-white" size={24} />
              </div>
              <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{change}</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-xl font-bold text-gray-900">Monthly Payroll Details</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg">
              <FileSpreadsheet size={16} /> Export Excel
            </button>
            <button className="px-4 py-2 bg-white/50 border border-gray-200 rounded-xl hover:bg-white/70">Filter</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50">
              <tr>
                {["Employee", "Basic Salary", "Gross Salary", "Deductions", "Tax", "Net Salary", "Leave", "Status"].map((col, idx) => (
                  <th key={idx} className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payrollData.map((emp) => (
                <tr key={emp.id} className="hover:bg-white/30">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{emp.name}</div>
                    <div className="text-gray-500">{emp.id} • {emp.department}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">${emp.basicSalary.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">Monthly</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-green-600 font-medium">${emp.grossSalary.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">+${emp.allowances + emp.bonus + emp.overtime} (extras)</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-red-600 font-medium">${emp.deductions.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">Various deductions</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-orange-600 font-medium">${emp.tax.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">Income tax</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-indigo-600">${emp.netSalary.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">Take-home</div>
                  </td>
                  <td className="px-6 py-4 text-xs space-y-1">
                    <div className="text-green-600">Paid: {emp.paidLeave} days</div>
                    <div className="text-red-600">Unpaid: {emp.unpaidLeave} days</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(emp.status)}`}>{emp.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Salary Breakdown</h2>
          {renderProgress("Basic Salaries", "$185,000", "60%", "from-blue-500 to-cyan-500")}
          {renderProgress("Allowances", "$12,000", "20%", "from-green-500 to-emerald-500")}
          {renderProgress("Bonuses", "$4,500", "15%", "from-purple-500 to-pink-500")}
          {renderProgress("Overtime", "$2,900", "10%", "from-orange-500 to-red-500")}
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Deductions Overview</h2>
          {renderProgress("Income Tax", "$42,000", "70%", "from-red-500 to-pink-500")}
          {renderProgress("Insurance", "$8,000", "20%", "from-orange-500 to-red-500")}
          {renderProgress("Retirement Fund", "$6,000", "15%", "from-yellow-500 to-orange-500")}
          {renderProgress("Other Deductions", "$3,000", "10%", "from-gray-500 to-gray-600")}
        </div>
      </div>
    </div>
  );
};
  
export default Payroll;

