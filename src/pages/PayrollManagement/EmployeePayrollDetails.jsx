import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, startOfMonth } from "date-fns";
import { toast } from "react-toastify";
import {
  fetchPayroll,
  generatePayrollForEmployee,
  downloadPayrollPDF,
} from "../../redux/slices/payrollSlice";
import { fetchEmployees } from "../../redux/slices/employeeSlice";
import { downloadPayslip } from "../../redux/slices/payslipSlice";
import DatePicker from "../../Components/ui/date/DatePicker";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PayslipGenerator from "../PayslipManagement/PayslipGenerator";
import {
  FileDown,
  FileText,
  Calendar,
  Users,
  Clock,
  DollarSign,
  FileSpreadsheet,
  ChevronDown,
  Eye,
} from "lucide-react";

// CustomSelect component (reused from GeneratePayroll)
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

const EmployeePayrollDetails = () => {
  const dispatch = useDispatch();
  const { payrollList = [], loading, error, successMessage } = useSelector(
    (state) => state.payroll
  );
  const { employees, loading: employeesLoading, error: employeesError } = useSelector(
    (state) => state.employee
  );
  const { role, isAuthenticated, employee_id } = useSelector((state) => state.auth);

  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployees());
    if (selectedEmployeeId && selectedMonth) {
      const formattedMonth = format(selectedMonth, "yyyy-MM");
      dispatch(
        fetchPayroll({
          month: formattedMonth,
          page: 1,
          limit: 1,
          employeeId: selectedEmployeeId,
        })
      );
    }
  }, [dispatch, selectedEmployeeId, selectedMonth]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || error);
    }
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [error, successMessage]);

  useEffect(() => {
    if (selectedEmployeeId) {
      const employee = employees.find((e) => e.employee_id === selectedEmployeeId);
      if (employee) {
        setEmployeeDetails(employee);
      } else {
        setEmployeeDetails(null);
      }
    } else {
      setEmployeeDetails(null);
    }
  }, [selectedEmployeeId, employees]);

  if (!isAuthenticated || !["hr", "super_admin"].includes(role)) {
    return (
      <div className="space-y-8 bg-white rounded-2xl min-h-screen p-6">
        <p className="text-red-500">Access restricted. Please log in as HR or Super Admin.</p>
      </div>
    );
  }

  const handleGeneratePayroll = () => {
    if (!selectedMonth || !selectedEmployeeId) {
      toast.error("Please select a month and an employee.");
      return;
    }
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(
      generatePayrollForEmployee({ employeeId: selectedEmployeeId, month: formattedMonth })
    ).then((result) => {
      if (generatePayrollForEmployee.fulfilled.match(result)) {
        dispatch(
          fetchPayroll({
            month: formattedMonth,
            page: 1,
            limit: 1,
            employeeId: selectedEmployeeId,
          })
        );
        setSelectedPayroll(result.payload.data);
        toast.success(result.payload.message || "Payroll generated successfully");
      } else {
        toast.error(result.payload?.error || "Failed to generate payroll");
      }
    });
  };

  const handleDownloadPayslip = () => {
    if (!selectedMonth || !selectedEmployeeId) {
      toast.error("Please select a month and an employee.");
      return;
    }
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(
      downloadPayslip({ employeeId: selectedEmployeeId, month: formattedMonth })
    ).then((result) => {
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

  const payrollRecord = payrollList.find(
    (record) => record.employee_id === selectedEmployeeId && record.month === format(selectedMonth, "yyyy-MM")
  );

  const summaryStats = payrollRecord
    ? [
        {
          title: "Days Worked",
          value: payrollRecord.present_days || 0,
          icon: Clock,
        },
        {
          title: "Total Leaves",
          value: (payrollRecord.paid_leave_days || 0) + (payrollRecord.unpaid_leave_days || 0),
          icon: Calendar,
        },
        {
          title: "Gross Salary",
          value: `₹${(parseFloat(payrollRecord.gross_salary) || 0).toLocaleString("en-IN")}`,
          icon: DollarSign,
        },
        {
          title: "Net Salary",
          value: `₹${(parseFloat(payrollRecord.net_salary) || 0).toLocaleString("en-IN")}`,
          icon: DollarSign,
        },
      ]
    : [];

  return (
    <div className="w-full">
      <div className="hidden sm:flex sm:justify-end">
        <PageMeta
          title="Employee Payroll Details"
          description="View detailed payroll information for a selected employee."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Employee Payroll Details", link: "/admin/employee-payroll-details" },
          ]}
        />
      </div>
      <div className="space-y-8 bg-white rounded-2xl min-h-screen p-4 sm:p-6">
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg border border-slate-200/50 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Employee Payroll Details</h1>
          <p className="text-gray-200 text-sm sm:text-lg mt-1">
            Select an employee and month to view detailed payroll information.
          </p>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="lg:max-w-xs">
              <DatePicker
                title="Select Month"
                value={selectedMonth}
                onChange={(date) => setSelectedMonth(startOfMonth(date))}
                maxDate={new Date()}
                showOnlyMonthYear
                titleClassName="text-slate-500 text-sm font-medium"
                className="w-full px-3 rounded-lg border border-slate-300 bg-white text-teal-600 focus:ring-2 focus:ring-teal-400"
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
              disabled={loading || employeesLoading || !selectedEmployeeId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-transform duration-300 transform hover:scale-105"
            >
              <FileText className="inline-block mr-2 w-5 h-5" />
              Generate Payroll
            </button>
            <button
              onClick={handleDownloadPayslip}
              disabled={loading || employeesLoading || !selectedEmployeeId || !payrollRecord}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-transform duration-300 transform hover:scale-105"
            >
              <FileDown className="inline-block mr-2 w-5 h-5" />
              Download Payslip
            </button>
          </div>
        </div>

        {loading && <p className="text-slate-500">Loading payroll data...</p>}
        {employeesError && <p className="text-red-500">Error loading employees: {employeesError}</p>}
        {!loading && !selectedEmployeeId && (
          <p className="text-slate-500">Please select an employee to view payroll details.</p>
        )}
        {!loading && selectedEmployeeId && !payrollRecord && (
          <p className="text-slate-500">
            No payroll record found for {employeeDetails?.full_name || selectedEmployeeId} in{" "}
            {format(selectedMonth, "yyyy-MM")}. Try generating payroll.
          </p>
        )}
        {!loading && payrollRecord && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {summaryStats.map(({ title, value, icon: Icon }, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
                      <Icon className="text-white" size={20} />
                    </div>
                  </div>
                  <h3 className="text-slate-500 text-xs sm:text-sm font-medium mb-1 truncate">
                    {title}
                  </h3>
                  <p className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
                Payroll Details for {employeeDetails?.full_name || selectedEmployeeId}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Employee ID</p>
                  <p className="text-base font-medium text-slate-900">{payrollRecord.employee_id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Department</p>
                  <p className="text-base font-medium text-slate-900">{payrollRecord.department || "HR"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Designation</p>
                  <p className="text-base font-medium text-slate-900">{payrollRecord.designation_name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      payrollRecord.status === "Processed" || payrollRecord.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : payrollRecord.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {payrollRecord.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Days Worked</p>
                  <p className="text-base font-medium text-slate-900">{payrollRecord.present_days || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Paid Leave Days</p>
                  <p className="text-base font-medium text-slate-900">{payrollRecord.paid_leave_days || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Unpaid Leave Days</p>
                  <p className="text-base font-medium text-slate-900">{payrollRecord.unpaid_leave_days || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Holidays</p>
                  <p className="text-base font-medium text-slate-900">{payrollRecord.holidays || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Working Days</p>
                  <p className="text-base font-medium text-slate-900">{payrollRecord.total_working_days || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Unpaid Leave Deduction</p>
                  <p className="text-base font-medium text-red-600">
                    ₹{(parseFloat(payrollRecord.unpaid_leave_deduction) || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
              {payrollRecord.leave_details && payrollRecord.leave_details.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-base font-bold text-slate-900 mb-2">Leave Details</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border-collapse">
                      <thead className="bg-gradient-to-r from-teal-600 to-slate-700 text-white">
                        <tr>
                          <th className="px-4 py-2 text-left">Type</th>
                          <th className="px-4 py-2 text-left">Days</th>
                          <th className="px-4 py-2 text-left">Start Date</th>
                          <th className="px-4 py-2 text-left">End Date</th>
                          <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {payrollRecord.leave_details.map((leave, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-4 py-2">{leave.type}</td>
                            <td className="px-4 py-2">{leave.days}</td>
                            <td className="px-4 py-2">{leave.start_date}</td>
                            <td className="px-4 py-2">{leave.end_date}</td>
                            <td className="px-4 py-2">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  leave.status === "Paid" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {leave.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleViewPayslip(payrollRecord)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 transition-transform duration-300 transform hover:scale-105"
                >
                  <Eye className="inline-block mr-2 w-5 h-5" />
                  View Payslip
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedPayroll && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <PayslipGenerator
                employee={selectedPayroll}
                selectedMonth={format(selectedMonth, "yyyy-MM")}
                onClose={() => setSelectedPayroll(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeePayrollDetails;