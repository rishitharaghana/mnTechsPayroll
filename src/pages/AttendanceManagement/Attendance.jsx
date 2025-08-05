import React, { useState } from 'react';
import {
  Calendar, Clock, CheckCircle, XCircle, Users
} from 'lucide-react';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const attendanceData = [
    { id: 'EMP001', name: 'John Smith', department: 'Engineering', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', workingHours: '9h 0m', location: 'Office' },
    { id: 'EMP002', name: 'Sarah Wilson', department: 'Marketing', checkIn: '08:45 AM', checkOut: '05:30 PM', status: 'Present', workingHours: '8h 45m', location: 'Remote' },
    { id: 'EMP003', name: 'Mike Johnson', department: 'Design', checkIn: '-', checkOut: '-', status: 'Absent', workingHours: '0h 0m', location: '-' },
    { id: 'EMP004', name: 'Emily Davis', department: 'HR', checkIn: '09:15 AM', checkOut: '06:15 PM', status: 'Present', workingHours: '9h 0m', location: 'Office' },
    { id: 'EMP005', name: 'Robert Brown', department: 'Sales', checkIn: '10:00 AM', checkOut: '-', status: 'Late', workingHours: '6h 30m', location: 'Office' }
  ];

  const stats = [
    { title: 'Present Today', value: '198', total: '248', percentage: '80%', color: 'from-green-500 to-emerald-500', icon: CheckCircle },
    { title: 'Absent Today', value: '12', total: '248', percentage: '5%', color: 'from-red-500 to-pink-500', icon: XCircle },
    { title: 'Late Arrivals', value: '8', total: '248', percentage: '3%', color: 'from-yellow-500 to-orange-500', icon: Clock },
    { title: 'Remote Workers', value: '30', total: '248', percentage: '12%', color: 'from-blue-500 to-cyan-500', icon: Users }
  ];

  const getStatusColor = (status) => ({
    Present: 'bg-green-100 text-green-800',
    Absent: 'bg-red-100 text-red-800',
    Late: 'bg-yellow-100 text-yellow-800'
  }[status] || 'bg-gray-100 text-gray-800');

  const getLocationColor = (location) => ({
    Office: 'bg-blue-100 text-blue-800',
    Remote: 'bg-purple-100 text-purple-800'
  }[location] || 'bg-gray-100 text-gray-800');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Attendance Tracking
          </h1>
          <p className="text-gray-600 mt-1">Monitor employee attendance and working hours</p>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="text-gray-400" size={20} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-white/70 backdrop-blur-md border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ title, value, total, percentage, color, icon: Icon }, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">{percentage}</span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-xl font-bold text-gray-900">
              {value} <span className="text-sm text-gray-500">/ {total}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Today's Attendance</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Date: {new Date(selectedDate).toLocaleDateString()}</span>
            <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg">
              Export Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                {['Employee', 'Check In', 'Check Out', 'Working Hours', 'Status', 'Location'].map((header, i) => (
                  <th key={i} className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attendanceData.map(({ id, name, department, checkIn, checkOut, workingHours, status, location }) => (
                <tr key={id} className="hover:bg-white/30 transition">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{name}</div>
                      <div className="text-sm text-gray-500">{id} • {department}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{checkIn}</span>
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-900">{checkOut}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{workingHours}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLocationColor(location)}`}>
                      {location}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Attendance Overview</h2>
        <div className="grid grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
            const value = Math.floor(Math.random() * 20 + 180);
            const percentage = Math.random() * 40 + 60;

            return (
              <div key={day} className="text-center">
                <div className="text-sm font-medium text-gray-600 mb-2">{day}</div>
                <div className="space-y-2">
                  <div className="h-3 bg-green-200 rounded-full relative overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <div className="text-xs text-gray-500">{value}/248</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
