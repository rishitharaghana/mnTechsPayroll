import React, { useState, useEffect, useMemo } from "react";
import { Eye, X, CheckCircle, FileSpreadsheet, DollarSign, Users, TrendingUp, Calculator } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { format, parse, startOfMonth } from "date-fns";
import { toast } from "react-toastify";
import {
  fetchPayroll,
  generatePayroll,
  generatePayrollForEmployee,
  downloadPayrollPDF,
  clearState,
} from "../../redux/slices/payrollSlice";
import { fetchPayslips, downloadPayslip } from "../../redux/slices/payslipSlice";
import { fetchEmployees } from "../../redux/slices/employeeSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import DatePicker from "../../Components/ui/date/DatePicker";
import PayslipGenerator from "../PayslipManagement/PaySlipGenerator";

const PayrollManagement = () => {
  const dispatch = useDispatch();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const { payrollList, totalRecords: payrollTotal, loading: payrollLoading, error: payrollError, successMessage } = useSelector((state) => state.payroll);
  const { payslips, totalRecords: payslipTotal, loading: payslipLoading, error: payslipError } = useSelector((state) => state.payslip);
  const { employees, loading: employeesLoading } = useSelector((state) => state.employee);

  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ search: "", department: "", status: "" });
  const [sortConfig, setSortConfig] = useState({ key: "employee_name", direction: "asc" });
  const [showPreview, setShowPreview] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    if (isAuthenticated && ["hr", "super_admin"].includes(role)) {
      dispatch(fetchEmployees());
      const formattedMonth = format(selectedMonth, "yyyy-MM");
      dispatch(fetchPayroll({ month: formattedMonth, page: currentPage, limit: itemsPerPage }));
      dispatch(fetchPayslips({ month: formattedMonth, page: currentPage, limit: itemsPerPage }));
      dispatch(clearState());
    }
  }, [dispatch, isAuthenticated, role, selectedMonth, currentPage]);

  const filteredPayrolls = useMemo(() => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    return (Array.isArray(payrollList) ? payrollList : [])
      .filter((record) => {
        return (
          record.employee_name?.toLowerCase().includes(filters.search.toLowerCase()) &&
          (!filters.department || record.department === filters.department) &&
          (!filters.status || record.status === filters.status) &&
          record.month === formattedMonth
        );
      })
      .map((record) => ({
        ...record,
        totalEarnings:
          parseFloat(record.basic_salary || 0) +
          parseFloat(record.hra || 0) +
          parseFloat(record.da || 0) +
          parseFloat(record.other_allowances || 0),
        totalDeductions:
          parseFloat(record.pf_deduction || 0) +
          parseFloat(record.esic_deduction || 0) +
          parseFloat(record.tax_deduction || 0) +
          parseFloat(record.professional_tax || 0),
      }))
      .sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        return sortConfig.direction === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
      });
  }, [payrollList, filters, sortConfig, selectedMonth]);

  const paginatedPayrolls = filteredPayrolls.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredPayrolls.length / itemsPerPage);

  const summaryStats = [
    {
      title: "Total Payroll",
      value: `₹${filteredPayrolls.reduce((sum, emp) => sum + (parseFloat(emp.gross_salary) || 0), 0).toLocaleString("en-IN")}`,
      icon: DollarSign,
    },
    {
      title: "Employees Paid",
      value: filteredPayrolls.length,
      icon: Users,
    },
    {
      title: "Avg. Gross Salary",
      value: `₹${filteredPayrolls.length ? (filteredPayrolls.reduce((sum, emp) => sum + (parseFloat(emp.gross_salary) || 0), 0) / filteredPayrolls.length).toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "0.00"}`,
      icon: TrendingUp,
    },
    {
      title: "Total PF Deductions",
      value: `₹${filteredPayrolls.reduce((sum, emp) => sum + (parseFloat(emp.pf_deduction) || 0), 0).toLocaleString("en-IN")}`,
      icon: Calculator,
    },
  ];

  const handleSort = (key) => {
    setSortConfig({
      key: key === "Employee" ? "employee_name" : key === "Gross Salary" ? "gross_salary" : key === "Net Salary" ? "net_salary" : key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const handleGeneratePayroll = () => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    if (!formattedMonth || !/^\d{4}-(0[1-9]|1[0-2])$/.test(formattedMonth)) {
      toast.error("Please select a valid month");
      return;
    }
    const action = selectedEmployeeId
      ? generatePayrollForEmployee({ employeeId: selectedEmployeeId, month: formattedMonth })
      : generatePayroll({ month: formattedMonth });
    dispatch(action)
      .unwrap()
      .then(() => {
        dispatch(fetchPayroll({ month: formattedMonth, page: currentPage, limit: itemsPerPage }));
        dispatch(fetchPayslips({ month: formattedMonth, page: currentPage, limit: itemsPerPage }));
        toast.success("Payroll generated successfully");
      })
      .catch((err) => toast.error(err || "Failed to generate payroll"));
  };

  const handleDownloadPayrollPDF = () => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    if (!formattedMonth || !/^\d{4}-(0[1-9]|1[0-2])$/.test(formattedMonth)) {
      toast.error("Please select a valid month");
      return;
    }
    dispatch(downloadPayrollPDF({ month: formattedMonth, employeeId: selectedEmployeeId }))
      .unwrap()
      .then(() => toast.success("Payroll PDF downloaded successfully"))
      .catch((err) => toast.error(err || "Failed to download payroll PDF"));
  };

  const handleDownloadPayslip = (employeeId) => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    if (!employeeId || !formattedMonth || !/^\d{4}-(0[1-9]|1[0-2])$/.test(formattedMonth)) {
      toast.error("Please select an employee and a valid month");
      return;
    }
    const payrollExists = payrollList.find((p) => p.employee_id === employeeId && p.month === formattedMonth);
    if (!payrollExists) {
      dispatch(generatePayrollForEmployee({ employeeId, month: formattedMonth }))
        .unwrap()
        .then(() => {
          dispatch(fetchPayroll({ month: formattedMonth, page: currentPage, limit: itemsPerPage }));
          dispatch(downloadPayslip({ employeeId, month: formattedMonth }))
            .unwrap()
            .then(() => toast.success("Payslip downloaded successfully"))
            .catch((err) => toast.error(err || "Failed to download payslip"));
        })
        .catch((err) => toast.error(err || "Failed to generate payroll"));
    } else {
      dispatch(downloadPayslip({ employeeId, month: formattedMonth }))
        .unwrap()
        .then(() => toast.success("Payslip downloaded successfully"))
        .catch((err) => toast.error(err || "Failed to download payslip"));
    }
  };

  const handleViewPayslip = (record) => {
    setShowPreview(record);
  };

  const exportToCSV = () => {
    const headers = [
      "ID,Name,Department,Gross Salary,PF Deduction,Net Salary,Status",
    ];
    const rows = paginatedPayrolls.map(
      (emp) =>
        `${emp.employee_id},${emp.employee_name},${emp.department || "N/A"},${parseFloat(emp.gross_salary) || 0},${parseFloat(emp.pf_deduction) || 0},${parseFloat(emp.net_salary) || 0},${emp.status}`
    );
    const csvContent = [...headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Payroll_${format(selectedMonth, "yyyy-MM")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (!isAuthenticated || !["hr", "super_admin"].includes(role)) {
    return (
      <div className="space-y-8 bg-white rounded-2xl min-h-screen p-6">
        <p className="text-red-500">Access restricted. Please log in as HR or Super Admin.</p>
      </div>
    );
  }

  return (
    <div className="w-78/100 ">
      <div className="flex justify-end">
        <PageMeta title="Payroll & Payslip Management" description="Generate, download, and manage payroll and payslips" />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/admin/dashboard" },
            { label: "Payroll Management", link: "/admin/payroll-management" },
          ]}
        />
      </div>
      <div className="space-y-8 bg-white rounded-2xl min-h-screen p-6 shadow-md">
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg border border-slate-200/50 p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-white">Payroll & Payslip Management</h1>
          <p className="text-slate-200 text-lg mt-1">Generate, download, and manage payroll and payslips for employees</p>
        </div>

        {(payrollError || payslipError || successMessage) && (
          <div
            className={`p-4 rounded-lg ${payrollError || payslipError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
          >
            {payrollError || payslipError || successMessage}
          </div>
        )}

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-500 text-sm font-medium mb-1">Select Month</label>
              <DatePicker
                name="monthPicker"
                value={selectedMonth}
                onChange={(date) => setSelectedMonth(startOfMonth(date))}
                maxDate={new Date()}
                showOnlyMonthYear
              />
            </div>
            <div>
              <label className="block text-slate-500 text-sm font-medium mb-1">Select Employee</label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                disabled={employeesLoading}
              >
                <option value="">All Employees{employeesLoading ? " (Loading...)" : ""}</option>
                {employees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.full_name} ({emp.employee_id})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-4">
              <button
                onClick={handleGeneratePayroll}
                disabled={payrollLoading || employeesLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
              >
                <CheckCircle size={18} className="mr-2" />
                {payrollLoading ? "Generating..." : "Generate Payroll"}
              </button>
              <button
                onClick={handleDownloadPayrollPDF}
                disabled={payrollLoading || employeesLoading}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center"
              >
                <FileSpreadsheet size={18} className="mr-2" />
                Download Payroll PDF
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              name="search"
              placeholder="Search by name..."
              value={filters.search}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
            </select>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            >
              <option value="">All Statuses</option>
              <option value="Processed">Processed</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {summaryStats.map(({ title, value, icon: Icon }, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center w-12 h-12">
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          {payrollLoading && <p className="text-slate-500">Loading payroll data...</p>}
          {!payrollLoading && filteredPayrolls.length === 0 && (
            <p className="text-slate-500">
              No payroll records found for {format(selectedMonth, "yyyy-MM")}. Try generating payroll.
            </p>
          )}
          {!payrollLoading && filteredPayrolls.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-teal-600 to-slate-700 text-white">
                  <tr>
                    {["Employee", "Department", "Gross Salary", "Net Salary", "Status", "Actions"].map((col, idx) => (
                      <th
                        key={idx}
                        onClick={() =>
                          col === "Employee" ? handleSort("employee_name") : col === "Gross Salary" ? handleSort("gross_salary") : col === "Net Salary" ? handleSort("net_salary") : null
                        }
                        className={`px-6 py-4 text-left ${["Employee", "Gross Salary", "Net Salary"].includes(col) ? "cursor-pointer hover:text-slate-200" : ""}`}
                      >
                        {col} {sortConfig.key === (col === "Employee" ? "employee_name" : col === "Gross Salary" ? "gross_salary" : "net_salary") && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginatedPayrolls.map((record) => (
                    <tr key={`${record.employee_id}-${record.month}`} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        {record.employee_name} ({record.employee_id})
                      </td>
                      <td className="px-6 py-4">{record.department || "N/A"}</td>
                      <td className="px-6 py-4">₹{(parseFloat(record.gross_salary) || 0).toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4">₹{(parseFloat(record.net_salary) || 0).toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            record.status === "Processed" || record.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : record.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleViewPayslip(record)}
                          className="text-teal-600 hover:text-teal-800"
                        >
                          View Payslip
                        </button>
                        <button
                          onClick={() => handleDownloadPayslip(record.employee_id)}
                          className="text-teal-600 hover:text-teal-800"
                        >
                          Download Payslip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredPayrolls.length > 0 && (
            <div className="flex justify-between items-center p-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-slate-500">Page {currentPage} of {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border border-slate-200 p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto relative shadow-lg">
              <button
                onClick={() => setShowPreview(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Payslip Preview</h2>
              <PayslipGenerator
                employee={showPreview}
                selectedMonth={format(selectedMonth, "yyyy-MM")}
                onClose={() => setShowPreview(null)}
              />
              <button
                onClick={() => handleDownloadPayslip(showPreview.employee_id)}
                className="mt-4 w-full bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600"
              >
                Download Payslip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollManagement;