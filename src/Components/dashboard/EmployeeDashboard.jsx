import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { Users, Clock, FileText, DollarSign, PiggyBank, Calendar, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { getCurrentUserProfile } from '../../redux/slices/employeeSlice';
import { fetchEmployeeAttendance } from '../../redux/slices/attendanceSlice';
import { fetchLeaveBalances } from '../../redux/slices/leaveSlice';
import { fetchRecentPayslip } from '../../redux/slices/payslipSlice';
import MiniCalendar from '../common/MiniCalendar';

const iconMap = {
  FileText: FileText,
  Users: Users,
  Clock: Clock,
  DollarSign: DollarSign,
  PiggyBank: PiggyBank,
  Calendar: Calendar,
  User: User,
};

const quickActions = [
  { label: 'Leave Request', icon: 'FileText', color: 'bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600', focusRing: 'focus:ring-teal-600', to: '/employee/leave-application' },
  { label: 'Leave Dashboard', icon: 'Calendar', color: 'bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600', focusRing: 'focus:ring-teal-600', to: '/employee/leave-dashboard' },
  { label: 'Payslip', icon: 'DollarSign', color: 'bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600', focusRing: 'focus:ring-teal-600', to: '/employee-payslip' },
  { label: 'Attendance', icon: 'Clock', color: 'bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600', focusRing: 'focus:ring-teal-600', to: '/employee/employee-attendance' },
  { label: 'PF', icon: 'PiggyBank', color: 'bg-gradient-to-r from-teal-600 to-slate-700 hover:from-teal-500 hover:to-slate-600', focusRing: 'focus:ring-teal-600', to: '/pf' },
];

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role, isAuthenticated, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { employeeId, profile, loading: employeeLoading, error: employeeError } = useSelector((state) => state.employee);
  const { leaveBalances, loading: leaveLoading, error: leaveError } = useSelector((state) => state.leaves);
  const { submissions: attendance, loading: attendanceLoading, error: attendanceError } = useSelector((state) => state.attendance);
  const { recentPayslip, loading: payrollLoading, error: payrollError } = useSelector((state) => state.payslip);
  const [dashboardData, setDashboardData] = useState({
    leaveBalances: [],
    attendance: [],
    attendanceStatus: { today: 'Not Recorded', lastUpdated: 'N/A' },
    recentPayslip: null,
    profile: null,
    workSummary: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/login');
    } else if (!user || !employeeId) {
      dispatch(getCurrentUserProfile());
    } else if (isAuthenticated && role?.toLowerCase() === 'employee' && employeeId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [leaveBalancesResult, attendanceResult, payslipResult] = await Promise.all([
            dispatch(fetchLeaveBalances()).unwrap(),
            dispatch(fetchEmployeeAttendance()).unwrap(),
            dispatch(fetchRecentPayslip({ employeeId })).unwrap(),
          ]);

          setDashboardData({
            leaveBalances: [
              { type: 'Casual Leave (CL)', backendType: 'casual', remaining: leaveBalancesResult.casual || 0, total: 7, bgColor: 'bg-white/90 backdrop-blur-sm', color: 'bg-gradient-to-r from-teal-600 to-slate-700', textColor: 'text-gray-600', icon: 'FileText' },
              { type: 'Sick Leave (SL)', backendType: 'sick', remaining: leaveBalancesResult.sick || 0, total: 12, bgColor: 'bg-white/90 backdrop-blur-sm', color: 'bg-gradient-to-r from-teal-600 to-slate-700', textColor: 'text-gray-600', icon: 'FileText' },
              { type: 'Earned Leave (EL)', backendType: 'vacation', remaining: leaveBalancesResult.vacation || 0, total: 15, bgColor: 'bg-white/90 backdrop-blur-sm', color: 'bg-gradient-to-r from-teal-600 to-slate-700', textColor: 'text-gray-600', icon: 'FileText' },
            ],
            attendance: attendanceResult.data?.attendance.map((record) => ({
              date: record.date,
              status: record.status,
              timeIn: record.login_time || 'N/A',
              timeOut: record.logout_time || 'N/A',
            })) || [],
            attendanceStatus: attendanceResult.data?.attendanceStatus || { today: 'Not Recorded', lastUpdated: 'N/A' },
            recentPayslip: payslipResult?.data[0] || null,
            profile: profile || null,
            workSummary: payslipResult?.data[0] || null,
          });
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          toast.error(error || 'Failed to load dashboard data', { position: 'top-right', autoClose: 3000 });
        }
        setLoading(false);
      };
      fetchData();
    }
  }, [dispatch, navigate, isAuthenticated, authLoading, user, role, employeeId, profile]);

  useEffect(() => {
    if (authError || employeeError || leaveError || attendanceError || payrollError) {
      toast.error(authError || employeeError || leaveError || attendanceError || payrollError, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  }, [authError, employeeError, leaveError, attendanceError, payrollError]);

  if (authLoading || employeeLoading || loading || payrollLoading) {
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

  if (!employeeId) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">
            Access restricted: Employee ID is missing. {employeeError || 'Please try again.'}
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-slate-700 to-teal-600 rounded-2xl border border-teal-700/50 p-6 sm:p-8 mb-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Hello, {user?.full_name || 'Employee'}!
              </h1>
              <p className="text-gray-200 text-lg mt-1">Manage your leave, attendance, and more with ease.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData.leaveBalances.map((leave, index) => {
            const Icon = iconMap[leave.icon] || FileText;
            return (
              <div
                key={index}
                className={`${leave.bgColor} rounded-2xl border border-teal-200/50 p-6 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group relative`}
                role="region"
                aria-label={`${leave.type} leave balance`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 ${leave.color} rounded-lg flex items-center justify-center shadow-md`}>
                    <Icon className="text-white" size={20} aria-hidden="true" />
                  </div>
                  <span className={`text-xs font-semibold ${leave.textColor}`}>
                    {leave.remaining}/{leave.total}
                  </span>
                </div>
                <h3 className="text-gray-600 text-xs font-medium mb-1">{leave.type}</h3>
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
          {dashboardData.profile && (
            <div
              className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 group relative"
              role="region"
              aria-label="Profile snapshot"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center shadow-md">
                  <User className="text-white" size={20} aria-hidden="true" />
                </div>
                <span className="text-xs font-semibold text-gray-600">Employee Profile</span>
              </div>
              <h3 className="text-gray-600 text-xs font-medium mb-1">{dashboardData.profile.full_name}</h3>
              <p className="text-sm text-gray-900">ID: {dashboardData.profile.employee_id}</p>
              <p className="text-sm text-gray-900">Dept: {dashboardData.profile.department_name || 'N/A'}</p>
              <p className="text-sm text-gray-900">Role: {dashboardData.profile.designation_name || 'Employee'}</p>
              <NavLink
                to="/employee/profile"
                className="text-teal-600 text-xs font-medium hover:text-teal-800 hover:underline mt-2 inline-block"
                aria-label="View full profile"
              >
                View Profile
              </NavLink>
            </div>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 mb-8 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {quickActions.map((action, index) => {
              const Icon = iconMap[action.icon] || FileText;
              return (
                <NavLink
                  key={index}
                  to={action.to}
                  className={`p-2 ${action.color} rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1 ${action.focusRing} shadow-sm text-center`}
                  aria-label={action.label}
                >
                  <Icon className="mx-auto mb-1" size={20} aria-hidden="true" />
                  <span className="text-xs">{action.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {dashboardData.recentPayslip ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Payslip</h2>
              <div className="space-y-2">
                <p className="text-gray-600 text-sm">Month: {dashboardData.recentPayslip.month || 'N/A'}</p>
                <p className="text-gray-600 text-sm">
                  Gross Pay: ₹{parseFloat(dashboardData.recentPayslip.gross_salary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-gray-600 text-sm">
                  Net Pay: ₹{parseFloat(dashboardData.recentPayslip.net_salary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <NavLink
                  to="/employee-payslip"
                  className="text-teal-600 text-sm font-medium hover:text-teal-800 hover:underline mt-2 inline-block"
                  aria-label="View full payslip"
                >
                  View Full Payslip
                </NavLink>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Payslip</h2>
              <p className="text-gray-500 text-sm">No payslip available for the current month.</p>
            </div>
          )}

          {dashboardData.workSummary ? (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Work Summary</h2>
              <div className="space-y-2">
                <p className="text-gray-600 text-sm">Month: {dashboardData.workSummary.month || 'N/A'}</p>
                <p className="text-gray-600 text-sm">Total Working Days: {dashboardData.workSummary.total_working_days || 0}</p>
                <p className="text-gray-600 text-sm">Days Present: {dashboardData.workSummary.present_days || 0}</p>
                <p className="text-gray-600 text-sm">Paid Leave: {dashboardData.workSummary.paid_leave_days || 0}</p>
                <p className="text-gray-600 text-sm">Unpaid Leave: {dashboardData.workSummary.unpaid_leave_days || 0}</p>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Work Summary</h2>
              <p className="text-gray-500 text-sm">No work summary available for the current month.</p>
            </div>
          )}
        </div>

        {/* New Attendance Insights with Mini Calendar */}
        {dashboardData.workSummary ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 mb-8 shadow-sm hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Insights</h2>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">Month: {dashboardData.workSummary.month || 'N/A'}</p>
              <MiniCalendar month={dashboardData.workSummary.month} workSummary={dashboardData.workSummary} />
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
                className="text-teal-600 text-sm font-medium hover:text-teal-800 hover:underline mt-2 inline-block"
                aria-label="View leave details"
              >
                View Leave Details
              </NavLink>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Insights</h2>
            <p className="text-gray-500 text-sm">No attendance data available for the current month.</p>
          </div>
        )}

        {dashboardData.attendance.length > 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-teal-200/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
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
          <p className="text-gray-500 text-center mt-6">No attendance records available.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;