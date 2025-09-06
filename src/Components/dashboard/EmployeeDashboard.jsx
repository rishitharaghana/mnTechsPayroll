import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Users, Clock, FileText, Calendar, DollarSign, PiggyBank } from 'lucide-react';
import DatePicker from '../../Components/ui/date/DatePicker';
import { fetchLeaveBalances, fetchLeaveRequests, fetchAttendance, clearError } from '../../redux/slices/dashboardSlice';
import { getCurrentUserProfile } from '../../redux/slices/employeeSlice';
import { toast } from 'react-toastify';

const iconMap = {
  Calendar: Calendar,
  FileText: FileText,
  Users: Users,
};

// Static quick actions
const quickActions = [
  { label: 'Submit Leave Request', icon: FileText, color: 'bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600', focusRing: 'focus:ring-teal-600', to: '/employee/leave-application' },
  { label: 'View Payslip', icon: DollarSign, color: 'bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600', focusRing: 'focus:ring-teal-600', to: '/payslip' },
  { label: 'Track Attendance', icon: Clock, color: 'bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600', focusRing: 'focus:ring-teal-600', to: '/attendance' },
  { label: 'View PF', icon: PiggyBank, color: 'bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600', focusRing: 'focus:ring-teal-600', to: '/pf' },
];

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { user, role, isAuthenticated } = useSelector((state) => state.auth);
  const { employeeId, loading: employeeLoading, error: employeeError } = useSelector((state) => state.employee);
  const { leaveBalances, leaveRequests, attendance, attendanceStatus, loading, error } = useSelector((state) => state.dashboard);
  const [leaveRequestDateRange, setLeaveRequestDateRange] = useState({ from: '', to: '' });

  // Fetch employee profile
  useEffect(() => {
    if (isAuthenticated && role?.toLowerCase() === 'employee' && !employeeId) {
      dispatch(getCurrentUserProfile());
    }
  }, [dispatch, isAuthenticated, role, employeeId]);

  // Fetch dashboard data
  useEffect(() => {
    if (isAuthenticated && role?.toLowerCase() === 'employee' && employeeId) {
      dispatch(fetchLeaveBalances({ employeeId }));
      dispatch(fetchLeaveRequests({ employeeId, fromDate: leaveRequestDateRange.from, toDate: leaveRequestDateRange.to }));
      dispatch(fetchAttendance({ employeeId }));
      dispatch(clearError());
    }
  }, [dispatch, isAuthenticated, role, employeeId, leaveRequestDateRange]);

  const handleLeaveRequestDateRangeChange = useCallback(({ fromDate, toDate }) => {
    setLeaveRequestDateRange({ from: fromDate, to: toDate });
  }, []);

  // Error handling
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <p className="text-red-600 font-semibold">Access restricted: Not authenticated. Please log in.</p>
        </div>
      </div>
    );
  }
  if (role?.toLowerCase() !== 'employee') {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <p className="text-red-600 font-semibold">Access restricted: User role is '{role || 'undefined'}', not 'employee'.</p>
        </div>
      </div>
    );
  }
  if (!employeeId) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">
          <p className="text-red-600 font-semibold">
            Access restricted: Employee ID is missing. {employeeLoading ? 'Loading profile...' : employeeError || 'Please try again.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="p-4 rounded-lg mb-6 bg-red-50 text-red-700">{error}</div>
        )}
        {loading && (
          <div className="flex justify-center items-center mb-6">
            <svg className="animate-spin h-5 w-5 text-teal-600" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
            <span className="ml-2 text-gray-600">Loading dashboard...</span>
          </div>
        )}
        <div className="bg-gradient-to-r from-slate-700 to-teal-600 rounded-2xl border border-teal-700/50 p-6 sm:p-8 mb-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Hello, {user?.name || 'Employee'}!
              </h1>
              <p className="text-gray-200 text-lg mt-1">Manage your leave, attendance, and more with ease.</p>
            </div>
          </div>
        </div>

        {leaveBalances.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {leaveBalances.map((leave, index) => {
              const Icon = iconMap[leave.icon];
              return (
                <div
                  key={index}
                  className={`${leave.bgColor} rounded-2xl border border-teal-200/50 p-6 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group relative`}
                  role="region"
                  aria-label={`${leave.type} leave balance`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${leave.color} rounded-lg flex items-center justify-center shadow-md`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <span className={`text-sm font-semibold ${leave.textColor}`}>
                      {leave.remaining}/{leave.total}
                    </span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium mb-1">{leave.type.charAt(0).toUpperCase() + leave.type.slice(1)} Leave</h3>
                  <p className="text-2xl font-bold text-gray-900">{leave.remaining} days</p>
                  <div className="absolute invisible group-hover:visible bg-gradient-to-r from-teal-600 to-slate-700 text-white text-xs rounded-lg py-1 px-3 bottom-full mb-2 shadow-sm">
                    Remaining {leave.type.toLowerCase()} leave days
                    <svg className="absolute text-teal-600 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                      <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No leave balance available.</p>
        )}

        {leaveRequests.filter((req) => req.status === 'Pending').length > 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 mt-8 shadow-sm hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Leave Requests</h2>
            <div className="space-y-4">
              {leaveRequests
                .filter((req) => req.status === 'Pending')
                .map((request, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
                    role="listitem"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                      <FileText className="text-white" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold">{request.type.charAt(0).toUpperCase() + request.type.slice(1)} Leave ({request.id})</p>
                      <p className="text-gray-600 text-sm">
                        {request.from} to {request.to} ({request.days} days)
                      </p>
                      <p className="text-gray-500 text-xs">Status: {request.status} | {request.details}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No pending leave requests.</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {leaveRequests.length > 0 ? (
            <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-900">Recent Leave Requests</h2>
                <div className="w-full sm:w-64 mt-4 sm:mt-0">
                  <DatePicker
                    type="date"
                    fromDate={leaveRequestDateRange.from}
                    toDate={leaveRequestDateRange.to}
                    onFromDateChange={(date) => handleLeaveRequestDateRangeChange({ fromDate: date, toDate: leaveRequestDateRange.to })}
                    onToDateChange={(date) => handleLeaveRequestDateRangeChange({ fromDate: leaveRequestDateRange.from, toDate: date })}
                    labelFrom="From"
                    labelTo="To"
                    className="rounded-lg border-teal-200 bg-gray-100 text-gray-900 focus:ring-teal-600"
                  />
                </div>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-gray-100">
                {leaveRequests.map((request, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
                    role="listitem"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                      <FileText className="text-white" size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-semibold">{request.type.charAt(0).toUpperCase() + request.type.slice(1)} Leave ({request.id})</p>
                      <p className="text-gray-600 text-sm">
                        {request.from} to {request.to} ({request.days} days)
                      </p>
                      <p className="text-gray-500 text-xs">Status: {request.status} | {request.details}</p>
                    </div>
                    <NavLink
                      to={`/leave-application/${request.id}`}
                      className="text-teal-600 text-sm font-medium hover:text-teal-800 hover:underline transition-all duration-200"
                      aria-label={`View details for leave request ${request.id}`}
                    >
                      View
                    </NavLink>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No recent leave requests available.</p>
          )}

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <NavLink
                    key={index}
                    to={action.to}
                    className={`p-4 ${action.color} rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${action.focusRing} shadow-md`}
                    aria-label={action.label}
                  >
                    <Icon className="mx-auto mb-2" size={24} />
                    <span className="text-sm">{action.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>

        {attendance.length > 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 mt-6 shadow-sm hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Attendance Status</h2>
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Today's Status</p>
                  <p className="text-2xl font-bold text-gray-900">{attendanceStatus.today}</p>
                </div>
                <div className="text-right mt-4 sm:mt-0">
                  <p className="text-gray-600 text-sm">Last Updated</p>
                  <p className="text-gray-900 font-medium">{attendanceStatus.lastUpdated}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-gray-100">
              {attendance.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
                  role="listitem"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                    <Clock className="text-white" size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold">{record.date}</p>
                    <p className="text-gray-600 text-sm">Status: {record.status}</p>
                    <p className="text-gray-500 text-xs">
                      Time In: {record.timeIn} | Time Out: {record.timeOut}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No attendance records available.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;