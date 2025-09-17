import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, Clock, FileText, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import {
  markAttendance,
  fetchEmployeeAttendance,
  clearState,
} from "../../redux/slices/attendanceSlice";
import { fetchUserProfile } from "../../redux/slices/userSlice";
import { fetchRecipientOptions } from "../../redux/slices/leaveSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import Select from "react-select";

const EmployeeAttendance = () => {
  const dispatch = useDispatch();
  const { submissions, loading, error, successMessage } = useSelector(
    (state) => state.attendance
  );
  const { profile, error: userError } = useSelector((state) => state.user);
  const { recipients: recipientOptions, error: leaveError, loading: leaveLoading } = useSelector(
    (state) => state.leaves
  );

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loginTime, setLoginTime] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [recipient, setRecipient] = useState("");
  const [location, setLocation] = useState("Office");

  const locations = [
    { value: "Office", label: "Office" },
    { value: "Remote", label: "Remote" },
  ];

  const stored = localStorage.getItem("userToken");
  const parsed = stored ? JSON.parse(stored) : null;
  const userRole = parsed?.role || null;
  const employeeId = parsed?.id || null;

  const employee = profile;
  const employeeName = employee
    ? `${employee.full_name} (${employee.employee_id})`
    : "Unknown";

  const validRecipientOptions = recipientOptions.filter(
    (option) => option.value && option.value !== ""
  );

  const selectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      padding: "0.1rem",
      boxShadow: "none",
      "&:hover": { borderColor: "#000" },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#328E6E" : "#fff",
      color: state.isSelected ? "#fff" : "#111827",
      padding: "0.75rem 1rem",
      "&:hover": { backgroundColor: state.isSelected ? "#328E6E" : "#f3f4f6" },
    }),
    singleValue: (provided) => ({ ...provided, color: "#111827" }),
    input: (provided) => ({ ...provided, color: "#111827" }),
  };

  const locationSelectStyles = {
    ...selectStyles,
    control: (provided) => ({
      ...selectStyles.control(provided),
      borderColor: "#d1d5db",
    }),
    option: (provided, state) => ({
      ...selectStyles.option(provided, state),
      backgroundColor: state.isSelected ? "#1f2937" : "#fff",
    }),
  };

  useEffect(() => {
    if (["employee", "dept_head", "hr", "super_admin"].includes(userRole)) {
      dispatch(fetchRecipientOptions());
      dispatch(fetchEmployeeAttendance());
      if (!profile) {
        dispatch(fetchUserProfile());
      }
    }
    return () => {
      dispatch(clearState());
    };
  }, [dispatch, userRole, profile]);

  useEffect(() => {
    console.log("Debug State:", {
      recipientOptions,
      validRecipientOptions,
      recipient,
      submissions,
      loading,
      leaveLoading,
      leaveError,
      userRole,
      employee_id: employee?.employee_id,
    });
  }, [recipientOptions, validRecipientOptions, recipient, submissions, loading, leaveLoading, leaveError, userRole, employee]);

  useEffect(() => {
    if (validRecipientOptions.length > 0 && !recipient) {
      console.log("Setting default recipient:", validRecipientOptions[0].value);
      setRecipient(validRecipientOptions[0].value);
    }
    if (validRecipientOptions.length === 0 && !leaveLoading && leaveError) {
      toast.error(leaveError || "No valid recipients available");
    }
  }, [validRecipientOptions, recipient, leaveLoading, leaveError]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearState());
    }
    if (userError) {
      toast.error(userError);
      dispatch(clearState());
    }
    if (leaveError && validRecipientOptions.length === 0) {
      toast.error(leaveError || "Failed to load recipient options");
    }
  }, [successMessage, error, userError, leaveError, validRecipientOptions.length, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !loginTime || !recipient || !location || !employee?.employee_id) {
      toast.error("Please fill in all required fields, including a valid employee ID.");
      return;
    }

    const payload = {
      employee_id: employee?.employee_id,
      date,
      login_time: loginTime,
      logout_time: logoutTime || null,
      recipient_id: recipient, // Should be employee_id for HR or full_name for Super Admin
      location,
    };
    console.log("Submitting attendance with payload:", payload);

    dispatch(markAttendance(payload))
      .unwrap()
      .then(() => {
        toast.success("Attendance marked successfully!");
        setLoginTime("");
        setLogoutTime("");
        setLocation("Office");
        setRecipient(validRecipientOptions.length > 0 ? validRecipientOptions[0].value : "");
        dispatch(fetchEmployeeAttendance()); // Refresh attendance
      })
      .catch((err) => {
        toast.error(err.message || "Failed to mark attendance");
      });
  };

  return (
    <div className="w-full mt-4 md:mt-0">
      <div className="hidden sm:flex sm:justify-end sm:items-center">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/emp-dashboard" },
            { label: "Mark Attendance", link: "/employee/employee-attendance" },
          ]}
        />
        <PageMeta
          title="Mark Attendance"
          description="Submit your daily attendance for review"
        />
      </div>

      <div className="space-y-6 bg-white rounded-2xl shadow-md p-4 sm:p-6 min-h-screen">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 tracking-tight">
            Mark Attendance
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Submit your daily attendance for review
          </p>
        </div>

        {validRecipientOptions.length === 0 && !leaveLoading ? (
          <div className="text-red-600 text-sm mb-4">
            No valid recipients available. Please contact support to add a Super Admin or HR user.
          </div>
        ) : null}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-bold text-black tracking-tight">
                Employee
              </label>
              <div className="flex items-center space-x-2">
                <FileText size={16} className="text-black" />
                <input
                  type="text"
                  value={employeeName}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 cursor-not-allowed text-sm"
                  disabled
                  aria-label="Employee"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-bold text-black tracking-tight">
                Date
              </label>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-black" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 text-sm"
                  required
                  aria-label="Date"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-bold text-black tracking-tight">
                Login Time
              </label>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-black" />
                <input
                  type="time"
                  value={loginTime}
                  onChange={(e) => setLoginTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 text-sm"
                  required
                  aria-label="Login Time"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-bold text-black tracking-tight">
                Logout Time
              </label>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-black" />
                <input
                  type="time"
                  value={logoutTime}
                  onChange={(e) => setLogoutTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 text-sm"
                  aria-label="Logout Time"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-bold text-black tracking-tight">
                Location
              </label>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-black" />
                <Select
                  options={locations}
                  value={locations.find((loc) => loc.value === location)}
                  onChange={(option) => setLocation(option.value)}
                  styles={locationSelectStyles}
                  className="w-full"
                  required
                  aria-label="Location"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-bold text-black tracking-tight">
                Submit To
              </label>
              <div className="flex items-center space-x-2">
                <FileText size={16} className="text-black" />
                <Select
                  options={validRecipientOptions}
                  value={validRecipientOptions.find((rec) => rec.value === recipient) || null}
                  onChange={(option) => {
                    console.log("Selected recipient:", option ? option.value : "none");
                    setRecipient(option ? option.value : "");
                  }}
                  styles={selectStyles}
                  className="w-full"
                  required
                  aria-label="Submit To"
                  isLoading={leaveLoading && validRecipientOptions.length === 0}
                  isDisabled={validRecipientOptions.length === 0}
                  placeholder={
                    validRecipientOptions.length === 0
                      ? "No recipients available"
                      : "Select a recipient"
                  }
                />
              </div>
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                disabled={loading || leaveLoading || validRecipientOptions.length === 0 || !recipient}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  loading || leaveLoading || validRecipientOptions.length === 0 || !recipient
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800 hover:scale-105"
                }`}
                aria-label="Submit Attendance"
              >
                <FileText size={16} />
                <span>Submit</span>
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Attendance Submissions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Date",
                    "Login Time",
                    "Logout Time",
                    "Location",
                    "Submitted To",
                    "Status",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-2 sm:px-4 py-2 sm:py-3 text-left font-bold text-black uppercase tracking-tight border-b border-gray-200 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {!Array.isArray(submissions) || submissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-2 sm:px-4 py-3 text-gray-500 text-center"
                    >
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  submissions.map(
                    ({
                      id,
                      date,
                      login_time,
                      logout_time,
                      location,
                      recipient_id,
                      recipient_name,
                      status,
                    }) => (
                      <tr key={id} className="hover:bg-gray-50 transition">
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 whitespace-nowrap">
                          {new Date(date).toLocaleDateString()}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 whitespace-nowrap">
                          {login_time || "N/A"}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 whitespace-nowrap">
                          {logout_time || "N/A"}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 whitespace-nowrap">
                          {location}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 whitespace-nowrap">
                          {recipient_name && recipient_name !== "Unknown"
                            ? recipient_name
                            : recipient_id === "hr"
                            ? "Default HR User (HR)"
                            : recipient_id === "super_admin"
                            ? "Default Super Admin (Super Admin)"
                            : validRecipientOptions.find((rec) => rec.value === recipient_id)?.label || "Unknown"}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-900 whitespace-nowrap">
                          {status}
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;