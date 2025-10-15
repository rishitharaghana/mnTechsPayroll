import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import { fetchEmployeePayrollDetails, clearState } from "../../redux/slices/payrollSlice";
import { toast } from "react-toastify";
import { Loader2, ArrowLeft } from "lucide-react";

const PayrollDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { employeeDetails, employeeDetailsLoading, error } = useSelector((state) => state.payroll);
  const { role, isAuthenticated } = useSelector((state) => state.auth);

  const params = new URLSearchParams(location.search);
  const employeeId = params.get("employeeId");
  const month = params.get("month"); // Expected yyyy-MM

  useEffect(() => {
    if (employeeId && month) {
      dispatch(fetchEmployeePayrollDetails({ employeeId, month })).then((result) => {
        if (!fetchEmployeePayrollDetails.fulfilled.match(result)) {
          toast.error(result.payload?.error || "Failed to fetch details");
          navigate("/admin/generate-payroll");
        }
      });
    } else {
      toast.error("Invalid parameters");
      navigate("/admin/generate-payroll");
    }
    return () => dispatch(clearState());
  }, [dispatch, employeeId, month, navigate]);

  useEffect(() => {
    if (error) toast.error(error.message || "An error occurred");
  }, [error]);

  if (!isAuthenticated || !["hr", "super_admin"].includes(role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-red-600 text-lg font-medium">Access restricted. Please log in as HR or Super Admin.</p>
      </div>
    );
  }

  const formatCurrency = (val) =>
    `₹${(parseFloat(val) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const selectedMonthDate = month ? parse(month, "yyyy-MM", new Date()) : null;
  const monthFormatted = selectedMonthDate ? format(selectedMonthDate, "MMMM yyyy") : "";

  return (
    <>
      <PageMeta title="Payroll Details" description="View employee payroll details" />
      <PageBreadcrumb
        items={[
          { label: "Home", link: "/" },
          { label: "Generate Payroll", link: "/admin/generate-payroll" },
          { label: "Payroll Details", link: "/admin/payroll-details" },
        ]}
      />

      <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Payroll Details - {monthFormatted}
                </h1>
                <p className="text-slate-600 mt-1">Detailed view for careful review.</p>
              </div>
              <button
                onClick={() => navigate("/admin/generate-payroll")}
                className="flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition"
              >
                <ArrowLeft className="mr-2 w-4 h-4" /> Back
              </button>
            </div>
          </div>

          {employeeDetailsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : employeeDetails ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
              <h2 className="text-xl font-bold text-slate-900">
                {employeeDetails?.employee.full_name} ({employeeDetails?.employee.employee_id})
              </h2>

              {/* Employee & Bank */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4 border">
                  <h3 className="font-semibold text-teal-700 mb-2">Employee Info</h3>
                  <p><strong>Dept:</strong> {employeeDetails.employee.department_name || "N/A"}</p>
                  <p><strong>Designation:</strong> {employeeDetails.employee.designation_name || "N/A"}</p>
                  <p><strong>Role:</strong> {employeeDetails.employee.role}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border">
                  <h3 className="font-semibold text-teal-700 mb-2">Bank Details</h3>
                  {employeeDetails.bankDetails ? (
                    <>
                      <p><strong>Acct:</strong> {employeeDetails.bankDetails.bank_account_number}</p>
                      <p><strong>IFSC:</strong> {employeeDetails.bankDetails.ifsc_number}</p>
                    </>
                  ) : (
                    <p className="text-slate-500 italic">No bank details</p>
                  )}
                </div>
              </div>

              {/* Salary Structure */}
              <div className="bg-slate-50 rounded-lg p-4 border">
                <h3 className="font-semibold text-teal-700 mb-3">Salary Structure</h3>
                {employeeDetails.salaryStructure ? (
                  <table className="w-full text-sm">
                    <thead className="bg-white">
                      <tr>
                        <th className="text-left py-2 px-3">Component</th>
                        <th className="text-right py-2 px-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-3">Basic Salary</td>
                        <td className="text-right py-2 px-3">{formatCurrency(employeeDetails.salaryStructure.basic_salary)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">HRA</td>
                        <td className="text-right py-2 px-3">
                          {formatCurrency(
                            employeeDetails.salaryStructure.hra ||
                              (employeeDetails.salaryStructure.hra_percentage * employeeDetails.salaryStructure.basic_salary) / 100
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">Special Allowances</td>
                        <td className="text-right py-2 px-3">{formatCurrency(employeeDetails.salaryStructure.special_allowances)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">Bonus</td>
                        <td className="text-right py-2 px-3">{formatCurrency(employeeDetails.salaryStructure.bonus)}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <p className="text-slate-500 italic">No salary structure found</p>
                )}
              </div>

              {/* Attendance */}
              <div className="bg-slate-50 rounded-lg p-4 border">
                <h3 className="font-semibold text-teal-700 mb-3">Attendance & Leaves</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="bg-white p-3 rounded border text-center">
                    <p className="text-xs text-slate-500">Present</p>
                    <p className="font-medium">{employeeDetails.attendance.presentDays}</p>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <p className="text-xs text-slate-500">Paid Leave</p>
                    <p className="font-medium">{employeeDetails.attendance.paidLeaveDays}</p>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <p className="text-xs text-slate-500">Unpaid Leave</p>
                    <p className="font-medium">{employeeDetails.attendance.unpaidLeaveDays}</p>
                  </div>
                  <div className="bg-white p-3 rounded border text-center">
                    <p className="text-xs text-slate-500">Total Working</p>
                    <p className="font-medium">{employeeDetails.attendance.totalWorkingDays}</p>
                  </div>
                </div>
                {employeeDetails.attendance.leaveDetails?.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium text-teal-600">View Leave Details</summary>
                    <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                      {employeeDetails.attendance.leaveDetails.map((leave, idx) => (
                        <li key={idx}>
                          {leave.type} ({leave.days} days, {leave.start_date} to {leave.end_date})
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>

              {/* Calculations */}
              {employeeDetails.calculated && (
                <div className="bg-slate-50 rounded-lg p-4 border">
                  <h3 className="font-semibold text-teal-700 mb-3">Payroll Calculation</h3>
                  <table className="w-full text-sm">
                    <thead className="bg-white">
                      <tr>
                        <th className="text-left py-2 px-3">Item</th>
                        <th className="text-right py-2 px-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-3">Gross (Adjusted)</td>
                        <td className="text-right py-2 px-3">{formatCurrency(employeeDetails.calculated.adjustedGrossSalary)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">PF Deduction</td>
                        <td className="text-right py-2 px-3">{formatCurrency(employeeDetails.calculated.pf_deduction)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">ESIC Deduction</td>
                        <td className="text-right py-2 px-3">{formatCurrency(employeeDetails.calculated.esic_deduction)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">Professional Tax</td>
                        <td className="text-right py-2 px-3">{formatCurrency(employeeDetails.calculated.professional_tax)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">Tax Deduction</td>
                        <td className="text-right py-2 px-3">{formatCurrency(employeeDetails.calculated.tax_deduction)}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3">Unpaid Leave Ded.</td>
                        <td className="text-right py-2 px-3">{formatCurrency(employeeDetails.calculated.unpaid_leave_deduction)}</td>
                      </tr>
                      <tr className="font-bold border-t">
                        <td className="py-2 px-3">Net Salary</td>
                        <td className="text-right py-2 px-3">{formatCurrency(employeeDetails.calculated.net_salary)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-slate-500">No details available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default PayrollDetails;