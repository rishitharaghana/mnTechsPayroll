import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { Users, Clock, CreditCard, Calendar, BarChart, TrendingUp, Activity, Clock as ClockIcon } from 'lucide-react';
import { fetchDashboardData, clearState } from '../../redux/slices/dashboardSlice';
import { getCurrentUserProfile } from '../../redux/slices/employeeSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { profile, loading: employeeLoading, error: employeeError } = useSelector((state) => state.employee);
  const { dashboardData, loading, error } = useSelector((state) => state.dashboard);
  const role = profile?.role || user?.role || '';
  const fullName = profile?.full_name || user?.full_name || role.toUpperCase();

  useEffect(() => {
    
    if (!isAuthenticated && !authLoading) {
      navigate('/login');
    } else if (!profile?.full_name) {
      dispatch(getCurrentUserProfile());
    } else if (role && token) {
      dispatch(fetchDashboardData({ role }));
    }
    return () => dispatch(clearState());
  }, [dispatch, navigate, isAuthenticated, authLoading, profile, user, role, token]);

  if (authLoading || employeeLoading || loading) {
    return <div className="flex justify-center items-center min-h-screen text-slate-500">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p>Please log in to access the dashboard.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-teal-600 text-white p-2 rounded mt-2 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (authError || employeeError || error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p>{authError || employeeError || error}</p>
          <button
            onClick={() => {
              dispatch(getCurrentUserProfile());
              if (role && token) dispatch(fetchDashboardData({ role }));
            }}
            className="bg-teal-600 text-white p-2 rounded mt-2 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { stats = [], quickActions = [], recentActivities = [], performanceMetrics = [], leaveBalances = {} } = dashboardData || {};

  // Role-specific insights title
  const getInsightsTitle = () => {
    if (role === 'super_admin') return 'Organization Insights';
    if (role === 'hr') return 'HR Insights';
    if (role === 'dept_head') return 'Team Insights';
    return 'Insights';
  };

  // Simple layout logic for sparse data
  const totalItems = performanceMetrics.length + Object.keys(leaveBalances).length;
  const isSingleItem = totalItems === 1;
  const isTwoItems = totalItems === 2;
  const isHRorDeptHead = role === 'hr' || role === 'dept_head';

  // Helper to render progress bar for rates (e.g., attendance)
  const ProgressBar = ({ value, color = 'teal' }) => {
    const percentage = parseFloat(value) || 0;
    const bgColor = color === 'teal' ? 'bg-teal-500' : 'bg-emerald-500';
    return (
      <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${bgColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-8 bg-white rounded-2xl min-h-screen sm:p-6 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-teal-600 rounded-lg border border-slate-200/50 md:p-8 p-5 sm:mb-8 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="md:text-3xl sm:text-2xl text-xl font-extrabold text-white tracking-tight">
              Welcome Back, {fullName}!
            </h1>
            <p className="text-gray-200 md:text-lg sm:text-md text-sm mt-1">
              Manage your {role === 'dept_head' ? 'team' : role === 'hr' ? 'HR operations' : 'organization'} with ease.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:mb-8 mb-6">
          {stats.map((stat, index) => {
            const Icon = { Users, Clock, CreditCard, Calendar }[stat.icon] || Users;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                role="region"
                aria-label={stat.title}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center w-10 h-10">
                    <Icon className="text-white" size={20} aria-hidden="true" />
                  </div>
                  <span className="text-emerald-600 text-xs font-medium">{stat.change}</span>
                </div>
                <h3 className="text-slate-500 text-xs font-medium mb-1">{stat.title}</h3>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No statistics available.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:mb-8 mb-6">
        {quickActions.length > 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-t-lg -mx-4 -mt-4 p-3">
              <h2 className="text-lg font-bold text-white">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {quickActions.map((action, index) => {
                const Icon = { Users, Clock, CreditCard, Calendar, BarChart }[action.icon] || Users;
                return (
                  <NavLink
                    key={index}
                    to={action.link}
                    className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg text-white p-3 flex flex-col items-center hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300"
                    aria-label={`Navigate to ${action.title}`}
                  >
                    <Icon className="mb-1" size={20} aria-hidden="true" />
                    <span className="text-xs font-medium text-center">{action.title}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No quick actions available.</p>
        )}

        {recentActivities.length > 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-t-lg -mx-4 -mt-4 p-3">
              <h2 className="text-lg font-bold text-white">Recent Activities</h2>
            </div>
            <div className="mt-4 space-y-3">
              {recentActivities.map((activity, index) => {
                const Icon = { Users, Clock, Calendar }[activity.icon] || Users;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                    role="listitem"
                    aria-label={`${activity.type} by ${activity.name}`}
                  >
                    <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center w-8 h-8">
                      <Icon className="text-white" size={16} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 text-sm font-medium">{activity.type}</p>
                      <p className="text-slate-500 text-xs">{activity.name}</p>
                    </div>
                    <span className="text-slate-400 text-xs">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No recent activities.</p>
        )}
      </div>

      {/* Role-Specific Insights Section - Circles for HR/Dept Head, Horizontal for Super Admin */}
      {(performanceMetrics.length > 0 || Object.keys(leaveBalances).length > 0) && (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="text-teal-600" size={20} />
            {getInsightsTitle()}
          </h2>
          {isHRorDeptHead ? (
            // Circle Cards for HR/Dept Head
            <div className={`grid ${isSingleItem ? 'grid-cols-1 justify-items-center' : isTwoItems ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'} gap-6`}>
              {/* Performance Metrics */}
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="text-center group cursor-default transition-all duration-300 hover:scale-105">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl">
                      <span className="text-lg font-bold text-white">{metric.value}</span>
                    </div>
                    {metric.title.toLowerCase().includes('attendance') && (
                      <ProgressBar value={metric.value.replace('%', '')} color="teal" />
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mt-2">{metric.title}</h3>
                  <p className="text-xs text-slate-500">{metric.description}</p>
                </div>
              ))}
              
              {/* Leave Balances */}
              {Object.keys(leaveBalances).map((type, index) => {
                if (role === 'super_admin' && type !== 'paid_leave_balance') return null;
                const label = type === 'paid_leave_balance' ? 'Paid Leave' : type.charAt(0).toUpperCase() + type.slice(1);
                return (
                  <div key={`leave-${index}`} className="text-center group cursor-default transition-all duration-300 hover:scale-105">
                    <div className="relative inline-block">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl">
                        <span className="text-lg font-bold text-white">{leaveBalances[type]}</span>
                      </div>
                      <p className="text-xs text-emerald-600 mt-1 font-medium">days</p>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mt-2">{label} Balance</h3>
                    <p className="text-xs text-slate-500">Available for {new Date().getFullYear()}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            // Horizontal Layout for Super Admin
            <div className={`space-y-4 ${isSingleItem ? 'max-w-md mx-auto' : ''}`}>
              {/* Performance Metrics */}
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-teal-100 rounded-lg">
                      <ClockIcon className="text-teal-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{metric.title}</h3>
                      <p className="text-xs text-slate-500">{metric.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end w-32">
                    <span className="text-lg font-bold text-teal-600 mb-2">{metric.value}</span>
                    {metric.title.toLowerCase().includes('attendance') && (
                      <ProgressBar value={metric.value.replace('%', '')} color="teal" />
                    )}
                  </div>
                </div>
              ))}
              
              {/* Leave Balances */}
              {Object.keys(leaveBalances).map((type, index) => {
                if (role === 'super_admin' && type !== 'paid_leave_balance') return null;
                const label = type === 'paid_leave_balance' ? 'Paid Leave' : type.charAt(0).toUpperCase() + type.slice(1);
                return (
                  <div key={`leave-${index}`} className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-emerald-100 rounded-lg">
                        <Calendar className="text-emerald-600" size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{label} Balance</h3>
                        <p className="text-xs text-slate-500">Org-Wide</p>
                      </div>
                    </div>
                    <div className="text-right w-32">
                      <span className="text-xl font-bold text-emerald-600">{leaveBalances[type]}</span>
                      <p className="text-xs text-emerald-600 mt-1">days</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;