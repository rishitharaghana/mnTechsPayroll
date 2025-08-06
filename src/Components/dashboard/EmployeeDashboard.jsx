
import React, { useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Clock, FileText, Calendar, DollarSign, PiggyBank } from 'lucide-react';
import DatePicker from '../../Components/ui/date/DatePicker';

const EmployeeDashboard = () => {
  const [leaveRequestDateRange, setLeaveRequestDateRange] = useState({ from: '', to: '' });

  // Mock employee data
  const employee = { id: 'EMP001', name: 'John Smith' };

  // Mock leave balance data
  const leaveBalance = [
    { type: 'Vacation', remaining: 15, total: 20, icon: Calendar, color: 'bg-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { type: 'Sick', remaining: 7, total: 10, icon: FileText, color: 'bg-green-600', bgColor: 'bg-green-50', textColor: 'text-green-600' },
    { type: 'Personal', remaining: 3, total: 5, icon: Users, color: 'bg-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { type: 'Maternity', remaining: 30, total: 30, icon: Users, color: 'bg-orange-600', bgColor: 'bg-orange-50', textColor: 'text-orange-600' },
  ];

  // Mock recent leave requests
  const recentLeaveRequests = [
    { id: 'LEAVE001', type: 'Vacation', from: '2025-08-10', to: '2025-08-15', days: 6, status: 'Pending', details: 'Family vacation' },
    { id: 'LEAVE002', type: 'Sick', from: '2025-07-20', to: '2025-07-22', days: 3, status: 'Approved', details: 'Medical leave' },
    { id: 'LEAVE003', type: 'Personal', from: '2025-06-15', to: '2025-06-16', days: 2, status: 'Rejected', details: 'Personal event' },
  ];

  // Mock attendance data
  const attendanceStatus = { today: 'Present', lastUpdated: '2025-08-06 09:00 AM' };
  const recentAttendance = [
    { date: '2025-08-05', status: 'Present', timeIn: '09:00 AM', timeOut: '05:00 PM' },
    { date: '2025-08-04', status: 'Present', timeIn: '08:45 AM', timeOut: '05:15 PM' },
    { date: '2025-08-03', status: 'Absent', timeIn: '-', timeOut: '-' },
  ];

  // Quick actions
  const quickActions = [
    { label: 'Submit Leave Request', icon: FileText, color: 'bg-orange-600 hover:bg-orange-700', to: '/employee/leave-application' },
    { label: 'View Payslip', icon: DollarSign, color: 'bg-green-600 hover:bg-green-700', to: '/payslip' },
    { label: 'Track Attendance', icon: Clock, color: 'bg-purple-600 hover:bg-purple-700', to: '/attendance' },
    { label: 'View PF', icon: PiggyBank, color: 'bg-pink-600 hover:bg-pink-700', to: '/pf' },
  ];

  const handleLeaveRequestDateRangeChange = useCallback(({ fromDate, toDate }) => {
    setLeaveRequestDateRange({ from: fromDate, to: toDate });
    // Mock filtering (replace with backend logic if needed)
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Welcome Section */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {employee.name}!
            </h1>
            <p className="text-gray-600 text-lg">View your leave balance, attendance, and more.</p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <p className="text-gray-600">Today's Date</p>
            <p className="text-xl font-semibold text-gray-900">
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* Leave Balance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {leaveBalance.map((leave, index) => {
          const Icon = leave.icon;
          return (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group relative"
              role="region"
              aria-label={`${leave.type} leave balance`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${leave.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className={`text-sm font-medium ${leave.textColor}`}>
                  {leave.remaining}/{leave.total}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{leave.type} Leave</h3>
              <p className="text-2xl font-bold text-gray-900">{leave.remaining} days</p>
              <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full mb-2">
                Remaining {leave.type.toLowerCase()} leave days
                <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                  <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Leave Requests */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Leave Requests</h2>
            <div className="w-64">
              <DatePicker
                type="date"
                fromDate={leaveRequestDateRange.from}
                toDate={leaveRequestDateRange.to}
                onFromDateChange={(date) => handleLeaveRequestDateRangeChange({ ...leaveRequestDateRange, from: date })}
                onToDateChange={(date) => handleLeaveRequestDateRangeChange({ ...leaveRequestDateRange, to: date })}
                labelFrom="From"
                labelTo="To"
              />
            </div>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentLeaveRequests.map((request, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                role="listitem"
              >
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <FileText className="text-white" size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{request.type} Leave ({request.id})</p>
                  <p className="text-gray-600 text-sm">
                    {request.from} to {request.to} ({request.days} days)
                  </p>
                  <p className="text-gray-500 text-xs">Status: {request.status} | {request.details}</p>
                </div>
                <NavLink
                  to={`/leave-application/${request.id}`}
                  className="text-indigo-600 text-sm hover:underline"
                  aria-label={`View details for leave request ${request.id}`}
                >
                  View
                </NavLink>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <NavLink
                  key={index}
                  to={action.to}
                  className={`p-4 ${action.color} rounded-lg text-white transition-colors duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${action.color.split('-')[1]}-500`}
                  aria-label={action.label}
                >
                  <Icon className="mx-auto mb-2" size={24} />
                  <span className="text-sm font-medium">{action.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* Attendance Status */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 p-6 mt-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Attendance Status</h2>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Status</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceStatus.today}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm">Last Updated</p>
              <p className="text-gray-900 font-medium">{attendanceStatus.lastUpdated}</p>
            </div>
          </div>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {recentAttendance.map((record, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              role="listitem"
            >
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Clock className="text-white" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{record.date}</p>
                <p className="text-gray-600 text-sm">Status: {record.status}</p>
                <p className="text-gray-500 text-xs">
                  Time In: {record.timeIn} | Time Out: {record.timeOut}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

