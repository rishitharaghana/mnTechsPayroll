import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Users, UserCog, Briefcase } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  createEmployee,
  clearState,
  fetchDepartments,
  fetchDesignations,
} from "../../redux/slices/employeeSlice";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const AssignEmployee = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, successMessage, departments, designations } =
    useSelector((state) => state.employee);
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
    bloodGroup: "",
    photo: null,
    dateOfBirth: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const roleTypes = [
    {
      name: "HR",
      icon: <UserCog className="w-6 h-6" />,
      description: "Manage HR-related tasks",
    },
    {
      name: "Department Head",
      icon: <Users className="w-6 h-6" />,
      description: "Lead a department",
    },
    {
      name: "Manager",
      icon: <Briefcase className="w-6 h-6" />,
      description: "Manage a team",
    },
    {
      name: "Employee",
      icon: <User className="w-6 h-6" />,
      description: "Standard employee role",
    },
  ];

  const filteredRoleTypes =
    user?.role === "hr"
      ? roleTypes.filter((role) => role.name !== "HR")
      : roleTypes;

  const bloodGroups = [
    "A+ve",
    "A-ve",
    "B+ve",
    "B-ve",
    "AB+ve",
    "AB-ve",
    "O+ve",
    "O-ve",
  ];
  const employmentTypes = ["Full-time", "Part-time", "Internship", "Contract"];
  const genders = ["Male", "Female", "Others"];

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchDesignations());
  }, [dispatch]);

  useEffect(() => {
    if (
      employee.emergencyPhone &&
      employee.mobile &&
      employee.emergencyPhone.trim() === employee.mobile.trim()
    ) {
      setErrors((prev) => ({
        ...prev,
        emergencyPhone:
          "Mobile and emergency contact numbers cannot be the same",
      }));
    } else {
      setErrors((prev) => ({ ...prev, emergencyPhone: "" }));
    }
  }, [employee.mobile, employee.emergencyPhone]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
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
        bloodGroup: "",
        photo: null,
        dateOfBirth: "",
        gender: "",
      });
      setStep(1);
      setErrors({});
      dispatch(clearState());
      navigate("/admin/assign-employee");
    }
    if (error) {
      toast.error(error);
      setErrors({ submit: error });
      dispatch(clearState());
    }
  }, [successMessage, error, dispatch, navigate]);

  // Filter departments based on role
  const getFilteredDepartments = () => {
    if (!departments) return [];
    if (employee.roleType === "HR") {
      return departments.filter((dept) => dept.department_name === "HR");
    }
    if (["Department Head", "Manager"].includes(employee.roleType)) {
      return departments.filter(
        (dept) =>
          dept.department_name !== "HR" && dept.department_name !== "Manager"
      );
    }
    return departments.filter((dept) => dept.department_name !== "Manager");
  };

  // Filter designations based on role and department
  const getFilteredDesignations = () => {
    if (!designations || !employee.department) return [];
    const deptDesignations = designations.filter(
      (des) => des.department_name === employee.department
    );
    if (employee.roleType === "HR") {
      return deptDesignations.filter((des) =>
        [
          "HR Manager",
          "HR Executive",
          "Payroll Executive",
          "Recruitment Specialist",
          "Training & Development Officer",
        ].includes(des.designation_name)
      );
    }
    if (
      employee.roleType === "Department Head" ||
      employee.roleType === "Manager"
    ) {
      return deptDesignations.filter((des) =>
        [
          "Facility Manager",
          "Office Administrator",
          "General Manager",
          "Digital Marketing Manager",
          "Design Manager",
          "Technical Lead",
          "Marketing Manager",
          "Telemarketing Manager",
        ].includes(des.designation_name)
      );
    }
    return deptDesignations.filter(
      (des) =>
        ![
          "Facility Manager",
          "Office Administrator",
          "General Manager",
          "Digital Marketing Manager",
          "Design Manager",
          "Technical Lead",
          "Marketing Manager",
          "Telemarketing Manager",
        ].includes(des.designation_name)
    );
  };

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          photo: "Only JPG, JPEG, or PNG files are allowed",
        }));
        toast.error("Only JPG, JPEG, or PNG files are allowed for photo");
        return;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          photo: "Photo size must not exceed 5MB",
        }));
        toast.error("Photo size must not exceed 5MB");
        return;
      }
      setEmployee((prev) => ({ ...prev, photo: file }));
      setErrors((prev) => ({ ...prev, photo: "" }));
    } else {
      setErrors((prev) => ({ ...prev, photo: "No file selected" }));
      toast.error("No file selected");
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !employee.roleType) {
      newErrors.roleType = "Please select a Role Type";
    }
    if (step === 2) {
      if (!employee.name) newErrors.name = "Full Name is required";
      if (!employee.email) newErrors.email = "Email is required";
      if (
        employee.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)
      ) {
        newErrors.email = "Invalid email format";
      }
      if (!employee.mobile) newErrors.mobile = "Mobile number is required";
      if (employee.mobile && !/^[0-9]{10}$/.test(employee.mobile)) {
        newErrors.mobile = "Mobile number must be a 10-digit number";
      }
      if (
        employee.emergencyPhone &&
        !/^[0-9]{10}$/.test(employee.emergencyPhone)
      ) {
        newErrors.emergencyPhone =
          "Emergency Phone must be a 10-digit number";
      }
      if (
        employee.emergencyPhone &&
        employee.mobile &&
        employee.emergencyPhone.trim() === employee.mobile.trim()
      ) {
        newErrors.emergencyPhone =
          "Mobile and emergency contact numbers cannot be the same";
      }
      if (!employee.password) newErrors.password = "Password is required";
      if (employee.password && employee.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (!employee.bloodGroup)
        newErrors.bloodGroup = "Blood Group is required";
      if (!employee.photo) newErrors.photo = "Photo is required";
      else {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(employee.photo.type)) {
          newErrors.photo = "Photo must be a JPG, JPEG, or PNG file";
        }
        if (employee.photo.size > 5 * 1024 * 1024) {
          newErrors.photo = "Photo size must not exceed 5MB";
        }
      }
      // Validate Date of Birth
      if (!employee.dateOfBirth) {
        newErrors.dateOfBirth = "Date of Birth is required";
      } else if (isNaN(new Date(employee.dateOfBirth).getTime())) {
        newErrors.dateOfBirth = "Invalid Date of Birth";
      } else {
        const today = new Date();
        const dob = new Date(employee.dateOfBirth);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < dob.getDate())
        ) {
          age--;
        }
        if (age < 18) {
          newErrors.dateOfBirth = "Employee must be at least 18 years old";
        }
        if (dob > today) {
          newErrors.dateOfBirth = "Date of Birth cannot be in the future";
        }
      }
      // Validate Gender
      if (!employee.gender) {
        newErrors.gender = "Gender is required";
      } else if (!genders.includes(employee.gender)) {
        newErrors.gender = "Please select a valid gender option";
      }
    }
    if (step === 3) {
      if (!employee.joinDate) newErrors.joinDate = "Join Date is required";
      if (
        ["Department Head", "Employee", "Manager"].includes(
          employee.roleType
        ) &&
        !employee.department
      ) {
        newErrors.department = `Department is required for ${employee.roleType} role`;
      }
      if (
        ["Department Head", "Employee", "Manager"].includes(
          employee.roleType
        ) &&
        !employee.position
      ) {
        newErrors.position = `Position is required for ${employee.roleType} role`;
      }
      if (
        ["Employee", "Manager"].includes(employee.roleType) &&
        !employee.employmentType
      ) {
        newErrors.employmentType = "Employment Type is required";
      }
      if (!employee.basicSalary)
        newErrors.basicSalary = "Basic Salary is required";
      if (
        employee.basicSalary &&
        (isNaN(employee.basicSalary) ||
          parseFloat(employee.basicSalary) < 0 ||
          employee.basicSalary.trim() === "")
      ) {
        newErrors.basicSalary =
          "Basic Salary must be a valid non-negative number";
      }
      if (!employee.allowances) newErrors.allowances = "Allowances is required";
      if (
        employee.allowances &&
        (isNaN(employee.allowances) ||
          parseFloat(employee.allowances) < 0 ||
          employee.allowances.trim() === "")
      ) {
        newErrors.allowances =
          "Allowances must be a valid non-negative number";
      }
      if (!employee.bonuses) newErrors.bonuses = "Bonuses is required";
      if (
        employee.bonuses &&
        (isNaN(employee.bonuses) ||
          parseFloat(employee.bonuses) < 0 ||
          employee.bonuses.trim() === "")
      ) {
        newErrors.bonuses = "Bonuses must be a valid non-negative number";
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
        toast.error("Please fix the errors before submitting");
        return;
      }

      console.log("Submitting dateOfBirth:", employee.dateOfBirth); // Debug DOB

      const roleMap = {
        HR: "hr",
        "Department Head": "dept_head",
        Manager: "manager",
        Employee: "employee",
      };

      const formData = new FormData();
      formData.append("role", roleMap[employee.roleType] || "");
      formData.append("name", employee.name.trim() || "");
      formData.append("email", employee.email.trim() || "");
      formData.append("mobile", employee.mobile.trim() || "");
      formData.append("emergency_phone", employee.emergencyPhone.trim() || "");
      formData.append("address", employee.address.trim() || "");
      formData.append("password", employee.password || "");
      formData.append("basic_salary", parseFloat(employee.basicSalary) || 0);
      formData.append("allowances", parseFloat(employee.allowances) || 0);
      formData.append("bonuses", parseFloat(employee.bonuses) || 0);
      formData.append("join_date", employee.joinDate || "");
      formData.append("blood_group", employee.bloodGroup || "");
      formData.append("dob", employee.dateOfBirth || ""); // Changed to 'dob'
      formData.append("gender", employee.gender || "");
      if (employee.photo) {
        formData.append("photo", employee.photo);
      }
      if (
        ["Department Head", "Manager", "Employee"].includes(employee.roleType)
      ) {
        formData.append("department_name", employee.department || "");
        formData.append("designation_name", employee.position || "");
      }
      if (["Employee", "Manager"].includes(employee.roleType)) {
        formData.append("employment_type", employee.employmentType || "");
      }

      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      const resultAction = await dispatch(createEmployee(formData));

      if (createEmployee.fulfilled.match(resultAction)) {
        console.log("Create employee response:", resultAction.payload); // Debug response
        toast.success("Employee created successfully");
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
          bloodGroup: "",
          photo: null,
          dateOfBirth: "",
          gender: "",
        });
        setStep(1);
        setErrors({});
        dispatch(clearState());
        navigate("/admin/assign-employee");
      } else {
        console.error("Submission error:", resultAction.payload);
        toast.error(resultAction.payload || "Failed to create employee");
        setErrors({
          submit: resultAction.payload || "Failed to create employee",
        });
      }
      setIsSubmitting(false);
    },
    [dispatch, employee, navigate]
  );

  const handleNext = () => {
    const stepErrors = validateStep();
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error("Please fix the errors before proceeding");
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
    <div className="w-full lg:w-[78%]">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/admin/dashboard" },
            { label: "Assign Employee", link: "/admin/assign-employee" },
          ]}
        />
        <PageMeta title="Assign Employee" description="Assign a new employee" />
      </div>
      <div className="min-h-screen bg-white rounded-2xl p-6 ">
        <div className="bg-white rounded-2xl shadow-md border-1 border-gray-200 p-6 relative z-10">
          <h2 className="text-3xl font-bold text-center text-teal-600 mb-10 uppercase tracking-tight">
            Assign New Employee
          </h2>
          <div className="text-sm text-gray-500 font-semibold mb-4">
            Current Step: {step}
          </div>
          {renderStepIndicator()}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {successMessage && (
            <p className="text-green-600 text-center mb-4">{successMessage}</p>
          )}
          {errors.submit && (
            <p className="text-red-600 text-center mb-4">{errors.submit}</p>
          )}
          {step === 1 && (
            <div className="pb-2">
              <label className="block text-md font-semibold text-gray-900 mb-4">
                Select Role Type{" "}
                <span className="text-red-600 font-bold">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {filteredRoleTypes.map((role) => (
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
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    className="block text-lg px-5 py-2 mt-6 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 font-medium z-50"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
          {step > 1 && (
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              {step === 2 && (
                <div className="space-y-6">
                  {[
                    {
                      label: "Full Name",
                      field: "name",
                      type: "text",
                      required: true,
                    },
                    {
                      label: "Email",
                      field: "email",
                      type: "email",
                      required: true,
                    },
                    {
                      label: "Mobile",
                      field: "mobile",
                      type: "tel",
                      required: true,
                    },
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
                      label: "Date of Birth",
                      field: "dateOfBirth",
                      type: "date",
                      required: true,
                      tooltip: "Employee must be at least 18 years old",
                    },
                    {
                      label: "Gender",
                      field: "gender",
                      type: "select",
                      required: true,
                      options: genders,
                    },
                    {
                      label: "Password",
                      field: "password",
                      type: "password",
                      required: true,
                      tooltip: "Minimum 8 characters",
                    },
                    {
                      label: "Blood Group",
                      field: "bloodGroup",
                      type: "select",
                      required: true,
                      options: bloodGroups,
                    },
                    {
                      label: "Photo",
                      field: "photo",
                      type: "file",
                      required: true,
                      accept: "image/jpeg,image/jpg,image/png",
                    },
                  ].map(
                    ({
                      label,
                      field,
                      type,
                      required,
                      tooltip,
                      options,
                      accept,
                    }) => (
                      <div key={field} className="relative group z-10">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {label}{" "}
                          {required && (
                            <span className="text-red-600 font-bold">*</span>
                          )}
                          {tooltip && (
                            <span
                              className="ml-1 text-gray-400 cursor-help"
                              title={tooltip}
                            >
                              ⓘ
                            </span>
                          )}
                        </label>
                        {type === "textarea" ? (
                          <textarea
                            value={employee[field]}
                            onChange={(e) => handleInput(field, e.target.value)}
                            className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
                              errors[field]
                                ? "border-red-500 animate-pulse"
                                : ""
                            }`}
                            aria-label={label}
                            rows="4"
                          />
                        ) : type === "select" ? (
                          <select
                            value={employee[field]}
                            onChange={(e) => handleInput(field, e.target.value)}
                            className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 z-10 ${
                              errors[field]
                                ? "border-red-500 animate-pulse"
                                : ""
                            }`}
                            aria-label={label}
                            required={required}
                          >
                            <option value="">Select {label}</option>
                            {options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : type === "file" ? (
                          <input
                            type="file"
                            accept={accept}
                            onChange={handleFileChange}
                            className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 z-10 ${
                              errors[field]
                                ? "border-red-500 animate-pulse"
                                : ""
                            }`}
                            aria-label={label}
                            required={required}
                          />
                        ) : (
                          <input
                            type={type}
                            value={employee[field]}
                            onChange={(e) => handleInput(field, e.target.value)}
                            required={required}
                            max={
                              type === "date"
                                ? new Date().toISOString().split("T")[0]
                                : undefined
                            }
                            className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
                              errors[field]
                                ? "border-red-500 animate-pulse"
                                : ""
                            }`}
                            aria-label={label}
                          />
                        )}
                        {errors[field] && (
                          <p className="mt-1 text-sm text-red-600 font-medium">
                            {errors[field]}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="relative group z-10">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Join Date{" "}
                      <span className="text-red-600 font-bold">*</span>
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
                      <p className="mt-1 text-sm text-red-600 font-medium">
                        {errors.joinDate}
                      </p>
                    )}
                  </div>
                  <div className="relative group z-10">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Basic Salary{" "}
                      <span className="text-red-600 font-bold">*</span>
                      <span
                        className="ml-1 text-gray-400 cursor-help"
                        title="Monthly basic salary"
                      >
                        ⓘ
                      </span>
                    </label>
                    <input
                      type="number"
                      value={employee.basicSalary}
                      onChange={(e) =>
                        handleInput("basicSalary", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
                        errors.basicSalary ? "border-red-500 animate-pulse" : ""
                      }`}
                      aria-label="Basic Salary"
                      required
                    />
                    {errors.basicSalary && (
                      <p className="mt-1 text-sm text-red-600 font-medium">
                        {errors.basicSalary}
                      </p>
                    )}
                  </div>
                  <div className="relative group z-10">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Allowances{" "}
                      <span className="text-red-600 font-bold">*</span>
                      <span
                        className="ml-1 text-gray-400 cursor-help"
                        title="Monthly allowances"
                      >
                        ⓘ
                      </span>
                    </label>
                    <input
                      type="number"
                      value={employee.allowances}
                      onChange={(e) =>
                        handleInput("allowances", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
                        errors.allowances ? "border-red-500 animate-pulse" : ""
                      }`}
                      aria-label="Allowances"
                      required
                    />
                    {errors.allowances && (
                      <p className="mt-1 text-sm text-red-600 font-medium">
                        {errors.allowances}
                      </p>
                    )}
                  </div>
                  <div className="relative group z-10">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Bonuses <span className="text-red-600 font-bold">*</span>
                      <span
                        className="ml-1 text-gray-400 cursor-help"
                        title="Monthly bonuses"
                      >
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
                      <p className="mt-1 text-sm text-red-600 font-medium">
                        {errors.bonuses}
                      </p>
                    )}
                  </div>
                  {["Department Head", "Employee", "Manager"].includes(
                    employee.roleType
                  ) && (
                    <div className="relative group z-10">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Department{" "}
                        <span className="text-red-600 font-bold">*</span>
                      </label>
                      <select
                        value={employee.department}
                        onChange={(e) =>
                          handleInput("department", e.target.value)
                        }
                        className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 z-10 ${
                          errors.department
                            ? "border-red-500 animate-pulse"
                            : ""
                        }`}
                        aria-label="Select department"
                        required
                      >
                        <option value="">Select Department</option>
                        {getFilteredDepartments().map((dept) => (
                          <option key={dept.id} value={dept.department_name}>
                            {dept.department_name}
                          </option>
                        ))}
                      </select>
                      {errors.department && (
                        <p className="mt-1 text-sm text-red-600 font-medium">
                          {errors.department}
                        </p>
                      )}
                    </div>
                  )}
                  {["Department Head", "Employee", "Manager"].includes(
                    employee.roleType
                  ) &&
                    employee.department && (
                      <div className="relative group z-10">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {employee.roleType === "Employee"
                            ? "Position"
                            : "Designation"}{" "}
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <select
                          value={employee.position}
                          onChange={(e) =>
                            handleInput("position", e.target.value)
                          }
                          className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 z-10 ${
                            errors.position
                              ? "border-red-500 animate-pulse"
                              : ""
                          }`}
                          aria-label="Select designation"
                          required
                        >
                          <option value="">
                            Select{" "}
                            {employee.roleType === "Employee"
                              ? "Position"
                              : "Designation"}
                          </option>
                          {getFilteredDesignations().map((des) => (
                            <option
                              key={des.designation_name}
                              value={des.designation_name}
                            >
                              {des.designation_name}
                            </option>
                          ))}
                        </select>
                        {errors.position && (
                          <p className="mt-1 text-sm text-red-600 font-medium">
                            {errors.position}
                          </p>
                        )}
                      </div>
                    )}
                  {["Employee", "Manager"].includes(employee.roleType) && (
                    <div className="relative group z-10">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Employment Type{" "}
                        <span className="text-red-600 font-bold">*</span>
                      </label>
                      <select
                        value={employee.employmentType}
                        onChange={(e) =>
                          handleInput("employmentType", e.target.value)
                        }
                        className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 z-10 ${
                          errors.employmentType
                            ? "border-red-500 animate-pulse"
                            : ""
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
                        <p className="mt-1 text-sm text-red-600 font-medium">
                          {errors.employmentType}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              <div className="flex justify-between gap-4 pt-6 relative z-50">
                {step > 1 && (
                  <button
                    type="button"
                    className="block text-lg px-5 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 hover:scale-105 transition-all duration-200 font-medium z-50"
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    className="block text-lg px-5 py-2 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 font-medium ml-auto z-50"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`block text-lg px-5 py-2 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 font-medium flex items-center justify-center ml-auto z-50 ${
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