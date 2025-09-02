import React, { useState, useEffect, useMemo } from "react";
import { Eye, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { format, parse, startOfMonth } from "date-fns";
import {
  downloadPayslip,
  fetchPayslips,
  clearError,
} from "../../redux/slices/payslipSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import PayslipGenerator from "./PaySlipGenerator";
import DatePicker from "../../Components/ui/date/DatePicker";

const Payslip = () => {
  const dispatch = useDispatch();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const { loading, error, payslips } = useSelector((state) => state.payslip);
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    role === "employee" && user?.employee_id ? user.employee_id : ""
  );
  const [showPreview, setShowPreview] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  // Fetch payslips on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPayslips());
      dispatch(clearError());
    }
  }, [dispatch, isAuthenticated]);

  // Filter payslips based on role, employee, and month
  const filteredPayslips = useMemo(() => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    return (Array.isArray(payslips) ? payslips : [])
      .filter((slip) => {
        // Employees can only see their own payslips
        if (role === "employee" && slip.employee_id !== user?.employee_id)
          return false;
        // Filter by selected employee and month, and only show approved payslips
        return (
          (!selectedEmployeeId || slip.employee_id === selectedEmployeeId) &&
          slip.month === formattedMonth &&
          slip.status === "Approved"
        );
      })
      .map((slip) => ({
        ...slip,
        totalEarnings:
          slip.basic_salary + slip.hra + slip.da + slip.other_allowances,
        totalDeductions:
          slip.pf_deduction +
          slip.esic_deduction +
          slip.tax_deduction +
          slip.professional_tax,
        netPay: slip.net_salary,
      }));
  }, [payslips, selectedMonth, selectedEmployeeId, role, user]);

  // Get unique employees and months
  const employees = useMemo(() => {
    return [
      ...new Set(
        payslips.map((slip) => ({
          employee_id: slip.employee_id,
          employee_name: slip.employee,
        }))
      ),
    ];
  }, [payslips]);

  const payPeriods = useMemo(() => {
    return [...new Set(payslips.map((slip) => slip.month))].sort(
      (a, b) => new Date(b + "-01") - new Date(a + "-01")
    );
  }, [payslips]);

  const openPreview = () => setShowPreview(true);
  const closePreview = () => setShowPreview(false);

  const handleDownload = () => {
    setDownloadError(null);
    if (!selectedEmployeeId || !selectedMonth) {
      setDownloadError("Please select both an employee and a month");
      return;
    }

    const formattedMonth = format(selectedMonth, "yyyy-MM");
    const slip = filteredPayslips.find(
      (slip) =>
        slip.employee_id === selectedEmployeeId && slip.month === formattedMonth
    );
    if (!slip) {
      setDownloadError(
        "No approved payslip found for the selected employee and month"
      );
      return;
    }

    dispatch(
      downloadPayslip({ employeeId: selectedEmployeeId, month: formattedMonth })
    )
      .unwrap()
      .catch((err) => setDownloadError(err || "Failed to download payslip"));
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-8 bg-slate-50 min-h-screen p-6">
        <p className="text-red-500">Please log in to view payslips.</p>
      </div>
    );
  }

  return (
    <div className="w-78/100">
      <div className="flex justify-end">
        <PageMeta
          title="Payslip Management"
          description="Manage and generate employee payslips"
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Payslip", link: "/payslip" },
          ]}
        />
      </div>
      <div className="space-y-8 bg-white rounded-2xl min-h-screen p-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Payslips</h1>
              <p className="text-slate-500 text-lg mt-1">
                View and download your payslips
              </p>
            </div>
            <button
              onClick={handleDownload}
              disabled={loading || !selectedEmployeeId || !selectedMonth}
              className="px-6 py-3 bg-slate-700 text-white rounded-lg transition-transform duration-300 transform hover:scale-105 disabled:bg-teal-700 disabled:cursor-not-allowed"
              aria-label="Download payslip PDF"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 inline"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
              ) : (
                <Eye size={18} className="mr-2" />
              )}
              {loading ? "Downloading..." : "Download PDF"}
            </button>
          </div>
          {(error || downloadError) && (
            <p className="text-red-500 text-sm mt-2">
              {error || downloadError}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
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
              <label className="block text-slate-500 text-sm font-medium mb-1">
                Select Pay Period
              </label>
              <DatePicker
                name="monthPicker"
                value={selectedMonth}
                onChange={(date) => setSelectedMonth(startOfMonth(date))}
                maxDate={new Date()}
                titleClassName="text-slate-500 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Payslip List */}
        {loading && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm text-center">
            <p className="text-slate-500">Loading payslips...</p>
          </div>
        )}
        {!loading && filteredPayslips.length === 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm text-center">
            <p className="text-slate-500">
              No approved payslips found for {format(selectedMonth, "yyyy-MM")}.
            </p>
          </div>
        )}
        {!loading && filteredPayslips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPayslips.map((slip) => (
              <div
                key={slip.employee_id + slip.month}
                className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  {slip.employee}
                </h2>
                <p className="text-slate-500 text-sm mb-1">
                  <strong>Month:</strong> {slip.month}
                </p>
                <p className="text-slate-500 text-sm mb-1">
                  <strong>Department:</strong> {slip.department}
                </p>
                <p className="text-slate-500 text-sm mb-1">
                  <strong>Position:</strong> {slip.position}
                </p>
                <p className="text-teal-600 font-bold text-lg mt-2">
                  ₹{(slip.net_salary || 0).toLocaleString("en-IN")}
                </p>
                <button
                  onClick={() => {
                    setSelectedEmployeeId(slip.employee_id);
                    setSelectedMonth(parse(slip.month, "yyyy-MM", new Date()));
                    openPreview();
                  }}
                  className="mt-4 w-full flex items-center justify-center bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105"
                  aria-label={`View payslip for ${slip.employee} ${slip.month}`}
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
                aria-label="Close preview"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Payslip Preview
              </h2>
              {filteredPayslips
                .filter(
                  (slip) =>
                    slip.employee_id === selectedEmployeeId &&
                    slip.month === format(selectedMonth, "yyyy-MM")
                )
                .map((slip) => (
                  <PayslipGenerator
                    key={slip.employee_id + slip.month}
                    employee={slip}
                    selectedMonth={slip.month}
                  />
                ))}
              <button
                onClick={closePreview}
                className="w-full bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-transform duration-300 transform hover:scale-105"
                aria-label="Close preview"
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
