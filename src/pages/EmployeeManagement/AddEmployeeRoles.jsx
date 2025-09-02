import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRole, fetchRoles, clearState } from "../../redux/slices/employeeSlice";
import { toast } from "react-toastify";
import { X, PlusCircle } from "lucide-react";

const AddEmployeeRoles = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading, error, successMessage } = useSelector((state) => state.employee);

  const [role, setRole] = useState({
    name: "",
    description: "",
    isHRRole: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(fetchRoles());
    return () => {
      dispatch(clearState());
    };
  }, [dispatch]);

  const handleInput = useCallback((field, value) => {
    setRole((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!role.name) newErrors.name = "Role name is required";
    if (!role.description) newErrors.description = "Description is required";
    if (user?.role === "hr" && role.isHRRole) {
      newErrors.isHRRole = "HR users cannot create HR-level roles";
    }
    return newErrors;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const formErrors = validateForm();
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        toast.error("Please fix the errors before submitting");
        return;
      }

      const roleData = {
        name: role.name,
        description: role.description,
        role_id: role.name.toLowerCase().replace(/\s+/g, "_"),
        isHRRole: role.isHRRole,
      };

      const resultAction = await dispatch(createRole(roleData));

      if (createRole.fulfilled.match(resultAction)) {
        toast.success("Role created successfully");
        setRole({ name: "", description: "", isHRRole: false });
        setErrors({});
        onClose();
      } else {
        toast.error(resultAction.payload || "Failed to create role");
        setErrors({ submit: resultAction.payload || "Failed to create role" });
      }
    },
    [dispatch, role, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 scale-100 hover:scale-105">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-teal-600 uppercase tracking-tight">
            Add New Role
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-600 text-center mb-4">{successMessage}</p>
        )}
        {errors.submit && (
          <p className="text-red-600 text-center mb-4">{errors.submit}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Role Name <span className="text-red-600 font-bold">*</span>
            </label>
            <input
              type="text"
              value={role.name}
              onChange={(e) => handleInput("name", e.target.value)}
              className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 ${
                errors.name ? "border-red-500 animate-pulse" : ""
              }`}
              placeholder="e.g., Senior Developer"
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 font-medium">{errors.name}</p>
            )}
          </div>

          <div className="relative group">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Description <span className="text-red-600 font-bold">*</span>
            </label>
            <textarea
              value={role.description}
              onChange={(e) => handleInput("description", e.target.value)}
              className={`w-full px-4 py-3 border-0 border-b-2 border-gray-200 focus:border-teal-600 focus:ring-0 transition-all duration-200 bg-transparent text-gray-900 placeholder-gray-400 hover:bg-gray-50/50 ${
                errors.description ? "border-red-500 animate-pulse" : ""
              }`}
              placeholder="Describe the role's responsibilities"
              rows="4"
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 font-medium">{errors.description}</p>
            )}
          </div>

          <div className="relative group">
            <label className="flex items-center text-sm font-medium text-gray-900">
              <input
                type="checkbox"
                checked={role.isHRRole}
                onChange={(e) => handleInput("isHRRole", e.target.checked)}
                className="mr-2 h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                disabled={user?.role === "hr"}
              />
              HR-Level Role
              <span
                className="ml-1 text-gray-400 cursor-help"
                title="HR-level roles have administrative privileges"
              >
                ⓘ
              </span>
            </label>
            {errors.isHRRole && (
              <p className="mt-1 text-sm text-red-600 font-medium">{errors.isHRRole}</p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-gradient-to-r hover:from-teal-600 hover:to-teal-700 transition-all duration-200 flex items-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 24 24"
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
                <>
                  <PlusCircle className="w-5 h-5 mr-2" />
                  Add Role
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeRoles;