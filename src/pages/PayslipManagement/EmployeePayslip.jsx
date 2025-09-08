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
        employee_name: slip.employee || slip.employee_name || "Unknown", // Ensure employee_name is set
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
        net_salary: parseFloat(slip.net_salary) || 0, // Ensure net_salary is included
        pan_number: slip.pan_number || "-", // Fallback for missing fields
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
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <p className="text-red-600 font-semibold">
            Access restricted: Not authenticated. Please log in.
          </p>
        </div>
      </div>
    );
  }
  if (role?.toLowerCase() !== "employee") {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
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
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
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
    <div className="min-h-screen bg-gray-100 p-6">
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Payslips</h1>
          <p className="text-gray-600 mt-2">
            View and download your payslips for any month.
          </p>
        </div>
        {(error || downloadError || employeeError) && (
          <div className="p-4 rounded-lg mb-6 bg-red-50 text-red-700">
            {error || downloadError || employeeError}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Select Pay Period
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pay Period
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                aria-label="Select pay period"
              >
                <option value="">Select a month</option>
                {payPeriods.map((month) => (
                  <option key={month} value={month}>
                    {new Date(month + "-01").toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </option>
                ))}
              </select>
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
              className="py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Refresh
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
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
              <span className="ml-2 text-gray-600">Loading payslips...</span>
            </div>
          )}
          {!loading && !employeeLoading && filteredPayslips.length === 0 && (
            <p className="text-gray-600">
              No approved, paid, or pending payslips found for{" "}
              {selectedMonth || "the selected month"}.
            </p>
          )}
          {!loading && !employeeLoading && filteredPayslips.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="bg-teal-600 text-white">
                    <tr>
                      <th className="px-6 py-3">Month</th>
                      <th className="px-6 py-3">Total Earnings</th>
                      <th className="px-6 py-3">Total Deductions</th>
                      <th className="px-6 py-3">Net Pay</th>
                      <th className="px-6 py-3">Payment Date</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPayslips.map((slip, index) => (
                      <tr
                        key={
                          slip.id ??
                          `${slip.employee_id}-${slip.month}-${index}`
                        }
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          {new Date(slip.month + "-01").toLocaleString(
                            "default",
                            { month: "long", year: "numeric" }
                          )}
                        </td>
                        <td className="px-6 py-4">
                          ₹{(slip.totalEarnings || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          ₹{(slip.totalDeductions || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          ₹{(slip.netPay || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          {slip.payment_date
                            ? new Date(slip.payment_date).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4">{slip.status}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => {
                              console.log("Opening preview for:", slip);
                              setShowPreview(slip);
                            }}
                            className="flex items-center text-teal-600 hover:text-teal-800"
                            aria-label={`View payslip for ${slip.month}`}
                          >
                            <Eye size={18} className="mr-1" />
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
                                className="animate-spin h-5 w-5 mr-1"
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
                              <Download size={18} className="mr-1" />
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
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto relative">
              <button
                onClick={() => setShowPreview(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
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
