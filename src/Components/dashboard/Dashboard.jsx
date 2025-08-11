import React from 'react';
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
import { NavLink } from 'react-router-dom';

const stats = [
  {
    title: 'Total Employees',
    value: '248',
    change: '+12%',
    icon: Users,
  },
  {
    title: 'Present Today',
    value: '198',
    change: '+5%',
    icon: Clock,
  },
  {
    title: 'Monthly Payroll',
    value: '$48,200',
    change: '+8%',
    icon: CreditCard,
  },
  {
    title: 'Performance Score',
    value: '94%',
    change: '+3%',
    icon: TrendingUp,
  },
];

const recentActivities = [
  { type: 'Employee Added', name: 'John Smith', time: '2 hours ago', icon: Users },
  { type: 'Payslip Generated', name: 'Sarah Wilson', time: '4 hours ago', icon: FileText },
  { type: 'Time Logged', name: 'Mike Johnson', time: '6 hours ago', icon: Clock },
  { type: 'Performance Review', name: 'Emily Davis', time: '1 day ago', icon: Award },
];

const quickActions = [
  { label: 'Add Employee', icon: Users, to: '/admin/employees/add-employee' },
  { label: 'Generate Payslip', icon: FileText, to: '/admin/payslip/payslip-form' },
  { label: 'Track Time', icon: Clock, to: '/admin/time-tracking' },
  { label: 'View Calendar', icon: Calendar, to: '/admin/calendar' },
  { label: 'Manage Loans', icon: DollarSign, to: '/admin/loans' },
  { label: 'ESI Records', icon: Shield, to: '/admin/esi' },
  { label: 'PF Management', icon: PiggyBank, to: '/admin/pf' },
  { label: 'Performance', icon: TrendingUp, to: '/admin/performance' },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 bg-slate-50 min-h-screen p-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg border border-slate-200/50 p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Admin!</h1>
            <p className="text-slate-200 text-lg">Here's what's happening with your organization today.</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-slate-200">Today's Date</p>
            <p className="text-xl font-semibold text-white">
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
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

        {/* Quick Actions */}
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
                  to={action.to}
                  className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg text-white transition-transform duration-300 transform hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400 flex flex-col items-center p-4"
                >
                  <Icon className="mb-2" size={24} />
                  <span className="text-sm font-medium text-center">{action.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-t-lg -mx-6 -mt-6 p-4">
          <h2 className="text-xl font-bold text-white">Performance Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">A+</span>
            </div>
            <h3 className="font-semibold text-slate-900">Team Performance</h3>
            <p className="text-slate-500 text-sm">Excellent overall rating</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">98%</span>
            </div>
            <h3 className="font-semibold text-slate-900">Attendance Rate</h3>
            <p className="text-slate-500 text-sm">Above target this month</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">15</span>
            </div>
            <h3 className="font-semibold text-slate-900">Awards Given</h3>
            <p className="text-slate-500 text-sm">Recognition this quarter</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">$2.4M</span>
            </div>
            <h3 className="font-semibold text-slate-900">Total Payroll</h3>
            <p className="text-slate-500 text-sm">This fiscal year</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;