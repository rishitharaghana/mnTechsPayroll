import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../../form/FormInput";
import DatePicker from "../../Components/ui/date/DatePicker";
import Button from "../../Components/ui/date/Button";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const AssignEmployee = () => {
  const navigate = useNavigate();

  // Form state
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyPhone: "",
    address: "",
    annualSalary: "",
    joinDate: "",
    roleType: "",
    department: "",
    position: "",
    employmentType: "Full-time",
  });

  // Department heads (for Department role) and departments (for Employee role)
  const departmentHeads = [
    "Head of IT",
    "Head of Graphic Designing",
    "Head of Digital Marketing",
    "Head of Telecalling Operations",
    "Head of Business Management",
  ];

  const departments = [
    "IT",
    "Graphic Designing",
    "Digital Marketing",
    "Telecalling Operations",
    "Business Management",
  ];

  const positions = {
    IT: [
      "Senior Software Engineer",
      "Associate Software Engineer",
      "Front End Developer",
      "Full Stack Developer",
      "Intern",
    ],
    "Graphic Designing": [
      "UI UX Designer",
      "Senior Graphic Designer",
      "Junior Graphic Designer",
      "Intern",
    ],
    "Digital Marketing": [
      "Senior Digital Marketer",
      "Junior Digital Marketer",
      "Intern",
    ],
    "Telecalling Operations": [
      "Senior Tele Associate",
      "Junior Tele Associate",
      "Intern",
    ],
    "Business Management": [
      "General Manager",
      "Senior BDM",
      "Junior BDM",
      "Senior BDE",
      "Junior BDE",
      "Intern",
    ],
  };

  const employmentTypes = ["Full-time", "Part-time", "Internship", "Contract"];
  const roleTypes = ["HR", "Department", "Employee"];

  // Handle input changes
  const handleInput = useCallback((field, value) => {
    setEmployee((prev) => {
      const updated = { ...prev, [field]: value };
      // Reset department and position when roleType changes
      if (field === "roleType") {
        return { ...updated, department: "", position: "" };
      }
      // Reset position when department changes
      if (field === "department") {
        return { ...updated, position: "" };
      }
      return updated;
    });
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!employee.name || !employee.email || !employee.joinDate) {
        alert("Please fill in all required fields (Name, Email, Join Date).");
        return;
      }
      if (employee.roleType === "Department" && !employee.department) {
        alert("Please select a Department Head for Department role.");
        return;
      }
      if (employee.roleType === "Employee" && !employee.department) {
        alert("Please select a Department for Employee role.");
        return;
      }
      if (employee.roleType === "Employee" && !employee.position) {
        alert("Please select a Position for Employee role.");
        return;
      }

      // Save to localStorage (replace with API in production)
      const employees = JSON.parse(localStorage.getItem("employees") || "[]");
      const id = `EMP${(employees.length + 1).toString().padStart(3, "0")}`;
      const newEmployee = {
        ...employee,
        id,
        status: "Active",
        annualSalary: parseFloat(employee.annualSalary) || 0,
      };
      localStorage.setItem("employees", JSON.stringify([...employees, newEmployee]));
      navigate("/admin/employees");
    },
    [employee, navigate]
  );

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-end mb-6">
        <PageMeta
          title="Assign Employee"
          description="Assign a new employee, HR, or department head to the system."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Employees", link: "/admin/employees" },
            { label: "Assign Employee", link: "/admin/employees/assign-employee" },
          ]}
        />
      </div>

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center uppercase text-teal-600">
          Assign New Employee
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Full Name", field: "name", type: "text", required: true },
              { label: "Email", field: "email", type: "email", required: true },
              { label: "Phone", field: "phone", type: "tel" },
              { label: "Emergency Phone", field: "emergencyPhone", type: "tel" },
              { label: "Address", field: "address", type: "textarea" },
              { label: "Annual Salary", field: "annualSalary", type: "number" },
            ].map(({ label, field, type, required }) => (
              <div key={field}>
                {type === "textarea" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <textarea
                      value={employee[field]}
                      onChange={(e) => handleInput(field, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                      aria-label={label}
                    />
                  </div>
                ) : (
                  <FormInput
                    label={label}
                    type={type}
                    value={employee[field]}
                    onChange={(e) => handleInput(field, e.target.value)}
                    required={required}
                  />
                )}
              </div>
            ))}

            <div>
              <DatePicker
                name="joinDate"
                title="Join Date"
                singleDate
                value={employee.joinDate}
                onChange={(date) => handleInput("joinDate", date)}
                className="w-full"
                aria-label="Select Join Date"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Type
              </label>
              <select
                value={employee.roleType}
                onChange={(e) => handleInput("roleType", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                aria-label="Select role type"
                required
              >
                <option value="">Select Role Type</option>
                {roleTypes.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {employee.roleType === "Department" && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Head
                </label>
                <select
                  value={employee.department}
                  onChange={(e) => handleInput("department", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  aria-label="Select department head"
                  required
                >
                  <option value="">Select Department Head</option>
                  {departmentHeads.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {employee.roleType === "Employee" && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={employee.department}
                  onChange={(e) => handleInput("department", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  aria-label="Select department"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {employee.roleType === "Employee" && employee.department && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <select
                  value={employee.position}
                  onChange={(e) => handleInput("position", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  aria-label="Select position"
                  required
                >
                  <option value="">Select Position</option>
                  {positions[employee.department]?.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <select
                value={employee.employmentType}
                onChange={(e) => handleInput("employmentType", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                aria-label="Select employment type"
              >
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-sm font-medium"
              size="large"
              onClick={() => navigate("/admin/employees")}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="large"
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 text-sm font-medium"
            >
              Assign Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignEmployee;