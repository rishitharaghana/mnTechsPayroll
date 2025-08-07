import { useState } from "react";
import { Calendar, Download, Play, Pause, DollarSign, FileText } from "lucide-react";

const mockPayrollRecords = [
  {
    id: "1",
    month: "March",
    year: 2024,
    totalEmployees: 247,
    grossPay: 156750,
    deductions: 28300,
    netPay: 128450,
    status: "completed",
    processedDate: "2024-03-01",
  },
  {
    id: "2",
    month: "February",
    year: 2024,
    totalEmployees: 245,
    grossPay: 154200,
    deductions: 27850,
    netPay: 126350,
    status: "completed",
    processedDate: "2024-02-01",
  },
  {
    id: "3",
    month: "April",
    year: 2024,
    totalEmployees: 250,
    grossPay: 158900,
    deductions: 29100,
    netPay: 129800,
    status: "processing",
  },
];

const PayrollHistory = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [payrollRecords] = useState(mockPayrollRecords);

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
    }
  };

  const handleProcessPayroll = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Payroll Management</h2>
          <p className="text-slate-500 text-base sm:text-lg">Automate and manage monthly payroll processing</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            className="flex items-center px-4 py-2 border border-slate-200 text-slate-900 rounded-lg hover:bg-slate-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
          <button
            className={`flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
              isProcessing ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleProcessPayroll}
            disabled={isProcessing}
          >
            {isProcessing ? (
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

      {/* Current Month Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-slate-500">Total Employees</h3>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">250</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-slate-500">Gross Pay</h3>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">$158,900</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-slate-500">Total Deductions</h3>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-rose-600">$29,100</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="pb-2">
            <h3 className="text-sm font-medium text-slate-500">Net Pay</h3>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">$129,800</div>
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
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
              Processing payroll for 250 employees. This may take a few minutes.
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
              {payrollRecords.map((record) => (
                <tr key={record.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-200">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-slate-900">{record.month} {record.year}</p>
                      {record.processedDate && (
                        <p className="text-sm text-slate-500">
                          Processed: {new Date(record.processedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-900">{record.totalEmployees}</td>
                  <td className="py-3 px-4 text-slate-900">${record.grossPay.toLocaleString()}</td>
                  <td className="py-3 px-4 text-rose-600">${record.deductions.toLocaleString()}</td>
                  <td className="py-3 px-4 text-emerald-600 font-medium">${record.netPay.toLocaleString()}</td>
                  <td className="py-3 px-4">{getStatusBadge(record.status)}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-teal-600 hover:text-teal-500 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-teal-600 hover:text-teal-500 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollHistory;