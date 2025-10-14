import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Users, UserCog, Briefcase, Eye, EyeOff } from "lucide-react";
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
  const { loading, error, successMessage, departments, designations, employeeId } =
    useSelector((state) => state.employee);
  const { user } = useSelector((state) => state.auth);

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    mobile: "",
    emergencyPhone: "",
    address: "",
    joinDate: "",
    roleType: "",
    department: "",
    position: "",
    employmentType: "full_time",
    password: "",
    bloodGroup: "",
    photo: null,
    dateOfBirth: "",
    gender: "",
    basicSalary: "",
    hraPercentage: "",
    hraAmount: "",
    specialAllowances: "",
    pfPercentage: "12",
    pfAmount: "",
    esiPercentage: "0.75",
    esiAmount: "",
    bonus: "",
    customEmployeeIdSuffix: "", // Field for numeric suffix
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [realTimeCalculations, setRealTimeCalculations] = useState({
    grossSalary: 0,
    totalDeductions: 0,
    netSalary: 0,
  });

  const roleTypes = [
    { name: "HR", icon: <UserCog className="w-6 h-6" />, description: "Manage HR-related tasks" },
    { name: "Department Head", icon: <Users className="w-6 h-6" />, description: "Lead a department" },
    { name: "Manager", icon: <Briefcase className="w-6 h-6" />, description: "Manage a team" },
    { name: "Employee", icon: <User className="w-6 h-6" />, description: "Standard employee role" },
  ];

  const filteredRoleTypes = user?.role === "hr" ? roleTypes.filter((role) => role.name !== "HR") : roleTypes;
  const bloodGroups = ["A+ve", "A-ve", "B+ve", "B-ve", "AB+ve", "AB-ve", "O+ve", "O-ve"];
  const employmentTypes = ["full_time", "part_time", "intern", "contract"];
  const genders = ["Male", "Female", "Others"];

  useEffect(() => {
    if (!["super_admin", "hr"].includes(user?.role)) {
      toast.error("Unauthorized access. Please log in with appropriate permissions.");
      navigate("/login");
      return;
    }
    dispatch(clearState());
    dispatch(fetchDepartments());
    dispatch(fetchDesignations());
  }, [dispatch, navigate, user]);

  useEffect(() => {
    if (employee.emergencyPhone && employee.mobile && employee.emergencyPhone.trim() === employee.mobile.trim()) {
      setErrors((prev) => ({ ...prev, emergencyPhone: "Mobile and emergency contact numbers cannot be the same" }));
    } else {
      setErrors((prev) => ({ ...prev, emergencyPhone: "" }));
    }
  }, [employee.mobile, employee.emergencyPhone]);

  const calculateRealTime = useCallback(() => {
    const basic = parseFloat(employee.basicSalary) || 0;
    const hra = parseFloat(employee.hraAmount) || 0;
    const allowances = parseFloat(employee.specialAllowances) || 0;
    const bonus = parseFloat(employee.bonus) || 0;
    const pf = parseFloat(employee.pfAmount) || 0;
    const esi = parseFloat(employee.esiAmount) || 0;

    const grossSalary = basic + hra + allowances + bonus;
    const totalDeductions = pf + esi;
    const netSalary = grossSalary - totalDeductions;

    setRealTimeCalculations({
      grossSalary: grossSalary.toFixed(2),
      totalDeductions: totalDeductions.toFixed(2),
      netSalary: netSalary.toFixed(2),
    });
  }, [employee]);

  useEffect(() => {
    calculateRealTime();
  }, [employee, calculateRealTime]);

  const handleInput = useCallback(
    (field, value) => {
      setEmployee((prev) => {
        const updated = { ...prev, [field]: value };
        if (field === "roleType") return { ...updated, department: "", position: "" };
        if (field === "department") return { ...updated, position: "" };
        return updated;
      });
      setErrors((prev) => ({ ...prev, [field]: "" }));

      const basic = parseFloat(field === "basicSalary" ? value : employee.basicSalary) || 0;
      const gross =
        basic +
        parseFloat(employee.hraAmount || 0) +
        parseFloat(field === "specialAllowances" ? value : employee.specialAllowances || 0) +
        parseFloat(field === "bonus" ? value : employee.bonus || 0);

      if (field === "hraPercentage" || field === "basicSalary") {
        const hraPercent = parseFloat(field === "hraPercentage" ? value : employee.hraPercentage) || 0;
        setEmployee((prev) => ({ ...prev, hraAmount: ((basic * hraPercent) / 100).toFixed(2) }));
      }

      if (field === "pfPercentage" || field === "basicSalary") {
        const pfPercent = parseFloat(field === "pfPercentage" ? value : employee.pfPercentage) || 0;
        if (basic <= 15000 && pfPercent !== 12) {
          setErrors((prev) => ({ ...prev, pfPercentage: "PF must be 12% for basic salary ≤ ₹15,000" }));
          setEmployee((prev) => ({ ...prev, pfPercentage: "12", pfAmount: ((basic * 12) / 100).toFixed(2) }));
        } else {
          setEmployee((prev) => ({ ...prev, pfAmount: ((basic * pfPercent) / 100).toFixed(2) }));
        }
      }

      if (
        field === "esiPercentage" ||
        field === "basicSalary" ||
        field === "specialAllowances" ||
        field === "bonus"
      ) {
        const esiPercent = parseFloat(field === "esiPercentage" ? value : employee.esiPercentage) || 0;
        if (gross > 21000 && esiPercent > 0) {
          setErrors((prev) => ({ ...prev, esiPercentage: "ESI not applicable for gross salary > ₹21,000" }));
          setEmployee((prev) => ({ ...prev, esiPercentage: "0", esiAmount: "0" }));
        } else if (gross <= 21000 && esiPercent !== 0.75) {
          setErrors((prev) => ({ ...prev, esiPercentage: "ESI must be 0.75% for employee contribution" }));
          setEmployee((prev) => ({ ...prev, esiPercentage: "0.75", esiAmount: ((gross * 0.75) / 100).toFixed(2) }));
        } else {
          setEmployee((prev) => ({ ...prev, esiAmount: ((gross * esiPercent) / 100).toFixed(2) }));
        }
      }
    },
    [employee]
  );

  useEffect(() => {
    if (isSubmitting && successMessage && employeeId) {
      toast.success(successMessage);
      navigate("/admin/employees");
      setTimeout(() => {
        dispatch(clearState());
      }, 1000);
    } else if (isSubmitting && successMessage && !employeeId) {
      toast.success(successMessage);
      navigate("/admin/employees");
      dispatch(clearState());
    }
    if (error) {
      if (
        error.includes("Access token is required") ||
        error.includes("Invalid or expired token") ||
        error.includes("Forbidden Action") ||
        error.includes("Custom suffix")
      ) {
        toast.error(error);
      } else {
        toast.error(error);
        setErrors({ submit: error });
        setIsSubmitting(false);
      }
    }
  }, [successMessage, error, employeeId, dispatch, navigate, isSubmitting]);

  const getFilteredDepartments = () => {
    if (!departments) return [];
    if (employee.roleType === "HR") {
      return departments.filter((dept) => dept.department_name === "HR");
    }
    return departments.filter((dept) => dept.department_name !== "Manager");
  };

  const getFilteredDesignations = () => {
    if (!designations || !employee.department) return [];
    const deptDesignations = designations.filter((des) => des.department_name === employee.department);
    if (employee.roleType === "HR") return deptDesignations;
    if (employee.roleType === "Department Head") {
      return deptDesignations.filter((des) =>
        [
          "Technical Lead",
          "IT Director",
          "General Manager",
          "Digital Marketing Manager",
          "Design Manager",
          "Marketing Manager",
          "Telemarketing Manager",
          "Facility Manager",
          "Office Administrator",
        ].includes(des.designation_name)
      );
    }
    if (employee.roleType === "Manager") {
      return deptDesignations.filter((des) =>
        [
          "Project Manager",
          "Team Lead",
          "Operations Manager",
          "Marketing Coordinator",
          "Design Coordinator",
        ].includes(des.designation_name)
      );
    }
    return deptDesignations.filter(
      (des) =>
        ![
          "Technical Lead",
          "IT Director",
          "General Manager",
          "Digital Marketing Manager",
          "Design Manager",
          "Marketing Manager",
          "Telemarketing Manager",
          "Facility Manager",
          "Office Administrator",
          "Project Manager",
          "Team Lead",
          "Operations Manager",
          "Marketing Coordinator",
          "Design Coordinator",
        ].includes(des.designation_name)
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, photo: "Only JPG, JPEG, or PNG files are allowed" }));
        toast.error("Only JPG, JPEG, or PNG files are allowed for photo");
        return;
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({ ...prev, photo: "Photo size must not exceed 5MB" }));
        toast.error("Photo size must not exceed 5MB");
        return;
      }
      setEmployee((prev) => ({ ...prev, photo: file }));
      setPhotoPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, photo: "" }));
    } else {
      setErrors((prev) => ({ ...prev, photo: "No file selected" }));
      toast.error("No file selected");
      setPhotoPreview(null);
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
      if (employee.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!employee.mobile) newErrors.mobile = "Mobile number is required";
      if (employee.mobile && !/^[0-9]{10}$/.test(employee.mobile)) {
        newErrors.mobile = "Mobile number must be a 10-digit number";
      }
      if (employee.emergencyPhone && !/^[0-9]{10}$/.test(employee.emergencyPhone)) {
        newErrors.emergencyPhone = "Emergency Phone must be a 10-digit number";
      }
      if (employee.emergencyPhone && employee.mobile && employee.emergencyPhone.trim() === employee.mobile.trim()) {
        newErrors.emergencyPhone = "Mobile and emergency contact numbers cannot be the same";
      }
      if (!employee.password) newErrors.password = "Password is required";
      if (employee.password && employee.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (!employee.bloodGroup) newErrors.bloodGroup = "Blood Group is required";
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
      if (!employee.dateOfBirth) {
        newErrors.dateOfBirth = "Date of Birth is required";
      } else if (isNaN(new Date(employee.dateOfBirth).getTime())) {
        newErrors.dateOfBirth = "Invalid Date of Birth";
      } else {
        const today = new Date();
        const dob = new Date(employee.dateOfBirth);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        if (age < 18) {
          newErrors.dateOfBirth = "Employee must be at least 18 years old";
        }
        if (dob > today) {
          newErrors.dateOfBirth = "Date of Birth cannot be in the future";
        }
      }
      if (!employee.gender) {
        newErrors.gender = "Gender is required";
      } else if (!genders.includes(employee.gender)) {
        newErrors.gender = "Please select a valid gender option";
      }
      if (!employee.customEmployeeIdSuffix) {
        newErrors.customEmployeeIdSuffix = "Employee ID suffix is required";
      } else if (!/^[0-9]{1,10}$/.test(employee.customEmployeeIdSuffix)) {
        newErrors.customEmployeeIdSuffix = "Employee ID suffix must be numeric and 1-10 digits";
      }
    }
    if (step === 3) {
      if (!employee.joinDate) newErrors.joinDate = "Join Date is required";
      if (["HR", "Department Head", "Employee", "Manager"].includes(employee.roleType) && !employee.department) {
        newErrors.department = `Department is required for ${employee.roleType} role`;
      }
      if (["HR", "Department Head", "Employee", "Manager"].includes(employee.roleType) && !employee.position) {
        newErrors.position = `Position is required for ${employee.roleType} role`;
      }
      if (employee.roleType === "HR" && employee.department !== "HR") {
        newErrors.department = "HR role must be in HR department";
      }
      if (["Employee", "Manager"].includes(employee.roleType) && !employee.employmentType) {
        newErrors.employmentType = "Employment Type is required";
      }
    }
    if (step === 4) {
      if (!employee.basicSalary) newErrors.basicSalary = "Basic Salary is required";
      else if (isNaN(employee.basicSalary) || Number(employee.basicSalary) <= 0) {
        newErrors.basicSalary = "Basic Salary must be a positive number";
      }
      if (!employee.hraPercentage) newErrors.hraPercentage = "HRA Percentage is required";
      if (
        employee.hraPercentage &&
        (isNaN(employee.hraPercentage) || Number(employee.hraPercentage) < 0 || Number(employee.hraPercentage) > 100)
      ) {
        newErrors.hraPercentage = "HRA Percentage must be between 0 and 100";
      }
      if (!employee.specialAllowances) newErrors.specialAllowances = "Special Allowances is required";
      if (
        employee.specialAllowances &&
        (isNaN(employee.specialAllowances) || Number(employee.specialAllowances) < 0)
      ) {
        newErrors.specialAllowances = "Special Allowances must be a non-negative number";
      }
      if (!employee.pfPercentage) newErrors.pfPercentage = "PF Percentage is required";
      if (
        employee.pfPercentage &&
        (isNaN(employee.pfPercentage) || Number(employee.pfPercentage) < 0 || Number(employee.pfPercentage) > 100)
      ) {
        newErrors.pfPercentage = "PF Percentage must be between 0 and 100";
      }
      if (employee.bonus && (isNaN(employee.bonus) || Number(employee.bonus) < 0)) {
        newErrors.bonus = "Bonus must be a non-negative number";
      }
      const basic = parseFloat(employee.basicSalary) || 0;
      const gross =
        basic +
        parseFloat(employee.hraAmount || 0) +
        parseFloat(employee.specialAllowances || 0) +
        parseFloat(employee.bonus || 0);
      if (basic <= 15000 && parseFloat(employee.pfPercentage) !== 12) {
        newErrors.pfPercentage = "PF must be 12% for basic salary ≤ ₹15,000";
      }
      if (gross > 21000 && parseFloat(employee.esiPercentage) > 0) {
        newErrors.esiPercentage = "ESI not applicable for gross salary > ₹21,000";
      }
      if (gross <= 21000 && parseFloat(employee.esiPercentage) !== 0.75) {
        newErrors.esiPercentage = "ESI must be 0.75% for employee contribution";
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

      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        toast.error("No authentication token found. Please log in.");
        navigate("/login");
        setIsSubmitting(false);
        return;
      }

      let token, userId, userRole;
      try {
        const parsedToken = JSON.parse(userToken);
        token = parsedToken.token;
        userId = parsedToken.employee_id;
        userRole = parsedToken.role;
        if (!token || !["super_admin", "hr"].includes(userRole)) {
          toast.error("Unauthorized. Please log in with appropriate permissions.");
          navigate("/login");
          setIsSubmitting(false);
          return;
        }
      } catch (parseError) {
        toast.error("Invalid token format. Please log in again.");
        navigate("/login");
        setIsSubmitting(false);
        return;
      }

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
      formData.append("join_date", employee.joinDate || "");
      formData.append("blood_group", employee.bloodGroup || "");
      formData.append("dob", employee.dateOfBirth || "");
      formData.append("gender", employee.gender || "");
      formData.append("custom_employee_id_suffix", employee.customEmployeeIdSuffix.trim() || "");
      if (employee.photo) formData.append("photo", employee.photo);
      if (["HR", "Department Head", "Manager", "Employee"].includes(employee.roleType)) {
        formData.append("department_name", employee.department || "");
        formData.append("designation_name", employee.position || "");
      }
      if (["Employee", "Manager"].includes(employee.roleType)) {
        formData.append("employment_type", employee.employmentType || "");
      }
      formData.append("basic_salary", parseFloat(employee.basicSalary) || 0);
      formData.append("hra_percentage", parseFloat(employee.hraPercentage) || 0);
      formData.append("hra", parseFloat(employee.hraAmount) || 0);
      formData.append("special_allowances", parseFloat(employee.specialAllowances) || 0);
      formData.append("provident_fund_percentage", parseFloat(employee.pfPercentage) || 0);
      formData.append("provident_fund", parseFloat(employee.pfAmount) || 0);
      formData.append("esic_percentage", parseFloat(employee.esiPercentage) || 0);
      formData.append("esic", parseFloat(employee.esiAmount) || 0);
      formData.append("bonus", parseFloat(employee.bonus) || 0);
      formData.append("created_by", userId || "");

      try {
        const resultAction = await dispatch(createEmployee(formData));
        if (!createEmployee.fulfilled.match(resultAction)) {
          throw new Error(resultAction.payload || "Failed to create employee");
        }
      } catch (err) {
        toast.error(err.message);
        setErrors({ submit: err.message });
        setIsSubmitting(false);
      }
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
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [dispatch, photoPreview]);

  const renderStepIndicator = () => (
    <div className="flex flex-col sm:flex-row border-2 border-gray-200 sm:border-0 sm:border-none p-4 sm:p-0 rounded-xl sm:rounded-none shadow-md sm:shadow-none items-start sm:items-center sm:justify-center justify-start mb-5 sm:mb-6 space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4 lg:space-x-6">
      {["Role", "Personal", "Employment", "Salary"].map((label, index) => (
        <div key={label} className="flex sm:items-center items-center sm:justify-center justify-start w-full sm:w-auto">
          <div
            className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs xs:text-sm sm:text-base font-medium z-50 ${
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
            className={`ml-2 text-xs xs:text-sm sm:text-sm md:text-base font-medium text-center sm:text-left ${
              step >= index + 1 ? "text-teal-600" : "text-gray-500"
            }`}
          >
            {label}
          </span>
          {index < 3 && (
            <div
              className={`w-6 sm:w-8 md:w-10 lg:w-12 h-1 mx-1 sm:mx-2 hidden sm:block ${
                step > index + 1 ? "bg-teal-600" : "bg-gray-200"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full">
      <div className="hidden sm:flex sm:justify-end mb-4">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/admin/dashboard" },
            { label: "Assign Employee", link: "/admin/assign-employee" },
          ]}
        />
        <PageMeta title="Assign Employee" description="Assign a new employee" />
      </div>
      <div className="min-h-screen bg-white rounded-2xl p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6 relative z-10">
          <h2 className="text-xl pt-3 sm:pt-0 sm:text-3xl font-bold text-center text-teal-600 mb-8 sm:mb-10 uppercase tracking-tight">
            Assign New Employee
          </h2>
          {renderStepIndicator()}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}
          {errors.submit && <p className="text-red-600 text-center mb-4">{errors.submit}</p>}
          {step === 1 && (
            <div className="pb-2">
              <label className="block text-sm sm:text-md font-semibold text-gray-900 mb-4">
                Select Role Type <span className="text-red-600 font-bold">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {filteredRoleTypes.map((role) => (
                  <button
                    key={role.name}
                    type="button"
                    onClick={() => handleInput("roleType", role.name)}
                    className={`p-4 sm:p-6 rounded-xl border-2 bg-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-between text-center z-50 min-h-[150px] sm:min-h-[180px] ${
                      employee.roleType === role.name
                        ? "border-teal-600 bg-teal-50 text-teal-700 scale-105"
                        : "border-gray-200 text-gray-700 hover:border-teal-400 hover:bg-teal-50"
                    } ${errors.roleType ? "border-red-500 animate-pulse" : ""}`}
                  >
                    <div className="mb-2 text-teal-600 flex items-center justify-center h-8 sm:h-10">
                      <span className="text-2xl sm:text-3xl">{role.icon}</span>
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold">{role.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{role.description}</p>
                  </button>
                ))}
              </div>
              {errors.roleType && (
                <p className="mt-3 text-sm text-red-600 text-center font-medium">{errors.roleType}</p>
              )}
              {employee.roleType && (
                <div className="w-full flex justify-end mt-6">
                  <button
                    type="button"
                    className="text-base sm:text-lg px-5 py-2 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 font-medium z-50"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
          {step > 1 && (
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative z-10">
              {step === 2 && (
                <div className="space-y-4 sm:space-y-6">
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
                    { label: "Address", field: "address", type: "textarea", tooltip: "Optional address" },
                    {
                      label: "Date of Birth",
                      field: "dateOfBirth",
                      type: "date",
                      required: true,
                      tooltip: "Employee must be at least 18 years old",
                    },
                    { label: "Gender", field: "gender", type: "select", required: true, options: genders },
                    {
                      label: "Password",
                      field: "password",
                      type: showPassword ? "text" : "password",
                      required: true,
                      tooltip: "Minimum 8 characters",
                      isPassword: true,
                    },
                    { label: "Blood Group", field: "bloodGroup", type: "select", required: true, options: bloodGroups },
                    {
                      label: "Photo",
                      field: "photo",
                      type: "file",
                      required: true,
                      accept: "image/jpeg,image/jpg,image/png",
                    },
                    {
                      label: "Employee ID Suffix",
                      field: "customEmployeeIdSuffix",
                      type: "text",
                      required: true,
                      tooltip: "Enter numeric suffix for Employee ID (e.g., '001' for MO-EMP-001)",
                    },
                  ].map(({ label, field, type, required, tooltip, options, accept, isPassword }) => (
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
                      ) : type === "select" ? (
                        <select
                          value={employee[field]}
                          onChange={(e) => handleInput(field, e.target.value)}
                          className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 z-10 ${
                            errors[field] ? "border-red-500 animate-pulse" : ""
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
                        <div>
                          {photoPreview && (
                            <div className="mt-4">
                              <img
                                src={photoPreview}
                                alt="Photo preview"
                                className="w-25 h-25 object-cover rounded-md border-2 border-gray-200"
                              />
                            </div>
                          )}
                          <input
                            type="file"
                            accept={accept}
                            onChange={handleFileChange}
                            className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 z-10 ${
                              errors[field] ? "border-red-500 animate-pulse" : ""
                            }`}
                            aria-label={label}
                            required={required}
                          />
                        </div>
                      ) : field === "customEmployeeIdSuffix" ? (
                        <div className="relative flex items-center">
                          <span className="absolute left-0 px-4 py-3 text-gray-500 font-medium bg-gray-100 rounded-l-md border-0 border-b-2 border-gray-200">
                            MO-EMP-
                          </span>
                          <input
                            type="text"
                            value={employee[field]}
                            onChange={(e) => handleInput(field, e.target.value)}
                            required={required}
                            placeholder="e.g., 001"
                            pattern="[0-9]{1,10}" // Enforce numeric input in the browser
                            className={`w-full pl-20 pr-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
                              errors[field] ? "border-red-500 animate-pulse" : ""
                            }`}
                            aria-label={label}
                          />
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type={type}
                            value={employee[field]}
                            onChange={(e) => handleInput(field, e.target.value)}
                            required={required}
                            max={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
                            className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
                              errors[field] ? "border-red-500 animate-pulse" : ""
                            }`}
                            aria-label={label}
                          />
                          {isPassword && (
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-teal-600"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          )}
                        </div>
                      )}
                      {field === "customEmployeeIdSuffix" && (
                        <p className="mt-1 text-sm text-gray-500">
                          Full Employee ID: MO-EMP-{employee.customEmployeeIdSuffix || "<suffix>"}
                        </p>
                      )}
                      {errors[field] && (
                        <p className="mt-1 text-sm text-red-600 font-medium">{errors[field]}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4 sm:space-y-6">
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
                  {["HR", "Department Head", "Employee", "Manager"].includes(employee.roleType) && (
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
                        {getFilteredDepartments().map((dept) => (
                          <option key={dept.id} value={dept.department_name}>
                            {dept.department_name}
                          </option>
                        ))}
                      </select>
                      {errors.department && (
                        <p className="mt-1 text-sm text-red-600 font-medium">{errors.department}</p>
                      )}
                    </div>
                  )}
                  {["HR", "Department Head", "Employee", "Manager"].includes(employee.roleType) &&
                    employee.department && (
                      <div className="relative group z-10">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {employee.roleType === "Employee" ? "Position" : "Designation"}{" "}
                          <span className="text-red-600 font-bold">*</span>
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
                          <option value="">
                            Select {employee.roleType === "Employee" ? "Position" : "Designation"}
                          </option>
                          {getFilteredDesignations().map((des) => (
                            <option key={des.designation_name} value={des.designation_name}>
                              {des.designation_name}
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
              {step === 4 && (
                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Structure</h3>
                  {[
                    {
                      label: "Basic Salary (₹)",
                      field: "basicSalary",
                      type: "number",
                      required: true,
                      tooltip: "Enter the basic salary amount",
                    },
                    {
                      label: "HRA Percentage (%)",
                      field: "hraPercentage",
                      type: "number",
                      required: true,
                      tooltip: "Percentage of basic salary (e.g., 40 for 40%)",
                    },
                    {
                      label: "HRA Amount (₹)",
                      field: "hraAmount",
                      type: "number",
                      readOnly: true,
                      tooltip: "Auto-calculated based on HRA percentage",
                    },
                    {
                      label: "Special Allowances (₹)",
                      field: "specialAllowances",
                      type: "number",
                      required: true,
                      tooltip: "Additional monthly allowance",
                    },
                    {
                      label: "PF Percentage (%)",
                      field: "pfPercentage",
                      type: "number",
                      required: true,
                      tooltip: "Percentage of basic salary (default: 12%)",
                    },
                    {
                      label: "PF Amount (₹)",
                      field: "pfAmount",
                      type: "number",
                      readOnly: true,
                      tooltip: "Auto-calculated based on PF percentage",
                    },
                    {
                      label: "ESI Percentage (%)",
                      field: "esiPercentage",
                      type: "number",
                      tooltip: "Percentage of gross salary (default: 0.75%)",
                    },
                    {
                      label: "ESI Amount (₹)",
                      field: "esiAmount",
                      type: "number",
                      readOnly: true,
                      tooltip: "Auto-calculated based on ESI percentage",
                    },
                    {
                      label: "Bonus (₹)",
                      field: "bonus",
                      type: "number",
                      required: false,
                      tooltip: "Optional monthly bonus amount",
                    },
                  ].map(({ label, field, type, required, tooltip, readOnly }) => (
                    <div key={field} className="relative group z-10">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {label} {required && <span className="text-red-600 font-bold">*</span>}
                        {tooltip && (
                          <span className="ml-1 text-gray-400 cursor-help" title={tooltip}>
                            ⓘ
                          </span>
                        )}
                      </label>
                      <input
                        type={type}
                        value={employee[field]}
                        onChange={(e) => handleInput(field, e.target.value)}
                        readOnly={readOnly}
                        className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 z-10 ${
                          errors[field] ? "border-red-500 animate-pulse" : ""
                        } ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        aria-label={label}
                        required={required}
                        min="0"
                        step="0.01"
                      />
                      {errors[field] && (
                        <p className="mt-1 text-sm text-red-600 font-medium">{errors[field]}</p>
                      )}
                    </div>
                  ))}
                  <div className="mb-6 p-4 bg-teal-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-teal-700 mb-2">Real-Time Salary Breakdown</h3>
                    <p>Gross Salary: ₹{realTimeCalculations.grossSalary}</p>
                    <p>Total Deductions (PF + ESI): ₹{realTimeCalculations.totalDeductions}</p>
                    <p>Net Salary: ₹{realTimeCalculations.netSalary}</p>
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 relative z-50">
                {step > 1 && (
                  <button
                    type="button"
                    className="w-full sm:w-auto text-base sm:text-lg px-5 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 hover:scale-105 transition-all duration-200 font-medium z-50"
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                )}
                {step < 4 ? (
                  <button
                    type="button"
                    className="w-full sm:w-auto text-base sm:text-lg px-5 py-2 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 font-medium sm:ml-auto z-50"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className={`w-full sm:w-auto text-base sm:text-lg px-5 py-2 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 font-medium flex items-center justify-center sm:ml-auto z-50 ${
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
                          viewBox="0 24"
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