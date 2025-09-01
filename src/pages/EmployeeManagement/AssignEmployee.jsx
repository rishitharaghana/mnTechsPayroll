import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Users, UserCog, Briefcase } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createEmployee, clearState } from "../../redux/slices/employeeSlice";

const AssignEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.employee);
  const { user } = useSelector((state) => state.auth);

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    mobile: "",
    emergencyPhone: "",
    address: "",
    basicSalary: "",
    allowances: "",
    bonuses: "",
    joinDate: "",
    roleType: "",
    department: "",
    position: "",
    employmentType: "Full-time",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const departments = [
    "Administration",
    "Business Management",
    "Digital Marketing",
    "Graphic Designing",
    "HR",
    "IT",
    "Marketing",
    "Telecalling Operations",
  ];

  const designations = {
    Administration: ["Facility Manager", "Office Administrator"],
    "Business Management": ["General Manager"],
    "Digital Marketing": ["Digital Marketing Manager"],
    "Graphic Designing": ["Design Manager"],
    HR: ["HR Manager"],
    IT: ["Technical Lead"],
    Marketing: ["Marketing Manager"],
    "Telecalling Operations": ["Telemarketing Manager"],
  };

  const employeeDesignations = {
    Administration: ["Admin Assistant", "Front Desk Executive", "Operations Executive"],
    "Business Management": ["Intern", "Junior BDE", "Junior BDM", "Senior BDE", "Senior BDM"],
    "Digital Marketing": ["Intern", "Junior Digital Marketer", "Senior Digital Marketer"],
    "Graphic Designing": ["Intern", "Junior Graphic Designer", "Senior Graphic Designer", "UI UX Designer"],
    HR: ["HR Executive", "Payroll Executive", "Recruitment Specialist", "Training & Development Officer"],
    IT: ["Senior Software Engineer", "Associate Software Engineer", "Front End Developer", "Full Stack Developer", "Intern"],
    Marketing: ["Marketing Executive"],
    "Telecalling Operations": ["Senior Tele Associate", "Junior Tele Associate", "Intern"],
  };

  const employmentTypes = ["Full-time", "Part-time", "Internship", "Contract"];
  const roleTypes = [
    { name: "HR", icon: <UserCog className="w-6 h-6" />, description: "Manage HR-related tasks" },
    { name: "Department Head", icon: <Users className="w-6 h-6" />, description: "Lead a department" },
    { name: "Manager", icon: <Briefcase className="w-6 h-6" />, description: "Manage a team" },
    { name: "Employee", icon: <User className="w-6 h-6" />, description: "Standard employee role" },
  ];

  useEffect(() => {
    if (
      employee.emergencyPhone &&
      employee.mobile &&
      employee.emergencyPhone.trim() === employee.mobile.trim()
    ) {
      setErrors((prev) => ({
        ...prev,
        emergencyPhone: "Mobile and emergency contact numbers cannot be the same",
      }));
    } else {
      setErrors((prev) => ({ ...prev, emergencyPhone: "" }));
    }
  }, [employee.mobile, employee.emergencyPhone]);

  const handleInput = useCallback((field, value) => {
    setEmployee((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "roleType") {
        return { ...updated, department: "", position: "" };
      }
      if (field === "department") {
        return { ...updated, position: "" };
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !employee.roleType) {
      newErrors.roleType = "Please select a Role Type";
    }
    if (step === 2) {
      if (!employee.name) newErrors.name = "Full Name is required";
      if (!employee.email) newErrors.email = "Email is required";
      if (employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!employee.mobile) newErrors.mobile = "Mobile is required";
      if (employee.mobile && !/^[0-9]{10}$/.test(employee.mobile)) {
        newErrors.mobile = "Mobile must be a 10-digit number";
      }
      if (employee.emergencyPhone && !/^[0-9]{10}$/.test(employee.emergencyPhone)) {
        newErrors.emergencyPhone = "Emergency Phone must be a 10-digit number";
      }
      if (employee.emergencyPhone && employee.emergencyPhone.trim() === employee.mobile.trim()) {
        newErrors.emergencyPhone = "Mobile and emergency contact numbers cannot be the same";
      }
      if (!employee.password) newErrors.password = "Password is required";
      if (employee.password && employee.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
    }
    if (step === 3) {
      if (!employee.joinDate) newErrors.joinDate = "Join Date is required";
      if (["Department Head", "Employee", "Manager"].includes(employee.roleType) && !employee.department) {
        newErrors.department = "Department is required";
      }
      if (["Department Head", "Employee", "Manager"].includes(employee.roleType) && !employee.position) {
        newErrors.position = "Position is required";
      }
      if (["Employee", "Manager"].includes(employee.roleType) && !employee.employmentType) {
        newErrors.employmentType = "Employment Type is required";
      }
      if (!employee.basicSalary) newErrors.basicSalary = "Basic Salary is required";
      if (employee.basicSalary && (isNaN(employee.basicSalary) || parseFloat(employee.basicSalary) < 0)) {
        newErrors.basicSalary = "Basic Salary must be a non-negative number";
      }
      if (!employee.allowances) newErrors.allowances = "Allowances is required";
      if (employee.allowances && (isNaN(employee.allowances) || parseFloat(employee.allowances) < 0)) {
        newErrors.allowances = "Allowances must be a non-negative number";
      }
      if (!employee.bonuses) newErrors.bonuses = "Bonuses is required";
      if (employee.bonuses && (isNaN(employee.bonuses) || parseFloat(employee.bonuses) < 0)) {
        newErrors.bonuses = "Bonuses must be a non-negative number";
      }
    }
    return newErrors;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      const formErrors = validateStep();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        setIsSubmitting(false);
        return;
      }

      const roleMap = {
        HR: "hr",
        "Department Head": "dept_head",
        Manager: "manager",
        Employee: "employee",
      };

      const employeeData = {
        role: roleMap[employee.roleType],
        name: employee.name,
        email: employee.email,
        mobile: employee.mobile,
        emergency_phone: employee.emergencyPhone || null,
        address: employee.address || null,
        password: employee.password,
        basic_salary: parseFloat(employee.basicSalary) || 0,
        allowances: parseFloat(employee.allowances) || 0,
        bonuses: parseFloat(employee.bonuses) || 0,
        join_date: employee.joinDate,
      };

      if (employee.roleType === "Department Head") {
        employeeData.department_name = employee.department;
        employeeData.designation_name = employee.position;
      } else if (employee.roleType === "Manager") {
        employeeData.department_name = employee.department;
        employeeData.designation_name = employee.position;
        employeeData.employment_type = employee.employmentType;
      } else if (employee.roleType === "Employee") {
        employeeData.department_name = employee.department;
        employeeData.designation_name = employee.position;
        employeeData.employment_type = employee.employmentType;
      }

      console.log("Submitting Employee Data:", employeeData);

      const resultAction = await dispatch(createEmployee(employeeData));

      if (createEmployee.fulfilled.match(resultAction)) {
        setEmployee({
          name: "",
          email: "",
          mobile: "",
          emergencyPhone: "",
          address: "",
          basicSalary: "",
          allowances: "",
          bonuses: "",
          joinDate: "",
          roleType: "",
          department: "",
          position: "",
          employmentType: "Full-time",
          password: "",
        });
        setStep(1);
        setErrors({});
        dispatch(clearState());
        navigate("/admin/employees");
      } else {
        setErrors({ submit: resultAction.payload || "Failed to create employee" });
      }
      setIsSubmitting(false);
    },
    [dispatch, employee, navigate]
  );

  const handleNext = () => {
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, [dispatch]);

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {["Role", "Personal", "Employment"].map((label, index) => (
        <div key={label} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-50 ${
              step > index + 1
                ? "bg-teal-600 text-white"
                : step === index + 1
                ? "bg-teal-100 text-teal-600 border-2 border-teal-600"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {index + 1}
          </div>
          <span
            className={`ml-2 text-sm font-medium ${
              step >= index + 1 ? "text-teal-600" : "text-gray-500"
            }`}
          >
            {label}
          </span>
          {index < 2 && (
            <div
              className={`w-12 h-1 mx-2 ${
                step > index + 1 ? "bg-teal-600" : "bg-gray-200"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 relative z-10">
          <h2 className="text-3xl font-bold text-center text-teal-600 mb-10 uppercase tracking-tight">
            Assign New Employee
          </h2>
          <div className="text-sm text-gray-500 mb-4">Current Step: {step}</div>
          {renderStepIndicator()}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}
          {errors.submit && <p className="text-red-600 text-center mb-4">{errors.submit}</p>}
          {step === 1 && (
            <div className="mb-10">
              <label className="block text-sm font-medium text-gray-900 mb-4">
                Select Role Type <span className="text-red-600 font-bold">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {roleTypes.map((role) => (
                  <button
                    key={role.name}
                    type="button"
                    onClick={() => handleInput("roleType", role.name)}
                    className={`p-6 rounded-xl border-2 bg-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center text-center z-50 ${
                      employee.roleType === role.name
                        ? "border-teal-600 bg-teal-50 text-teal-700 scale-105"
                        : "border-gray-200 text-gray-700 hover:border-teal-400 hover:bg-teal-50"
                    } ${errors.roleType ? "border-red-500 animate-pulse" : ""}`}
                  >
                    <div className="mb-2 text-teal-600">{role.icon}</div>
                    <h3 className="text-lg font-semibold">{role.name}</h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </button>
                ))}
              </div>
              {errors.roleType && (
                <p className="mt-3 text-sm text-red-600 text-center font-medium">
                  {errors.roleType}
                </p>
              )}
              {employee.roleType && (
                <button
                  type="button"
                  className="block min-h-[48px] px-8 py-3 mt-4 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 text-base font-medium mx-auto z-50"
                  onClick={handleNext}
                >
                  Next
                </button>
              )}
            </div>
          )}
          {step > 1 && (
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              {step === 2 && (
                <div className="space-y-6">
                  {[
                    { label: "Full Name", field: "name", type: "text", required: true },
                    { label: "Email", field: "email", type: "email", required: true },
                    { label: "Mobile", field: "mobile", type: "tel", required: true },
                    {
                      label: "Emergency Phone",
                      field: "emergencyPhone",
                      type: "tel",
                      tooltip: "Optional emergency contact",
                    },
                    {
                      label: "Address",
                      field: "address",
                      type: "textarea",
                      tooltip: "Optional address",
                    },
                    {
                      label: "Password",
                      field: "password",
                      type: "password",
                      required: true,
                      tooltip: "Minimum 8 characters",
                    },
                  ].map(({ label, field, type, required, tooltip }) => (
                    <div key={field} className="relative group z-10">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {label} {required && <span className="text-red-600 font-bold">*</span>}
                        {tooltip && (
                          <span className="ml-1 text-gray-400 cursor-help" title={tooltip}>
                            ⓘ
                          </span>
                        )}
                      </label>
                      {type === "textarea" ? (
                        <textarea
                          value={employee[field]}
                          onChange={(e) => handleInput(field, e.target.value)}
                          className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
                            errors[field] ? "border-red-500 animate-pulse" : ""
                          }`}
                          aria-label={label}
                          rows="4"
                        />
                      ) : (
                        <input
                          type={type}
                          value={employee[field]}
                          onChange={(e) => handleInput(field, e.target.value)}
                          required={required}
                          className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
                            errors[field] ? "border-red-500 animate-pulse" : ""
                          }`}
                          aria-label={label}
                        />
                      )}
                      {errors[field] && (
                        <p className="mt-1 text-sm text-red-600 font-medium">{errors[field]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="relative group z-10">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Join Date <span className="text-red-600 font-bold">*</span>
                    </label>
                    <input
                      type="date"
                      value={employee.joinDate}
                      onChange={(e) => handleInput("joinDate", e.target.value)}
                      className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent z-10 ${
                        errors.joinDate ? "border-red-500 animate-pulse" : ""
                      }`}
                      aria-label="Select Join Date"
                      required
                    />
                    {errors.joinDate && (
                      <p className="mt-1 text-sm text-red-600 font-medium">{errors.joinDate}</p>
                    )}
                  </div>
                  <div className="relative group z-10">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Basic Salary <span className="text-red-600 font-bold">*</span>
                      <span className="ml-1 text-gray-400 cursor-help" title="Monthly basic salary">
                        ⓘ
                      </span>
                    </label>
                    <input
                      type="number"
                      value={employee.basicSalary}
                      onChange={(e) => handleInput("basicSalary", e.target.value)}
                      className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
                        errors.basicSalary ? "border-red-500 animate-pulse" : ""
                      }`}
                      aria-label="Basic Salary"
                      required
                    />
                    {errors.basicSalary && (
                      <p className="mt-1 text-sm text-red-600 font-medium">{errors.basicSalary}</p>
                    )}
                  </div>
                  <div className="relative group z-10">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Allowances <span className="text-red-600 font-bold">*</span>
                      <span className="ml-1 text-gray-400 cursor-help" title="Monthly allowances">
                        ⓘ
                      </span>
                    </label>
                    <input
                      type="number"
                      value={employee.allowances}
                      onChange={(e) => handleInput("allowances", e.target.value)}
                      className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
                        errors.allowances ? "border-red-500 animate-pulse" : ""
                      }`}
                      aria-label="Allowances"
                      required
                    />
                    {errors.allowances && (
                      <p className="mt-1 text-sm text-red-600 font-medium">{errors.allowances}</p>
                    )}
                  </div>
                  <div className="relative group z-10">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Bonuses <span className="text-red-600 font-bold">*</span>
                      <span className="ml-1 text-gray-400 cursor-help" title="Monthly bonuses">
                        ⓘ
                      </span>
                    </label>
                    <input
                      type="number"
                      value={employee.bonuses}
                      onChange={(e) => handleInput("bonuses", e.target.value)}
                      className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
                        errors.bonuses ? "border-red-500 animate-pulse" : ""
                      }`}
                      aria-label="Bonuses"
                      required
                    />
                    {errors.bonuses && (
                      <p className="mt-1 text-sm text-red-600 font-medium">{errors.bonuses}</p>
                    )}
                  </div>
                  {["Department Head", "Employee", "Manager"].includes(employee.roleType) && (
                    <div className="relative group z-10">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Department <span className="text-red-600 font-bold">*</span>
                      </label>
                      <select
                        value={employee.department}
                        onChange={(e) => handleInput("department", e.target.value)}
                        className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 z-10 ${
                          errors.department ? "border-red-500 animate-pulse" : ""
                        }`}
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
                      {errors.department && (
                        <p className="mt-1 text-sm text-red-600 font-medium">{errors.department}</p>
                      )}
                    </div>
                  )}
                  {["Department Head", "Manager"].includes(employee.roleType) && employee.department && (
                    <div className="relative group z-10">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Designation <span className="text-red-600 font-bold">*</span>
                      </label>
                      <select
                        value={employee.position}
                        onChange={(e) => handleInput("position", e.target.value)}
                        className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 z-10 ${
                          errors.position ? "border-red-500 animate-pulse" : ""
                        }`}
                        aria-label="Select designation"
                        required
                      >
                        <option value="">Select Designation</option>
                        {designations[employee.department]?.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                      </select>
                      {errors.position && (
                        <p className="mt-1 text-sm text-red-600 font-medium">{errors.position}</p>
                      )}
                    </div>
                  )}
                  {employee.roleType === "Employee" && employee.department && (
                    <div className="relative group z-10">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Position <span className="text-red-600 font-bold">*</span>
                      </label>
                      <select
                        value={employee.position}
                        onChange={(e) => handleInput("position", e.target.value)}
                        className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 z-10 ${
                          errors.position ? "border-red-500 animate-pulse" : ""
                        }`}
                        aria-label="Select position"
                        required
                      >
                        <option value="">Select Position</option>
                        {employeeDesignations[employee.department]?.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                      </select>
                      {errors.position && (
                        <p className="mt-1 text-sm text-red-600 font-medium">{errors.position}</p>
                      )}
                    </div>
                  )}
                  {["Employee", "Manager"].includes(employee.roleType) && (
                    <div className="relative group z-10">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Employment Type <span className="text-red-600 font-bold">*</span>
                      </label>
                      <select
                        value={employee.employmentType}
                        onChange={(e) => handleInput("employmentType", e.target.value)}
                        className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 z-10 ${
                          errors.employmentType ? "border-red-500 animate-pulse" : ""
                        }`}
                        aria-label="Select employment type"
                        required
                      >
                        <option value="">Select Employment Type</option>
                        {employmentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      {errors.employmentType && (
                        <p className="mt-1 text-sm text-red-600 font-medium">{errors.employmentType}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-between gap-4 pt-6 relative z-50">
                {step > 1 && (
                  <button
                    type="button"
                    className="block min-h-[48px] px-8 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-800 hover:scale-105 transition-all duration-200 text-base font-medium z-50"
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    className="block min-h-[48px] px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 text-base font-medium ml-auto z-50"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`block min-h-[48px] px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 text-base font-medium flex items-center justify-center ml-auto z-50 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Assign Employee"
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignEmployee;