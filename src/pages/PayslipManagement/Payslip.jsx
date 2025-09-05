import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { Eye, X } from "lucide-react";
import {
  downloadPayslip,
  fetchPayslips,
  clearError,
} from "../../redux/slices/payslipSlice";
import { fetchEmployees, fetchDepartments } from "../../redux/slices/employeeSlice";
import {
  generatePayroll,
  generatePayrollForEmployee,
} from "../../redux/slices/payrollSlice";
import { toast } from "react-toastify";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PayslipGenerator from "./PayslipGenerator";

const Payslip = () => {
  const dispatch = useDispatch();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const { payslips = [], totalRecords = 0, loading, error } = useSelector((state) => state.payslip);
  const { employees, departments, loading: employeesLoading, error: employeesError } = useSelector(
    (state) => state.employee
  );
  const { loading: payrollLoading, error: payrollError } = useSelector((state) => state.payroll);

  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [paymentDate, setPaymentDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    role === "employee" && user?.employee_id ? user.employee_id : ""
  );
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [showPreview, setShowPreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchEmployees());
      dispatch(fetchDepartments());
      dispatch(fetchPayslips({ month: selectedMonth, page: currentPage, limit: itemsPerPage }));
      dispatch(clearError());
    }
  }, [dispatch, isAuthenticated, selectedMonth, currentPage]);

  const filteredPayslips = useMemo(() => {
    return (Array.isArray(payslips) ? payslips : [])
      .filter((slip) => {
        if (role === "employee" && slip.employee_id !== user?.employee_id) return false;
        return (
          (!selectedEmployeeId || slip.employee_id === selectedEmployeeId) &&
          (!selectedDepartment || slip.department === selectedDepartment) &&
          slip.month === selectedMonth
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
  }, [payslips, selectedMonth, selectedEmployeeId, selectedDepartment, role, user?.employee_id]);

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const handleGeneratePayroll = async () => {
    if (!selectedMonth || !paymentDate) {
      toast.error("Please select both a month and payment date.");
      return;
    }
    const action = selectedEmployeeId
      ? generatePayrollForEmployee({ employeeId: selectedEmployeeId, month: selectedMonth, paymentDate })
      : generatePayroll({ month: selectedMonth, paymentDate });

    try {
      await dispatch(action).unwrap();
      dispatch(fetchPayslips({ month: selectedMonth, page: 1, limit: itemsPerPage }));
      toast.success(`Payroll generated successfully for ${selectedEmployeeId || "all employees"}`);
      setCurrentPage(1);
    } catch (err) {
      toast.error(err?.error || "Failed to generate payroll");
    }
  };

  const handleDownloadPayslip = async (employeeId) => {
    if (!selectedMonth || !employeeId) {
      toast.error("Please select a month and an employee.");
      return;
    }
    try {
      await dispatch(downloadPayslip({ employeeId, month: selectedMonth, paymentDate })).unwrap();
      toast.success("Payslip downloaded successfully");
    } catch (err) {
      const errorMessage =
        err?.error === "No payroll record found"
          ? "No payroll record found. Please generate payroll first."
          : err?.error || "Failed to download payslip";
      toast.error(errorMessage);
    }
  };

  const handleViewPayslip = (slip) => {
    setShowPreview(slip);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6">
          <p className="text-red-600 font-semibold">Please log in to view payslips.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-78/100 bg-gray-100 p-6">
      <div className="">
        <PageMeta
          title="Payslip Management"
          description="View, generate, and download employee payslips."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Payslip Management", link: "/admin/payslip" },
          ]}
        />

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Payslip Management</h1>
          <p className="text-gray-600 mt-2">
            View, generate, and download payslips for employees.
          </p>
        </div>

        {/* Notifications */}
        {(error || payrollError || employeesError) && (
          <div className="p-4 rounded-lg mb-6 bg-red-50 text-red-700">
            {error || payrollError || employeesError}
          </div>
        )}

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {role !== "employee" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Employee</label>
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  disabled={employeesLoading || employees.length === 0}
                >
                  <option value="">All Employees</option>
                  {employees.map((employee) => (
                    <option key={employee.employee_id} value={employee.employee_id}>
                      {employee.full_name} ({employee.employee_id})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Pay Period</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                max={format(new Date(), "yyyy-MM")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
              />
            </div>
            {role !== "employee" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  disabled={employeesLoading || departments.length === 0}
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Actions Section */}
        {["hr", "super_admin"].includes(role) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleGeneratePayroll}
                disabled={loading || payrollLoading || employeesLoading}
                className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Generate Payroll {selectedEmployeeId ? "for Employee" : "for All"}
              </button>
              <button
                onClick={() => handleDownloadPayslip(selectedEmployeeId)}
                disabled={loading || payrollLoading || !selectedEmployeeId}
                className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Download Payslip
              </button>
            </div>
          </div>
        )}

        {/* Payslip Records */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Payslip Records</h2>
          {loading && <p className="text-gray-500">Loading payslips...</p>}
          {!loading && filteredPayslips.length === 0 && (
            <p className="text-gray-500">
              No payslips found for {selectedMonth}.{" "}
              {["hr", "super_admin"].includes(role) && "Try generating payroll."}
            </p>
          )}
          {!loading && filteredPayslips.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="bg-teal-600 text-white">
                    <tr>
                      <th className="px-6 py-3">Employee</th>
                      <th className="px-6 py-3">Department</th>
                      <th className="px-6 py-3">Total Earnings</th>
                      <th className="px-6 py-3">Total Deductions</th>
                      <th className="px-6 py-3">Net Pay</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPayslips.map((slip) => (
                      <tr key={`${slip.employee_id}-${slip.month}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          {slip.employee_name} ({slip.employee_id})
                        </td>
                        <td className="px-6 py-4">{slip.department || "HR"}</td>
                        <td className="px-6 py-4">
                          ₹{(slip.totalEarnings || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          ₹{(slip.totalDeductions || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          ₹{(slip.netPay || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => handleViewPayslip(slip)}
                            className="text-teal-600 hover:text-teal-800 flex items-center"
                          >
                            <Eye size={18} className="mr-1" /> View
                          </button>
                          {["hr", "super_admin"].includes(role) && (
                            <button
                              onClick={() => handleDownloadPayslip(slip.employee_id)}
                              className="text-teal-600 hover:text-teal-800 flex items-center"
                            >
                              Download
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Payslip Preview */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto relative">
              <button
                onClick={() => setShowPreview(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payslip Preview</h2>
              <PayslipGenerator
                employee={showPreview}
                selectedMonth={selectedMonth}
                onClose={() => setShowPreview(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payslip;