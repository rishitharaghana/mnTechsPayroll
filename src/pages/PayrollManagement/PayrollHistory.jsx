import React, { useEffect, useState } from "react";
import { Calendar, Download, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPayroll,
  downloadPayrollPDF,
} from "../../redux/slices/payrollSlice";
import DatePicker from "../../Components/ui/date/DatePicker"; // Import the custom DatePicker
import { format} from "date-fns";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import { Link } from "react-router-dom";

const PayrollHistory = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date("2025-08-01")); // Default to 2025-08-01
  const dispatch = useDispatch();
  const {
    payrollList = [],
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.payroll);

  useEffect(() => {
    const formattedMonth = format(selectedMonth, "yyyy-MM"); // Format as "YYYY-MM"
    console.log("Fetching payroll for month:", formattedMonth); // Debug log
    dispatch(fetchPayroll({ month: formattedMonth }));
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
        month: new Date(`${monthYear}-01`).toLocaleString("en-US", {
          month: "long",
        }),
        year: parseInt(monthYear.split("-")[0]),
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
    acc[monthYear].deductions +=
      (parseFloat(record.pf_deduction) || 0) +
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
  const formattedSelectedMonth = format(selectedMonth, "yyyy-MM");
  const selectedMonthRecord = payrollRecords[formattedSelectedMonth] || {
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

  const handleDownloadReport = (month) => {
    console.log("Downloading PDF for month:", month); // Debug log
    dispatch(downloadPayrollPDF({ month }));
  };

  // Handle DatePicker change
  const handleDateChange = (date) => {
    if (date) {
      setSelectedMonth(date);
    }
  };

  return (
    <div className="w-78/100">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { name: "Payroll Management", Link: "/payroll-management"},
            { name: "Payroll History", Link: "/payroll-history"}, 
          ]}
        />
        <pageMeta title="Payroll History" description="Payroll History" />
      </div>
    <div className="min-h-screen bg-white rounded-2xl p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start sm:items-center">
        <div className="w-7/12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Payroll Management
          </h2>
          <p className="text-slate-500 text-base sm:text-lg">
            Automate and manage monthly payroll processing
          </p>
        </div>
        <div className="w-5/12 flex place-items-end-safe gap-3 mt-4">
          <div className="w-full gap-2">
            <DatePicker
              title="Select Month"
              value={selectedMonth}
              onChange={handleDateChange}
              maxDate={new Date()} // Prevent future dates
              showOnlyMonthYear // Custom prop to show only month and year
            />
          </div>      
          <button
            onClick={() => handleDownloadReport(formattedSelectedMonth)}
            className="flex items-center px-3 py-[10px] border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
          >
            <Download className="w-3 h-3 mr-1" />
            Export
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
            <h3 className="text-sm font-medium text-slate-500 truncate">
              Total Employees
            </h3>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              {selectedMonthRecord.totalEmployees}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 min-w-0">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-slate-500 truncate">
              Gross Pay
            </h3>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              ₹{selectedMonthRecord.grossPay.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 min-w-0">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-slate-500 truncate">
              Total Deductions
            </h3>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-rose-600 truncate">
              ₹{selectedMonthRecord.deductions.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 min-w-0">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-slate-500 truncate">
              Net Pay
            </h3>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 truncate">
              ₹{selectedMonthRecord.netPay.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Remove Processing Status Section (since Process Payroll is removed) */}

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
                <th className="text-left py-3 px-4 text-slate-900 font-medium">
                  Period
                </th>
                <th className="text-left py-3 px-4 text-slate-900 font-medium">
                  Employees
                </th>
                <th className="text-left py-3 px-4 text-slate-900 font-medium">
                  Gross Pay
                </th>
                <th className="text-left py-3 px-4 text-slate-900 font-medium">
                  Deductions
                </th>
                <th className="text-left py-3 px-4 text-slate-900 font-medium">
                  Net Pay
                </th>
                <th className="text-left py-3 px-4 text-slate-900 font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-slate-900 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {payrollRecordsArray.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="py-3 px-4 text-center text-slate-500"
                  >
                    No payroll records found for{" "}
                    {format(selectedMonth, "MMMM yyyy")}. Try refreshing or
                    changing the month.
                  </td>
                </tr>
              ) : (
                payrollRecordsArray.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-200"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {record.month} {record.year}
                        </p>
                        {record.processedDate && (
                          <p className="text-sm text-slate-500">
                            Processed:{" "}
                            {new Date(record.processedDate).toLocaleDateString(
                              "en-IN"
                            )}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-900">
                      {record.totalEmployees}
                    </td>
                    <td className="py-3 px-4 text-slate-900">
                      ₹{record.grossPay.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-rose-600">
                      ₹{record.deductions.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-emerald-600 font-medium">
                      ₹{record.netPay.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="p-2 text-teal-600 hover:text-teal-500 hover:bg-slate-100 rounded-lg transition-colors duration-200">
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
    </div>
  );
};

export default PayrollHistory;
