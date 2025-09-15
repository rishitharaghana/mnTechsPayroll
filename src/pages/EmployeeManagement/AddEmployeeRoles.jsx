import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createRole, fetchRoles, clearState } from "../../redux/slices/employeeSlice";
import { toast } from "react-toastify";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const AddEmployeeRoles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, successMessage, roles } = useSelector((state) => state.employee);
  const { user } = useSelector((state) => state.auth);

  const [roleData, setRoleData] = useState({
    role_id: "",
    name: "",
    description: "",
    isHRRole: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!["super_admin", "hr"].includes(user?.role)) {
      toast.error("Access denied: Only admins can create roles");
      navigate("/admin/dashboard");
    }
    dispatch(fetchRoles());
  }, [dispatch, user, navigate]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      setTimeout(() => {
        setRoleData({ role_id: "", name: "", description: "", isHRRole: false });
        setErrors({});
        dispatch(clearState());
        dispatch(fetchRoles()); 
        navigate("/admin/roles"); 
      }, 1500);
    }
    if (error) {
      toast.error(error);
      setErrors({ submit: error });
      dispatch(clearState());
    }
  }, [successMessage, error, dispatch, navigate]);

  const handleInput = (field, value) => {
    setRoleData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!roleData.role_id) {
      newErrors.role_id = "Role ID is required";
    } else if (!/^[a-z_]+$/.test(roleData.role_id)) {
      newErrors.role_id = "Role ID must be lowercase with underscores (e.g., new_role)";
    } else if (roles.some((role) => role.role_id === roleData.role_id)) {
      newErrors.role_id = "Role ID already exists";
    }
    if (!roleData.name) {
      newErrors.name = "Role Name is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    const payload = {
      role_id: roleData.role_id,
      name: roleData.name.trim(),
      description: roleData.description.trim() || undefined,
      isHRRole: roleData.isHRRole,
    };

    await dispatch(createRole(payload));
  };

  return (
    <div className="w-full">
      <div className="hidden sm:flex sm:justify-end mb-4">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/admin/dashboard" },
            { label: "Create Role", link: "/admin/create-role" },
          ]}
        />
        <PageMeta title="Create Role" description="Create a new role" />
      </div>
      <div className="min-h-screen bg-white rounded-2xl p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 sm:p-6">
          <h2 className="text-xl sm:text-3xl font-bold text-center text-teal-600 mb-8 sm:mb-10 uppercase tracking-tight">
            Create New Role
          </h2>
          {errors.submit && (
            <p className="text-red-600 text-center mb-4" id="form-error">
              {errors.submit}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="relative group">
              <label
                htmlFor="role-id-input"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Role ID <span className="text-red-600 font-bold">*</span>
                <span
                  className="ml-1 text-gray-400 cursor-help"
                  title="Unique identifier (lowercase, underscores, e.g., new_role)"
                >
                  ⓘ
                </span>
              </label>
              <input
                id="role-id-input"
                type="text"
                value={roleData.role_id}
                onChange={(e) => handleInput("role_id", e.target.value)}
                className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 ${
                  errors.role_id ? "border-red-500 animate-pulse" : ""
                }`}
                placeholder="e.g., new_role"
                aria-label="Role ID"
                aria-describedby={errors.role_id ? "role-id-error" : undefined}
                required
              />
              {errors.role_id && (
                <p id="role-id-error" className="mt-1 text-sm text-red-600 font-medium">
                  {errors.role_id}
                </p>
              )}
            </div>
            <div className="relative group">
              <label
                htmlFor="name-input"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Role Name <span className="text-red-600 font-bold">*</span>
              </label>
              <input
                id="name-input"
                type="text"
                value={roleData.name}
                onChange={(e) => handleInput("name", e.target.value)}
                className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 ${
                  errors.name ? "border-red-500 animate-pulse" : ""
                }`}
                placeholder="e.g., Project Manager"
                aria-label="Role Name"
                aria-describedby={errors.name ? "name-error" : undefined}
                required
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600 font-medium">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="relative group">
              <label
                htmlFor="description-input"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                Description
              </label>
              <textarea
                id="description-input"
                value={roleData.description}
                onChange={(e) => handleInput("description", e.target.value)}
                className="w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50"
                placeholder="Describe the role's responsibilities"
                aria-label="Role Description"
                rows="4"
              />
            </div>
            <div className="relative group">
              <label className="flex items-center text-sm font-medium text-gray-900 mb-2">
                <input
                  type="checkbox"
                  checked={roleData.isHRRole}
                  onChange={(e) => handleInput("isHRRole", e.target.checked)}
                  className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  aria-label="Is HR Role"
                />
                Is HR Role
                <span
                  className="ml-1 text-gray-400 cursor-help"
                  title="Check if this role has HR-level permissions"
                >
                  ⓘ
                </span>
              </label>
            </div>
            <div className="flex justify-end gap-4 pt-6">
              <button
                type="button"
                className="text-base sm:text-lg px-5 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 hover:scale-105 transition-all duration-200 font-medium"
                onClick={() => navigate("/admin/roles")}
                aria-label="Cancel role creation"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`text-base sm:text-lg px-5 py-2 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 hover:scale-105 transition-all duration-200 font-medium flex items-center justify-center ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={loading}
                aria-label="Create role"
              >
                {loading ? (
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
                    Creating...
                  </>
                ) : (
                  "Create Role"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeRoles;