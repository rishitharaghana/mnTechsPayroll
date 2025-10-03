import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  allocateMonthlyLeaves,
  allocateSpecialLeave,
  clearState,
} from "../../redux/slices/leaveSlice";
import { fetchEmployees } from "../../redux/slices/employeeSlice";
import { UserPlus, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignLeave = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { role, token, employee_id } = useSelector((state) => state.auth);
  const { employees, loading: employeeLoading, error: employeeError } = useSelector(
    (state) => state.employee
  );
  const { loading: leaveLoading, error: leaveError, successMessage } = useSelector(
    (state) => state.leaves
  );

  const [formData, setFormData] = useState({
    employee_id: "", // Empty for all employees, or specific employee_id
    leave_type: "paid",
    days: 1, // Default to 1 paid leave per month
    allocationMonth: new Date(), // Default to current month/year
  });

  useEffect(() => {
    // Authentication checks
    const userToken = localStorage.getItem("userToken");
    if (!token || !userToken) {
      console.log("No token found, redirecting to login", { token, userToken });
      navigate("/login");
      return;
    }

    let storedToken;
    try {
      const parsed = JSON.parse(userToken);
      storedToken = parsed.token || userToken;
    } catch (error) {
      storedToken = userToken;
    }

    if (storedToken !== token) {
      console.log("Token mismatch, redirecting to login", { storedToken, token });
      navigate("/login");
      return;
    }

    if (role !== "hr" && role !== "super_admin") {
      console.log(`Unauthorized role: ${role}, redirecting to /unauthorized`);
      navigate("/unauthorized");
      return;
    }

    // Fetch employees
    dispatch(fetchEmployees()).unwrap().catch((err) => {
      console.error("Failed to fetch employees:", err);
      if (err?.includes("No authentication token")) {
        navigate("/login");
      }
    });
  }, [dispatch, navigate, token, role]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, { autoClose: 3000 });
      dispatch(clearState());
    }
    if (leaveError) {
      toast.error(leaveError.error || "Failed to allocate leaves", { autoClose: 3000 });
      dispatch(clearState());
    }
    if (employeeError) {
      toast.error(
        typeof employeeError === "string" ? employeeError : employeeError.message || "Failed to fetch employees",
        { autoClose: 3000 }
      );
    }
  }, [successMessage, leaveError, employeeError, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMonthChange = (date) => {
    console.log("Selected month/year:", date); // Debug selected date
    setFormData((prev) => ({ ...prev, allocationMonth: date }));
  };

  const handleAssignLeaves = async (e) => {
    e.preventDefault();
    try {
      if (formData.employee_id === "" || formData.employee_id === "all") {
        const payload = {
          year: formData.allocationMonth.getFullYear(),
          month: formData.allocationMonth.getMonth() + 1,
        };
        console.log("Sending payload to allocateMonthlyLeaves:", payload); // Debug payload
        await dispatch(allocateMonthlyLeaves(payload)).unwrap();
        console.log("Monthly leave allocation triggered for all employees");
      } else {
        const daysNum = parseInt(formData.days, 10);
        if (isNaN(daysNum) || daysNum <= 0) {
          toast.error("Please enter a valid number of days", { autoClose: 3000 });
          return;
        }
        await dispatch(
          allocateSpecialLeave({
            employee_id: formData.employee_id,
            leave_type: formData.leave_type,
            days: daysNum,
          })
        ).unwrap();
        console.log("Special leave allocation successful:", formData);
      }
      setFormData({
        employee_id: "",
        leave_type: "paid",
        days: 1,
        allocationMonth: new Date(),
      });
    } catch (err) {
      console.error("Leave allocation error:", err);
      toast.error(err.error || "Failed to allocate leaves", { autoClose: 3000 });
    }
  };

  // Filter active employees
  const activeEmployees = employees.filter((emp) => emp.status === "active");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <PageMeta
          title="Assign Leave"
          description="Allocate monthly or special leaves to employees"
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Leave Tracker", link: "/admin/leave-tracker" },
            { label: "Assign Leave", link: "/admin/assign-leave" },
          ]}
        />

        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Assign Leave
          </h1>
          <p className="text-gray-600 mb-6">
            Allocate monthly paid leaves or special leaves for employees
          </p>

          <form onSubmit={handleAssignLeaves} className="space-y-6">
            <div>
              <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700">
                Select Employee
              </label>
              <select
                id="employee_id"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
                disabled={employeeLoading || leaveLoading}
              >
                <option value="all">All Employees</option>
                {activeEmployees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.full_name} ({emp.employee_id})
                  </option>
                ))}
              </select>
              {employeeLoading && (
                <p className="mt-1 text-sm text-gray-500">Loading employees...</p>
              )}
            </div>

            <div>
              <label htmlFor="allocationMonth" className="block text-sm font-medium text-gray-700">
                Allocation Month
              </label>
              <div className="mt-1 relative">
                <DatePicker
                  selected={formData.allocationMonth}
                  onChange={handleMonthChange}
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
                  placeholderText="Select month and year"
                  disabled={leaveLoading}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="leave_type" className="block text-sm font-medium text-gray-700">
                Leave Type
              </label>
              <select
                id="leave_type"
                name="leave_type"
                value={formData.leave_type}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
                disabled={formData.employee_id === "all" || !formData.employee_id || leaveLoading}
              >
                <option value="paid">Paid</option>
                <option value="maternity">Maternity</option>
                <option value="paternity">Paternity</option>
              </select>
            </div>

            <div>
              <label htmlFor="days" className="block text-sm font-medium text-gray-700">
                Number of Days
              </label>
              <input
                type="number"
                id="days"
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
                min="1"
                disabled={formData.employee_id === "all" || !formData.employee_id || leaveLoading}
                placeholder="e.g., 1"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={leaveLoading || employeeLoading}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              {formData.employee_id === "all" || !formData.employee_id
                ? "Assign Monthly Leaves for All"
                : "Assign Leave"}
            </button>
          </form>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default AssignLeave;