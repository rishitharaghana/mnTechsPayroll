import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, startOfMonth } from "date-fns";
import MonthYearPicker from "../../Components/ui/date/MontlyDatePicker";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import { generatePayroll, fetchPayroll, clearState, downloadPayrollPDF } from "../../redux/slices/payrollSlice";
import { fetchEmployees } from "../../redux/slices/employeeSlice";

const GeneratePayroll = () => {
  const dispatch = useDispatch();
  const { payrollList, loading, error, successMessage } = useSelector((state) => state.payroll);
  const { employees, loading: employeesLoading, error: employeesError } = useSelector((state) => state.employee);
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));

  useEffect(() => {
    console.log("Employees in state:", employees);
    console.log("PayrollList in state:", payrollList);
  }, [employees, payrollList]);

  if (!isAuthenticated || !["hr", "super_admin"].includes(role)) {
    return (
      <div className="space-y-8 bg-white rounded-2xl min-h-screen p-6">
        <p className="text-red-500">Access restricted. Please log in as HR or Super Admin.</p>
      </div>
    );
  }

  useEffect(() => {
    dispatch(fetchEmployees());
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(fetchPayroll({ month: formattedMonth }));
    dispatch(clearState());
  }, [dispatch, selectedMonth]);

  const handleGeneratePayroll = () => {
    if (!selectedMonth) {
      alert("Please select a month.");
      return;
    }
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    console.log("Generating payroll for month:", formattedMonth);
    dispatch(clearState());
    dispatch(generatePayroll({ month: formattedMonth })).then((result) => {
      if (generatePayroll.fulfilled.match(result)) {
        dispatch(fetchPayroll({ month: formattedMonth }));
      }
    });
  };

  const handleDownloadPDF = () => {
    if (!selectedMonth) {
      alert("Please select a month.");
      return;
    }
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    console.log("Downloading payroll PDF for month:", formattedMonth); // Debug log
    dispatch(clearState());
    dispatch(downloadPayrollPDF({ month: formattedMonth }));
  };

  return (
    <div className="w-78/100">
      <div className="flex justify-end">
      <PageMeta title="Generate Payroll" description="Generate payroll for all employees in a selected month." />
      <PageBreadcrumb
        items={[
          { label: "Home", link: "/" },
          { label: "Generate Payroll", link: "/admin/generate-payroll" },
        ]}
      />
      </div>
      <div className="space-y-8 bg-white rounded-2xl min-h-screen p-6">
      <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h1 className="text-3xl font-bold text-white">💼 Generate Payroll</h1>
        <p className="text-slate-200 text-lg mt-1">
          Generate payroll for all employees for the selected month.
        </p>
      </div>

      {(error || successMessage || employeesError) && (
        <div
          className={`p-4 rounded-lg ${
            error || employeesError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {error || employeesError || successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <MonthYearPicker
              name="monthPicker"
              value={selectedMonth}
              onChange={(date) => setSelectedMonth(startOfMonth(date))}
              maxDate={new Date()}
              titleClassName="text-slate-500 text-sm font-medium"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={handleGeneratePayroll}
            disabled={loading || employeesLoading || employees.length === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            ⚡ Generate Payroll for All
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={loading || payrollList.length === 0}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            📄 Download Payroll PDF
          </button>
        </div>
      </div>

      {/* Display generated payroll records */}
      {loading && <p className="text-slate-500">Loading payroll data...</p>}
      {!loading && payrollList.length === 0 && (
        <p className="text-slate-500">
          No payroll records found for {format(selectedMonth, "yyyy-MM")}.
        </p>
      )}
      {!loading && payrollList.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Generated Payroll Records</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-teal-600 to-slate-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Employee</th>
                  <th className="px-6 py-4 text-left">Gross Salary</th>
                  <th className="px-6 py-4 text-left">Net Salary</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payrollList.map((record) => (
                  <tr key={record.employee_id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      {record.employee_name} ({record.employee_id})
                    </td>
                    <td className="px-6 py-4">
                      ₹{(parseFloat(record.gross_salary) || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      ₹{(parseFloat(record.net_salary) || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          record.status === "Processed"
                            ? "bg-green-100 text-green-800"
                            : record.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default GeneratePayroll;