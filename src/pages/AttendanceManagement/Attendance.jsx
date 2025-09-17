import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Clock, CheckCircle, XCircle, Users } from "lucide-react";
import DatePicker from "../../Components/ui/date/DatePicker";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import {
  fetchAllAttendance,
  updateAttendanceStatus,
  clearState,
} from "../../redux/slices/attendanceSlice";
import { format, parse, isValid, startOfWeek, endOfWeek } from "date-fns";

const Attendance = () => {
  const dispatch = useDispatch();
  const { submissions, loading, error, successMessage } = useSelector(
    (state) => state.attendance
  );

  // Initialize selectedDate in IST
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  console.log("Selected date (IST):", formattedDate);

  const userToken = localStorage.getItem("userToken");
  const user = userToken ? JSON.parse(userToken) : null;
  const userRole = user?.role;
  const userEmployeeId = user?.employee_id;

  useEffect(() => {
    if (["super_admin", "hr", "dept_head"].includes(userRole)) {
      dispatch(fetchAllAttendance());
    }
    return () => {
      dispatch(clearState());
    };
  }, [dispatch, userRole]);

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      dispatch(clearState());
    }
    if (error) {
      alert(error);
      dispatch(clearState());
    }
  }, [successMessage, error, dispatch]);

  const handleStatusUpdate = (id, status) => {
    console.log("Updating attendance status:", { id, status });
    dispatch(updateAttendanceStatus({ id, status }));
  };

  const getStatusColor = (status) =>
    ({
      Pending: "bg-blue-100 text-blue-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    }[status] || "bg-slate-100 text-slate-800");

  const getLocationColor = (location) =>
    ({
      Office: "bg-blue-100 text-blue-800",
      Remote: "bg-purple-100 text-purple-800",
    }[location] || "bg-slate-100 text-slate-800");

  const normalizeDate = (isoDate) => {
    try {
      if (!isoDate) return "";
      const date = parse(isoDate, "yyyy-MM-dd", new Date());
      if (!isValid(date)) {
        console.warn(`Invalid date format: ${isoDate}`);
        return "";
      }
      return format(date, "yyyy-MM-dd"); // No IST offset, database is IST
    } catch (err) {
      console.warn(`Error normalizing date ${isoDate}:`, err);
      return "";
    }
  };

  // Debug submissions and filtering
  console.log("Raw submissions:", submissions);
  const filteredSubmissions = submissions.filter((submission) => {
    const normalizedSubmissionDate = normalizeDate(submission.date);
    console.log(
      `Filtering submission: ID=${submission.id}, date=${submission.date}, normalized=${normalizedSubmissionDate}, formattedDate=${formattedDate}, recipient=${submission.recipient}, status=${submission.status}`
    );
    return (
      normalizedSubmissionDate === formattedDate &&
      normalizedSubmissionDate !== "" &&
      (userRole === "dept_head"
        ? submission.recipient === "hr" || submission.recipient === userEmployeeId
        : userRole === "super_admin"
        ? submission.recipient === "super_admin" ||
          submission.recipient === userEmployeeId ||
          submission.recipient === "hr" ||
          submission.recipient.includes("MO-EMP-") || // Debug: Allow employee IDs
          submission.recipient === "Office" // Debug: Allow invalid recipient
        : userRole === "hr"
        ? submission.recipient === "hr" ||
          submission.recipient === userEmployeeId ||
          submission.recipient.includes("MO-EMP-") || // Debug: Allow employee IDs
          submission.recipient === "Office" // Debug: Allow invalid recipient
        : submission.recipient === userRole || submission.recipient === userEmployeeId)
    );
  });
  console.log("Filtered submissions:", filteredSubmissions);

  // Calculate week boundaries for selectedDate (Monday to Sunday)
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekStartFormatted = format(weekStart, "yyyy-MM-dd");
  const weekEndFormatted = format(weekEnd, "yyyy-MM-dd");
  console.log(`Week range (IST): ${weekStartFormatted} to ${weekEndFormatted}`);
  console.log("User info:", { userRole, userEmployeeId });

  const stats = [
    {
      title: "Present Today",
      value: filteredSubmissions.filter((s) => s.status === "Approved").length,
      total: filteredSubmissions.length,
      percentage: filteredSubmissions.length
        ? (
            (filteredSubmissions.filter((s) => s.status === "Approved").length /
              filteredSubmissions.length) *
            100
          ).toFixed(1) + "%"
        : "0%",
      color: "bg-gradient-to-r from-teal-600 to-slate-700",
      icon: CheckCircle,
    },
    {
      title: "Absent Today",
      value: filteredSubmissions.filter((s) => s.status === "Rejected").length,
      total: filteredSubmissions.length,
      percentage: filteredSubmissions.length
        ? (
            (filteredSubmissions.filter((s) => s.status === "Rejected").length /
              filteredSubmissions.length) *
            100
          ).toFixed(1) + "%"
        : "0%",
      color: "bg-gradient-to-r from-teal-600 to-slate-700",
      icon: XCircle,
    },
    {
      title: "Pending Approvals",
      value: filteredSubmissions.filter((s) => s.status === "Pending").length,
      total: filteredSubmissions.length,
      percentage: filteredSubmissions.length
        ? (
            (filteredSubmissions.filter((s) => s.status === "Pending").length /
              filteredSubmissions.length) *
            100
          ).toFixed(1) + "%"
        : "0%",
      color: "bg-gradient-to-r from-teal-600 to-slate-700",
      icon: Clock,
    },
    {
      title: "Remote Workers",
      value: filteredSubmissions.filter((s) => s.location === "Remote").length,
      total: filteredSubmissions.length,
      percentage: filteredSubmissions.length
        ? (
            (filteredSubmissions.filter((s) => s.location === "Remote").length /
              filteredSubmissions.length) *
            100
          ).toFixed(1) + "%"
        : "0%",
      color: "bg-gradient-to-r from-teal-600 to-slate-700",
      icon: Users,
    },
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklyStats = weekDays.map((day, index) => {
    const expectedDay = index === 6 ? 0 : index + 1;
    const daySubmissions = submissions.filter((s) => {
      if (!s.date) {
        console.warn(`Missing date in submission ID=${s.id}`);
        return false;
      }
      const parsedDate = parse(s.date, "yyyy-MM-dd", new Date());
      if (!isValid(parsedDate)) {
        console.warn(`Invalid date in submission ID=${s.id}: ${s.date}`);
        return false;
      }
      const dateFormatted = format(parsedDate, "yyyy-MM-dd");
      const isValidDay = parsedDate.getDay() === expectedDay;
      const isValidDateRange =
        dateFormatted >= weekStartFormatted && dateFormatted <= weekEndFormatted;
      const isValidRecipient = userRole === "dept_head"
        ? s.recipient === "hr" || s.recipient === userEmployeeId
        : userRole === "super_admin"
        ? s.recipient === "super_admin" ||
          s.recipient === userEmployeeId ||
          s.recipient === "hr" ||
          s.recipient.includes("MO-EMP-") || // Debug: Allow employee IDs
          s.recipient === "Office" // Debug: Allow invalid recipient
        : userRole === "hr"
        ? s.recipient === "hr" ||
          s.recipient === userEmployeeId ||
          s.recipient.includes("MO-EMP-") || // Debug: Allow employee IDs
          s.recipient === "Office" // Debug: Allow invalid recipient
        : s.recipient === userRole || s.recipient === userEmployeeId;
      console.log(`Checking submission ID=${s.id} for ${day}:`, {
        date: s.date,
        parsedDate: parsedDate.toISOString(),
        dateFormatted,
        isValidDay,
        isValidDateRange,
        isValidRecipient,
        expectedDay,
        actualDay: parsedDate.getDay(),
      });
      return isValidDay && isValidDateRange && isValidRecipient;
    });
    const presentCount = daySubmissions.filter((s) => s.status === "Approved").length;
    const totalCount = daySubmissions.length;
    const percentage = totalCount ? Number(((presentCount / totalCount) * 100).toFixed(1)) : 0;
    console.log(`Day ${day}:`, { presentCount, totalCount, percentage, daySubmissions });
    return { day, presentCount, totalCount, percentage };
  });
  console.log("Weekly stats:", weeklyStats);

  return (
    <div className="w-full">
      <div className="hidden sm:flex sm:justify-end">
        <PageMeta
          title="Attendance Management"
          description="Track and manage employee attendance efficiently."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Attendance", link: "/admin/attendance" },
          ]}
        />
      </div>
      <div className="space-y-6 bg-white rounded-2xl min-h-screen p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-[50%] md:w-[65%]">
              <h1 className="text-3xl font-bold text-white">
                Attendance Tracking
              </h1>
              <p className="text-slate-200 text-lg mt-1">
                Monitor employee attendance and working hours
              </p>
            </div>
            <div className="w-full sm:w-[50%] md:w-[35%] flex items-center space-x-4">
              <DatePicker
                name="attendanceDate"
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                className="w-full max-w-xs"
                aria-label="Select Attendance Date"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(
            ({ title, value, total, percentage, color, icon: Icon }, index) => (
              <div
                key={index}
                className="bg-white/90 rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="text-white" size={24} />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">
                    {percentage}
                  </span>
                </div>
                <h3 className="text-slate-600 text-sm font-medium mb-1">
                  {title}
                </h3>
                <p className="text-xl font-bold text-slate-900">
                  {value}{" "}
                  <span className="text-sm text-slate-500">/ {total}</span>
                </p>
              </div>
            )
          )}
        </div>

        {/* Table */}
        <div className="bg-white/90 rounded-lg border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-slate-900">
              Attendance Records
            </h2>
            <div className="flex items-center flex-wrap gap-2 space-x-4">
              <span className="text-md border border-slate-200 rounded-lg p-2 px-3 shadow-md text-slate-600">
                Date: {format(selectedDate, "dd/MM/yyyy")}
              </span>
              <button className="px-4 py-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105">
                Export Report
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table
              className="w-full table-fixed text-sm min-w-[800px]"
              aria-label="Employee Attendance Table"
            >
              <thead className="bg-gradient-to-r from-teal-600 to-slate-700">
                <tr>
                  <th className="w-[15%] px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-white uppercase">
                    Employee
                  </th>
                  <th className="w-[15%] px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-white uppercase">
                    Date
                  </th>
                  <th className="w-[15%] px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-white uppercase">
                    Check In
                  </th>
                  <th className="w-[15%] px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-white uppercase">
                    Check Out
                  </th>
                  <th className="w-[15%] px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-white uppercase">
                    Location
                  </th>
                  <th className="w-[15%] px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-white uppercase">
                    Status
                  </th>
                  {["super_admin", "hr"].includes(userRole) && (
                    <th className="w-[20%] px-2 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-white uppercase">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={["super_admin", "hr"].includes(userRole) ? 7 : 6}
                      className="px-2 py-3 sm:px-4 text-sm text-slate-500 text-center whitespace-nowrap"
                    >
                      No attendance records found for{" "}
                      {format(selectedDate, "dd/MM/yyyy")}. Try selecting a different date.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map(
                    ({
                      id,
                      employee_name,
                      date,
                      login_time,
                      logout_time,
                      location,
                      status,
                    }) => (
                      <tr
                        key={id}
                        className="hover:bg-slate-100/80 transition-colors duration-200"
                      >
                        <td className="px-2 py-3 sm:px-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">
                            {employee_name}
                          </div>
                        </td>
                        <td className="px-2 py-3 sm:px-4 whitespace-nowrap">
                          <span className="text-sm text-slate-900">
                            {format(parse(date, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")}
                          </span>
                        </td>
                        <td className="px-2 py-3 sm:px-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <Clock size={12} className="text-slate-400 sm:w-4 sm:h-4" />
                            <span className="text-sm text-slate-900">{login_time}</span>
                          </div>
                        </td>
                        <td className="px-2 py-3 sm:px-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <Clock size={12} className="text-slate-400 sm:w-4 sm:h-4" />
                            <span className="text-sm text-slate-900">
                              {logout_time || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-3 sm:px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLocationColor(
                              location
                            )}`}
                          >
                            {location}
                          </span>
                        </td>
                        <td className="px-2 py-3 sm:px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              status
                            )}`}
                          >
                            {status}
                          </span>
                        </td>
                        {["super_admin", "hr"].includes(userRole) && (
                          <td className="px-2 py-3 sm:px-4 whitespace-nowrap">
                            {status === "Pending" && (
                              <div className="flex space-x-1 sm:space-x-2">
                                <button
                                  onClick={() => handleStatusUpdate(id, "Approved")}
                                  className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-transform duration-300"
                                  disabled={loading}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(id, "Rejected")}
                                  className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition-transform duration-300"
                                  disabled={loading}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly Attendance Overview */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Weekly Attendance Overview ({format(weekStart, "dd/MM")} -{" "}
            {format(weekEnd, "dd/MM/yyyy")})
          </h2>
          {weeklyStats.every((stat) => stat.totalCount === 0) ? (
            <div className="text-slate-500 text-center">
              No attendance records for the selected week. Try selecting a different week.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              {weeklyStats.map(({ day, presentCount, totalCount, percentage }) => (
                <div
                  key={day}
                  className="bg-white/90 p-4 rounded-lg text-center hover:shadow-md hover:scale-105 transition-all duration-300"
                >
                  <div className="text-sm font-medium text-slate-700 mb-2">
                    {day}
                  </div>
                  <div className="relative w-16 h-16 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#14b8a6"
                        strokeWidth="3"
                        strokeDasharray={`${percentage}, 100`}
                      />
                      <text
                        x="18"
                        y="20"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs  text-slate-800"
                      >
                        {percentage}%
                      </text>
                    </svg>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    {presentCount}/{totalCount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;