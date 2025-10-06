import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { Users, Clock, FileText, PiggyBank, Calendar, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCurrentUserProfile } from '../../redux/slices/employeeSlice';
import { fetchEmployeeAttendance } from '../../redux/slices/attendanceSlice';
import { fetchLeaveBalances } from '../../redux/slices/leaveSlice';
import MiniCalendar from '../common/MiniCalendar';
import { format } from 'date-fns';

const iconMap = {
  FileText: FileText,
  Users: Users,
  Clock: Clock,
  PiggyBank: PiggyBank,
  Calendar: Calendar,
  User: User,
};

const quickActions = [
  { label: 'Leave Request', icon: 'FileText', color: 'bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600', focusRing: 'focus:ring-teal-600', to: '/employee/leave-application' },
  { label: 'Leave Dashboard', icon: 'Calendar', color: 'bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600', focusRing: 'focus:ring-teal-600', to: '/employee/leave-dashboard' },
  { label: 'Attendance', icon: 'Clock', color: 'bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600', focusRing: 'focus:ring-teal-600', to: '/employee/employee-attendance' },
  // { label: 'PF', icon: 'PiggyBank', color: 'bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600', focusRing: 'focus:ring-teal-600', to: '/pf' },
];

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role, isAuthenticated, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { employeeId, profile, loading: employeeLoading, error: employeeError } = useSelector((state) => state.employee);
  const { leaveBalances, loading: leaveLoading, error: leaveError } = useSelector((state) => state.leaves);
  const { submissions: attendance, loading: attendanceLoading, error: attendanceError } = useSelector((state) => state.attendance);
  const [dashboardData, setDashboardData] = useState({
    leaveBalances: [],
    attendance: [],
    attendanceStatus: { today: 'Not Recorded', lastUpdated: 'N/A' },
    profile: null,
    workSummary: null,
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('workSummary');

  useEffect(() => {

    if (!isAuthenticated && !authLoading) {
      navigate('/login');
    } else if (!profile?.full_name || !employeeId) {
      dispatch(getCurrentUserProfile());
    } else if (isAuthenticated && role?.toLowerCase() === 'employee' && employeeId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [leaveBalancesResult, attendanceResult] = await Promise.all([
            dispatch(fetchLeaveBalances()).unwrap(),
            dispatch(fetchEmployeeAttendance()).unwrap(),
          ]);

          const attendanceData = attendanceResult.data?.attendance || [];
          const presentDays = attendanceData.filter(a => a.status === "Present").length;
          const paidLeave = attendanceData.filter(a => a.status === "Paid Leave").length;
          const unpaidLeave = attendanceData.filter(a => a.status === "Unpaid Leave").length;
          const holidays = attendanceData.filter(a => a.status === "Holiday").length;

          const workSummaryFallback = {
            month: format(new Date(), 'yyyy-MM'), // Format as "YYYY-MM" for MiniCalendar
            total_working_days: attendanceData.length,
            present_days: presentDays,
            paid_leave_days: paidLeave,
            unpaid_leave_days: unpaidLeave,
            holidays: holidays,
            attendance: attendanceData, // Include actual attendance records
          };

          setDashboardData({
            leaveBalances: [
              { type: 'Casual Leave (CL)', backendType: 'casual', remaining: leaveBalancesResult.casual || 0, total: 7, bgColor: 'bg-white/90 backdrop-blur-sm', color: 'bg-gradient-to-r from-teal-600 to-slate-700', textColor: 'text-gray-600', icon: 'FileText' },
              { type: 'Sick Leave (SL)', backendType: 'sick', remaining: leaveBalancesResult.sick || 0, total: 12, bgColor: 'bg-white/90 backdrop-blur-sm', color: 'bg-gradient-to-r from-teal-600 to-slate-700', textColor: 'text-gray-600', icon: 'FileText' },
              { type: 'Earned Leave (EL)', backendType: 'vacation', remaining: leaveBalancesResult.vacation || 0, total: 15, bgColor: 'bg-white/90 backdrop-blur-sm', color: 'bg-gradient-to-r from-teal-600 to-slate-700', textColor: 'text-gray-600', icon: 'FileText' },
            ],
            attendance: attendanceData.map((record) => ({
              date: record.date,
              status: record.status,
              timeIn: record.login_time || 'N/A',
              timeOut: record.logout_time || 'N/A',
            })),
            attendanceStatus: attendanceResult.data?.attendanceStatus || { today: 'Not Recorded', lastUpdated: 'N/A' },
            profile: profile || null,
            workSummary: workSummaryFallback,
          });
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          toast.error(error.message || 'Failed to load dashboard data', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [dispatch, navigate, isAuthenticated, authLoading, user, role, employeeId, profile]);

  useEffect(() => {
    if (authError || employeeError || leaveError || attendanceError) {
      toast.error(authError || employeeError || leaveError || attendanceError, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, [authError, employeeError, leaveError, attendanceError]);

  if (authLoading || employeeLoading || loading || leaveLoading || attendanceLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="flex items-center space-x-2 text-gray-600">
          <svg className="animate-spin h-5 w-5 text-teal-600" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">Access restricted: Not authenticated. Please log in.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-teal-600 text-white p-2 rounded hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
            aria-label="Go to login page"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (role?.toLowerCase() !== 'employee') {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">Access restricted: User role is '{role || 'undefined'}', not 'employee'.</p>
        </div>
      </div>
    );
  }

  if (!employeeId || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">
            Access restricted: Employee profile is missing. {employeeError || 'Please try again.'}
          </p>
          <button
            onClick={() => dispatch(getCurrentUserProfile())}
            className="bg-teal-600 text-white p-2 rounded hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
            aria-label="Retry fetching profile"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section for Profile */}
        <div className="bg-gradient-to-r from-slate-700 to-teal-600 rounded-2xl border border-teal-700/50 p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white/90 rounded-full flex items-center justify-center shadow-md animate-pulse-subtle">
                <User className="text-teal-600" size={40} aria-hidden="true" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-teal-600 text-white text-xs font-semibold rounded-full px-2 py-1 shadow-md">
                {profile?.employee_id || 'N/A'}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Welcome, {profile?.full_name || 'Employee'}!
              </h1>
              <p className="text-gray-200 text-sm mt-1">
                {profile?.designation_name || 'Employee'} | {profile?.department_name || 'N/A'}
              </p>
              <NavLink
                to="/userprofile"
                className="text-white text-sm font-medium hover:underline mt-2 inline-block"
                aria-label="View full profile"
              >
                View Full Profile
              </NavLink>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/90 backdrop-blur-sm rounded-full border border-teal-200/50 p-2 shadow-sm">
            {quickActions.map((action, index) => {
              const Icon = iconMap[action.icon] || FileText;
              return (
                <NavLink
                  key={index}
                  to={action.to}
                  className={`p-3 ${action.color} rounded-full mx-1 text-white font-medium transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 ${action.focusRing} shadow-sm`}
                  aria-label={action.label}
                >
                  <Icon size={20} aria-hidden="true" />
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {dashboardData.leaveBalances.map((leave, index) => {
            const Icon = iconMap[leave.icon] || FileText;
            const percentage = (leave.remaining / leave.total) * 100;
            return (
              <div
                key={index}
                className={`${leave.bgColor} rounded-2xl border border-teal-200/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group relative`}
                role="region"
                aria-label={`${leave.type} leave balance`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="text-teal-600"
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${percentage}, 100`}
                      />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <Icon className="text-teal-600" size={24} aria-hidden="true" />
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${leave.textColor}`}>
                    {leave.remaining}/{leave.total}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{leave.type}</h3>
                <p className="text-xl font-bold text-gray-900">{leave.remaining} days</p>
                <div className="absolute invisible group-hover:visible bg-gradient-to-r from-teal-600 to-slate-700 text-white text-xs rounded-lg py-1 px-2 bottom-full mb-2 shadow-sm">
                  Remaining {leave.type.toLowerCase()} days
                  <svg className="absolute text-teal-600 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 mb-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex border-b border-teal-200/50 mb-4">
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'workSummary' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600 hover:text-teal-600'}`}
              onClick={() => setActiveTab('workSummary')}
              aria-label="View work summary"
            >
              Work Summary
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${activeTab === 'attendance' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600 hover:text-teal-600'}`}
              onClick={() => setActiveTab('attendance')}
              aria-label="View attendance"
            >
              Attendance
            </button>
          </div>

          {activeTab === 'workSummary' && (
            <div>
              {dashboardData.workSummary ? (
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Work Summary</h2>
                  <p className="text-gray-600 text-sm">Month: {format(new Date(dashboardData.workSummary.month), 'MMMM yyyy')}</p>
                  <p className="text-gray-600 text-sm">Total Working Days: {dashboardData.workSummary.total_working_days || 0}</p>
                  <p className="text-gray-600 text-sm">Days Present: {dashboardData.workSummary.present_days || 0}</p>
                  <p className="text-gray-600 text-sm">Paid Leave: {dashboardData.workSummary.paid_leave_days || 0}</p>
                  <p className="text-gray-600 text-sm">Unpaid Leave: {dashboardData.workSummary.unpaid_leave_days || 0}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No work summary available for the current month.</p>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div>
              {dashboardData.attendance.length > 0 ? (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Status</h2>
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Today's Status</p>
                        <p className="text-xl font-bold text-gray-900">{dashboardData.attendanceStatus.today}</p>
                      </div>
                      <div className="text-right mt-4 sm:mt-0">
                        <p className="text-gray-600 text-sm">Last Updated</p>
                        <p className="text-gray-900 font-medium">{dashboardData.attendanceStatus.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-gray-100">
                    {dashboardData.attendance.map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
                        role="listitem"
                        aria-label={`Attendance record for ${record.date}`}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                          <Clock className="text-white" size={16} aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-semibold text-sm">{record.date}</p>
                          <p className="text-gray-600 text-xs">Status: {record.status}</p>
                          <p className="text-gray-500 text-xs">
                            Time In: {record.timeIn} | Time Out: {record.timeOut}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No attendance records available.</p>
              )}
            </div>
          )}
        </div>

        {dashboardData.workSummary ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Insights</h2>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <p className="text-gray-600 text-sm mb-4">Month: {format(new Date(dashboardData.workSummary.month), 'MMMM yyyy')}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-teal-600 rounded-full mr-2"></span>
                    <span>Present: {dashboardData.workSummary.present_days || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                    <span>Paid Leave: {dashboardData.workSummary.paid_leave_days || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                    <span>Unpaid Leave: {dashboardData.workSummary.unpaid_leave_days || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-600 rounded-full mr-2"></span>
                    <span>Holidays: {dashboardData.workSummary.holidays || 0}</span>
                  </div>
                </div>
                <NavLink
                  to="/employee/leave-dashboard"
                  className="text-teal-600 text-sm font-medium hover:text-teal-800 hover:underline mt-4 inline-block"
                  aria-label="View leave details"
                >
                  View Leave Details
                </NavLink>
              </div>
              <div className="flex-1">
                <MiniCalendar month={dashboardData.workSummary.month} workSummary={dashboardData.workSummary} />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Insights</h2>
            <p className="text-gray-500 text-sm">No attendance data available for the current month.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;