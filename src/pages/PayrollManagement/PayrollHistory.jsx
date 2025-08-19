import React, { useEffect, useState } from "react";
import { Calendar, Download, Play, Pause, DollarSign, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayroll, generatePayroll, downloadPayrollPDF } from "../../redux/slices/payrollSlice";

const PayrollHistory = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("2025-08"); // Default to 2025-08
  const dispatch = useDispatch();
  const { payrollList = [], loading, error, successMessage } = useSelector((state) => state.payroll);

  useEffect(() => {
    console.log("Fetching payroll for month:", selectedMonth); // Debug log
    dispatch(fetchPayroll({ month: selectedMonth }));
  }, [dispatch, selectedMonth]);

  useEffect(() => {
    console.log("payrollList updated:", payrollList); // Debug log
  }, [payrollList]);

  // Aggregate payroll records by month
  const payrollRecords = payrollList.reduce((acc, record) => {
    const monthYear = record.month; // e.g., "2025-08"
    if (!acc[monthYear]) {
      acc[monthYear] = {
        id: monthYear,
        month: new Date(`${monthYear}-01`).toLocaleString('en-US', { month: 'long' }),
        year: parseInt(monthYear.split('-')[0]),
        totalEmployees: 0,
        grossPay: 0,
        deductions: 0,
        netPay: 0,
        status: record.status || "pending",
        processedDate: record.payment_date || null,
      };
    }
    acc[monthYear].totalEmployees += 1;
    acc[monthYear].grossPay += parseFloat(record.gross_salary) || 0;
    acc[monthYear].deductions += (parseFloat(record.pf_deduction) || 0) +
                                (parseFloat(record.esic_deduction) || 0) +
                                (parseFloat(record.tax_deduction) || 0);
    acc[monthYear].netPay += parseFloat(record.net_salary) || 0;
    // Update status: if any record is "processing", set month to "processing"
    if (record.status === "processing") {
      acc[monthYear].status = "processing";
    } else if (acc[monthYear].status !== "processing") {
      acc[monthYear].status = "completed"; // Assume completed unless processing
    }
    return acc;
  }, {});

  // Convert aggregated records to array for table
  const payrollRecordsArray = Object.values(payrollRecords);

  // Summary stats for the selected month
  const selectedMonthRecord = payrollRecords[selectedMonth] || {
    totalEmployees: 0,
    grossPay: 0,
    deductions: 0,
    netPay: 0,
  };

  // Debug log for aggregated records and summary stats
  useEffect(() => {
    console.log("Aggregated Payroll Records:", payrollRecordsArray);
    console.log("Selected Month Summary:", selectedMonthRecord);
  }, [payrollRecordsArray, selectedMonthRecord]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-600 text-white">
            Completed
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-600 text-white">
            Processing
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-900">
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-200 text-slate-900">
            Unknown
          </span>
        );
    }
  };

  const handleProcessPayroll = () => {
    setIsProcessing(true);
    console.log("Processing payroll for month:", selectedMonth); // Debug log
    dispatch(generatePayroll({ month: selectedMonth })).then((result) => {
      if (generatePayroll.fulfilled.match(result)) {
        console.log("generatePayroll success, refetching for month:", selectedMonth); // Debug log
        dispatch(fetchPayroll({ month: selectedMonth }));
      }
      setIsProcessing(false);
    });
  };

  const handleDownloadReport = (month) => {
    console.log("Downloading PDF for month:", month); // Debug log
    dispatch(downloadPayrollPDF({ month }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Payroll Management</h2>
          <p className="text-slate-500 text-base sm:text-lg">Automate and manage monthly payroll processing</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-slate-500" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <button
            onClick={() => handleDownloadReport(selectedMonth)}
            className="flex items-center px-4 py-2 border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
          <button
            className={`flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
              isProcessing || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleProcessPayroll}
            disabled={isProcessing || loading}
          >
            {isProcessing || loading ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Process Payroll
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error or Success Message */}
      {(error || successMessage) && (
        <div
          className={`p-4 rounded-lg ${
            error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {error || successMessage}
        </div>
      )}

      {/* Current Month Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-full">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 min-w-0">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-slate-500 truncate">Total Employees</h3>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{selectedMonthRecord.totalEmployees}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 min-w-0">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-slate-500 truncate">Gross Pay</h3>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 truncate">₹{selectedMonthRecord.grossPay.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 min-w-0">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-slate-500 truncate">Total Deductions</h3>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-rose-600 truncate">₹{selectedMonthRecord.deductions.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 min-w-0">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-slate-500 truncate">Net Pay</h3>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 truncate">₹{selectedMonthRecord.netPay.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {(isProcessing || loading) && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm">
          <div className="pb-2">
            <h3 className="flex items-center text-lg sm:text-xl font-bold text-slate-900">
              <DollarSign className="w-5 h-5 mr-2 text-teal-600" />
              Payroll Processing Status
            </h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Calculating salaries...</span>
                <span className="text-sm text-slate-600">75%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-teal-600 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Processing payroll for {selectedMonthRecord.totalEmployees} employees. This may take a few minutes.
            </p>
          </div>
        </div>
      )}

      {/* Payroll History */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="pb-2">
          <h3 className="flex items-center text-lg sm:text-xl font-bold text-slate-900">
            <Calendar className="w-5 h-5 mr-2 text-teal-600" />
            Payroll History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-slate-900 font-medium">Period</th>
                <th className="text-left py-3 px-4 text-slate-900 font-medium">Employees</th>
                <th className="text-left py-3 px-4 text-slate-900 font-medium">Gross Pay</th>
                <th className="text-left py-3 px-4 text-slate-900 font-medium">Deductions</th>
                <th className="text-left py-3 px-4 text-slate-900 font-medium">Net Pay</th>
                <th className="text-left py-3 px-4 text-slate-900 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-900 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrollRecordsArray.length === 0 && !loading ? (
                <tr>
                  <td colSpan="7" className="py-3 px-4 text-center text-slate-500">
                    No payroll records found for {selectedMonth}. Try refreshing or changing the month.
                  </td>
                </tr>
              ) : (
                payrollRecordsArray.map((record) => (
                  <tr key={record.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-900">{record.month} {record.year}</p>
                        {record.processedDate && (
                          <p className="text-sm text-slate-500">
                            Processed: {new Date(record.processedDate).toLocaleDateString('en-IN')}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-900">{record.totalEmployees}</td>
                    <td className="py-3 px-4 text-slate-900">₹{record.grossPay.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-rose-600">₹{record.deductions.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-emerald-600 font-medium">₹{record.netPay.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          className="p-2 text-teal-600 hover:text-teal-500 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadReport(record.id)}
                          className="p-2 text-teal-600 hover:text-teal-500 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollHistory;