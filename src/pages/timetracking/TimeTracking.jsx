import React, { useState } from 'react';
import { Users, MapPin, Search, Download } from 'lucide-react';
import EmployeeStatusCards from '../../pages/timetracking/EmployeeStatusCards';
import LiveTrackingTable from '../../pages/timetracking/LiveTrackingTable';

const TimeTracking = () => {
  const [activeView, setActiveView] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <div className="space-y-4">
      {/* Card 1: Header + Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/20 p-4 space-y-4">
        {/* Title */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Time Tracking Dashboard</h2>
            <p className="text-gray-600 text-xs">
              Real-time employee site visit tracking and location monitoring
            </p>
          </div>

          {/* Search, Filter, Export */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-teal-700 w-full sm:w-48"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>

            {/* Export */}
            <button className="flex items-center justify-center space-x-1 px-3 py-2 text-xs bg-gradient-to-r text-white bg-slate-700 rounded-lg hover:from-teal-700 hover:to-teal-700 transition-all duration-300 shadow">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex space-x-1 bg-white/80 rounded-xl backdrop-blur-xl shadow-md border border-white/10 p-1">  
          <button
            onClick={() => setActiveView('overview')}
            className={`flex-1 py-2 rounded-md text-xs font-medium flex items-center justify-center space-x-1 ${
              activeView === 'overview'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveView('tracking')}
            className={`flex-1 py-2 rounded-md text-xs font-medium flex items-center justify-center space-x-1 ${
              activeView === 'tracking'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Tracking</span>
          </button>
        </div>
      </div>

      {/* Card 2: Data Display */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/20 p-4">
        {activeView === 'overview' && (
          <EmployeeStatusCards searchTerm={searchTerm} filterStatus={filterStatus} />
        )}
        {activeView === 'tracking' && (
          <LiveTrackingTable searchTerm={searchTerm} filterStatus={filterStatus} />
        )}
      </div>
    </div>
  );
};

export default TimeTracking;
