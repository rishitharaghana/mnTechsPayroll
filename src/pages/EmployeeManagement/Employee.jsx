import React, { useEffect, useState } from "react";
import { Edit, Mail, Phone, Calendar, Filter, Fullscreen, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import { fetchEmployees, getCurrentUserProfile } from "../../redux/slices/employeeSlice";

const selectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "40px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    boxShadow: "none",
    "&:hover": { borderColor: "#4f46e5" },
    fontSize: "14px",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    zIndex: 10,
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    color: state.isSelected ? "#ffffff" : state.isFocused ? "#ffffff" : "#1e293b",
    backgroundColor: state.isSelected ? "#4f46e5" : state.isFocused ? "#0f766e" : "#ffffff",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1e293b",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
  }),
};

const Employee = () => {
  const dispatch = useDispatch();
  const { employees, loading, error, successMessage, profile } = useSelector((state) => state.employee);
  const { user, authLoading } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 9;

  // Define filter options
  const departments = [...new Set(employees?.map((emp) => emp.department_name) || [])];
  const roles = [...new Set(employees?.map((emp) => emp.role) || [])];
  const statuses = ["all", "active", "serving_notice", "inactive", "absconded"];

  const departmentOptions = [
    { value: "all", label: "All Departments" },
    ...departments.map((dept) => ({ value: dept, label: dept })),
  ];
  const roleOptions = [
    { value: "all", label: "All Roles" },
    ...roles.map((role) => ({
      value: role,
      label: role.charAt(0).toUpperCase() + role.slice(1),
    })),
  ];
  const statusOptions = statuses.map((status) => ({
    value: status,
    label:
      status === "all"
        ? "All Statuses"
        : status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
  }));

  const filtered = employees?.filter((emp) => {
    const name = emp.full_name || emp.name || "";
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || emp.department_name === departmentFilter;
    const matchesRole = roleFilter === "all" || emp.role === roleFilter;
    const matchesStatus = statusFilter === "all" || (emp.status || "active") === statusFilter;

    if (!user) {
      console.log("No user in auth state, showing all employees for super_admin/hr");
      return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
    }
    if (user.role === "dept_head") {
      const department = profile?.department || profile?.department_name;
      if (!department) {
        console.log("No department in profile for dept_head, excluding all employees");
        return false;
      }
      console.log(
        `Filtering dept_head: emp.department_name=${emp.department_name}, profile.department=${department}, emp.role=${emp.role}`
      );
      return (
        emp.department_name?.toLowerCase() === department.toLowerCase() &&
        (emp.role === "employee" || emp.role === "manager") &&
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    } else if (user.role === "manager") {
      const department = profile?.department || profile?.department_name;
      if (!department) {
        console.log("No department in profile for manager, excluding all employees");
        return false;
      }
      return (
        emp.department_name?.toLowerCase() === department.toLowerCase() &&
        (emp.role === "dept_head" || emp.role === "employee") &&
        matchesSearch &&
        matchesDepartment &&
        matchesRole &&
        matchesStatus
      );
    } else if (user.role === "employee") {
      return (
        emp.id === user.id &&
        matchesSearch &&
        matchesDepartment &&
        matchesRole &&
        matchesStatus
      );
    }
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  }) || [];

  const totalPages = Math.ceil(filtered.length / employeesPerPage);
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filtered.slice(indexOfFirstEmployee, indexOfLastEmployee);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getCurrentUserProfile()).unwrap();
        await dispatch(fetchEmployees()).unwrap();
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (user?.role === "dept_head" && (profile?.department || profile?.department_name)) {
      setDepartmentFilter(profile?.department || profile?.department_name);
    }
  }, [user, profile]);

  useEffect(() => {
    console.log("User (auth):", user);
    console.log("Profile (employee):", profile);
    console.log("Profile Department:", profile?.department || profile?.department_name);
    console.log("Employee Departments:", [...new Set(employees?.map(emp => emp.department_name))]);
    console.log("Filtered Employees:", filtered);
    console.log("Current Employees:", currentEmployees);
  }, [user, profile, employees, filtered, currentEmployees]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    let startPage = Math.max(1, currentPage - 1);
    if (currentPage === totalPages && totalPages >= 3) {
      startPage = totalPages - 2;
    } else if (currentPage === totalPages - 1 && totalPages >= 3) {
      startPage = totalPages - 2;
    }
    for (let i = startPage; i < startPage + maxPagesToShow && i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const getImageUrl = (emp) => {
    const bgColors = {
      dept_head: "4B5EAA",
      manager: "FF6F61",
      employee: "6B7280",
    };
    const initials = (emp.full_name || emp.name || "")
      .split(" ")
      .map((n) => n?.charAt(0) || "")
      .join("")
      .toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${
      bgColors[emp.role] || "6B7280"
    }&color=fff`;
  };

  const canManage = user ? ["super_admin", "hr"].includes(user.role) : false;

  if (authLoading || loading) {
    return <div className="text-center text-gray-600 py-4">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!employees || employees.length === 0) {
    return <div className="text-center text-gray-600 py-4">No employees available.</div>;
  }

  return (
    <div className="w-full">
      <style>
        {`
          .alert {
            padding: 12px;
            margin-bottom: 16px;
            border-radius: 4px;
          }
          .alert-success {
            background: #d1fae5;
            color: #065f46;
          }
          .alert-error {
            background: #fee2e2;
            color: #991b1b;
          }
        `}
      </style>
      <div className="hidden md:flex md:justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Employees", link: "/admin/employees" },
          ]}
        />
        <PageMeta title="Employee Management" description="Manage your employees efficiently." />
      </div>
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Employees</h1>
            <p className="text-gray-500 text-sm sm:text-base">Manage your team members</p>
          </div>
          {canManage && (
            <Link
              to="/admin/employees/terminate"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <UserPlus size={16} className="mr-2" /> Termination Dashboard
            </Link>
          )}
        </div>

        {/* {successMessage && <div className="alert alert-success">{successMessage}</div>} */}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="mb-6 bg-white shadow-md p-4 border border-gray-200 rounded-xl flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full p-2 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Filter className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <div className="flex flex-col md:flex-row justify-end gap-3 items-start md:items-center">
            <Select
              options={departmentOptions}
              value={departmentOptions.find((option) => option.value === departmentFilter)}
              onChange={(selected) => setDepartmentFilter(selected.value)}
              styles={selectStyles}
              className="w-full md:w-56"
              placeholder="Select Department"
            />
            <Select
              options={roleOptions}
              value={roleOptions.find((option) => option.value === roleFilter)}
              onChange={(selected) => setRoleFilter(selected.value)}
              styles={selectStyles}
              className="w-full md:w-44"
              placeholder="Select Role"
            />
            <Select
              options={statusOptions}
              value={statusOptions.find((option) => option.value === statusFilter)}
              onChange={(selected) => setStatusFilter(selected.value)}
              styles={selectStyles}
              className="w-full md:w-44"
              placeholder="Select Status"
            />
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-600 py-4">
            No employees found.{" "}
            {user?.role === "dept_head" && !(profile?.department || profile?.department_name)
              ? "Department information is missing for this user."
              : ""}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentEmployees.map((emp) => (
            <div
              key={`${emp.role}-${emp.id}`}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:-translate-y-1 transition"
            >
              <div className="flex flex-col items-center mb-4">
                <img
                  src={emp.photo_url && emp.photo_url.trim() ? emp.photo_url : getImageUrl(emp)}
                  onError={(e) => {
                    e.target.src = getImageUrl(emp);
                  }}
                  alt={emp.full_name || emp.name || "Employee"}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-md -mt-4 object-cover"
                />
              </div>
              <div className="mb-2">
                <h3 className="font-bold mb-1 text-md sm:text-lg text-gray-900">
                  {emp.full_name || "Unknown"}
                </h3>
                <div className="flex items-center lg:flex-wrap sm:flex-row justify-between sm:items-center gap-3 lg:gap-3">
                  <p className="text-indigo-600 font-medium text-xs sm:text-sm">
                    {emp.employee_id || "N/A"}
                  </p>
                  <div className="flex items-center justify-end sm:justify-end gap-1 sm:gap-2">
                    <Link
                      to={`/admin/employees/edit/${emp.role}/${emp.id}`}
                      className="p-1.5 sm:p-2 text-gray-600 hover:text-indigo-600 bg-indigo-50 hover:bg-indigo-50 rounded-lg"
                    >
                      <Edit size={14} className="sm:w-4 sm:h-4" />
                    </Link>
                    <Link
                      to={`/admin/employees/preview/${emp.id}`}
                      state={{ employee: emp }}
                      className="p-1.5 sm:p-2 text-gray-600 hover:text-indigo-600 bg-green-100 hover:bg-indigo-50 rounded-lg"
                    >
                      <Fullscreen size={14} className="sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Mail size={14} /> {emp.email || "N/A"}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} /> {emp.mobile || "N/A"}
                </div>
                {(emp.role === "employee" || emp.role === "manager") && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} /> {emp.join_date || "N/A"}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <span
                    className={`text-sm ${
                      (emp.status || "active") === "active"
                        ? "text-green-600"
                        : (emp.status || "active") === "serving_notice"
                        ? "text-yellow-600"
                        : (emp.status || "active") === "inactive"
                        ? "text-red-600"
                        : "text-purple-600"
                    }`}
                  >
                    {((emp.status || "active")?.charAt(0) || "").toUpperCase() +
                      ((emp.status || "active")?.slice(1).replace("_", " ") || "")}
                  </span>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 mt-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">{emp.department_name || "N/A"}</span>
                  {(emp.role === "employee" || emp.role === "manager") && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        emp.employment_type === "Full-time"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {emp.employment_type || "N/A"}
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {emp.designation_name || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center lg:justify-end items-center gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`sm:px-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 1
                  ? "bg-slate-300 text-white cursor-not-allowed"
                  : "bg-slate-700 text-white hover:bg-teal-700"
              }`}
            >
              Previous
            </button>
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(page)}
                disabled={page === currentPage}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-teal-700 text-white"
                    : "bg-slate-700 text-white hover:bg-teal-700"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`sm:px-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? "bg-slate-300 text-white cursor-not-allowed"
                  : "bg-slate-700 text-white hover:bg-teal-700"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employee;