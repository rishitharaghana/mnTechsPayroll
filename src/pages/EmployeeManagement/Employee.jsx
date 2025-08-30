import React, { useEffect, useState } from "react";
import {
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import { fetchEmployees, clearState } from "../../redux/slices/employeeSlice";

const Employee = () => {
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector((state) => state.employee);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchEmployees());
    return () => {
      dispatch(clearState());
    };
  }, [dispatch]);

 const filtered = employees.filter((emp) => {
  const name = emp.full_name || emp.name || ""; // fallback
  return name.toLowerCase().includes(search.toLowerCase());
});


  const getSalary = (emp) => {
    if (emp.role === "employee" || emp.role === "manager") {
      return (emp.basic_salary * 12) + (emp.allowances || 0);
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

  return `https://placehold.co/100x100?text=${encodeURIComponent(
    initials
  )}&bg=${bgColors[emp.role] || "6B7280"}`;
};


  return (
    <div className="p-6">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Employees", link: "/admin/employees" },
          ]}
        />
        <PageMeta title="Employee Management" description="Manage your employees efficiently." />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
          <p className="text-gray-500">Manage your team members</p>
        </div>
        <Link
          to="/admin/employees/add-employee"
          className="flex items-center bg-slate-600 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <UserPlus className="mr-2" size={20} />
          Add Employee
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="text-center text-gray-600">Loading employees...</div>
      )}
      {error && <div className="text-center text-red-600">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center text-gray-600">No employees found.</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((emp) => (
          <div
            key={`${emp.role}-${emp.id}`}
            className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="flex flex-col items-center mb-4">
              <img
                src={getImageUrl(emp)}
                alt={emp.name}
                className="w-40 h-40 rounded-full border-4 border-white shadow-md -mt-4"
              />
            </div>

            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg text-gray-900">{emp.name}</h3>
              <div className="flex space-x-2">
                <Link
                  to={`/admin/employees/edit/${emp.role}/${emp.id}`}
                  className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                >
                  <Edit size={16} />
                </Link>
                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-indigo-600 font-medium">{emp.employee_id}</p>

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
                <span className="text-sm text-gray-600">{emp.department_name}</span>
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
              <p className="font-medium text-gray-900">{emp.designation_name}</p>
              {(emp.role === "employee" || emp.role === "manager") && getSalary(emp) && (
                <p className="text-sm text-gray-600">Salary: ${getSalary(emp).toLocaleString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employee;