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
  const [activeTab, setActiveTab] = useState('payslip');

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
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-teal-600" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          </svg>
          <span className="text-sm sm:text-base">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-sm sm:text-base mb-3 sm:mb-4">Access restricted: Not authenticated. Please log in.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-teal-600 text-white p-1.5 sm:p-2 rounded hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
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
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-sm sm:text-base mb-3 sm:mb-4">Access restricted: User role is '{role || 'undefined'}', not 'employee'.</p>
        </div>
      </div>
    );
  }

  if (!employeeId) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-sm sm:text-base mb-3 sm:mb-4">
            Access restricted: Employee ID is missing. {employeeError || 'Please try again.'}
          </p>
          <button
            onClick={() => dispatch(getCurrentUserProfile())}
            className="bg-teal-600 text-white p-1.5 sm:p-2 rounded hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            aria-label="Retry fetching profile"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-full sm:max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-700 to-teal-600 rounded-xl sm:rounded-2xl border border-teal-700/50 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/90 rounded-full flex items-center justify-center shadow-md animate-pulse-subtle">
                <User className="text-teal-600" size={32} sm:size={36} md:size={40} aria-hidden="true" />
              </div>
              <div className="w-22 sm:w-23 absolute -bottom-1 -right-3 sm:-right-2 md:right-1 sm:-bottom-2 bg-teal-600 text-white text-xs font-semibold rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 shadow-md">
                {dashboardData.profile?.employee_id || 'N/A'}
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Welcome, {dashboardData.profile?.full_name || user?.full_name || 'Employee'}!
              </h1>
              <p className="text-xs sm:text-sm text-gray-200 mt-1">
                {dashboardData.profile?.designation_name || 'Employee'} | {dashboardData.profile?.department_name || 'N/A'}
              </p>
              <NavLink
                to="/profile"
                className="text-white text-xs sm:text-sm font-medium hover:underline mt-1 sm:mt-2 inline-block"
                aria-label="View full profile"
              >
                View Full Profile
              </NavLink>
            </div>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex bg-white/90 backdrop-blur-sm rounded-full border border-teal-200/50 p-1.5 sm:p-2 shadow-sm overflow-x-auto">
            {quickActions.map((action, index) => {
              const Icon = iconMap[action.icon] || FileText;
              return (
                <NavLink
                  key={index}
                  to={action.to}
                  className={`p-2 sm:p-3 ${action.color} rounded-full mx-1 text-white font-medium transition-all duration-300 transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${action.focusRing} shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center`}
                  aria-label={action.label}
                >
                  <Icon size={18} sm:size={20} aria-hidden="true" />
                  <span className="sr-only">{action.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Leave Balances */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {dashboardData.leaveBalances.map((leave, index) => {
            const Icon = iconMap[leave.icon] || FileText;
            const percentage = (leave.remaining / leave.total) * 100;
            return (
              <div
                key={index}
                className={`${leave.bgColor} rounded-xl sm:rounded-2xl border border-teal-200/50 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group relative`}
                role="region"
                aria-label={`${leave.type} leave balance`}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
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
                      <Icon className="text-teal-600" size={20} sm:size={22} md:size={24} aria-hidden="true" />
                    </div>
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold ${leave.textColor}`}>
                    {leave.remaining}/{leave.total}
                  </span>
                </div>
                <h3 className="text-gray-600 text-xs sm:text-sm font-medium mb-1">{leave.type}</h3>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{leave.remaining} days</p>
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

        {/* Tabbed Interface */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-teal-200/50 p-4 sm:p-6 mb-6 sm:mb-8 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex flex-wrap border-b border-teal-200/50 mb-3 sm:mb-4 gap-2 sm:gap-0">
            <button
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === 'payslip' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600 hover:text-teal-600'}`}
              onClick={() => setActiveTab('payslip')}
              aria-label="View payslip"
            >
              Payslip
            </button>
            <button
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === 'workSummary' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600 hover:text-teal-600'}`}
              onClick={() => setActiveTab('workSummary')}
              aria-label="View work summary"
            >
              Work Summary
            </button>
            <button
              className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium ${activeTab === 'attendance' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-600 hover:text-teal-600'}`}
              onClick={() => setActiveTab('attendance')}
              aria-label="View attendance"
            >
              Attendance
            </button>
          </div>

          {activeTab === 'payslip' && (
            <div>
              {dashboardData.recentPayslip ? (
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Recent Payslip</h2>
                  <p className="text-gray-600 text-xs sm:text-sm">Month: {dashboardData.recentPayslip.month || 'N/A'}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Gross Pay: ₹{parseFloat(dashboardData.recentPayslip.gross_salary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Net Pay: ₹{parseFloat(dashboardData.recentPayslip.net_salary || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <NavLink
                    to="/employee-payslip"
                    className="text-teal-600 text-xs sm:text-sm font-medium hover:text-teal-800 hover:underline mt-2 inline-block"
                    aria-label="View full payslip"
                  >
                    View Full Payslip
                  </NavLink>
                </div>
              ) : (
                <p className="text-gray-500 text-xs sm:text-sm">No payslip available for the current month.</p>
              )}
            </div>
          )}

          {activeTab === 'workSummary' && (
            <div>
              {dashboardData.workSummary ? (
                <div className="space-y-2">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Work Summary</h2>
                  <p className="text-gray-600 text-xs sm:text-sm">Month: {dashboardData.workSummary.month || 'N/A'}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Total Working Days: {dashboardData.workSummary.total_working_days || 0}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Days Present: {dashboardData.workSummary.present_days || 0}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Paid Leave: {dashboardData.workSummary.paid_leave_days || 0}</p>
                  <p className="text-gray-600 text-xs sm:text-sm">Unpaid Leave: {dashboardData.workSummary.unpaid_leave_days || 0}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-xs sm:text-sm">No work summary available for the current month.</p>
              )}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div>
              {dashboardData.attendance.length > 0 ? (
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Attendance Status</h2>
                  <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                      <div>
                        <p className="text-gray-600 text-xs sm:text-sm">Today's Status</p>
                        <p className="text-lg sm:text-xl font-bold text-gray-900">{dashboardData.attendanceStatus.today}</p>
                      </div>
                      <div className="text-right mt-3 sm:mt-0">
                        <p className="text-gray-600 text-xs sm:text-sm">Last Updated</p>
                        <p className="text-gray-900 font-medium text-xs sm:text-sm">{dashboardData.attendanceStatus.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4 max-h-40 sm:max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-gray-100 pr-2">
                    {dashboardData.attendance.map((record, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 sm:space-x-4 p-2 rounded-lg hover:bg-gray-100/80 transition-all duration-200"
                        role="listitem"
                        aria-label={`Attendance record for ${record.date}`}
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                          <Clock className="text-white" size={14} sm:size={16} aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-semibold text-xs sm:text-sm">{record.date}</p>
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
                <p className="text-gray-500 text-xs sm:text-sm">No attendance records available.</p>
              )}
            </div>
          )}
        </div>

        {/* Attendance Insights */}
        {dashboardData.workSummary ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-teal-200/50 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Attendance Insights</h2>
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              <div className="flex-1">
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">Month: {dashboardData.workSummary.month || 'N/A'}</p>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-teal-600 rounded-full mr-1.5 sm:mr-2"></span>
                    <span>Present: {dashboardData.workSummary.present_days || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-600 rounded-full mr-1.5 sm:mr-2"></span>
                    <span>Paid Leave: {dashboardData.workSummary.paid_leave_days || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-600 rounded-full mr-1.5 sm:mr-2"></span>
                    <span>Unpaid Leave: {dashboardData.workSummary.unpaid_leave_days || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-600 rounded-full mr-1.5 sm:mr-2"></span>
                    <span>Holidays: {dashboardData.workSummary.holidays || 0}</span>
                  </div>
                </div>
                <NavLink
                  to="/employee/leave-dashboard"
                  className="text-teal-600 text-xs sm:text-sm font-medium hover:text-teal-800 hover:underline mt-3 sm:mt-4 inline-block"
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
          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-teal-200/50 p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Attendance Insights</h2>
            <p className="text-gray-500 text-xs sm:text-sm">No attendance data available for the current month.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;