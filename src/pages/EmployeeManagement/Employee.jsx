import React, { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  UserPlus,
  Filter,
  Fullscreen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import { fetchEmployees, clearState } from "../../redux/slices/employeeSlice";


const departmentSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "40px",
    border: "1px solid #D1D5DB", 
    borderRadius: "8px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#4F46E5", 
    },
    fontSize: "14px", 
    fontWeight: "500", 
    color: "#1E293B", 
  }),
  menu: (provided) => ({
    ...provided,
    minHeight: "150px", 
    borderRadius: "8px",
    zIndex: 10,
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px", 
    fontWeight: "500", 
    color: state.isSelected
      ? "#1E293B" 
      : state.isFocused
      ? "#ffffff" 
      : "#1E293B", 
    backgroundColor: state.isSelected
      ? "#4F46E5" 
      : state.isFocused
      ? "#0F766E" 
      : "#FFFFFF", 
    "&:active": {
      backgroundColor: "#C7D2FE", 
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1E293B", 
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9CA3AF", 
  }),
};


const roleSelectStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "40px",
    border: "1px solid #D1D5DB", 
    borderRadius: "8px",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#4F46E5", 
    },
    fontSize: "14px", 
    fontWeight: "500", 
    color: "#1E293B", 
  }),
  menu: (provided) => ({
    ...provided,
    minHeight: "100px", 
    borderRadius: "8px",
    zIndex: 10,
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px", 
    fontWeight: "500", 
    color: state.isSelected
      ? "#1E293B" 
      : state.isFocused
      ? "#ffffff" 
      : "#1E293B", 
    backgroundColor: state.isSelected
      ? "#4F46E5" 
      : state.isFocused
      ? "#0F766E" 
      : "#FFFFFF", 
    "&:active": {
      backgroundColor: "#C7D2FE", 
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1E293B", 
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9CA3AF", 
  }),
};

const Employee = () => {
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector((state) => state.employee);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  
  const departments = [...new Set(employees.map((emp) => emp.department_name))];
  const roles = [...new Set(employees.map((emp) => emp.role))];

  
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

  useEffect(() => {
    dispatch(fetchEmployees());
    return () => {
      dispatch(clearState());
    };
  }, [dispatch]);

  const filtered = employees.filter((emp) => {
    const name = emp.full_name || emp.name || "";
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || emp.department_name === departmentFilter;
    const matchesRole = roleFilter === "all" || emp.role === roleFilter;
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const getSalary = (emp) => {
    if (emp.role === "employee" || emp.role === "manager") {
      return emp.basic_salary * 12 + (emp.allowances || 0);
    }
    return null;
  };

  const getImageUrl = (emp) => {
    const bgColors = {
      dept_head: "4B5EAA",
      manager: "FF6F61",
      employee: "6B7280",
    };
    const initials = (emp.full_name || "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    return `https:
      initials
    )}&bg=${bgColors[emp.role] || "6B7280"}`;
  };

  return (
    <div className="w-78/100">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Employees", link: "/admin/employees" },
          ]}
        />
        <PageMeta
          title="Employee Management"
          description="Manage your employees efficiently."
        />
      </div>
      <div className="bg-white rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
            <p className="text-gray-500">Manage your team members</p>
          </div>
        </div>

        <div className="mb-6 flex bg-white shadow-md p-4 border-1 border-gray-200 rounded-xl flex-col sm:flex-row gap-4">
          <div className="relative flex-1 w-5/12">
            <input
              type="text"
              placeholder="Search by name..."
              className="w-8/12 p-2 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Filter
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
          <div className="flex justify-items-end gap-3 items-end">
            <Select
              options={departmentOptions}
              value={departmentOptions.find(
                (option) => option.value === departmentFilter
              )}
              onChange={(selected) => setDepartmentFilter(selected.value)}
              styles={departmentSelectStyles}
              className="w-56"
              placeholder="Select Department"
            />
            <Select
              options={roleOptions}
              value={roleOptions.find((option) => option.value === roleFilter)}
              onChange={(selected) => setRoleFilter(selected.value)}
              styles={roleSelectStyles}
              className="w-44"
              placeholder="Select Role"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-600">Loading employees...</div>
        )}
        {error && <div className="text-center text-red-600">{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center text-gray-600">No employees found.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp) => (
            <div
              key={`${emp.role}-${emp.id}`}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border-1 border-gray-200 shadow-md hover:-translate-y-1 transition"
            >
              <div className="flex flex-col items-center mb-4">
                <img
                  src={getImageUrl(emp)}
                  alt={emp.name}
                  className="w-30 h-30 rounded-full border-4 border-white shadow-md -mt-4"
                />
              </div>

              <div className="mb-2">
                <h3 className="font-bold text-lg text-gray-900">{emp.name}</h3>
                <div className="w-full flex justify-between items-center">
                  <div className="w-8/12">
                    <p className="text-indigo-600 font-medium">
                      {emp.employee_id}
                    </p>
                  </div>
                  <div className="w-4/12 flex items-center justify-end">
                    <Link
                      to={`/admin/employees/edit/${emp.role}/${emp.id}`}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <Edit size={16} />
                    </Link>
                    <Link
                      to={`/admin/employees/preview/${emp.id}`}
                      state={{ employee: emp }}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <Fullscreen size={16} />
                    </Link>
                    <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-gray-600 text-sm mt-2">
                <div className="flex items-center gap-2">
                  <Mail size={14} /> {emp.email}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} /> {emp.mobile}
                </div>
                {(emp.role === "employee" || emp.role === "manager") && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} /> {emp.join_date}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200 mt-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    {emp.department_name}
                  </span>
                  {(emp.role === "employee" || emp.role === "manager") && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        emp.employment_type === "Full-time"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {emp.employment_type}
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-900">
                  {emp.designation_name}
                </p>
                {(emp.role === "employee" || emp.role === "manager") &&
                  getSalary(emp) && (
                    <p className="text-sm text-gray-600">
                      Salary: ${getSalary(emp).toLocaleString()}
                    </p>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Employee;