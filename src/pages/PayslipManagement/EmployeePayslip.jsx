import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Eye } from 'lucide-react';
import { fetchPayslips, downloadPayslip, clearError } from '../../redux/slices/payslipSlice';
import PageBreadcrumb from '../../Components/common/PageBreadcrumb';
import PageMeta from '../../Components/common/PageMeta';


const EmployeePayslip = () => {
  const dispatch = useDispatch();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const { loading, error, payslips } = useSelector((state) => state.payslip);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    role === 'employee' && user?.employee_id ? user.employee_id : ''
  );
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch payslips on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPayslips());
      dispatch(clearError());
    }
  }, [dispatch, isAuthenticated]);

  // Filter payslips based on user role and selected month
  const filteredPayslips = useMemo(() => {
    return (Array.isArray(payslips) ? payslips : [])
      .filter((slip) => {
        // Employees can only see their own payslips
        if (role === 'employee' && slip.employee_id !== user?.employee_id) return false;
        // Filter by selected employee and month, and only show approved payslips
        return (
          (!selectedEmployeeId || slip.employee_id === selectedEmployeeId) &&
          (!selectedMonth || slip.month === selectedMonth) &&
          slip.status === 'Approved'
        );
      })
      .map((slip) => ({
        ...slip,
        totalEarnings: slip.basic_salary + slip.hra + slip.da + slip.other_allowances,
        totalDeductions:
          slip.pf_deduction + slip.esic_deduction + slip.tax_deduction + slip.professional_tax,
        netPay: slip.net_salary,
      }))
      .sort((a, b) => new Date(b.month + '-01') - new Date(a.month + '-01')); // Sort by month descending
  }, [payslips, selectedMonth, selectedEmployeeId, role, user]);

  // Get unique months for dropdown
  const payPeriods = useMemo(() => {
    return [...new Set(payslips.map((slip) => slip.month))].sort(
      (a, b) => new Date(b + '-01') - new Date(a + '-01')
    );
  }, [payslips]);

  // Get employees for HR/admin view
  const employees = useMemo(() => {
    return [...new Set(payslips.map((slip) => ({
      employee_id: slip.employee_id,
      employee_name: slip.employee,
    })))];
  }, [payslips]);

  const handlePreview = () => {
    setShowPreview(true);
    setDownloadError(null);
  };

  const handleDownload = async () => {
    if (!selectedEmployeeId || !selectedMonth) {
      setDownloadError('Please select both an employee and a month');
      return;
    }

    const slip = filteredPayslips.find(
      (slip) => slip.employee_id === selectedEmployeeId && slip.month === selectedMonth
    );
    if (!slip) {
      setDownloadError('No approved payslip found for the selected employee and month');
      return;
    }

    setIsLoadingDownload(true);
    setDownloadError(null);
    try {
      await dispatch(downloadPayslip({ employeeId: selectedEmployeeId, month: selectedMonth })).unwrap();
    } catch (err) {
      setDownloadError(err || 'Failed to download payslip');
      console.error('Download error:', err);
    } finally {
      setIsLoadingDownload(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <p className="text-red-500">Please log in to view payslips.</p>
      </div>
    );
  }

  return (
    <div className="w-78/100">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/emp-dashboard" },
            { label: "Payslip Management", link: "/employee-payslip" },
          ]}
        />
      </div>
    <div className="p-6 bg-white shadow-md rounded-2xl">
      <h2 className="text-xl font-bold mb-4">Payslip Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {role !== 'employee' && (
          <div>
            <label htmlFor="employee-select" className="block mb-2 font-medium">
              Select Employee
            </label>
            <select
              id="employee-select"
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="border px-3 py-2 rounded w-full"
              aria-label="Select employee"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.employee_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label htmlFor="month-select" className="block mb-2 font-medium">
            Select Month
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border-1 border-slate-400 px-3 py-2 rounded-md w-full"
            aria-label="Select pay period"
          >
            <option value="">Select Month</option>
            {payPeriods.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={handlePreview}
          disabled={!selectedMonth || !selectedEmployeeId || loading}
          className="bg-teal-700 text-white px-4 py-2 rounded disabled:cursor-not-allowed"
          aria-label="Preview payslips for selected employee and month"
        >
          Preview
        </button>
        <button
          onClick={handleDownload}
          disabled={isLoadingDownload || !selectedMonth || !selectedEmployeeId}
          className={`bg-slate-700 text-white px-4 py-2 rounded${
            isLoadingDownload ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Download payslip as PDF"
        >
          {isLoadingDownload ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <Eye size={18} className="mr-2 inline" />
              Download PDF
            </>
          )}
        </button>
      </div>

      {(error || downloadError) && (
        <p className="text-red-500 mb-4">{error || downloadError}</p>
      )}

      {showPreview && filteredPayslips.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-2">Payslip Preview</h3>
          {filteredPayslips
            .filter((slip) => slip.employee_id === selectedEmployeeId && slip.month === selectedMonth)
            .map((payslip) => (
              <div
                key={`${payslip.employee_id}-${payslip.month}`}
                className="bg-gray-50 p-4 rounded shadow mb-4"
              >
                <h4 className="text-md font-bold">{payslip.month}</h4>
                <p><strong>Employee Name:</strong> {payslip.employee}</p>
                <p><strong>Employee ID:</strong> {payslip.employee_id}</p>
                <p><strong>Department:</strong> {payslip.department}</p>
                <p><strong>Position:</strong> {payslip.position}</p>
                <hr className="my-3" />
                <p><strong>Basic:</strong> ₹{payslip.basic_salary.toLocaleString('en-IN')}</p>
                <p><strong>HRA:</strong> ₹{payslip.hra.toLocaleString('en-IN')}</p>
                <p><strong>DA:</strong> ₹{payslip.da.toLocaleString('en-IN')}</p>
                <p><strong>Other Allowances:</strong> ₹{payslip.other_allowances.toLocaleString('en-IN')}</p>
                <p><strong>Total Earnings:</strong> ₹{payslip.totalEarnings.toLocaleString('en-IN')}</p>
                <hr className="my-3" />
                <p><strong>PF:</strong> ₹{payslip.pf_deduction.toLocaleString('en-IN')}</p>
                <p><strong>ESIC:</strong> ₹{payslip.esic_deduction.toLocaleString('en-IN')}</p>
                <p><strong>Professional Tax:</strong> ₹{payslip.professional_tax.toLocaleString('en-IN')}</p>
                <p><strong>Income Tax:</strong> ₹{payslip.tax_deduction.toLocaleString('en-IN')}</p>
                <p><strong>Total Deductions:</strong> ₹{payslip.totalDeductions.toLocaleString('en-IN')}</p>
                <hr className="my-3" />
                <p className="text-lg font-semibold">
                  Net Pay: ₹{payslip.netPay.toLocaleString('en-IN')}
                </p>
                <p><strong>Status:</strong> {payslip.status}</p>
                <p><strong>Payment Method:</strong> {payslip.payment_method}</p>
                <p><strong>Payment Date:</strong> {new Date(payslip.payment_date).toLocaleDateString('en-IN')}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Note: This payslip is subject to statutory compliance as per Indian laws.
                </p>
              </div>
            ))}
        </div>
      ) : showPreview && filteredPayslips.length === 0 ? (
        <p className="text-red-500 mt-4">No approved payslips available for the selected employee and month.</p>
      ) : null}
    </div>
    </div>
  );
};

export default EmployeePayslip;