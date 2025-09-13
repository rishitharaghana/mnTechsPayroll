// src/components/ForgotPassword.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, checkMobileAndRoleExists } from "../../redux/slices/authSlice";
import { Eye, EyeOff, Lock, Phone, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Select from "react-select";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    newPassword: "",
    confirmPassword: "",
    uiRole: "Admin",
  });
  const [errors, setErrors] = useState({
    mobileNumber: "",
    newPassword: "",
    confirmPassword: "",
    general: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, mobileExists } = useSelector((state) => state.auth);

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "HR", label: "HR" },
    { value: "Department Head", label: "Department Head" },
    { value: "Manager", label: "Manager" },
    { value: "employee", label: "Employee" },
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.7)",
      borderColor: "rgba(148, 163, 184, 0.5)",
      borderRadius: "1rem",
      padding: "0.2rem 0.75rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "rgba(148, 163, 184, 0.5)",
      },
      "&:focus-within": {
        borderColor: "#0d9488",
        boxShadow: "0 0 0 2px rgba(13, 148, 136, 0.5)",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1e293b",
      fontSize: "0.875rem",
      fontWeight: "500",
      fontFamily: "sans-serif",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "white",
      borderRadius: "1rem",
      marginTop: "0.25rem",
      border: "1px solid rgba(148, 163, 184, 0.5)",
      overflow: "hidden",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "rgba(13, 148, 136, 0.1)"
        : state.isFocused
        ? "rgba(13, 148, 136, 0.05)"
        : "white",
      color: "#1e293b",
      fontSize: "0.875rem",
      fontWeight: "500",
      fontFamily: "sans-serif",
      padding: "0.75rem 1rem",
      "&:hover": {
        backgroundColor: "rgba(13, 148, 136, 0.05)",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
      fontSize: "0.875rem",
      fontWeight: "600",
      fontFamily: "sans-serif",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#94a3b8",
      "&:hover": {
        color: "#64748b",
      },
    }),
  };

  // Handle errors from Redux
  useEffect(() => {
    if (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        general: error,
      }));
    }
  }, [error]);

  // Update mobile verification status
  useEffect(() => {
    setIsMobileVerified(mobileExists);
    if (!mobileExists) {
      setFormData((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }));
      setErrors({ mobileNumber: "", newPassword: "", confirmPassword: "", general: "" });
    }
  }, [mobileExists]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "mobileNumber" ? value.replace(/\D/g, "") : value,
    }));
    if (errors[name] || errors.general) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
        general: "",
      }));
    }
  };

  const handleRoleChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      uiRole: selectedOption.value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      general: "",
    }));
  };

  const isValidMobile = (mobile) => {
    return /^[6-9]\d{9}$/.test(mobile);
  };

  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password);
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      mobileNumber: "",
      newPassword: "",
      confirmPassword: "",
      general: "",
    };
    let hasError = false;

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
      hasError = true;
    } else if (!isValidMobile(formData.mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
      hasError = true;
    }

    if (!formData.uiRole) {
      newErrors.general = "Role is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const backendRole =
      formData.uiRole === "Admin"
        ? "super_admin"
        : formData.uiRole === "HR"
        ? "hr"
        : formData.uiRole === "Department Head"
        ? "dept_head"
        : formData.uiRole === "Manager"
        ? "manager"
        : "employee";

    await dispatch(checkMobileAndRoleExists({ mobile: formData.mobileNumber, role: backendRole }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      mobileNumber: "",
      newPassword: "",
      confirmPassword: "",
      general: "",
    };
    let hasError = false;

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      hasError = true;
    } else if (!isValidPassword(formData.newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";
      hasError = true;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required";
      hasError = true;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const backendRole =
      formData.uiRole === "Admin"
        ? "super_admin"
        : formData.uiRole === "HR"
        ? "hr"
        : formData.uiRole === "Department Head"
        ? "dept_head"
        : formData.uiRole === "Manager"
        ? "manager"
        : "employee";

    const result = await dispatch(
      forgotPassword({
        mobileNumber: formData.mobileNumber,
        newPassword: formData.newPassword,
        role: backendRole,
      })
    ).unwrap();

    if (result.success) {
      setFormData({ mobileNumber: "", newPassword: "", confirmPassword: "", uiRole: "Admin" });
      setIsMobileVerified(false);
      navigate("/login", { replace: true });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-teal-50 flex items-center justify-center px-4 z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-sm">
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-xl p-2 mb-4">
          <h2 className="text-2xl font-extrabold text-center text-white font-sans">
            Forgot Password
          </h2>
        </div>

        {errors.general && (
          <div className="mb-3 text-center text-sm text-red-600 bg-red-100/50 rounded-lg p-1.5">
            {errors.general}
          </div>
        )}

        <form
          onSubmit={isMobileVerified ? handlePasswordSubmit : handleMobileSubmit}
          className="space-y-4"
          aria-label="Forgot Password Form"
        >
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Role</label>
            <div className="flex items-center space-x-2">
              <UserCircle size={18} className="text-slate-400" />
              <Select
                options={roleOptions}
                value={roleOptions.find((option) => option.value === formData.uiRole)}
                onChange={handleRoleChange}
                styles={customSelectStyles}
                className="w-full"
                placeholder="Select Role"
                aria-label="Select Role"
                isDisabled={isMobileVerified}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-2">
              <Phone size={18} className="text-slate-400" />
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                placeholder="Enter Mobile Number"
                maxLength={10}
                disabled={isMobileVerified}
                className="w-full px-3 py-2 bg-white/70 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 font-sans"
                required
                aria-label="Mobile Number"
              />
            </div>
            {errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.mobileNumber}</p>
            )}
          </div>

          {isMobileVerified && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2 relative">
                  <Lock size={18} className="text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter New Password"
                    className="w-full px-3 py-2 bg-white/70 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 font-sans"
                    required
                    aria-label="New Password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters and include uppercase, lowercase, number, and special character
                </p>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2 relative">
                  <Lock size={18} className="text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm New Password"
                    className="w-full px-3 py-2 bg-white/70 border border-slate-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-slate-900 font-sans"
                    required
                    aria-label="Confirm Password"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </>
          )}

          <div className="flex justify-between items-center">
            <Link
              to="/login"
              className="text-sm text-teal-600 hover:text-teal-700 transition-colors duration-200"
            >
              Back to Login
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600 text-white py-2.5 rounded-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-200 hover:shadow-md disabled:opacity-50"
          >
            {loading
              ? isMobileVerified
                ? "Resetting Password..."
                : "Verifying Mobile..."
              : isMobileVerified
              ? "Reset Password"
              : "Verify Mobile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;