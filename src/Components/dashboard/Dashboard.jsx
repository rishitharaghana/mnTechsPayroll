import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Clock,
  CreditCard,
  TrendingUp,
  Calendar,
  Award,
  FileText,
  DollarSign,
  PiggyBank,
  Shield,
} from 'lucide-react';

const statsByRole = {
  super_admin: [
    { title: 'Total Employees', value: '248', change: '+12%', icon: Users },
    { title: 'Present Today', value: '198', change: '+5%', icon: Clock },
    { title: 'Monthly Payroll', value: '$48,200', change: '+8%', icon: CreditCard },
    { title: 'Performance Score', value: '94%', change: '+3%', icon: TrendingUp },
  ],
  hr: [
    { title: 'Total Employees', value: '248', change: '+12%', icon: Users },
    { title: 'Present Today', value: '198', change: '+5%', icon: Clock },
    { title: 'Monthly Payroll', value: '$48,200', change: '+8%', icon: CreditCard },
    { title: 'Pending ESI/PF Filings', value: '12', change: '+2', icon: FileText },
  ],
  dept_head: [
    { title: 'Team Size', value: '25', change: '+10%', icon: Users },
    { title: 'Present Today', value: '20', change: '+4%', icon: Clock },
    { title: 'Team Performance', value: '92%', change: '+5%', icon: TrendingUp },
  ],
};

const quickActionsByRole = {
  super_admin: [
    { title: 'Manage Employees', icon: Users, link: '/admin/employees' },
    { title: 'Attendance', icon: Clock, link: '/admin/attendance' },
    { title: 'Payroll', icon: CreditCard, link: '/admin/payroll' },
    { title: 'Reports', icon: FileText, link: '/admin/reports' },
    { title: 'Performance', icon: TrendingUp, link: '/admin/performance' },
    { title: 'Leave Requests', icon: Calendar, link: '/admin/leave-requests' },
    { title: 'Rewards', icon: Award, link: '/admin/rewards' },
    { title: 'Finance', icon: DollarSign, link: '/admin/finance' },
    { title: 'Savings', icon: PiggyBank, link: '/admin/savings' },
    { title: 'Security', icon: Shield, link: '/admin/security' },
  ],
  hr: [
    { title: 'Manage Employees', icon: Users, link: '/admin/employees' },
    { title: 'Attendance', icon: Clock, link: '/admin/attendance' },
    { title: 'Leave Requests', icon: Calendar, link: '/admin/leave-requests' },
    { title: 'Payroll', icon: CreditCard, link: '/admin/payroll' },
  ],
  dept_head: [
    { title: 'Team Attendance', icon: Clock, link: '/admin/team-attendance' },
    { title: 'Team Performance', icon: TrendingUp, link: '/admin/team-performance' },
    { title: 'Leave Approvals', icon: Calendar, link: '/admin/leave-approvals' },
  ],
};

const recentActivitiesByRole = {
  super_admin: [
    { type: 'Employee Added', name: 'John Smith', time: '2 hours ago', icon: Users },
    { type: 'Payslip Generated', name: 'Sarah Wilson', time: '4 hours ago', icon: FileText },
    { type: 'Time Logged', name: 'Mike Johnson', time: '6 hours ago', icon: Clock },
    { type: 'Performance Review', name: 'Emily Davis', time: '1 day ago', icon: Award },
  ],
  hr: [
    { type: 'Employee Added', name: 'John Smith', time: '2 hours ago', icon: Users },
    { type: 'Payslip Generated', name: 'Sarah Wilson', time: '4 hours ago', icon: FileText },
    { type: 'ESI Filing', name: 'HR Team', time: '1 day ago', icon: Shield },
    { type: 'Loan Approved', name: 'Mike Johnson', time: '2 days ago', icon: DollarSign },
  ],
  dept_head: [
    { type: 'Time Logged', name: 'Mike Johnson', time: '6 hours ago', icon: Clock },
    { type: 'Performance Review', name: 'Emily Davis', time: '1 day ago', icon: Award },
    { type: 'Leave Approved', name: 'Sarah Wilson', time: '2 days ago', icon: Calendar },
  ],
};

