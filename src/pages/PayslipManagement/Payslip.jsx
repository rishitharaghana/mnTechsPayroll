import React, { useState } from 'react';
import { FileText, Download, Eye, Building, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const Payslip = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('EMP001');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showPreview, setShowPreview] = useState(false);

  const employees = [
    { id: 'EMP001', name: 'John Smith', position: 'Senior Developer', department: 'Engineering' },
    { id: 'EMP002', name: 'Sarah Wilson', position: 'Marketing Manager', department: 'Marketing' },
    { id: 'EMP003', name: 'Mike Johnson', position: 'UI Designer', department: 'Design' },
  ];

  const companyInfo = {
    name: 'TechCorp Solutions',
    address: '123 Business Avenue, Tech City, TC 12345',
    phone: '+1 (555) 123-4567',
    email: 'hr@techcorp.com',
    logo: '🏢' // Using emoji as placeholder for logo
  };

  const payslipData = {
    'EMP001': {
      basicSalary: 75000,
      allowances: 5000,
      bonus: 2000,
      overtime: 1500,
      healthInsurance: 800,
      retirementFund: 400,
      incomeTax: 18000,
      socialSecurity: 1200,
      paidLeave: 2,
      unpaidLeave: 0,
      workingDays: 22,
      expenses: 300
    },
    'EMP002': {
      basicSalary: 65000,
      allowances: 4000,
      bonus: 1500,
      overtime: 800,
      healthInsurance: 700,
      retirementFund: 350,
      incomeTax: 15000,
      socialSecurity: 1000,
      paidLeave: 1,
      unpaidLeave: 1,
      workingDays: 21,
      expenses: 250
    },
    'EMP003': {
      basicSalary: 45000,
      allowances: 3000,
      bonus: 1000,
      overtime: 600,
      healthInsurance: 600,
      retirementFund: 300,
      incomeTax: 9000,
      socialSecurity: 800,
      paidLeave: 0,
      unpaidLeave: 2,
      workingDays: 20,
      expenses: 200
    }
  };

  const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployee);
  const payData = payslipData[selectedEmployee];

  const calculateGrossSalary = () => {
    return payData.basicSalary + payData.allowances + payData.bonus + payData.overtime;
  };

  const calculateTotalDeductions = () => {
    return payData.healthInsurance + payData.retirementFund + payData.incomeTax + payData.socialSecurity;
  };

  const calculateNetSalary = () => {
    return calculateGrossSalary() - calculateTotalDeductions();
  };

  const generatePayslip = () => {
    setShowPreview(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Payslip Generator
        </h1>
        <p className="text-gray-600 mt-1">Generate and download employee payslips with company branding</p>
      </div>

      {/* Controls */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.id})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pay Period</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={generatePayslip}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Eye size={20} />
              <span>Preview Payslip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="text-white" size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Generate Single</h3>
          <p className="text-gray-600 text-sm">Create payslip for individual employee</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="text-white" size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Bulk Generate</h3>
          <p className="text-gray-600 text-sm">Create payslips for all employees</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Download className="text-white" size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Download Archive</h3>
          <p className="text-gray-600 text-sm">Download all payslips as ZIP</p>
        </div>
      </div>

      {/* Payslip Preview */}
      {showPreview && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Payslip Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">{companyInfo.logo}</div>
                <div>
                  <h2 className="text-2xl font-bold">{companyInfo.name}</h2>
                  <div className="flex items-center space-x-2 mt-2 opacity-90">
                    <MapPin size={16} />
                    <span className="text-sm">{companyInfo.address}</span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 opacity-90">
                    <div className="flex items-center space-x-1">
                      <Phone size={14} />
                      <span className="text-sm">{companyInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Mail size={14} />
                      <span className="text-sm">{companyInfo.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">PAYSLIP</div>
                <div className="flex items-center space-x-1 mt-2 opacity-90">
                  <Calendar size={16} />
                  <span>{new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Info */}
          <div className="p-8 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Employee Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedEmployeeData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employee ID:</span>
                    <span className="font-medium">{selectedEmployee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Position:</span>
                    <span className="font-medium">{selectedEmployeeData?.position}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">{selectedEmployeeData?.department}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Pay Period Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pay Period:</span>
                    <span className="font-medium">{new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Working Days:</span>
                    <span className="font-medium">{payData.workingDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paid Leave:</span>
                    <span className="font-medium">{payData.paidLeave} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Unpaid Leave:</span>
                    <span className="font-medium">{payData.unpaidLeave} days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Earnings and Deductions */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Earnings */}
              <div>
                <h3 className="text-lg font-bold text-green-600 mb-4">Earnings</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Basic Salary</span>
                    <span className="font-medium">${payData.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Allowances</span>
                    <span className="font-medium">${payData.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Bonus</span>
                    <span className="font-medium">${payData.bonus.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Overtime</span>
                    <span className="font-medium">${payData.overtime.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Expenses</span>
                    <span className="font-medium">${payData.expenses.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold text-green-600">
                      <span>Gross Salary</span>
                      <span>${calculateGrossSalary().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="text-lg font-bold text-red-600 mb-4">Deductions</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Health Insurance</span>
                    <span className="font-medium">${payData.healthInsurance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Retirement Fund</span>
                    <span className="font-medium">${payData.retirementFund.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Income Tax</span>
                    <span className="font-medium">${payData.incomeTax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Social Security</span>
                    <span className="font-medium">${payData.socialSecurity.toLocaleString()}</span>
                  </div>
                  <div className="py-2">
                    <span className="text-gray-600"></span>
                    <span className="font-medium"></span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold text-red-600">
                      <span>Total Deductions</span>
                      <span>${calculateTotalDeductions().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Net Salary (Take Home)</span>
                <span className="text-3xl font-bold text-indigo-600">${calculateNetSalary().toLocaleString()}</span>
              </div>
            </div>

            {/* Download Button */}
            <div className="mt-8 flex justify-center">
              <button className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
                <Download size={20} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payslip;