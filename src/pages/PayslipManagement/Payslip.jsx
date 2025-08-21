import React, { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { downloadPayslip, fetchPayslips, clearError } from "../../redux/slices/payslipSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import PayslipGenerator from "./PayslipGenerator";

const Payslip = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, payslips } = useSelector((state) => state.payslip);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  useEffect(() => {
    console.log("Fetching payslips...");
    dispatch(fetchPayslips());
    dispatch(clearError());
  }, [dispatch]);

  // Ensure payslips is an array
  const safePayslips = Array.isArray(payslips) ? payslips : [];
  const employees = [...new Set(safePayslips.map((slip) => slip.employee))];
  const payPeriods = [...new Set(safePayslips.map((slip) => slip.month))];

  const filteredPayslips = safePayslips.filter(
    (slip) =>
      (!selectedEmployee || slip.employee === selectedEmployee) &&
      (!selectedPeriod || slip.month === selectedPeriod)
  );

  const openPreview = () => setShowPreview(true);
  const closePreview = () => setShowPreview(false);

  const handleDownload = () => {
    setDownloadError(null);
    if (selectedEmployee && selectedPeriod) {
      const slip = safePayslips.find(
        (slip) => slip.employee === selectedEmployee && slip.month === selectedPeriod
      );
      if (slip) {
        dispatch(downloadPayslip({ employeeId: slip.employee_id, month: selectedPeriod }))
          .unwrap()
          .catch((err) => setDownloadError(err || "Failed to download payslip"));
      } else {
        setDownloadError("No payslip found for the selected employee and period");
      }
    } else {
      setDownloadError("Please select both an employee and a pay period");
    }
  };

  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">
      <div className="flex justify-end">
        <PageMeta title="Payslip Management" description="Manage and generate employee payslips" />
        <PageBreadcrumb items={[{ label: "Home", link: "/" }, { label: "Payslip", link: "/admin/payslip" }]} />
      </div>
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Payslips</h1>
            <p className="text-slate-500 text-lg mt-1">Generate and manage employee payslips</p>
          </div>
          <button
            onClick={handleDownload}
            disabled={loading || !selectedEmployee || !selectedPeriod}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105 disabled:bg-teal-300 disabled:cursor-not-allowed"
            aria-label="Download payslip PDF"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 mr-2 inline" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            ) : (
              <Eye size={18} className="mr-2" />
            )}
            {loading ? "Downloading..." : "Download PDF"}
          </button>
        </div>
        {(error || downloadError) && (
          <p className="text-red-500 text-sm mt-2">{error || downloadError}</p>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 text-sm font-medium mb-1">Select Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
              aria-label="Select employee"
            >
              <option value="">All Employees</option>
              {employees.map((employee) => (
                <option key={employee} value={employee}>
                  {employee}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-slate-500 text-sm font-medium mb-1">Select Pay Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
                aria-label="Select pay period"
              >
                <option value="">All Periods</option>
                {payPeriods.map((period) => (
                  <option key={period} value={period}>
                    {period}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={openPreview}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-transform duration-300 transform hover:scale-105 disabled:bg-slate-300 disabled:cursor-not-allowed"
              disabled={filteredPayslips.length === 0}
              aria-label="Preview payslip"
            >
              Preview Payslip
            </button>
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
          <p className="text-slate-500">No payslips found.</p>
        </div>
      )}
      {!loading && filteredPayslips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPayslips.map((slip) => (
            <div
              key={slip.employee_id + slip.month}
              className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{slip.employee}</h2>
              <p className="text-slate-500 text-sm mb-1"><strong>Month:</strong> {slip.month}</p>
              <p className="text-slate-500 text-sm mb-1"><strong>Department:</strong> {slip.department}</p>
              <p className="text-slate-500 text-sm mb-1"><strong>Position:</strong> {slip.position}</p>
              <p className="text-teal-600 font-bold text-lg mt-2">
                ₹{(slip.salary || 0).toLocaleString('en-IN')}
              </p>
              <button
                onClick={() => navigate(`/payslip/${slip.employee_id}/${slip.month}`)}
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
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Payslip Preview</h2>
            {filteredPayslips.map((slip) => (
              <PayslipGenerator key={slip.employee_id + slip.month} employee={slip} selectedMonth={slip.month} />
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
  );
};

export default Payslip;