const performanceMetricsByRole = {
  super_admin: [
    { title: 'Organization Performance', value: 'A+', description: 'Excellent overall rating' },
    { title: 'Attendance Rate', value: '98%', description: 'Above target this month' },
    { title: 'Awards Given', value: '15', description: 'Recognition this quarter' },
    { title: 'Total Payroll', value: '$2.4M', description: 'This fiscal year' },
  ],
  hr: [
    { title: 'Organization Performance', value: 'A+', description: 'Excellent overall rating' },
    { title: 'Attendance Rate', value: '98%', description: 'Above target this month' },
    { title: 'Pending Filings', value: '12', description: 'ESI/PF pending this month' },
    { title: 'Total Payroll', value: '$2.4M', description: 'This fiscal year' },
  ],
  dept_head: [
    { title: 'Team Performance', value: 'A+', description: 'Excellent team rating' },
    { title: 'Attendance Rate', value: '92%', description: 'Above target this month' },
  ],
};

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || '';

  const stats = statsByRole[role] || [];
  const quickActions = quickActionsByRole[role] || [];
  const recentActivities = recentActivitiesByRole[role] || [];
  const performanceMetrics = performanceMetricsByRole[role] || [];

  const currentDateTime = new Date('2025-08-13T17:11:00+05:30');
  const formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(currentDateTime);
  const formattedTime = new Intl.DateTimeFormat('en-US', { timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(currentDateTime);

  return (
    <div className="w-78/100 space-y-8 bg-white rounded-2xl min-h-screen p-6">
      <div className="bg-gradient-to-r from-slate-700 to-teal-600 rounded-lg border border-slate-200/50 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || role.toUpperCase()}!
            </h1>
            <p className="text-gray-200 text-lg mt-1">
              {user?.name && <span>{user.name}, </span>}
              Here to access your workspace {role === 'dept_head' ? 'team' : 'organization'} today.
            </p>
          </div>
        </div>
      </div>

      {stats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center w-12 h-12">
                    <Icon className="text-white" size={24} />
                  </div>
                  <span className="text-emerald-600 text-sm font-medium">{stat.change}</span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No statistics available for this role.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {recentActivities.length > 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-t-lg -mx-6 -mt-6 p-4">
              <h2 className="text-xl font-bold text-white">Recent Activities</h2>
            </div>
            <div className="space-y-4 mt-6">
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                  >
                    <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg flex items-center justify-center w-10 h-10">
                      <Icon className="text-white" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 font-medium">{activity.type}</p>
                      <p className="text-slate-500 text-sm">{activity.name}</p>
                    </div>
                    <span className="text-slate-400 text-sm">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No recent activities available for this role.</p>
        )}

        {/* Quick Actions */}
        {quickActions.length > 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-t-lg -mx-6 -mt-6 p-4">
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <NavLink
                    key={index}
                    to={action.link}
                    className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg text-white transition-transform duration-300 transform hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 flex flex-col items-center p-4"
                  >
                    <Icon className="mb-2" size={24} />
                    <span className="text-sm font-medium text-center">{action.title}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No quick actions available for this role.</p>
        )}
      </div>

      {/* Performance */}
      {performanceMetrics.length > 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-t-lg -mx-6 -mt-6 p-4">
            <h2 className="text-xl font-bold text-white">
              {role === 'dept_head' ? 'Team Performance Overview' : 'Performance Overview'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-teal-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">{metric.value}</span>
                </div>
                <h3 className="font-semibold text-slate-900">{metric.title}</h3>
                <p className="text-slate-500 text-sm">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">No performance metrics available for this role.</p>
      )}
    </div>
  );
};

export default AdminDashboard;