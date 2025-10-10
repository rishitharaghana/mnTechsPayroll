import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, startOfMonth } from "date-fns";
import DatePicker from "../../Components/ui/date/DatePicker";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import {
  generatePayroll,
  fetchPayroll,
  clearState,
  downloadPayrollPDF,
  generatePayrollForEmployee,
} from "../../redux/slices/payrollSlice";
import { fetchEmployees, fetchDepartments } from "../../redux/slices/employeeSlice";
import { downloadPayslip } from "../../redux/slices/payslipSlice";
import PaySlipGenerator from "../PayslipManagement/PaySlipGenerator";
import { toast } from "react-toastify";
import { ChevronDown, FileText, FileDown, Eye, ArrowLeft, ArrowRight } from "lucide-react";

const CustomSelect = ({ value, onChange, options, disabled, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative" ref={selectRef}>
      <label className="text-slate-500 text-sm font-medium">Select Employee</label>
      <div
        className={`mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 sm:text-sm cursor-pointer transition-all duration-200 ${
          disabled ? "bg-slate-100 cursor-not-allowed" : "hover:border-teal-400"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <span className={value ? "text-slate-900" : "text-slate-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>
      {isOpen && !disabled && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-teal-50 hover:text-teal-700 ${
                value === option.value ? "bg-teal-100 text-teal-800 font-medium" : "text-slate-900"
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const GeneratePayroll = () => {
  const dispatch = useDispatch();
  const { payrollList = [], totalRecords = 0, loading, error, successMessage } = useSelector(
    (state) => state.payroll
  );
  const { employees, departments, loading: employeesLoading, error: employeesError } = useSelector(
    (state) => state.employee
  );
  const { role, isAuthenticated, employee_id } = useSelector((state) => state.auth);
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(fetchPayroll({ month: formattedMonth, page: currentPage, limit: itemsPerPage }));
    return () => dispatch(clearState());
  }, [dispatch, selectedMonth, currentPage]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [error, successMessage]);

  if (!isAuthenticated || !["hr", "super_admin"].includes(role)) {
    return (
      <div className="space-y-8 bg-white rounded-2xl min-h-screen p-6">
        <p className="text-red-500">Access restricted. Please log in as HR or Super Admin.</p>
      </div>
    );
  }

  const handleGeneratePayroll = () => {
    if (!selectedMonth) {
      toast.error("Please select a month.");
      return;
    }
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(generatePayroll({ month: formattedMonth })).then((result) => {
      if (generatePayroll.fulfilled.match(result)) {
        dispatch(fetchPayroll({ month: formattedMonth, page: 1, limit: itemsPerPage }));
        toast.success(result.payload.message || "Payroll generated successfully");
        setCurrentPage(1);
      } else {
        toast.error(result.payload?.error || "Failed to generate payroll");
      }
    });
  };

  const handleGeneratePayrollForEmployee = (employeeId) => {
    if (!selectedMonth || !employeeId) {
      toast.error("Please select a month and an employee.");
      return;
    }
    console.log(`Frontend: Generating payroll for employeeId: "${employeeId}" (length: ${employeeId.length}, type: ${typeof employeeId})`);
    const employee = employees.find((e) => e.employee_id === employeeId);
    console.log("Frontend: Employee data:", employee);
    if (!employee) {
      toast.error("Employee not found in the employees list.");
      return;
    }
    if (role === "hr" && employee.role === "hr" && employee.employee_id !== employee_id) {
      toast.error("HR users cannot generate payroll for other HR users.");
      return;
    }
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(generatePayrollForEmployee({ employeeId, month: formattedMonth })).then((result) => {
      if (generatePayrollForEmployee.fulfilled.match(result)) {
        dispatch(fetchPayroll({ month: formattedMonth, page: currentPage, limit: itemsPerPage }));
        setSelectedPayroll(result.payload.data);
        toast.success(result.payload.message || "Payroll generated successfully");
      } else {
        console.error("Frontend: Payroll generation error:", result.payload);
        toast.error(result.payload?.error || "Failed to generate payroll");
      }
    });
  };

  const handleDownloadPDF = () => {
    if (!selectedMonth) {
      toast.error("Please select a month.");
      return;
    }
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(downloadPayrollPDF({ month: formattedMonth })).then((result) => {
      if (downloadPayrollPDF.fulfilled.match(result)) {
        toast.success(result.payload?.message || "Payroll PDF downloaded successfully");
      } else {
        toast.error(result.payload?.error || "Failed to download payroll PDF");
      }
    });
  };

  const handleDownloadEmployeePayslip = (employeeId) => {
    if (!selectedMonth || !employeeId) {
      toast.error("Please select a month and an employee.");
      return;
    }
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(downloadPayslip({ employeeId, month: formattedMonth })).then((result) => {
      if (downloadPayslip.fulfilled.match(result)) {
        toast.success("Payslip downloaded successfully");
      } else {
        toast.error(result.payload?.error || "Failed to download payslip");
      }
    });
  };

  const handleViewPayslip = (record) => {
    setSelectedPayroll(record);
  };

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const employeeOptions = [
    { value: "", label: "Select an employee" },
    ...employees
      .filter((employee) => {
        if (role === "super_admin") return true;
        if (role === "hr") {
          return employee.role !== "hr" || employee.employee_id === employee_id;
        }
        return false;
      })
      .map((employee) => ({
        value: employee.employee_id,
        label: `${employee.full_name} (${employee.employee_id}, ${employee.role.charAt(0).toUpperCase() + employee.role.slice(1)})`,
      })),
  ];

  return (
    <div className="w-full">
      <div className="hidden sm:flex sm:justify-end">
        <PageMeta
          title="Generate Payroll"
          description="Generate payroll for all employees or a specific employee in a selected month."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Generate Payroll", link: "/admin/generate-payroll" },
          ]}
        />
      </div>
      <div className="space-y-8 bg-white rounded-2xl min-h-screen sm:p-6 p-4">
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg border border-slate-200/50 sm:p-6 p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Generate Payroll</h1>
          <p className="text-gray-200 text-sm sm:text-lg mt-1">
            Generate payroll for all employees or a specific employee for the selected month.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200/50 sm:p-6 p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="lg:max-w-xs">
              <DatePicker
                title="Select Month"
                value={selectedMonth}
                onChange={(date) => setSelectedMonth(startOfMonth(date))}
                maxDate={new Date()}
                showOnlyMonthYear
                titleClassName="text-slate-500 text-sm font-medium"
              />
            </div>
            <div className="lg:max-w-xs">
              <CustomSelect
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                options={employeeOptions}
                disabled={employeesLoading || employees.length === 0}
                placeholder="Select an employee"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleGeneratePayroll}
              disabled={loading || employeesLoading || employees.length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <FileText className="inline-block mr-2 w-5 h-5" />
              Generate Payroll for All
            </button>
            <button
              onClick={() => handleGeneratePayrollForEmployee(selectedEmployeeId)}
              disabled={loading || employeesLoading || !selectedEmployeeId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <FileText className="inline-block mr-2 w-5 h-5" />
              Generate Payroll for Employee
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={loading || employeesLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <FileDown className="inline-block mr-2 w-5 h-5" />
              Download Payroll PDF
            </button>
            <button
              onClick={() => handleDownloadEmployeePayslip(selectedEmployeeId)}
              disabled={loading || employeesLoading || !selectedEmployeeId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <FileDown className="inline-block mr-2 w-5 h-5" />
              Download Employee Payslip
            </button>
          </div>
        </div>

        {selectedPayroll && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border border-slate-200 sm:p-6 p-4 shadow-sm max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <PaySlipGenerator
                employee={selectedPayroll}
                selectedMonth={format(selectedMonth, "yyyy-MM")}
                onClose={() => setSelectedPayroll(null)}
              />
            </div>
          </div>
        )}

        {loading && <p className="text-slate-500">Loading payroll data...</p>}
        {employeesError && <p className="text-red-500">Error loading employees: {employeesError}</p>}
        {!loading && payrollList.length === 0 && (
          <p className="text-slate-500">
            No payroll records found for {format(selectedMonth, "yyyy-MM")}. Try generating payroll.
          </p>
        )}
        {!loading && payrollList.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 sm:p-6 p-4 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Generated Payroll Records</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gradient-to-r border border-slate-200 rounded-md shadow-md from-teal-600 to-slate-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Employee</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Role</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap hidden sm:table-cell">Department</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Gross Salary</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Net Salary</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="border border-slate-200 divide-y divide-slate-200">
                  {payrollList.map((record) => (
                    <tr key={`${record.employee_id}-${record.month}`} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap truncate max-w-[180px]">
                        {record.employee} ({record.employee_id})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.role ? record.role.charAt(0).toUpperCase() + record.role.slice(1) : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        {record.department || "HR"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{(parseFloat(record.gross_salary) || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{(parseFloat(record.net_salary) || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.status === "Processed" || record.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : record.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex flex-col sm:flex-row gap-2 whitespace-nowrap">
                        <button
                          onClick={() => handleViewPayslip(record)}
                          className="text-teal-600 hover:text-teal-800 flex items-center"
                        >
                          <Eye className="inline-block mr-2 w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadEmployeePayslip(record.employee_id)}
                          className="text-teal-600 hover:text-teal-800 flex items-center"
                        >
                          <FileDown className="inline-block mr-2 w-4 h-4" />
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex sm:flex-row justify-between items-center gap-3 pt-4 sm:p-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-md bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="inline-block mr-2 w-5 h-5" />
                Previous
              </button>
              <span className="text-sm sm:text-md text-slate-500">Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 sm:px-4 py-2 text-sm sm:text-md bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <ArrowRight className="inline-block mr-2 w-5 h-5" />
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratePayroll;