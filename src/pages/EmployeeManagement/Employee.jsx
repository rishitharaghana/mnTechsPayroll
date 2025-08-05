import React, { useState } from "react";
import {
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";

const Employee = () => {
  const [employees, setEmployees] = useState([
    {
      id: "EMP001",
      name: "John Smith",
      joinDate: "2023-02-15",
      position: "Software Engineer",
      email: "john.smith@example.com",
      phone: "9876543210",
      department: "Engineering",
      type: "Full-time",
      salary: 75000,
    },
    {
      id: "EMP002",
      name: "Jane Doe",
      joinDate: "2022-11-10",
      position: "UI/UX Designer",
      email: "jane.doe@example.com",
      phone: "9876501234",
      department: "Design",
      type: "Part-time",
      salary: 50000,
    },
  ]);

  const [search, setSearch] = useState("");

  const filtered = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
          <p className="text-gray-500">Manage your team members</p>
        </div>
        <Link
          to="/admin/employees/add-employee"
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <UserPlus className="mr-2" size={20} />
          Add Employee
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="flex flex-col items-center mb-4">
              <img
                src={`https://i.pravatar.cc/100?u=${emp.id}`}
                alt={emp.name}
                className="w-40 h-40 rounded-full border-4 border-white shadow-md -mt-4"
              />
            </div>

            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg text-gray-900">{emp.name}</h3>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <Edit size={16} />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-indigo-600 font-medium">{emp.id}</p>

            <div className="space-y-2 text-gray-600 text-sm mt-2">
              <div className="flex items-center gap-2">
                <Mail size={14} /> {emp.email}
              </div>
              
              
            </div>

            <div className="pt-3 border-t border-gray-200 mt-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">{emp.department}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    emp.type === "Full-time"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {emp.type}
                </span>
              </div>
              <p className="font-medium text-gray-900">{emp.position}</p>
              {/* <p className="text-lg font-bold text-indigo-600">
                ${emp.salary.toLocaleString()}
              </p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employee;
