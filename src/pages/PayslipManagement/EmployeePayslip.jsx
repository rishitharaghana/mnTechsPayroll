import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Eye, Download, X } from "lucide-react";
import {
  fetchPayslips,
  downloadPayslip,
  clearError,
} from "../../redux/slices/payslipSlice";
import { getCurrentUserProfile, fetchEmployees } from "../../redux/slices/employeeSlice";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import PaySlipGenerator from "../PayslipManagement/PaySlipGenerator";

const CustomSelect = ({ value, onChange, options, label, placeholder = "Select an option" }) => {
  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm bg-white text-gray-800 py-2 px-3 transition duration-200 ease-in-out"
        aria-label={label}
      >
        <option value="" className="text-gray-500 bg-gray-100">
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option
            key={option.value || option}
            value={option.value || option}
            className={`${
              index % 2 === 0 ? "bg-teal-50" : "bg-white"
            } text-gray-800 hover:bg-teal-100 transition duration-150 ease-in-out`}
          >
            {option.label || new Date(option + "-01").toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </option>
        ))}
      </select>
    </div>
  );
};

const EmployeePayslip = () => {
  const dispatch = useDispatch();
  const { user, role, isAuthenticated, employee_id } = useSelector((state) => state.auth);
  const {
    employeeId,
    loading: employeeLoading,
    error: employeeError,
    profile,
    employees,
  } = useSelector((state) => state.employee);
  const {
    loading,
    error,
    payslips = [],
    totalRecords = 0,
  } = useSelector((state) => state.payslip);
  const [selectedMonth, setSelectedMonth] = useState("2025-09");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [showPreview, setShowPreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const normalizedRole = role?.toLowerCase().trim();

  useEffect(() => {
    console.log("EmployeePayslip state:", {
      isAuthenticated,
      role: normalizedRole,  
      employee_id,  
      employeeId,
      employeeLoading,
      employeeError,
      profile,
      employees,
      loading,
      error,
      payslips,
      totalRecords,
    });
  }, [
    isAuthenticated,
    normalizedRole, 
    employee_id,
    employeeId,
    employeeLoading,
    employeeError,
    profile,
    employees,
    loading,
    error,
    payslips,
    totalRecords,
  ]);

  useEffect(() => {
    if (
      isAuthenticated &&
      ["employee", "dept_head", "manager", "hr", "super_admin"].includes(normalizedRole) &&
      !employeeId &&
      !employeeError
    ) {
      console.log("Fetching user profile for:", employee_id || "unknown ID");  
      dispatch(getCurrentUserProfile());
    }
    if (["hr", "super_admin"].includes(normalizedRole)) {  
      console.log("Fetching employees for:", normalizedRole);
      dispatch(fetchEmployees());
    }
  }, [dispatch, isAuthenticated, normalizedRole, employeeId, employeeError]); 

  useEffect(() => {
    if (profile && profile.employee_id && !employee_id) {
      console.log("Syncing employee_id from profile:", profile.employee_id);  
    }
  }, [profile, employee_id]);

  useEffect(() => {
    if (
      isAuthenticated &&
      ["employee", "dept_head", "manager", "hr", "super_admin"].includes(normalizedRole) &&  // FIX: Use normalizedRole
      employeeId &&
      !employeeError
    ) {
      const dispatchEmployeeId = ["hr", "super_admin"].includes(normalizedRole) ? selectedEmployee || employeeId : employeeId;  // FIX: Fallback to own for HR if empty
      console.log("Dispatching fetchPayslips with:", {  
        normalizedRole,
        dispatchEmployeeId,
        selectedMonth,
        page: currentPage,
      });
      dispatch(
        fetchPayslips({
          month: selectedMonth,
          employeeId: dispatchEmployeeId,
          page: currentPage,
          limit: itemsPerPage,
        })
      );
      dispatch(clearError());
    }
  }, [dispatch, isAuthenticated, normalizedRole, employeeId, selectedMonth, selectedEmployee, currentPage, employeeError]);  // FIX: Use normalizedRole in deps

  useEffect(() => {
    if (error || downloadError || employeeError) {
      console.error("Error detected:", { error, downloadError, employeeError });
      const errorMessage = (error || downloadError || employeeError)?.error || (error || downloadError || employeeError);  // FIX: Handle nested {error: '...'}
      if (errorMessage?.includes("Employee not found")) {
        toast.error("Your employee profile was not found. Please contact HR.");
      } else if (errorMessage?.includes("HR users cannot view")) {
        toast.error("Access denied: HR users cannot view other HR users' payslips.");
      } else if (errorMessage === "Access denied") {
        toast.error("Access denied. Check your permissions or contact admin.");  // FIX: Specific for 403
      } else {
        toast.error(errorMessage || "An error occurred while fetching payslips.");
      }
      if (error) dispatch(clearError());
      setDownloadError(null);
    }
  }, [error, downloadError, employeeError, dispatch]);

  const filteredPayslips = useMemo(() => {
    const filtered = (Array.isArray(payslips) ? payslips : [])
      .filter((slip) => {
        if (!["employee", "dept_head", "manager", "hr", "super_admin"].includes(normalizedRole)) {  // FIX: Use normalizedRole
          return false;
        }
        if (["employee", "dept_head", "manager"].includes(normalizedRole) && slip.employee_id !== employeeId) {  // FIX: Use normalizedRole
          return false;
        }
        return (
          (!selectedMonth || slip.month === selectedMonth) &&
          ["Approved", "Paid", "Pending"].includes(slip.status)
        );
      })
      .map((slip) => ({
        ...slip,
        employee_name: slip.employee || slip.employee_name || "Unknown",
        totalEarnings:
          (parseFloat(slip.basic_salary) || 0) +
          (parseFloat(slip.hra) || 0) +
          (parseFloat(slip.special_allowances) || 0) +
          (parseFloat(slip.bonus) || 0),
        totalDeductions:
          (parseFloat(slip.pf_deduction) || 0) +
          (parseFloat(slip.esic_deduction) || 0) +
          (parseFloat(slip.professional_tax) || 0) +
          (parseFloat(slip.tax_deduction) || 0),
        netPay: parseFloat(slip.net_salary) || 0,
        net_salary: parseFloat(slip.net_salary) || 0,
        payment_date: slip.payment_date || null,
      }))
      .sort((a, b) => new Date(b.month + "-01") - new Date(a.month + "-01"));
    console.log("Filtered payslips:", filtered);
    return filtered;
  }, [payslips, selectedMonth, normalizedRole, employeeId]); 

  const payPeriods = useMemo(() => {
    if (payslips.length > 0) {
      return [...new Set(payslips.map((slip) => slip.month))]
        .sort((a, b) => new Date(b + "-01") - new Date(a + "-01"));
    }    const fallback = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      fallback.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    }
    console.log("Using fallback pay periods:", fallback);
    return fallback;
  }, [payslips]);

  const employeeOptions = useMemo(() => {
    return employees.map((emp) => ({
      value: emp.employee_id,
      label: `${emp.full_name} (${emp.employee_id})`,
    }));
  }, [employees]);

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const handleDownload = async (employeeId, month) => {
    if (!employeeId || !month) {
      const msg = "Please select an employee and month";
      setDownloadError(msg);
      toast.error(msg);
      return;
    }
    setIsLoadingDownload(true);
    setDownloadError(null);
    try {
      console.log("Downloading payslip for:", { normalizedRole, employeeId, month });  
      const response = await dispatch(downloadPayslip({ employeeId, month })).unwrap();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payslip_${employeeId}_${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Payslip downloaded successfully");
    } catch (err) {
      const errorMessage = err?.error || "Failed to download payslip";
      setDownloadError(errorMessage);
      toast.error(errorMessage); 
      console.error("Download error:", err);
    } finally {
      setIsLoadingDownload(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6">
          <p className="text-red-600 font-semibold">
            Access restricted: Not authenticated. Please log in.
          </p>
        </div>
      </div>
    );
  }
  if (!["employee", "dept_head", "manager", "hr", "super_admin"].includes(normalizedRole)) {  
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6">
          <p className="text-red-600 font-semibold">
            Access restricted: User role is '{role || "undefined"}' ({normalizedRole}), not allowed to view payslips. 
          </p>
        </div>
      </div>
    );
  }
  if (!employeeId || employeeError?.includes("Employee not found")) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6">
          <p className="text-red-600 font-semibold">
            Access restricted: Your employee profile was not found. Please contact HR.
            {employeeLoading
              ? " Loading profile..."
              : employeeError || " Please try again."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-4 sm:mt-0">
      <div className="hidden sm:flex sm:justify-end sm:items-center mb-4">
        <PageMeta
          title="Employee Payslips"
          description="View and download payslips."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/emp-dashboard" },
            { label: "Payslips", link: "/employee-payslip" },
          ]}
        />
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {["hr", "super_admin"].includes(normalizedRole) ? "All Payslips" : "My Payslips"}  {/* FIX: Use normalizedRole */}
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            View and download {["hr", "super_admin"].includes(normalizedRole) ? "employee payslips" : "your payslips"} for any month.  {/* FIX: Use normalizedRole */}
          </p>
        </div>
        {(error && !downloadError && !employeeError) && (
          <div className="p-4 rounded-lg mb-6 bg-red-50 text-red-700 text-sm sm:text-base">
            {error}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Select Pay Period
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {["hr", "super_admin"].includes(normalizedRole) && (  
              <div className="w-full sm:w-1/2">
                <CustomSelect
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  options={employeeOptions}
                  label="Employee"
                  placeholder="Select an employee (optional)"
                />
              </div>
            )}
            <div className="w-full sm:w-1/2">
              <CustomSelect
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                options={payPeriods}
                label="Pay Period"
                placeholder="Select a month (optional)"
              />
            </div>
            <button
              onClick={() => {
                setCurrentPage(1);
                const dispatchEmployeeId = ["hr", "super_admin"].includes(normalizedRole) ? selectedEmployee || employeeId : employeeId;  // FIX: Consistent fallback
                dispatch(
                  fetchPayslips({
                    month: selectedMonth,
                    employeeId: dispatchEmployeeId,
                    page: 1,
                    limit: itemsPerPage,
                  })
                );
              }}
              disabled={loading || employeeLoading}
              className="w-full sm:w-auto py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Payslip History
          </h2>
          {(loading || employeeLoading) && (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-5 w-5 text-teal-600"
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
              <span className="ml-2 text-gray-600 text-sm sm:text-base">
                Loading payslips...
              </span>
            </div>
          )}
          {!loading && !employeeLoading && filteredPayslips.length === 0 && (
            <p className="text-gray-600 text-sm sm:text-base">
              No approved, paid, or pending payslips found for{" "}
              {selectedMonth || "the selected month"}.
            </p>
          )}
          {!loading && !employeeLoading && filteredPayslips.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="bg-teal-600 text-white text-xs sm:text-sm">
                    <tr>
                      {["hr", "super_admin"].includes(normalizedRole) && (  
                        <th className="px-4 py-3 whitespace-nowrap">Employee Name</th>
                      )}
                      <th className="px-4 py-3 whitespace-nowrap">Month</th>
                      <th className="px-4 py-3 whitespace-nowrap">Total Earnings</th>
                      <th className="px-4 py-3 whitespace-nowrap">Total Deductions</th>
                      <th className="px-4 py-3 whitespace-nowrap">Net Pay</th>
                      <th className="px-4 py-3 whitespace-nowrap">Payment Date</th>
                      <th className="px-4 py-3 whitespace-nowrap">Status</th>
                      <th className="px-4 py-3 whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                    {filteredPayslips.map((slip, index) => (
                      <tr
                        key={
                          slip.id ??
                          `${slip.employee_id}-${slip.month}-${index}`
                        }
                        className="hover:bg-gray-50"
                      >
                        {["hr", "super_admin"].includes(normalizedRole) && (  
                          <td className="px-4 py-3 whitespace-nowrap">
                            {slip.employee_name}
                          </td>
                        )}
                        <td className="px-4 py-3 whitespace-nowrap">
                          {new Date(slip.month + "-01").toLocaleString(
                            "default",
                            { month: "long", year: "numeric" }
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          ₹{(slip.totalEarnings || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          ₹{(slip.totalDeductions || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          ₹{(slip.netPay || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {slip.payment_date
                            ? new Date(slip.payment_date).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{slip.status}</td>
                        <td className="px-4 py-3 whitespace-nowrap flex gap-2">
                          <button
                            onClick={() => {
                              console.log("Opening preview for:", slip);
                              setShowPreview(slip);
                            }}
                            className="flex items-center text-teal-600 hover:text-teal-800"
                            aria-label={`View payslip for ${slip.month}`}
                          >
                            <Eye size={16} className="mr-1" />
                            View
                          </button>
                          <button
                            onClick={() =>
                              handleDownload(slip.employee_id, slip.month)
                            }
                            disabled={isLoadingDownload}
                            className="flex items-center text-teal-600 hover:text-teal-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                            aria-label={`Download payslip for ${slip.month}`}
                          >
                            {isLoadingDownload &&
                            slip.month === selectedMonth ? (
                              <svg
                                className="animate-spin h-4 w-4 mr-1"
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
                              <Download size={16} className="mr-1" />
                            )}
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="w-full sm:w-auto py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    Previous
                  </button>
                  <span className="text-gray-600 text-sm sm:text-base">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="w-full sm:w-auto py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setShowPreview(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Payslip Preview
              </h2>
              <PaySlipGenerator
                employee={showPreview}
                selectedMonth={showPreview.month}
                onClose={() => setShowPreview(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePayslip;