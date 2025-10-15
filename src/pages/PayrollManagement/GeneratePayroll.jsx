

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format, startOfMonth } from "date-fns";
import DatePicker from "../../Components/ui/date/DatePicker";
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
import {
  ChevronDown,
  FileText,
  FileDown,
  Eye,
  ArrowLeft,
  ArrowRight,
  UserCheck,
  X,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

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
      <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee</label>
      <div
        className={`flex items-center justify-between w-full rounded-md border ${
          disabled ? "border-slate-300 bg-slate-50 cursor-not-allowed" : "border-slate-300 bg-white cursor-pointer hover:border-teal-500"
        } px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-teal-500 transition-colors`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
      >
        <span className={value ? "text-slate-900" : "text-slate-400"}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>
      {isOpen && !disabled && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-teal-50 hover:text-teal-700 ${
                value === option.value ? "bg-teal-100 text-teal-800 font-medium" : "text-slate-900"
              }`}
              onClick={() => handleSelect(option.value)}
              role="option"
              aria-selected={value === option.value}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const GeneratePayroll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    payrollList = [],
    totalRecords = 0,
    loading,
    error,
    successMessage,
  } = useSelector((state) => state.payroll);
  const { employees, loading: employeesLoading } = useSelector(
    (state) => state.employee
  );
  const { role, isAuthenticated, employee_id } = useSelector((state) => state.auth);

  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const employeeOptions = useMemo(
    () => [
      { value: "", label: "Select an employee" },
      ...employees
        .filter((emp) => {
          if (role === "super_admin") return true;
          if (role === "hr") return !["super_admin", "hr"].includes(emp.role) || emp.employee_id === employee_id;
          return false;
        })
        .map((emp) => ({
          value: emp.employee_id,
          label: `${emp.full_name} (${emp.employee_id}, ${emp.role.charAt(0).toUpperCase() + emp.role.slice(1)})`,
        })),
    ],
    [employees, role, employee_id]
  );

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(fetchPayroll({ month: formattedMonth, page: currentPage, limit: itemsPerPage }));
    return () => dispatch(clearState());
  }, [dispatch, selectedMonth, currentPage]);

  useEffect(() => {
    if (error) toast.error(error.message || "An error occurred");
    if (successMessage) toast.success(successMessage);
  }, [error, successMessage]);

  if (!isAuthenticated || !["hr", "super_admin"].includes(role)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-red-600 text-lg font-medium">Access restricted. Please log in as HR or Super Admin.</p>
      </div>
    );
  }

  const handleGeneratePayroll = () => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(generatePayroll({ month: formattedMonth })).then((result) => {
      if (generatePayroll.fulfilled.match(result)) {
        dispatch(fetchPayroll({ month: formattedMonth, page: 1, limit: itemsPerPage }));
        toast.success("Payroll generated successfully");
        setCurrentPage(1);
      } else {
        toast.error(result.payload?.error || "Failed to generate payroll");
      }
    });
  };

  const handleViewDetails = () => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    navigate(`/admin/payroll-employee?employeeId=${selectedEmployeeId}&month=${formattedMonth}`);
  };

  const handleGenerateForEmployee = () => {
    const employee = employees.find((e) => e.employee_id === selectedEmployeeId);
    if (!employee) return toast.error("Employee not found");
    if (role === "hr" && employee.role === "hr" && employee.employee_id !== employee_id)
      return toast.error("HR cannot generate for other HR users");

    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch (generatePayrollForEmployee({ employeeId: selectedEmployeeId, month: formattedMonth })).then(
      (result) => {
        if (generatePayrollForEmployee.fulfilled.match(result)) {
          dispatch(fetchPayroll({ month: formattedMonth, page: currentPage, limit: itemsPerPage }));
          setSelectedPayroll(result.payload.data);
          toast.success("Payroll generated");
        } else {
          toast.error(result.payload?.error || "Failed");
        }
      }
    );
  };

  const handleDownloadPDF = () => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(downloadPayrollPDF({ month: formattedMonth }));
  };

  const handleDownloadPayslip = () => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(downloadPayslip({ employeeId: selectedEmployeeId, month: formattedMonth }));
  };

  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const formatCurrency = (val) =>
    `₹${(parseFloat(val) || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <>
      <PageMeta title="Generate Payroll" description="Manage payroll generation" />
      <PageBreadcrumb
        items={[
          { label: "Home", link: "/" },
          { label: "Generate Payroll", link: "/admin/generate-payroll" },
        ]}
      />

      <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Generate Payroll</h1>
            <p className="text-slate-600 mt-1">Select month and employee to generate or preview payroll.</p>
          </div>

          {/* Controls Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <DatePicker
                title="Select Month"
                value={selectedMonth}
                onChange={(date) => setSelectedMonth(startOfMonth(date))}
                maxDate={new Date()}
                showOnlyMonthYear
                titleClassName="block text-sm font-medium text-slate-700 mb-1"
              />
              <CustomSelect
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                options={employeeOptions}
                disabled={employeesLoading}
                placeholder="Select an employee"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGeneratePayroll}
                disabled={loading || employeesLoading}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-medium rounded-md hover:from-teal-700 hover:to-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : <FileText className="mr-2 w-4 h-4" />}
                Generate All
              </button>
              <button
                onClick={handleViewDetails}
                disabled={loading || !selectedEmployeeId}
                className="flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <UserCheck className="mr-2 w-4 h-4" />
                View Details
              </button>
              <button
                onClick={handleGenerateForEmployee}
                disabled={loading || !selectedEmployeeId}
                className="flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FileText className="mr-2 w-4 h-4" />
                Generate Employee
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-slate-600 text-white font-medium rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FileDown className="mr-2 w-4 h-4" />
                Payroll PDF
              </button>
              <button
                onClick={handleDownloadPayslip}
                disabled={loading || !selectedEmployeeId}
                className="flex items-center px-4 py-2 bg-slate-600 text-white font-medium rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <FileDown className="mr-2 w-4 h-4" />
                Payslip
              </button>
            </div>
          </div>

          {/* Fixed Modal */}
          {selectedPayroll && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b bg-slate-50">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Payslip - {selectedPayroll.employee_name || selectedPayroll.employee} ({selectedPayroll.employee_id})
                    <span className="text-sm font-normal text-slate-600 block">
                      {format(new Date(selectedPayroll.month + "-01"), "MMMM yyyy")}
                    </span>
                  </h2>
                  <button
                    onClick={() => setSelectedPayroll(null)}
                    className="text-slate-500 hover:text-slate-700 transition"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Modal Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                  <PaySlipGenerator
                    employee={selectedPayroll}
                    selectedMonth={format(selectedMonth, "yyyy-MM")}
                    onClose={() => setSelectedPayroll(null)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-slate-900">Generated Payroll Records</h2>
            </div>
            {loading ? (
              <div className="p-6 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              </div>
            ) : payrollList.length === 0 ? (
              <p className="p-6 text-center text-slate-500">
                No records for {format(selectedMonth, "yyyy-MM")}. Generate payroll to see data.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gradient-to-r from-teal-600 to-slate-700 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left">Employee</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left hidden md:table-cell">Dept</th>
                        <th className="px-4 py-3 text-right">Gross</th>
                        <th className="px-4 py-3 text-right">Net</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {payrollList.map((record, idx) => (
                        <tr key={`${record.employee_id}-${record.month}`} className={`hover:bg-slate-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
                        >
                          <td className="px-4 py-2 truncate max-w-xs">
                            {record.employee_name || record.employee} ({record.employee_id})
                          </td>
                          <td className="px-4 py-2">
                            {record.role?.charAt(0).toUpperCase() + record.role?.slice(1) || "-"}
                          </td>
                          <td className="px-4 py-2 hidden md:table-cell">{record.department || "HR"}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(record.gross_salary)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(record.net_salary)}</td>
                          <td className="px-4 py-2 text-center">
                            <span
                              className={`inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                                record.status ===
"Paid" || record.status === "Processed"
                                  ? "bg-green-100 text-green-800"
                                  : record.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <button
                                onClick={() => setSelectedPayroll(record)}
                                className="text-teal-600 hover:text-teal-800 p-1"
                                title="View Payslip"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => dispatch(downloadPayslip({ employeeId: record.employee_id, month: record.month }))}
                                className="text-teal-600 hover:text-teal-800 p-1"
                                title="Download"
                              >
                                <FileDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t">
                  <button
                    onClick={() => setCurrentPage((p) =>  Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Prev
                  </button>
                  <span className="text-sm text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GeneratePayroll;