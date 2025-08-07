import React from 'react';

const PayslipGenerator = ({ employee, selectedMonth }) => {
  // Calculate total deductions (including PF and taxes)
  const totalDeductions =
    (Object.values(employee.deductions || {}).reduce((a, b) => a + b, 0) || 0) +
    (Object.values(employee.tax || {}).reduce((a, b) => a + b, 0) || 0);

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Payslip</h2>
        <div className="mt-2 text-sm text-slate-500">
          <p className="font-medium text-slate-900">Acme Corp</p>
          <p>123 Business St, City, Country</p>
          <p>Month: {selectedMonth}</p>
        </div>
      </div>

      {/* Employee Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="font-medium text-slate-900">Employee: {employee.name}</p>
          <p className="text-slate-500 text-sm">ID: {employee.id}</p>
          <p className="text-slate-500 text-sm">Department: {employee.department}</p>
        </div>
        <div>
          <p className="text-slate-500 text-sm">Payment Method: {employee.paymentMethod}</p>
          {employee.paymentMethod === 'Direct Deposit' && (
            <>
              <p className="text-slate-500 text-sm">Bank: {employee.bankDetails?.bankName || '-'}</p>
              <p className="text-slate-500 text-sm">Account: {employee.bankDetails?.accountNumber || '-'}</p>
            </>
          )}
        </div>
      </div>

      {/* Deductions */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-2">Deductions</h3>
        <div className="space-y-1 text-sm">
          {employee.deductions && Object.entries(employee.deductions).length > 0 ? (
            Object.entries(employee.deductions).map(([key, value]) => (
              <div key={key} className="flex justify-between text-slate-500">
                <span>{key === 'pf' ? 'Provident Fund' : key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <span className="text-red-600">${value.toLocaleString()}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-500">No deductions available</div>
          )}
          {employee.tax && Object.entries(employee.tax).length > 0 ? (
            Object.entries(employee.tax).map(([key, value]) => (
              <div key={key} className="flex justify-between text-slate-500">
                <span>{key.charAt(0).toUpperCase() + key.slice(1)} Tax</span>
                <span className="text-red-600">${value.toLocaleString()}</span>
              </div>
            ))
          ) : (
            <div className="text-slate-500">No taxes available</div>
          )}
          <div className="flex justify-between font-semibold text-red-600 pt-2 border-t border-slate-200">
            <span>Total Deductions</span>
            <span>${totalDeductions.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-slate-200 pt-4">
        <div className="flex justify-between text-lg font-bold text-teal-600">
          <span>Net Salary</span>
          <span>${employee.netSalary?.toLocaleString() || '0'}</span>
        </div>
      </div>
    </div>
  );
};

export default PayslipGenerator;