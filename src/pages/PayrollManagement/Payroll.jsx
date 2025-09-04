import React, { useEffect, useState } from "react";
import {
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Calculator,
  FileSpreadsheet,
} from "lucide-react";
import PayslipGenerator from "../PayslipManagement/PayslipGenerator";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import { fetchPayroll, generatePayroll } from "../../redux/slices/payrollSlice";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "../../Components/ui/date/DatePicker";
import { format, parse, startOfMonth } from "date-fns";

const Payroll = () => {
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    status: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "employee_name",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const dispatch = useDispatch();
  const { payrollList = [], loading, error, successMessage } = useSelector((state) => state.payroll);
  const { user, role } = useSelector((state) => state.auth);

  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(new Date()));

  useEffect(() => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    console.log("Fetching payroll for month:", formattedMonth);
    dispatch(fetchPayroll({ month: formattedMonth }));
  }, [dispatch, selectedMonth]);

  useEffect(() => {
    console.log("payrollList updated:", payrollList);
  }, [payrollList]);

  const itemsPerPage = 5;

  const summaryStats = [
    {
      title: "Total Payroll",
      value: `₹${payrollList
        .reduce((sum, emp) => sum + (parseFloat(emp.gross_salary) || 0), 0)
        .toLocaleString("en-IN")}`,
      change: "+5.2%",
      icon: DollarSign,
    },
    {
      title: "Employees Paid",
      value: payrollList.length,
      change: "+2",
      icon: Users,
    },
    {
      title: "Avg. Gross Salary",
      value: `₹${
        payrollList.length
          ? (
              payrollList.reduce(
                (sum, emp) => sum + (parseFloat(emp.gross_salary) || 0),
                0
              ) / payrollList.length
            ).toLocaleString("en-IN", { maximumFractionDigits: 2 })
          : "0.00"
      }`,
      change: "+3.1%",
      icon: TrendingUp,
    },
    {
      title: "Total PF Deductions",
      value: `₹${payrollList
        .reduce((sum, emp) => sum + (parseFloat(emp.pf_deduction) || 0), 0)
        .toLocaleString("en-IN")}`,
      change: "-1.2%",
      icon: Calculator,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Processed":
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const filteredData = payrollList
    .filter(
      (emp) =>
        emp.employee_name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) &&
        (!filters.department || emp.department === filters.department) &&
        (!filters.status || emp.status === filters.status) &&
        (role !== "employee" || emp.employee_id === user.id)
    )
    .sort((a, b) => {
      if (sortConfig.key) {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        return sortConfig.direction === "asc"
          ? aValue > bValue
            ? 1
            : -1
          : aValue < bValue
          ? 1
          : -1;
      }
      return 0;
    });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig({
      key:
        key === "Employee"
          ? "employee_name"
          : key === "Gross Salary"
          ? "gross_salary"
          : key === "Net Salary"
          ? "net_salary"
          : key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = [
      "ID,Name,Department,Gross Salary,PF Deduction,Net Salary,Status",
    ];
    const rows = paginatedData.map(
      (emp) =>
        `${emp.employee_id},${emp.employee_name},${emp.department},${
          parseFloat(emp.gross_salary) || 0
        },${parseFloat(emp.pf_deduction) || 0},${
          parseFloat(emp.net_salary) || 0
        },${emp.status}`
    );
    const csvContent = [...headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Payroll_${format(selectedMonth, "yyyy-MM")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleProcessPayroll = () => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(generatePayroll({ month: formattedMonth })).then((result) => {
      if (generatePayroll.fulfilled.match(result)) {
        dispatch(fetchPayroll({ month: formattedMonth }));
      }
    });
  };

  return (
    <div className="w-78/100">
      <div className="flex justify-end">
        <PageMeta
          title="Payroll Management"
          description="Manage employee payroll and deductions."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Payroll", link: "/admin/payroll" },
          ]}
        />
      </div>
      <div className="space-y-8 rounded-lg bg-white min-h-screen p-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row justify-around items-start sm:items-center gap-4">
            <div className="w-7/12">
              <h1 className="text-3xl font-bold text-white">
                Payroll Management
              </h1>
              <p className="text-slate-200 text-lg mt-1">
                Manage employee deductions and payroll processing
              </p>
            </div>
            <div className="w-5/12 flex justify-baseline items-end-safe gap-4">
              <div className="w-full flex flex-col items-baseline gap-2">
                <p className="text-white text-md">Select Date</p>
                <DatePicker
                  name="monthPicker"
                  value={selectedMonth}
                  onChange={(date) => setSelectedMonth(startOfMonth(date))}
                  maxDate={new Date()}
                  titleClassName="text-slate-200 text-sm font-medium"
                  showOnlyMonthYear
                />
              </div>
              {["hr", "super_admin"].includes(role) && (
                <button
                  onClick={handleProcessPayroll}
                  className="px-3 flex items-baseline py-2 bg-white text-teal-600 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105"
                >
                  Process
                </button>
              )}
            </div>
          </div>
        </div>

        {(error || successMessage) && (
          <div
            className={`p-4 rounded-lg ${
              error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {error || successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-full">
          {summaryStats.map(({ title, value, change, icon: Icon }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300 min-w-0"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center w-12 h-12">
                  <Icon className="text-white" size={24} />
                </div>
                <span
                  className={`text-sm font-medium ${
                    change.startsWith("+") ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {change}
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-medium mb-1 truncate">
                {title}
              </h3>
              <p className="text-xl font-bold text-slate-900 truncate">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row gap-4">
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
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center flex-wrap gap-4 p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Monthly Payroll Details
            </h2>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105"
            >
              <FileSpreadsheet size={16} /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            {paginatedData.length === 0 && !loading ? (
              <div className="p-6 text-center text-slate-500">
                No payroll records found for {format(selectedMonth, "yyyy-MM")}.
                Try refreshing or changing the month.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-teal-600 to-slate-700">
                  <tr>
                    {[
                      "Employee",
                      "Gross Salary",
                      "PF Deduction",
                      "Net Salary",
                      "Status",
                      "Actions",
                    ].map((col, idx) => (
                      <th
                        key={idx}
                        onClick={() =>
                          col === "Employee"
                            ? handleSort("employee_name")
                            : col === "Gross Salary"
                            ? handleSort("gross_salary")
                            : col === "Net Salary"
                            ? handleSort("net_salary")
                            : null
                        }
                        className={`px-6 py-4 text-left font-medium text-white uppercase tracking-wider ${
                          ["Employee", "Gross Salary", "Net Salary"].includes(col)
                            ? "cursor-pointer hover:text-slate-200"
                            : ""
                        }`}
                      >
                        {col}{" "}
                        {sortConfig.key ===
                          (col === "Employee"
                            ? "employee_name"
                            : col === "Gross Salary"
                            ? "gross_salary"
                            : "net_salary") &&
                          (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginatedData.map((emp) => (
                    <tr
                      key={emp.employee_id}
                      className="hover:bg-slate-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 truncate">
                          {emp.employee_name}
                        </div>
                        <div className="text-slate-500 text-xs truncate">
                          {emp.employee_id} • {emp.department}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 truncate">
                          ₹{(parseFloat(emp.gross_salary) || 0).toLocaleString("en-IN")}
                        </div>
                        <div className="text-slate-500 text-xs">Base</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-red-600 font-medium truncate">
                          ₹{(parseFloat(emp.pf_deduction) || 0).toLocaleString("en-IN")}
                        </div>
                        <div className="text-slate-500 text-xs">Provident Fund</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-teal-600 truncate">
                          ₹{(parseFloat(emp.net_salary) || 0).toLocaleString("en-IN")}
                        </div>
                        <div>Take-home</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            emp.status
                          )}`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="text-teal-600 hover:text-teal-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-teal-400"
                        >
                          View Payslip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {paginatedData.length > 0 && (
            <div className="flex justify-between items-center p-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:bg-slate-300 disabled:cursor-not-allowed transition-transform duration-300 transform hover:scale-105"
              >
                Previous
              </button>
              <span className="text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:bg-slate-300 disabled:cursor-not-allowed transition-transform duration-300 transform hover:scale-105"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {selectedEmployee && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <PayslipGenerator
                employee={selectedEmployee}
                selectedMonth={format(selectedMonth, "yyyy-MM")}
              />
              <button
                onClick={() => setSelectedEmployee(null)}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full transition-transform duration-300 transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payroll;