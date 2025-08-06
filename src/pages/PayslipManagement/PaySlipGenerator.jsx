import React from 'react';

const PayslipGenerator = ({ employee, selectedMonth }) => {
  // Calculate total deductions (including PF and taxes)
  const totalDeductions = Object.values(employee.deductions).reduce((a, b) => a + b, 0) + 
                        Object.values(employee.tax).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 p-6 bg-white/90 rounded-xl border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Payslip</h2>
        <div className="mt-2 text-sm text-gray-600">
          <p className="font-semibold">Acme Corp</p>
          <p>123 Business St, City, Country</p>
          <p>Month: {selectedMonth}</p>
        </div>
      </div>

      {/* Employee Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="font-medium text-gray-900">Employee: {employee.name}</p>
          <p className="text-gray-600">ID: {employee.id}</p>
          <p className="text-gray-600">Department: {employee.department}</p>
        </div>
        <div>
          <p className="text-gray-600">Payment Method: {employee.paymentMethod}</p>
          {employee.paymentMethod === 'Direct Deposit' && (
            <>
              <p className="text-gray-600">Bank: {employee.bankDetails.bankName}</p>
              <p className="text-gray-600">Account: {employee.bankDetails.accountNumber}</p>
            </>
          )}
        </div>
      </div>

      {/* Deductions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-2">Deductions</h3>
        <div className="space-y-1 text-sm">
          {Object.entries(employee.deductions).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span>{key === 'pf' ? 'Provident Fund' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span>${value.toLocaleString()}</span>
            </div>
          ))}
          {Object.entries(employee.tax).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)} Tax</span>
              <span>${value.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold text-red-600">
            <span>Total Deductions</span>
            <span>${totalDeductions.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-between text-lg font-bold text-indigo-600">
          <span>Net Salary</span>
          <span>${employee.netSalary.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PayslipGenerator;