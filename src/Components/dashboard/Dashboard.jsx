// Dashboard.jsx
import React from 'react';
import { Users, Clock, CreditCard, TrendingUp, Calendar, Award, FileText, DollarSign, PiggyBank, Shield } from 'lucide-react';

// Memoize static data to prevent unnecessary re-renders
const stats = [
  {
    title: 'Total Employees',
    value: '248',
    change: '+12%',
    icon: Users,
    color: 'bg-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    title: 'Present Today',
    value: '198',
    change: '+5%',
    icon: Clock,
    color: 'bg-green-600',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
  },
  {
    title: 'Monthly Payroll',
    value: '$48,200',
    change: '+8%',
    icon: CreditCard,
    color: 'bg-purple-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
  {
    title: 'Performance Score',
    value: '94%',
    change: '+3%',
    icon: TrendingUp,
    color: 'bg-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
];

const recentActivities = [
  { type: 'Employee Added', name: 'John Smith', time: '2 hours ago', icon: Users },
  { type: 'Payslip Generated', name: 'Sarah Wilson', time: '4 hours ago', icon: FileText },
  { type: 'Time Logged', name: 'Mike Johnson', time: '6 hours ago', icon: Clock },
  { type: 'Performance Review', name: 'Emily Davis', time: '1 day ago', icon: Award },
];

const quickActions = [
  { label: 'Add Employee', icon: Users, color: 'bg-blue-600 hover:bg-blue-700' },
  { label: 'Generate Payslip', icon: FileText, color: 'bg-green-600 hover:bg-green-700' },
  { label: 'Track Time', icon: Clock, color: 'bg-purple-600 hover:bg-purple-700' },
  { label: 'View Calendar', icon: Calendar, color: 'bg-orange-600 hover:bg-orange-700' },
  { label: 'Manage Loans', icon: DollarSign, color: 'bg-indigo-600 hover:bg-indigo-700' },
  { label: 'ESI Records', icon: Shield, color: 'bg-teal-600 hover:bg-teal-700' },
  { label: 'PF Management', icon: PiggyBank, color: 'bg-pink-600 hover:bg-pink-700' },
  { label: 'Performance', icon: TrendingUp, color: 'bg-red-600 hover:bg-red-700' },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Chief Executive!</h1>
            <p className="text-gray-600 text-lg">Here's what's happening with your organization today.</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-gray-600">Today's Date</p>
            <p className="text-xl font-semibold text-gray-900">
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-green-600 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Icon className="text-white" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{activity.type}</p>
                    <p className="text-gray-600 text-sm">{activity.name}</p>
                  </div>
                  <span className="text-gray-500 text-sm">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className={`p-4 ${action.color} rounded-lg text-white transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${action.color.split('-')[1]}-500`}
                  aria-label={action.label}
                >
                  <Icon className="mx-auto mb-2" size={24} />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">A+</span>
            </div>
            <h3 className="font-semibold text-gray-900">Team Performance</h3>
            <p className="text-gray-600 text-sm">Excellent overall rating</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">98%</span>
            </div>
            <h3 className="font-semibold text-gray-900">Attendance Rate</h3>
            <p className="text-gray-600 text-sm">Above target this month</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">15</span>
            </div>
            <h3 className="font-semibold text-gray-900">Awards Given</h3>
            <p className="text-gray-600 text-sm">Recognition this quarter</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">$2.4M</span>
            </div>
            <h3 className="font-semibold text-gray-900">Total Payroll</h3>
            <p className="text-gray-600 text-sm">This fiscal year</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;