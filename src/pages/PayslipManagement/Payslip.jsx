import React, { useState, useEffect, useMemo } from "react";
import { Eye, X, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { format, parse, startOfMonth } from "date-fns";
import {
  downloadPayslip,
  fetchPayslips,
  clearError,
} from "../../redux/slices/payslipSlice";
import { fetchEmployees } from "../../redux/slices/employeeSlice";
import {
  generatePayroll,
  generatePayrollForEmployee,
} from "../../redux/slices/payrollSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import PayslipGenerator from "./PaySlipGenerator";
import DatePicker from "../../Components/ui/date/DatePicker";

const Payslip = () => {
  const dispatch = useDispatch();

  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const { loading, error, payslips } = useSelector((state) => state.payslip);
  const { employees } = useSelector((state) => state.employee);
  const { loading: payrollLoading, error: payrollError } = useSelector((state) => state.payroll);

  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    role === "employee" && user?.employee_id ? user.employee_id : ""
  );
  const [showPreview, setShowPreview] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  // Fetch employees + payslips on load
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchEmployees());
      dispatch(fetchPayslips());
      dispatch(clearError());
    }
  }, [dispatch, isAuthenticated]);

  // Filter payslips based on role, employee, and month
  const filteredPayslips = useMemo(() => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    return (Array.isArray(payslips) ? payslips : [])
      .filter((slip) => {
        if (role === "employee" && slip.employee_id !== user?.employee_id)
          return false;
        return (
          (!selectedEmployeeId || slip.employee_id === selectedEmployeeId) &&
          slip.month === formattedMonth
        );
      })
      .map((slip) => ({
        ...slip,
        totalEarnings:
          parseFloat(slip.basic_salary || 0) +
          parseFloat(slip.hra || 0) +
          parseFloat(slip.da || 0) +
          parseFloat(slip.other_allowances || 0),
        totalDeductions:
          parseFloat(slip.pf_deduction || 0) +
          parseFloat(slip.esic_deduction || 0) +
          parseFloat(slip.tax_deduction || 0) +
          parseFloat(slip.professional_tax || 0),
        netPay: parseFloat(slip.net_salary || 0),
      }));
  }, [payslips, selectedMonth, selectedEmployeeId, role, user?.employee_id]);

  const openPreview = () => setShowPreview(true);
  const closePreview = () => setShowPreview(false);

  const handleDownload = () => {
    setDownloadError(null);
    if (!selectedEmployeeId || !selectedMonth) {
      setDownloadError("Please select both an employee and a month");
      return;
    }
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    console.log("Downloading payslip for:", { employeeId: selectedEmployeeId, month: formattedMonth });
    dispatch(
      downloadPayslip({ employeeId: selectedEmployeeId, month: formattedMonth })
    )
      .unwrap()
      .then(() => {
        console.log("Payslip downloaded successfully for:", selectedEmployeeId);
      })
      .catch((err) => setDownloadError(err || "Failed to download payslip"));
  };

  const handleGeneratePayroll = () => {
    setDownloadError(null);
    if (!selectedMonth) {
      setDownloadError("Please select a month");
      return;
    }
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    console.log("Generating payroll for:", { employeeId: selectedEmployeeId, month: formattedMonth });
    if (selectedEmployeeId) {
      dispatch(generatePayrollForEmployee({ employeeId: selectedEmployeeId, month: formattedMonth }))
        .unwrap()
        .then(() => dispatch(fetchPayslips()))
        .catch((err) => setDownloadError(err || "Failed to generate payroll"));
    } else {
      dispatch(generatePayroll({ month: formattedMonth }))
        .unwrap()
        .then(() => dispatch(fetchPayslips()))
        .catch((err) => setDownloadError(err || "Failed to generate payroll"));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-8 bg-slate-50 min-h-screen p-6">
        <p className="text-red-500">Please log in to view payslips.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-78/100 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <PageMeta
          title="Payslip Management"
          description="Manage, generate, and download employee payslips"
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/admin/dashboard" },
            { label: "Payslip", link: "/admin/payslip" },
          ]}
        />
      </div>

      <div className="space-y-8 bg-white rounded-2xl min-h-screen p-6 shadow-md">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Payslips</h1>
              <p className="text-slate-500 text-lg mt-1">
                View, generate, and download payslips
              </p>
            </div>
            <div className="flex gap-4">
              {["super_admin", "hr"].includes(role) && (
                <button
                  onClick={handleGeneratePayroll}
                  disabled={payrollLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg transition-transform duration-300 transform hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
                >
                  {payrollLoading ? (
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    </svg>
                  ) : (
                    <CheckCircle size={18} className="mr-2" />
                  )}
                  {payrollLoading ? "Generating..." : "Generate Payroll"}
                </button>
              )}
              <button
                onClick={handleDownload}
                disabled={loading || !selectedEmployeeId || !selectedMonth}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg transition-transform duration-300 transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center"
                aria-label="Download payslip PDF"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                ) : (
                  <Eye size={18} className="mr-2" />
                )}
                {loading ? "Downloading..." : "Download PDF"}
              </button>
            </div>
          </div>
          {(error || downloadError || payrollError) && (
            <p className="text-red-500 text-sm mt-2">
              {error || downloadError || payrollError}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {role !== "employee" && (
              <div>
                <label className="block text-slate-500 text-sm font-medium mb-1">
                  Select Employee
                </label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp, index) => (
                    <option key={`${emp.employee_id}-${index}`} value={emp.employee_id}>
                      {emp.full_name} ({emp.employee_id})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-slate-500 text-sm font-medium mb-1">
                Select Pay Period
              </label>
              <DatePicker
                name="monthPicker"
                value={selectedMonth}
                onChange={(date) => setSelectedMonth(startOfMonth(date))}
                maxDate={new Date()}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
            <p className="text-slate-500">Loading payslips...</p>
          </div>
        )}
        {!loading && filteredPayslips.length === 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-center">
            <p className="text-slate-500">
              No payslips found for {format(selectedMonth, "yyyy-MM")}.
            </p>
          </div>
        )}
        {!loading && filteredPayslips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPayslips.map((slip, index) => (
              <div
                key={`${slip.employee_id}-${slip.month}-${index}`}
                className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  {slip.employee}
                </h2>
                <p className="text-slate-500 text-sm">
                  <strong>Month:</strong> {slip.month}
                </p>
                <p className="text-slate-500 text-sm">
                  <strong>Department:</strong> {slip.department}
                </p>
                <p className="text-slate-500 text-sm">
                  <strong>Position:</strong> {slip.position}
                </p>
                <p className="text-teal-600 font-bold text-lg mt-2">
                  ₹{(slip.net_salary || 0).toLocaleString("en-IN")}
                </p>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => {
                      setSelectedEmployeeId(slip.employee_id);
                      setSelectedMonth(parse(slip.month, "yyyy-MM", new Date()));
                      openPreview();
                    }}
                    className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                  >
                    <Eye size={18} className="inline mr-2" />
                    View Payslip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border border-slate-200 p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto relative shadow-lg">
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Payslip Preview
              </h2>
              {filteredPayslips.length > 0 ? (
                <PayslipGenerator
                  key={`${filteredPayslips[0].employee_id}-${filteredPayslips[0].month}`}
                  employee={filteredPayslips[0]}
                  selectedMonth={filteredPayslips[0].month}
                  onClose={closePreview}
                />
              ) : (
                <p className="text-red-500">No payslip found for the selected employee and month.</p>
              )}
              <button
                onClick={closePreview}
                className="mt-4 w-full bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payslip;