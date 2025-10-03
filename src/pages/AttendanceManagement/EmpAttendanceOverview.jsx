import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  fetchEmployeeAverageHours,
  clearState as clearAttendanceState,
} from "../../redux/slices/attendanceSlice";
import {
  getCurrentUserProfile,
  clearState,
} from "../../redux/slices/employeeSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const EmpAttendanceOverview = () => {
  const dispatch = useDispatch();
  const {
    averageHours,
    loading: attendanceLoading,
    error: attendanceError,
    successMessage: attendanceSuccess,
  } = useSelector((state) => state.attendance);
  const {
    profile,
    loading: userLoading,
    error: userError,
    successMessage: userSuccess,
  } = useSelector((state) => state.employee);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidSession, setIsValidSession] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    let stored, parsed;
    try {
      stored = localStorage.getItem("userToken");
      parsed = stored ? JSON.parse(stored) : null;
      if (!parsed || !stored) {
        console.error("No valid userToken found");
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
        setIsValidSession(false);
        return;
      }
      setUserRole(parsed?.role || null);
      console.log("Parsed userToken:", parsed);
    } catch (error) {
      console.error("Error parsing userToken:", error.message);
      toast.error("Invalid session data. Please log in again.");
      window.location.href = "/login";
      setIsValidSession(false);
    }
  }, []);

  // Fetch user profile
  useEffect(() => {
    if (!isValidSession || !userRole) return;

    if (["employee", "dept_head", "hr", "super_admin"].includes(userRole)) {
      if (!profile && !userLoading) {
        console.log("Fetching user profile");
        dispatch(getCurrentUserProfile());
      }
    } else {
      console.warn("Invalid userRole", { userRole });
      toast.error(
        "Invalid user credentials. Please log in with appropriate permissions."
      );
      setIsValidSession(false);
    }
  }, [dispatch, isValidSession, userRole, profile, userLoading]);

  // Fetch attendance data
  useEffect(() => {
    if (!isValidSession || !profile?.employee_id || attendanceLoading) return;

    console.log("Fetching data for employee_id:", profile.employee_id);
    dispatch(fetchEmployeeAverageHours({ employee_id: profile.employee_id }));
  }, [dispatch, isValidSession, profile]);

  // Handle loading state
  useEffect(() => {
    setIsLoading(userLoading || attendanceLoading || !userRole);
  }, [userLoading, attendanceLoading, userRole]);

  // Handle success and error messages
  useEffect(() => {
    if (attendanceSuccess || userSuccess) {
      console.log("Success message:", attendanceSuccess || userSuccess);
      toast.success(attendanceSuccess || userSuccess);
    }
    if (attendanceError || userError) {
      console.error("Error:", { attendanceError, userError });
      if (
        attendanceError === "Access denied: Insufficient permissions" ||
        userError === "Access denied: Insufficient permissions"
      ) {
        toast.error(
          "You do not have permission to view this data. Please contact HR."
        );
      } else if (
        attendanceError === "Unauthorized" ||
        userError === "Unauthorized"
      ) {
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      } else if (
        attendanceError === "User not found" ||
        userError === "User not found"
      ) {
        toast.error("User profile not found. Please contact HR.");
      } else {
        toast.error(
          attendanceError ||
            userError ||
            "An error occurred while fetching data."
        );
      }
    }
  }, [attendanceSuccess, attendanceError, userSuccess, userError]);

  const calculatePercentage = (hours) => {
    const maxHours = 8;
    return hours ? Math.min(((hours / maxHours) * 100).toFixed(1), 100) : 0;
  };

  const monthlyAverage = averageHours?.average_working_hours ?? 0;

  const employeeName = profile
    ? `${profile.full_name} (${profile.employee_id})`
    : "No profile data available. Please contact HR.";

  if (!isValidSession || isLoading) {
    return (
      <div className="w-11/12 max-w-7xl mx-auto flex justify-center items-center min-h-screen">
        <svg
          className="w-12 h-12 animate-spin text-teal-500"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full mt-4 sm:mt-0">
      <div className="hidden sm:flex sm:items-center sm:justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/emp-dashboard" },
            {
              label: "Attendance Overview",
              link: "/employee/attendance-overview",
            },
          ]}
        />
        <PageMeta
          title="Attendance Overview"
          description="View your daily and monthly working hours"
        />
      </div>
      <div className="sm:p-8 p-6 space-y-8 bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-xl rounded-3xl min-h-screen">
        <div>
          <h1 className="sm:text-3xl text-2xl font-extrabold text-center text-slate-900 mb-2 tracking-tight">
            Attendance Overview
          </h1>
          <p className="text-sm sm:text-md text-slate-500 text-center">
            Track your daily and monthly working hours
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Employee Details
          </h3>
          {userLoading ? (
            <div className="flex justify-center">
              <svg
                className="w-8 h-8 animate-spin text-teal-500"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"
                />
              </svg>
            </div>
          ) : profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-sm text-slate-600">
                <strong>Name:</strong> {employeeName}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Department:</strong> {profile.department_name || "N/A"}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Designation:</strong>{" "}
                {profile.designation_name || "N/A"}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Email:</strong> {profile.email || "N/A"}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Phone:</strong> {profile.mobile || "N/A"}
              </p>
            </div>
          ) : (
            <p className="text-slate-500 text-center">
              {userError || "No employee details available. Please contact HR."}
            </p>
          )}
        </div>

        <div className="relative bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-xl rounded-2xl shadow-md border border-slate-100/60 p-8 transition-all duration-500 hover:shadow-lg animate-shimmer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-effect"></div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-medium text-slate-700">
              Monthly Average
            </h2>
            <span className="text-[11px] text-slate-400">Last 30 days</span>
          </div>
          {attendanceLoading ? (
            <div className="flex justify-center py-10">
              <svg
                className="w-8 h-8 animate-spin text-teal-500"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"
                />
              </svg>
            </div>
          ) : averageHours && averageHours.average_working_hours != null ? (
            <div className="flex flex-col items-center space-y-6 animate-fade-in">
              <div className="relative group w-40 h-40">
                <svg
                  className="w-full h-full -rotate-90"
                  viewBox="0 0 36 36"
                  aria-label={`Monthly average working hours: ${monthlyAverage.toFixed(
                    1
                  )} hours, ${calculatePercentage(
                    monthlyAverage
                  )}% of 8-hour goal`}
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    strokeDasharray={`${calculatePercentage(
                      monthlyAverage
                    )}, 100`}
                    className="transition-all duration-1000 ease-out"
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(6, 182, 212, 0.3))",
                    }}
                  />
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#0f766e" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight">
                    {monthlyAverage.toFixed(1)}h
                  </span>
                  <span className="text-[11px] text-slate-500">of 8h</span>
                </div>
                <div className="absolute invisible group-hover:visible bg-gray-900/95 text-white text-sm rounded-xl py-3 px-5 -top-24 left-1/2 transform -translate-x-1/2 transition-all duration-300 shadow-xl scale-0 group-hover:scale-100 z-10 w-56">
                  <p className="font-semibold">
                    {monthlyAverage.toFixed(1)} / 8 hours
                  </p>
                  <p className="text-teal-300">
                    {calculatePercentage(monthlyAverage)}% of daily goal
                  </p>
                  <p className="text-teal-200">
                    Status:{" "}
                    {monthlyAverage >= 7.5
                      ? "Excellent"
                      : monthlyAverage >= 6
                      ? "Good"
                      : "Needs Improvement"}
                  </p>
                  <div className="mt-3 h-1.5 bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${calculatePercentage(monthlyAverage)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-1.5">
                <p className="text-sm text-slate-600">
                  Avg / Day:{" "}
                  <span className="font-semibold text-teal-600">
                    {monthlyAverage.toFixed(2)}h
                  </span>
                </p>
                <p className="text-sm text-slate-600">
                  Days Counted:{" "}
                  <span className="font-semibold text-teal-600">
                    {averageHours.days_counted ?? "N/A"}
                  </span>
                </p>
              </div>
              <button
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-teal-500/20 ${
                  monthlyAverage >= 7.5
                    ? "bg-gradient-to-r from-teal-400 to-teal-600 text-white"
                    : monthlyAverage >= 6
                    ? "bg-gradient-to-r from-amber-400 to-amber-600 text-white"
                    : "bg-gradient-to-r from-rose-400 to-rose-600 text-white"
                }`}
                aria-label={`Attendance status: ${
                  monthlyAverage >= 7.5
                    ? "Excellent"
                    : monthlyAverage >= 6
                    ? "Good"
                    : "Needs Improvement"
                }`}
                onClick={() =>
                  toast.info("Detailed attendance report coming soon!")
                }
              >
                {monthlyAverage >= 7.5
                  ? "Excellent"
                  : monthlyAverage >= 6
                  ? "Good"
                  : "Needs Improvement"}
              </button>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8 text-sm">
              {attendanceError ||
                "No valid attendance records found. Please contact HR."}
            </p>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Daily Working Hours
          </h3>
          {attendanceLoading ? (
            <div className="flex justify-center">
              <svg
                className="w-8 h-8 animate-spin text-teal-500"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"
                />
              </svg>
            </div>
          ) : averageHours &&
            averageHours.trend_data &&
            averageHours.trend_data.length > 0 ? (
            <div className="overflow-x-auto">
              <table
                className="w-full table-fixed border-collapse"
                aria-label="Daily working hours"
              >
                <thead className="bg-slate-50">
                  <tr>
                    <th className="w-1/3 px-4 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-tight border-b border-slate-200">
                      Date
                    </th>
                    <th className="w-1/3 px-4 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-tight border-b border-slate-200">
                      Hours Worked
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {averageHours.trend_data
                    .slice()
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map(({ date, hours }, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {new Date(date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-900">
                          {hours.toFixed(2)} hours
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-center">
              {attendanceError || "No daily attendance records found."}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            to="/emp-dashboard"
            className="px-5 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:scale-105 hover:shadow-md hover:shadow-teal-500/20 transition-all duration-300"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmpAttendanceOverview;