import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { downloadPayslip } from "../../redux/slices/payslipSlice";

const PayslipGenerator = ({ employee = {}, selectedMonth, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.payslip);
  const { user, role } = useSelector((state) => state.auth);

  const formatCurrency = (value) =>
    `₹${(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Calculate gross salary (if needed for display, assuming backend provides it)
  const grossSalary = employee.gross_salary || 0;

  const handleDownloadPayslip = () => {
    if (role === "employee" && user.id !== employee.employee_id) {
      alert("Access denied: You can only download your own payslip.");
      return;
    }
    dispatch(downloadPayslip({ employeeId: employee.employee_id, month: selectedMonth }));
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {employee.employee_name || "-"}
          </h2>
          <p className="text-slate-500 text-sm">Month: {selectedMonth || "-"}</p>
        </div>
        <img
          src="/company_logo.png"
          alt="Company Logo"
          className="w-24 object-contain"
          onError={(e) => (e.target.src = "/fallback_logo.png")} // Fallback for missing logo
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Employee & Company Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold text-slate-800 mb-2">Employee Details</h3>
          <table className="w-full text-sm border border-slate-300 rounded-lg">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-2 font-medium text-slate-700">ID</td>
                <td className="px-4 py-2">{employee.employee_id || "-"}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-2 font-medium text-slate-700">Department</td>
                <td className="px-4 py-2">{employee.department || "-"}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-2 font-medium text-slate-700">Position</td>
                <td className="px-4 py-2">{employee.position || "-"}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-2 font-medium text-slate-700">PAN</td>
                <td className="px-4 py-2">{employee.pan_number || "-"}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-2 font-medium text-slate-700">UAN</td>
                <td className="px-4 py-2">{employee.uan_number || "-"}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-2 font-medium text-slate-700">Bank A/C</td>
                <td className="px-4 py-2">{employee.bank_account_number || "-"}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-slate-700">IFSC</td>
                <td className="px-4 py-2">{employee.ifsc_code || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-2">Company Details</h3>
          <table className="w-full text-sm border border-slate-300 rounded-lg">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-2 font-medium text-slate-700">Name</td>
                <td className="px-4 py-2">MNTechs Solutions Pvt Ltd</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-2 font-medium text-slate-700">PAN</td>
                <td className="px-4 py-2">ABCDE1234F</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-slate-700">GSTIN</td>
                <td className="px-4 py-2">12ABCDE1234F1Z5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Earnings */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-2">Earnings</h3>
          <table className="w-full text-sm border border-slate-300 rounded-lg">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-2 font-medium text-slate-700">Gross Salary</td>
                <td className="px-4 py-2">{formatCurrency(grossSalary)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions */}
        <div>
          <h3 className="font-semibold text-slate-800 mb-2">Deductions</h3>
          <table className="w-full text-sm border border-slate-300 rounded-lg">
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-2 font-medium text-slate-700">Provident Fund</td>
                <td className="px-4 py-2">{formatCurrency(employee.pf_deduction)}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-2 font-medium text-slate-700">ESIC</td>
                <td className="px-4 py-2">{formatCurrency(employee.esic_deduction)}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-2 font-medium text-slate-700">Professional Tax</td>
                <td className="px-4 py-2">{formatCurrency(employee.professional_tax)}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td className="px-4 py-2 font-medium text-slate-700">Income Tax</td>
                <td className="px-4 py-2">{formatCurrency(employee.tax_deduction)}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-slate-700">Net Salary</td>
                <td className="px-4 py-2 font-bold text-teal-600">{formatCurrency(employee.net_salary)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Extra Info */}
      <div className="space-y-2">
        <p><strong>Status:</strong> {employee.status || "-"}</p>
        <p><strong>Payment Method:</strong> {employee.payment_method || "-"}</p>
        <p>
          <strong>Payment Date:</strong>{" "}
          {employee.payment_date ? new Date(employee.payment_date).toLocaleDateString("en-IN") : "-"}
        </p>
        <p><strong>Generated By:</strong> {employee.created_by || "-"}</p>
      </div>

      {/* Download and Close Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleDownloadPayslip}
          disabled={loading || (role === "employee" && user.id !== employee.employee_id)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-transform duration-300 transform hover:scale-105"
        >
          {loading ? "Downloading..." : "Download Payslip"}
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-200 text-slate-900 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-transform duration-300 transform hover:scale-105"
        >
          Close
        </button>
      </div>

      <p className="text-sm text-slate-500">
        Note: This payslip is subject to statutory compliance as per Indian laws.
      </p>
    </div>
  );
};

export default PayslipGenerator;