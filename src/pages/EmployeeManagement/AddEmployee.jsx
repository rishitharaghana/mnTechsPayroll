import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../../form/FormInput";
import DatePicker from "../../Components/ui/date/DatePicker";
import Button from "../../Components/ui/date/Button";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const AddEmployee = () => {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
    department: "",
    salary: "",
    position: "",
    type: "Full-time",
    address: "",
    emergencyContact: "",
  });

  const handleInput = useCallback((field, value) => {
    console.log(`Updating field: ${field} with value: ${value}`);
    setEmployee((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employee.joinDate) {
      alert("Please select a join date.");
      return;
    }

    // Save to localStorage (replace with API in production)
    const employees = JSON.parse(localStorage.getItem("employees") || "[]");
    const id = `EMP${(employees.length + 1).toString().padStart(3, "0")}`;
    const newEmp = {
      ...employee,
      id,
      status: "Active",
      salary: parseFloat(employee.salary) || 0,
    };
    localStorage.setItem("employees", JSON.stringify([...employees, newEmp]));

    navigate("/");
  };

  return (
    <div className="">
      <div className="flex justify-end">
        <PageMeta
          title="Add Employee"
          description="Add a new employee to the system."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Employees", link: "/admin/employees" },
            { label: "Add Employee", link: "/admin/employees/add-employee" },
          ]}
        />
      </div>
      <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center uppercase text-teal-600">
          Add New Employee
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Full Name", field: "name", type: "text" },
              { label: "Email", field: "email", type: "email" },
              { label: "Phone", field: "phone", type: "tel" },
              { label: "Department", field: "department", type: "text" },
              { label: "Annual Salary", field: "salary", type: "number" },
              { label: "Position", field: "position", type: "text" },
            ].map(({ label, field, type }) => (
              <FormInput
                key={field}
                label={label}
                type={type}
                value={employee[field]}
                onChange={(e) => handleInput(field, e.target.value)}
              />
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee Type
              </label>
              <select
                value={employee.type}
                onChange={(e) => handleInput("type", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                aria-label="Select employee type"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Intern</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <FormInput
              label="Address"
              type="text"
              value={employee.address}
              onChange={(e) => handleInput("address", e.target.value)}
            />
            <FormInput
              label="Emergency Contact"
              type="tel"
              value={employee.emergencyContact}
              onChange={(e) => handleInput("emergencyContact", e.target.value)}
            />
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
              Add Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
