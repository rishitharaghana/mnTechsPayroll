
import React from 'react';
import {
  Users,
  Clock,
  CreditCard,
  TrendingUp,
  Calendar,
  Award,
  FileText,
} from 'lucide-react';



const Dashboard = () => {
  const stats = [
    {
      title: 'Total Employees',
      value: '248',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Present Today',
      value: '198',
      change: '+5%',
      icon: Clock,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Monthly Payroll',
      value: '$48,200',
      change: '+8%',
      icon: CreditCard,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Performance Score',
      value: '94%',
      change: '+3%',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const recentActivities = [
    { type: 'Employee Added', name: 'John Smith', time: '2 hours ago', icon: Users },
    { type: 'Payslip Generated', name: 'Sarah Wilson', time: '4 hours ago', icon: FileText },
    { type: 'Time Logged', name: 'Mike Johnson', time: '6 hours ago', icon: Clock },
    { type: 'Performance Review', name: 'Emily Davis', time: '1 day ago', icon: Award },
  ];

  return (
   
    <div className="space-y-8">
       
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
            <p className="text-indigo-100 text-lg">Here's what's happening with your team today.</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-indigo-100">Today's Date</p>
            <p className="text-xl font-semibold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-green-500 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/50 transition-all duration-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
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
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Users className="mx-auto mb-2" size={24} />
              <span className="text-sm font-medium">Add Employee</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
              <FileText className="mx-auto mb-2" size={24} />
              <span className="text-sm font-medium">Generate Payslip</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Clock className="mx-auto mb-2" size={24} />
              <span className="text-sm font-medium">Track Time</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white hover:shadow-lg transition-all duration-300 hover:scale-105">
              <Calendar className="mx-auto mb-2" size={24} />
              <span className="text-sm font-medium">View Calendar</span>
            </button>
          </div>
        </div>
      </div>

      
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">A+</span>
            </div>
            <h3 className="font-semibold text-gray-900">Team Performance</h3>
            <p className="text-gray-600 text-sm">Excellent overall rating</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">98%</span>
            </div>
            <h3 className="font-semibold text-gray-900">Attendance Rate</h3>
            <p className="text-gray-600 text-sm">Above target this month</p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-white">15</span>
            </div>
            <h3 className="font-semibold text-gray-900">Awards Given</h3>
            <p className="text-gray-600 text-sm">Recognition this quarter</p>
          </div>
        </div>
      </div>
    </div>
    
  );

};

export default Dashboard;
