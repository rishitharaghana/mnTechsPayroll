import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Clock } from 'lucide-react';

const HolidayCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
    type: 'public',
    description: ''
  });

  const holidays = [
    { date: '2024-01-01', name: 'New Year\'s Day', type: 'public' },
    { date: '2024-01-15', name: 'Martin Luther King Jr. Day', type: 'public' },
    { date: '2024-02-14', name: 'Valentine\'s Day', type: 'optional' },
    { date: '2024-02-19', name: 'Presidents\' Day', type: 'public' },
    { date: '2024-03-17', name: 'St. Patrick\'s Day', type: 'optional' },
    { date: '2024-05-27', name: 'Memorial Day', type: 'public' },
    { date: '2024-07-04', name: 'Independence Day', type: 'public' },
    { date: '2024-09-02', name: 'Labor Day', type: 'public' },
    { date: '2024-10-14', name: 'Columbus Day', type: 'public' },
    { date: '2024-10-31', name: 'Halloween', type: 'optional' },
    { date: '2024-11-28', name: 'Thanksgiving Day', type: 'public' },
    { date: '2024-12-25', name: 'Christmas Day', type: 'public' }
  ];

  const leaveRequests = [
    { employee: 'John Smith', date: '2024-01-16', reason: 'Personal Leave', status: 'approved' },
    { employee: 'Sarah Wilson', date: '2024-01-17', reason: 'Sick Leave', status: 'pending' },
    { employee: 'Mike Johnson', date: '2024-01-18', reason: 'Vacation', status: 'approved' },
    { employee: 'Emily Davis', date: '2024-01-19', reason: 'Medical Appointment', status: 'approved' }
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const isHoliday = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return holidays.find(holiday => holiday.date === dateStr);
  };

  const hasLeaveRequest = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return leaveRequests.find(request => request.date === dateStr);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleAddHoliday = (e) => {
    e.preventDefault();
    // Add holiday logic here
    setShowAddHoliday(false);
    setNewHoliday({ name: '', date: '', type: 'public', description: '' });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-20 bg-gray-50 rounded-lg"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const holiday = isHoliday(day);
      const leaveRequest = hasLeaveRequest(day);
      const today = isToday(day);

      days.push(
        <div
          key={day}
          className={`h-20 p-2 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
            today 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
              : holiday 
              ? 'bg-gradient-to-r from-red-100 to-pink-100 border-red-200' 
              : leaveRequest
              ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200'
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className={`font-semibold text-sm ${today ? 'text-white' : 'text-gray-900'}`}>
            {day}
          </div>
          {holiday && (
            <div className="mt-1">
              <div className={`text-xs px-1 py-0.5 rounded ${
                holiday.type === 'public' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}>
                {holiday.type === 'public' ? 'Holiday' : 'Optional'}
              </div>
            </div>
          )}
          {leaveRequest && (
            <div className="mt-1">
              <div className={`text-xs px-1 py-0.5 rounded ${
                leaveRequest.status === 'approved' 
                  ? 'bg-green-500 text-white' 
                  : leaveRequest.status === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                Leave
              </div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const getHolidayTypeColor = (type) => {
    switch (type) {
      case 'public':
        return 'bg-red-100 text-red-800';
      case 'optional':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Holiday Calendar
          </h1>
          <p className="text-gray-600 mt-1">Manage holidays and employee leave requests</p>
        </div>
        <button
          onClick={() => setShowAddHoliday(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          <Plus size={20} />
          <span>Add Holiday</span>
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            →
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendar()}
        </div>
      </div>

      {/* Holiday List and Leave Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Holidays */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Holidays</h2>
          <div className="space-y-4">
            {holidays.slice(0, 6).map((holiday, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-indigo-600" size={20} />
                  <div>
                    <h3 className="font-medium text-gray-900">{holiday.name}</h3>
                    <p className="text-sm text-gray-600">{new Date(holiday.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHolidayTypeColor(holiday.type)}`}>
                  {holiday.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Leave Requests</h2>
          <div className="space-y-4">
            {leaveRequests.map((request, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <Clock className="text-indigo-600" size={20} />
                  <div>
                    <h3 className="font-medium text-gray-900">{request.employee}</h3>
                    <p className="text-sm text-gray-600">{request.reason} • {new Date(request.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Holiday Modal */}
      {showAddHoliday && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Holiday</h2>
              <button
                onClick={() => setShowAddHoliday(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddHoliday} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Holiday Name</label>
                <input
                  type="text"
                  required
                  value={newHoliday.name}
                  onChange={(e) => setNewHoliday({...newHoliday, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  required
                  value={newHoliday.date}
                  onChange={(e) => setNewHoliday({...newHoliday, date: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newHoliday.type}
                  onChange={(e) => setNewHoliday({...newHoliday, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="public">Public Holiday</option>
                  <option value="optional">Optional Holiday</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newHoliday.description}
                  onChange={(e) => setNewHoliday({...newHoliday, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Add Holiday
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddHoliday(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl hover:bg-gray-300 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayCalendar;