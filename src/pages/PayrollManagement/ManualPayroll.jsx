import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, startOfMonth, subMonths } from "date-fns";
import DatePicker from "../../Components/ui/date/DatePicker";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import {
  generatePayroll,
  generatePayrollForEmployee,
  fetchPayroll,
  clearState,
  downloadPayrollPDF,
} from "../../redux/slices/payrollSlice";
import { fetchEmployees, fetchDepartments } from "../../redux/slices/employeeSlice";
import { downloadPayslip } from "../../redux/slices/payslipSlice";
import PaySlipGenerator from "../PayslipManagement/PaySlipGenerator";
import { toast } from "react-toastify";
import { ChevronDown, FileText, FileDown, Eye, ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";

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

const ManualPayroll = () => {
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
  const [manualData, setManualData] = useState({});
  const [leaveDetails, setLeaveDetails] = useState([]);
  const [previousMonthPayroll, setPreviousMonthPayroll] = useState([]);
  const itemsPerPage = 10;

  // Form states
  const [paidLeaveDays, setPaidLeaveDays] = useState("");
  const [unpaidLeaveDays, setUnpaidLeaveDays] = useState("");
  const [presentDays, setPresentDays] = useState("");
  const [totalWorkingDays, setTotalWorkingDays] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [hra, setHra] = useState("");
  const [allowances, setAllowances] = useState("");
  const [pfDeduction, setPfDeduction] = useState("");
  const [taxDeduction, setTaxDeduction] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [leaveStatus, setLeaveStatus] = useState("Paid");

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    const previousMonth = format(subMonths(selectedMonth, 1), "yyyy-MM");
    dispatch(fetchPayroll({ month: formattedMonth, page: currentPage, limit: itemsPerPage }));
    dispatch(fetchPayroll({ month: previousMonth, page: 1, limit: 100 })).then((result) => {
      if (fetchPayroll.fulfilled.match(result)) {
        setPreviousMonthPayroll(result.payload.data || []);
      }
    });
    return () => dispatch(clearState());
  }, [dispatch, selectedMonth, currentPage]);

  useEffect(() => {
    if (error) {
      const errorMessage = typeof error === "string" ? error : error.message || error.error || JSON.stringify(error);
      toast.error(errorMessage || "An error occurred");
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

  const isValidNumber = (value) => !isNaN(value) && value >= 0;

  const resetForm = () => {
    setPaidLeaveDays("");
    setUnpaidLeaveDays("");
    setPresentDays("");
    setTotalWorkingDays("");
    setBasicSalary("");
    setHra("");
    setAllowances("");
    setPfDeduction("");
    setTaxDeduction("");
    setLeaveType("");
    setLeaveStartDate("");
    setLeaveEndDate("");
    setLeaveStatus("Paid");
    setLeaveDetails([]);
  };

  const handleAddLeaveDetail = () => {
    if (!leaveType || !leaveStartDate || !leaveEndDate || !leaveStatus) {
      toast.error("Please fill all leave detail fields.");
      return;
    }
    const start = new Date(leaveStartDate);
    const end = new Date(leaveEndDate);
    if (end < start) {
      toast.error("End date cannot be before start date.");
      return;
    }
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    setLeaveDetails([
      ...leaveDetails,
      {
        type: leaveType,
        days,
        start_date: format(start, "yyyy-MM-dd"),
        end_date: format(end, "yyyy-MM-dd"),
        status: leaveStatus,
      },
    ]);
    setLeaveType("");
    setLeaveStartDate("");
    setLeaveEndDate("");
    setLeaveStatus("Paid");
  };

  const handleRemoveLeaveDetail = (index) => {
    setLeaveDetails(leaveDetails.filter((_, i) => i !== index));
  };

  const handleGeneratePayrollForEmployee = () => {
    if (!selectedMonth || !selectedEmployeeId) {
      toast.error("Please select a month and an employee.");
      return;
    }
    if (
      !paidLeaveDays ||
      !unpaidLeaveDays ||
      !presentDays ||
      !totalWorkingDays ||
      !basicSalary ||
      !hra ||
      !allowances ||
      !pfDeduction ||
      !taxDeduction
    ) {
      toast.error("Please fill all leave, attendance, and salary fields.");
      return;
    }
    if (
      !isValidNumber(paidLeaveDays) ||
      !isValidNumber(unpaidLeaveDays) ||
      !isValidNumber(presentDays) ||
      !isValidNumber(totalWorkingDays) ||
      !isValidNumber(basicSalary) ||
      !isValidNumber(hra) ||
      !isValidNumber(allowances) ||
      !isValidNumber(pfDeduction) ||
      !isValidNumber(taxDeduction)
    ) {
      toast.error("All fields must be valid non-negative numbers.");
      return;
    }
    if (parseFloat(presentDays) > parseFloat(totalWorkingDays)) {
      toast.error("Present days cannot exceed total working days.");
      return;
    }
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    const manualDataForEmployee = {
      paidLeaveDays: parseFloat(paidLeaveDays),
      unpaidLeaveDays: parseFloat(unpaidLeaveDays),
      presentDays: parseFloat(presentDays),
      totalWorkingDays: parseFloat(totalWorkingDays),
      basicSalary: parseFloat(basicSalary),
      hra: parseFloat(hra),
      allowances: parseFloat(allowances),
      pfDeduction: parseFloat(pfDeduction),
      taxDeduction: parseFloat(taxDeduction),
      leaveDetails,
    };
    console.log("Sending manualDataForEmployee:", JSON.stringify(manualDataForEmployee, null, 2));
    dispatch(
      generatePayrollForEmployee({
        employeeId: selectedEmployeeId,
        month: formattedMonth,
        manualData: manualDataForEmployee,
      })
    ).then((result) => {
      if (generatePayrollForEmployee.fulfilled.match(result)) {
        dispatch(fetchPayroll({ month: formattedMonth, page: currentPage, limit: itemsPerPage }));
        setSelectedPayroll(result.payload.data);
        toast.success(result.payload.message || "Payroll generated successfully");
        resetForm();
        setSelectedEmployeeId("");
      } else {
        toast.error(result.payload?.message || result.payload?.error || "Failed to generate payroll");
      }
    });
  };

  const handleGeneratePayroll = () => {
    if (!selectedMonth) {
      toast.error("Please select a month.");
      return;
    }
    if (Object.keys(manualData).length === 0) {
      toast.error("Please add manual data for at least one employee.");
      return;
    }
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    console.log("Sending manualData:", JSON.stringify(manualData, null, 2));
    dispatch(generatePayroll({ month: formattedMonth, manualData })).then((result) => {
      if (generatePayroll.fulfilled.match(result)) {
        dispatch(fetchPayroll({ month: formattedMonth, page: 1, limit: itemsPerPage }));
        toast.success(result.payload.message || "Payroll generated successfully");
        setCurrentPage(1);
        setManualData({});
      } else {
        toast.error(result.payload?.message || result.payload?.error || "Failed to generate payroll");
      }
    });
  };

  const handleAddEmployeeManualData = () => {
    if (!selectedEmployeeId) {
      toast.error("Please select an employee.");
      return;
    }
    if (
      !paidLeaveDays ||
      !unpaidLeaveDays ||
      !presentDays ||
      !totalWorkingDays ||
      !basicSalary ||
      !hra ||
      !allowances ||
      !pfDeduction ||
      !taxDeduction
    ) {
      toast.error("Please fill all leave, attendance, and salary fields.");
      return;
    }
    if (
      !isValidNumber(paidLeaveDays) ||
      !isValidNumber(unpaidLeaveDays) ||
      !isValidNumber(presentDays) ||
      !isValidNumber(totalWorkingDays) ||
      !isValidNumber(basicSalary) ||
      !isValidNumber(hra) ||
      !isValidNumber(allowances) ||
      !isValidNumber(pfDeduction) ||
      !isValidNumber(taxDeduction)
    ) {
      toast.error("All fields must be valid non-negative numbers.");
      return;
    }
    if (parseFloat(presentDays) > parseFloat(totalWorkingDays)) {
      toast.error("Present days cannot exceed total working days.");
      return;
    }
    const manualDataForEmployee = {
      paidLeaveDays: parseFloat(paidLeaveDays),
      unpaidLeaveDays: parseFloat(unpaidLeaveDays),
      presentDays: parseFloat(presentDays),
      totalWorkingDays: parseFloat(totalWorkingDays),
      basicSalary: parseFloat(basicSalary),
      hra: parseFloat(hra),
      allowances: parseFloat(allowances),
      pfDeduction: parseFloat(pfDeduction),
      taxDeduction: parseFloat(taxDeduction),
      leaveDetails,
    };
    setManualData({
      ...manualData,
      [selectedEmployeeId]: manualDataForEmployee,
    });
    resetForm();
    setSelectedEmployeeId("");
  };

  const handleRemoveEmployeeManualData = (employeeId) => {
    const newManualData = { ...manualData };
    delete newManualData[employeeId];
    setManualData(newManualData);
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
        toast.error(result.payload?.message || result.payload?.error || "Failed to download payroll PDF");
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
        toast.error(result.payload?.message || result.payload?.error || "Failed to download payslip");
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
          title="Manual Payroll Entry"
          description="Manually enter leave, attendance, and salary data to generate payroll for employees."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Manual Payroll Entry", link: "/admin/manual-payroll-entry" },
          ]}
        />
      </div>
      <div className="space-y-8 bg-white rounded-2xl min-h-screen sm:p-6 p-4">
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg border border-slate-200/50 sm:p-6 p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Manual Payroll Entry</h1>
          <p className="text-gray-200 text-sm sm:text-lg mt-1">
            Enter leave, attendance, and salary data manually to generate payroll for selected employees.
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

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-slate-500 text-sm font-medium">Paid Leave Days</label>
              <input
                type="number"
                value={paidLeaveDays}
                onChange={(e) => setPaidLeaveDays(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                placeholder="Enter paid leave days"
                min="0"
              />
            </div>
            <div>
              <label className="text-slate-500 text-sm font-medium">Unpaid Leave Days</label>
              <input
                type="number"
                value={unpaidLeaveDays}
                onChange={(e) => setUnpaidLeaveDays(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                placeholder="Enter unpaid leave days"
                min="0"
              />
            </div>
            <div>
              <label className="text-slate-500 text-sm font-medium">Present Days</label>
              <input
                type="number"
                value={presentDays}
                onChange={(e) => setPresentDays(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                placeholder="Enter present days"
                min="0"
              />
            </div>
            <div>
              <label className="text-slate-500 text-sm font-medium">Total Working Days</label>
              <input
                type="number"
                value={totalWorkingDays}
                onChange={(e) => setTotalWorkingDays(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                placeholder="Enter total working days"
                min="0"
              />
            </div>
            <div>
              <label className="text-slate-500 text-sm font-medium">Basic Salary (₹)</label>
              <input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                placeholder="Enter basic salary"
                min="0"
              />
            </div>
            <div>
              <label className="text-slate-500 text-sm font-medium">HRA (₹)</label>
              <input
                type="number"
                value={hra}
                onChange={(e) => setHra(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                placeholder="Enter HRA"
                min="0"
              />
            </div>
            <div>
              <label className="text-slate-500 text-sm font-medium">Allowances (₹)</label>
              <input
                type="number"
                value={allowances}
                onChange={(e) => setAllowances(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                placeholder="Enter allowances"
                min="0"
              />
            </div>
            <div>
              <label className="text-slate-500 text-sm font-medium">PF Deduction (₹)</label>
              <input
                type="number"
                value={pfDeduction}
                onChange={(e) => setPfDeduction(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                placeholder="Enter PF deduction"
                min="0"
              />
            </div>
            <div>
              <label className="text-slate-500 text-sm font-medium">Tax Deduction (₹)</label>
              <input
                type="number"
                value={taxDeduction}
                onChange={(e) => setTaxDeduction(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                placeholder="Enter tax deduction"
                min="0"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-900">Leave Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div>
                <label className="text-slate-500 text-sm font-medium">Leave Type</label>
                <input
                  type="text"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                  placeholder="e.g., Sick, Casual"
                />
              </div>
              <div>
                <label className="text-slate-500 text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  value={leaveStartDate}
                  onChange={(e) => setLeaveStartDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-slate-500 text-sm font-medium">End Date</label>
                <input
                  type="date"
                  value={leaveEndDate}
                  onChange={(e) => setLeaveEndDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="text-slate-500 text-sm font-medium">Status</label>
                <select
                  value={leaveStatus}
                  onChange={(e) => setLeaveStatus(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-slate-300 py-2 px-3 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleAddLeaveDetail}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500"
            >
              <Plus className="inline-block mr-2 w-5 h-5" />
              Add Leave Detail
            </button>
          </div>

          {leaveDetails.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-slate-900">Added Leave Details</h4>
              <table className="min-w-full text-sm border-collapse mt-2">
                <thead className="bg-teal-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Days</th>
                    <th className="px-4 py-2 text-left">Start Date</th>
                    <th className="px-4 py-2 text-left">End Date</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {leaveDetails.map((detail, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{detail.type}</td>
                      <td className="px-4 py-2">{detail.days}</td>
                      <td className="px-4 py-2">{detail.start_date}</td>
                      <td className="px-4 py-2">{detail.end_date}</td>
                      <td className="px-4 py-2">{detail.status}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleRemoveLeaveDetail(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={handleAddEmployeeManualData}
              disabled={loading || employeesLoading || !selectedEmployeeId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <Plus className="inline-block mr-2 w-5 h-5" />
              Add Employee Data
            </button>
            <button
              onClick={handleGeneratePayrollForEmployee}
              disabled={loading || employeesLoading || !selectedEmployeeId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <FileText className="inline-block mr-2 w-5 h-5" />
              Generate Payroll for Employee
            </button>
            <button
              onClick={handleGeneratePayroll}
              disabled={loading || employeesLoading || Object.keys(manualData).length === 0}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <FileText className="inline-block mr-2 w-5 h-5" />
              Generate Payroll for All
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={loading || employeesLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-slate-700 text-white font-medium rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <FileDown className="inline-block mr-2 w-5 h-5" />
              Download Payroll PDF
            </button>
          </div>

          {Object.keys(manualData).length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-semibold text-slate-900">Manual Data for Employees</h4>
              <table className="min-w-full text-sm border-collapse mt-2">
                <thead className="bg-teal-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Employee ID</th>
                    <th className="px-4 py-2 text-left">Paid Leave</th>
                    <th className="px-4 py-2 text-left">Unpaid Leave</th>
                    <th className="px-4 py-2 text-left">Present Days</th>
                    <th className="px-4 py-2 text-left">Total Days</th>
                    <th className="px-4 py-2 text-left">Basic Salary (₹)</th>
                    <th className="px-4 py-2 text-left">HRA (₹)</th>
                    <th className="px-4 py-2 text-left">Allowances (₹)</th>
                    <th className="px-4 py-2 text-left">PF Deduction (₹)</th>
                    <th className="px-4 py-2 text-left">Tax Deduction (₹)</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {Object.entries(manualData).map(([empId, data]) => (
                    <tr key={empId}>
                      <td className="px-4 py-2">{empId}</td>
                      <td className="px-4 py-2">{data.paidLeaveDays}</td>
                      <td className="px-4 py-2">{data.unpaidLeaveDays}</td>
                      <td className="px-4 py-2">{data.presentDays}</td>
                      <td className="px-4 py-2">{data.totalWorkingDays}</td>
                      <td className="px-4 py-2">{data.basicSalary.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2">{data.hra.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2">{data.allowances.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2">{data.pfDeduction.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2">{data.taxDeduction.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleRemoveEmployeeManualData(empId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {previousMonthPayroll.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 sm:p-6 p-4 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Previous Month Payroll ({format(subMonths(selectedMonth, 1), "MMMM yyyy")})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gradient-to-r border border-slate-200 rounded-md shadow-md from-teal-600 to-slate-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Employee</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Role</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap hidden sm:table-cell">Department</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Basic Salary (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">HRA (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Allowances (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">PF Deduction (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Tax Deduction (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Gross Salary (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Net Salary (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="border border-slate-200 divide-y divide-slate-200">
                  {previousMonthPayroll.map((record) => (
                    <tr key={`${record.employee_id}-${record.month}`} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap truncate max-w-[180px]">
                        {record.employee_name} ({record.employee_id})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.designation_name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        {record.department || "HR"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{(parseFloat(record.basic_salary) || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{(parseFloat(record.hra) || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{(parseFloat(record.special_allowances) || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{(parseFloat(record.pf_deduction) || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{(parseFloat(record.tax_deduction) || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
                    <th className="px-6 py-4 text-left whitespace-nowrap">Basic Salary (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">HRA (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Allowances (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">PF Deduction (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Tax Deduction (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Gross Salary (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Net Salary (₹)</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Status</th>
                    <th className="px-6 py-4 text-left whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="border border-slate-200 divide-y divide-slate-200">
                  {payrollList.map((record) => (
                    <tr key={`${record.employee_id}-${record.month}`} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap truncate max-w-[180px]">
                        {record.employee_name} ({record.employee_id})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.designation_name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        {record.department || "HR"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{(parseFloat(record.basic_salary) || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{(parseFloat(record.hra) || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{(parseFloat(record.special_allowances) || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{(parseFloat(record.pf_deduction) || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{(parseFloat(record.tax_deduction) || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
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

export default ManualPayroll;