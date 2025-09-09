import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
  const { payrollList = [], loading, error, successMessage, totalRecords } = useSelector((state) => state.payroll);
  const { user, role } = useSelector((state) => state.auth);

  // Default to September 2025 for testing
  const [selectedMonth, setSelectedMonth] = useState(startOfMonth(parse("2025-09", "yyyy-MM", new Date())));

  const itemsPerPage = 25;

  useEffect(() => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(fetchPayroll({ month: formattedMonth, page: currentPage, limit: itemsPerPage }));
  }, [dispatch, selectedMonth, currentPage]);

  useEffect(() => {
    console.log("Payroll list:", payrollList);
    console.log("Total records:", totalRecords);
    console.log("Filtered data:", filteredData);
    console.log("Paginated data:", paginatedData);
    console.log("Current filters:", filters);
  }, [payrollList, totalRecords, filters]);

  const departments = [...new Set(payrollList.map(emp => emp.department))].sort();

  const filteredData = payrollList
    .filter(
      (emp) =>
        emp.employee_name?.toLowerCase().includes(filters.search.toLowerCase()) &&
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

  const handleProcessPayroll = () => {
    const formattedMonth = format(selectedMonth, "yyyy-MM");
    dispatch(generatePayroll({ month: formattedMonth })).then((result) => {
      setCurrentPage(1);
      setFilters({ search: "", department: "", status: "" });
      setTimeout(() => {
        dispatch(fetchPayroll({ month: formattedMonth, page: 1, limit: itemsPerPage }));
      }, 500);
      if (generatePayroll.fulfilled.match(result)) {
        toast.success("Payroll generated successfully");
      } else {
        if (result.payload?.includes("Payroll already exists")) {
          toast.info("Payroll already exists. Displaying existing records.");
        } else {
          toast.error(result.payload || "Failed to generate payroll");
        }
      }
    });
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Processed":
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Paid":
        return "bg-blue-100 text-blue-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

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

  return (
    <div className="w-full">
      <div className="hidden sm:flex sm:flex-row justify-end gap-4">
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
      <div className="space-y-6 rounded-lg bg-white min-h-screen p-4 sm:p-6">
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg border border-slate-200/50 p-4 sm:p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    {/* Title and Description Section */}
    <div className="w-full sm:w-7/12">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
        Payroll Management
      </h1>
      <p className="text-slate-200 text-xs sm:text-sm md:text-base lg:text-lg mt-1">
        Manage employee deductions and payroll processing
      </p>
    </div>

    {/* Date Picker and Buttons Section */}
    <div className="w-full sm:w-5/12 flex flex-col sm:flex-row justify-end items-end gap-3 sm:gap-4">
      {/* Date Picker */}
      <div className="w-full sm:w-auto flex flex-col items-start gap-2">
        <p className="text-white text-xs sm:text-sm md:text-base">Select Date</p>
        <DatePicker
          name="monthPicker"
          value={selectedMonth}
          onChange={(date) => setSelectedMonth(startOfMonth(date))}
          maxDate={new Date()}
          titleClassName="text-slate-200 text-xs sm:text-sm md:text-base font-medium"
          showOnlyMonthYear
          className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white text-teal-600 focus:ring-2 focus:ring-teal-400"
        />
      </div>

      {/* Buttons for HR and Super Admin */}
      {["hr", "super_admin"].includes(role) && (
        <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={handleProcessPayroll}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-white text-teal-600 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base"
          >
            Process
          </button>
          <button
            onClick={() => {
              const formattedMonth = format(selectedMonth, "yyyy-MM");
              setCurrentPage(1);
              setFilters({ search: "", department: "", status: "" });
              dispatch(fetchPayroll({ month: formattedMonth, page: 1, limit: itemsPerPage }));
            }}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-white text-teal-600 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105 text-xs sm:text-sm md:text-base"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  </div>
</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryStats.map(({ title, value, change, icon: Icon }, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12">
                  <Icon className="text-white" size={20} />
                </div>
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    change.startsWith("+") ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {change}
                </span>
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
          <div className="flex flex-col md:flex-row gap-2 sm:gap-4">
            <input
              type="text"
              name="search"
              placeholder="Search by name..."
              value={filters.search}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
            />
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm sm:text-base"
            >
              <option value="">All Statuses</option>
              <option value="Processed">Processed</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center flex-wrap gap-4 p-4 sm:p-6 border-b border-slate-200">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Monthly Payroll Details
            </h2>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105 text-sm sm:text-base"
            >
              <FileSpreadsheet size={16} /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            {paginatedData.length === 0 && !loading ? (
              <div className="p-4 sm:p-6 text-center text-slate-500 text-sm sm:text-base">
                No payroll records found for {format(selectedMonth, "yyyy-MM")}.
                Try refreshing or changing the month.
              </div>
            ) : (
              <table className="w-full text-sm min-w-[640px]">
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
                        className={`px-3 py-2 sm:px-4 sm:py-3 text-left font-medium text-white uppercase tracking-wider text-xs sm:text-sm ${
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
                      key={`${emp.employee_id}-${emp.month}`}
                      className="hover:bg-slate-50 transition-colors duration-200"
                    >
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                        <div className="font-medium text-slate-900 truncate max-w-[100px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[200px]">
                          {emp.employee_name}
                        </div>
                        <div className="text-slate-500 text-xs truncate max-w-[100px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[200px]">
                          {emp.employee_id} • {emp.department}
                        </div>
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                        <div className="font-medium text-slate-900 truncate">
                          ₹{(parseFloat(emp.gross_salary) || 0).toLocaleString("en-IN")}
                        </div>
                        <div className="text-slate-500 text-xs">Base</div>
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                        <div className="text-red-600 font-medium truncate">
                          ₹{(parseFloat(emp.pf_deduction) || 0).toLocaleString("en-IN")}
                        </div>
                        <div className="text-slate-500 text-xs">Provident Fund</div>
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                        <div className="font-bold text-teal-600 truncate">
                          ₹{(parseFloat(emp.net_salary) || 0).toLocaleString("en-IN")}
                        </div>
                        <div className="text-slate-500 text-xs">Take-home</div>
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            emp.status
                          )}`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="text-teal-600 hover:text-teal-500 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
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
            <div className="flex sm:flex-row justify-between items-center p-4 sm:p-6 sm:gap-4 gap-3">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="sm:px-3 px-2 py-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:bg-slate-300 disabled:cursor-not-allowed transition-transform duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                Previous
              </button>
              <span className="text-slate-500 text-sm sm:text-base">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="sm:px-3 px-2 py-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:bg-slate-300 disabled:cursor-not-allowed transition-transform duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {selectedEmployee && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-sm max-w-md w-full max-h-[80vh] overflow-y-auto">
              <PayslipGenerator
                employee={selectedEmployee}
                selectedMonth={format(selectedMonth, "yyyy-MM")}
              />
              <button
                onClick={() => setSelectedEmployee(null)}
                className="mt-4 px-3 py-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full transition-transform duration-300 transform hover:scale-105 text-sm sm:text-base"
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