import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, Clock, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { markAttendance, fetchEmployeeAttendance, clearState } from "../../redux/slices/attendanceSlice";
import { fetchEmployees } from "../../redux/slices/employeeSlice";
import { fetchUserProfile } from "../../redux/slices/userSlice";

const EmployeeAttendance = () => {
  const dispatch = useDispatch();
  const { submissions, loading, error, successMessage } = useSelector((state) => state.attendance);
  const { employees, error: employeeError } = useSelector((state) => state.employee);
  const { profile, error: userError } = useSelector((state) => state.user);

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loginTime, setLoginTime] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [recipient, setRecipient] = useState("hr");

  const recipients = ["super_admin", "hr"];

  const userToken = localStorage.getItem("userToken");
  const user = userToken ? JSON.parse(userToken).user : null;
  const employee = user?.role === "employee" ? profile : employees.find((emp) => emp.employee_id === user?.employee_id);
  const employeeName = employee ? `${employee.name} (${employee.employee_id})` : "Unknown";

  useEffect(() => {
    if (user?.role === "employee") {
      dispatch(fetchEmployeeAttendance());
      if (!profile) {
        dispatch(fetchUserProfile());
      }
    } else if (["super_admin", "hr"].includes(user?.role)) {
      dispatch(fetchEmployeeAttendance());
      if (!employees.length) {
        dispatch(fetchEmployees());
      }
    }
    return () => {
      dispatch(clearState());
    };
  }, [dispatch, employees.length, profile, user]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearState());
    }
    if (employeeError) {
      toast.error(employeeError);
      dispatch(clearState());
    }
    if (userError) {
      toast.error(userError);
      dispatch(clearState());
    }
  }, [successMessage, error, employeeError, userError, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !loginTime || !recipient) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (logoutTime) {
      const login = new Date(`1970-01-01T${loginTime}:00`);
      const logout = new Date(`1970-01-01T${logoutTime}:00`);
      if (logout <= login) {
        toast.error("Logout time must be after login time.");
        return;
      }
    }
    dispatch(
      markAttendance({
        employee_id: user.employee_id,
        date,
        login_time: loginTime,
        logout_time: logoutTime || null,
        recipient,
      })
    );
    setLoginTime("");
    setLogoutTime("");
    setRecipient("hr");
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2 tracking-tight">
          Mark Attendance
        </h1>
        <p className="text-gray-600 text-center">Submit your daily attendance for review</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">Employee</label>
            <div className="flex items-center space-x-2">
              <FileText size={20} className="text-black" />
              <input
                type="text"
                value={employeeName}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 cursor-not-allowed"
                disabled
                aria-label="Employee"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">Date</label>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-black" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                required
                aria-label="Date"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">Login Time</label>
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-black" />
              <input
                type="time"
                value={loginTime}
                onChange={(e) => setLoginTime(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                required
                aria-label="Login Time"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">Logout Time</label>
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-black" />
              <input
                type="time"
                value={logoutTime}
                onChange={(e) => setLogoutTime(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                aria-label="Logout Time"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">Submit To</label>
            <div className="flex items-center space-x-2">
              <FileText size={20} className="text-black" />
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent text-gray-900 transition-all duration-300"
                required
                aria-label="Submit To"
              >
                {recipients.map((rec) => (
                  <option key={rec} value={rec}>
                    {rec === "super_admin" ? "Super Admin" : "HR"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800 hover:scale-105"
              }`}
              aria-label="Submit Attendance"
            >
              <FileText size={20} />
              <span>Submit Attendance</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Attendance Submissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/5 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-tight border-b border-gray-200">
                  Date
                </th>
                <th className="w-1/5 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-tight border-b border-gray-200">
                  Login Time
                </th>
                <th className="w-1/5 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-tight border-b border-gray-200">
                  Logout Time
                </th>
                <th className="w-1/5 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-tight border-b border-gray-200">
                  Submitted To
                </th>
                <th className="w-1/5 px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-tight border-b border-gray-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-sm text-gray-500 text-center">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                submissions.map(({ id, date, login_time, logout_time, recipient, status }) => (
                  <tr key={id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{login_time}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{logout_time || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {recipient === "super_admin" ? "Super Admin" : "HR"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAttendance;