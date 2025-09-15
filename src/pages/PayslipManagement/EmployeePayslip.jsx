import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Eye, Download, X } from "lucide-react";
import {
  fetchPayslips,
  downloadPayslip,
  clearError,
} from "../../redux/slices/payslipSlice";
import { getCurrentUserProfile } from "../../redux/slices/employeeSlice";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import PayslipGenerator from "../PayslipManagement/PayslipGenerator";

// Custom Select Component
const CustomSelect = ({ value, onChange, options, label }) => {
  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm bg-white text-gray-800 py-2 px-3 transition duration-200 ease-in-out"
        aria-label={label}
      >
        <option value="" className="text-gray-500 bg-gray-100">
          Select a month
        </option>
        {options.map((option, index) => (
          <option
            key={option}
            value={option}
            className={`${
              index % 2 === 0 ? "bg-teal-50" : "bg-white"
            } text-gray-800 hover:bg-teal-100 transition duration-150 ease-in-out`}
          >
            {new Date(option + "-01").toLocaleString("default", {
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
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const {
    employeeId,
    loading: employeeLoading,
    error: employeeError,
  } = useSelector((state) => state.employee);
  const {
    loading,
    error,
    payslips = [],
    totalRecords = 0,
  } = useSelector((state) => state.payslip);
  const [selectedMonth, setSelectedMonth] = useState("2025-09");
  const [isLoadingDownload, setIsLoadingDownload] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [showPreview, setShowPreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Debug states
  useEffect(() => {
    console.log("Auth state:", { isAuthenticated, role, user });
    console.log("Employee state:", {
      employeeId,
      employeeLoading,
      employeeError,
    });
    console.log("Payslip state:", { loading, error, payslips, totalRecords });
  }, [
    isAuthenticated,
    role,
    user,
    employeeId,
    employeeLoading,
    employeeError,
    loading,
    error,
    payslips,
    totalRecords,
  ]);

  // Fetch current user profile
  useEffect(() => {
    if (isAuthenticated && role?.toLowerCase() === "employee" && !employeeId) {
      console.log("Fetching user profile...");
      dispatch(getCurrentUserProfile());
    }
  }, [dispatch, isAuthenticated, role, employeeId]);

  // Fetch payslips
  useEffect(() => {
    if (isAuthenticated && role?.toLowerCase() === "employee" && employeeId) {
      console.log("Fetching payslips for:", {
        employeeId,
        selectedMonth,
        page: currentPage,
      });
      dispatch(
        fetchPayslips({
          month: selectedMonth,
          employeeId: employeeId,
          page: currentPage,
          limit: itemsPerPage,
        })
      );
      dispatch(clearError());
    }
  }, [dispatch, isAuthenticated, role, employeeId, selectedMonth, currentPage]);

  // Filter and map payslips
  const filteredPayslips = useMemo(() => {
    const filtered = (Array.isArray(payslips) ? payslips : [])
      .filter((slip) => {
        if (
          role?.toLowerCase() !== "employee" ||
          slip.employee_id !== employeeId
        )
          return false;
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
          (parseFloat(slip.da) || 0) +
          (parseFloat(slip.other_allowances) || 0),
        totalDeductions:
          (parseFloat(slip.pf_deduction) || 0) +
          (parseFloat(slip.esic_deduction) || 0) +
          (parseFloat(slip.professional_tax) || 0) +
          (parseFloat(slip.tax_deduction) || 0),
        netPay: parseFloat(slip.net_salary) || 0,
        net_salary: parseFloat(slip.net_salary) || 0,
        pan_number: slip.pan_number || "-",
        uan_number: slip.uan_number || "-",
        bank_account_number: slip.bank_account_number || "-",
        ifsc_code: slip.ifsc_code || "-",
        payment_date: slip.payment_date || null,
      }))
      .sort((a, b) => new Date(b.month + "-01") - new Date(a.month + "-01"));
    console.log("Filtered payslips:", filtered);
    return filtered;
  }, [payslips, selectedMonth, role, employeeId]);

  const payPeriods = useMemo(() => {
    const periods = [...new Set(payslips.map((slip) => slip.month))].sort(
      (a, b) => new Date(b + "-01") - new Date(a + "-01")
    );
    console.log("Pay periods:", periods);
    return periods;
  }, [payslips]);

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const handleDownload = async (employeeId, month) => {
    if (!employeeId || !month) {
      setDownloadError("Please select a month");
      toast.error("Please select a month");
      return;
    }
    setIsLoadingDownload(true);
    setDownloadError(null);
    try {
      console.log("Downloading payslip for:", { employeeId, month });
      await dispatch(downloadPayslip({ employeeId, month })).unwrap();
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

  // Detailed error messages
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
  if (role?.toLowerCase() !== "employee") {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6">
          <p className="text-red-600 font-semibold">
            Access restricted: User role is '{role || "undefined"}', not
            'employee'.
          </p>
        </div>
      </div>
    );
  }
  if (!employeeId) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-4 sm:p-6">
          <p className="text-red-600 font-semibold">
            Access restricted: Employee ID is missing.{" "}
            {employeeLoading
              ? "Loading profile..."
              : employeeError || "Please try again."}
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
          description="View and download your payslips."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/emp-dashboard" },
            { label: "My Payslips", link: "/employee-payslip" },
          ]}
        />
      </div>
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            My Payslips
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            View and download your payslips for any month.
          </p>
        </div>
        {(error || downloadError || employeeError) && (
          <div className="p-4 rounded-lg mb-6 bg-red-50 text-red-700 text-sm sm:text-base">
            {error || downloadError || employeeError}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Select Pay Period
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-1/2">
              <CustomSelect
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                options={payPeriods}
                label="Pay Period"
              />
            </div>
            <button
              onClick={() => {
                setCurrentPage(1);
                dispatch(
                  fetchPayslips({
                    month: selectedMonth,
                    employeeId: employeeId,
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
              <PayslipGenerator
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