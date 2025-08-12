import React, { useState } from 'react';
import { MapPin, Clock, Calendar, ChevronRight, TrendingUp, MessageSquare } from 'lucide-react';

const EmployeeVisitHistory = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const visits = [
    {
      id: '1',
      date: '2024-01-15',
      project: 'Metro Shopping Complex',
      location: 'Downtown District, Block A',
      startTime: '09:30 AM',
      endTime: '02:15 PM',
      duration: '4h 45m',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-01-12',
      project: 'Riverside Office Tower',
      location: 'Business Park, Phase 2',
      startTime: '10:15 AM',
      endTime: '01:30 PM',
      duration: '3h 15m',
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-01-10',
      project: 'Green Valley Residentials',
      location: 'Suburban Area, Sector 5',
      startTime: '08:45 AM',
      endTime: '03:20 PM',
      duration: '6h 35m',
      status: 'completed'
    },
    {
      id: '4',
      date: '2024-01-08',
      project: 'Tech Hub Development',
      location: 'IT Corridor, Building C',
      startTime: '11:00 AM',
      endTime: '04:30 PM',
      duration: '5h 30m',
      status: 'completed'
    }
  ];

  const totalHours = visits.reduce((acc, visit) => {
    const [hours, minutes] = visit.duration.split('h ');
    const h = parseInt(hours);
    const m = parseInt(minutes.replace('m', ''));
    return acc + h + (m / 60);
  }, 0);

  return (
    <div className="space-y-6 relative">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { icon: <Calendar className="w-5 h-5 text-white" />, label: 'Total Visits', value: visits.length, bg: 'from-slate-700 to-slate-700' },
          { icon: <Clock className="w-5 h-5 text-white" />, label: 'Total Hours', value: `${totalHours.toFixed(1)}h`, bg: 'from-slate-700 to-slate-700' },
          { icon: <MapPin className="w-5 h-5 text-white" />, label: 'Locations', value: '8', bg: 'from-slate-700 to-slate-700' },
          { icon: <TrendingUp className="w-5 h-5 text-white" />, label: 'Avg Duration', value: `${(totalHours / visits.length).toFixed(1)}h`, bg: 'from-slate-700 to-slate-700' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${stat.bg} rounded-lg flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visit History List */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Site Visits</h3>
        <div className="space-y-3">
          {visits.map((visit, index) => (
            <div
              key={visit.id}
              className="group bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-slate-700 to-slate-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{visit.project}</h4>
                      <p className="text-teal-700 text-xs font-medium">{visit.location}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center space-x-2 bg-blue-50 rounded p-2">
                      <Calendar className="w-4 h-4 text-slate-700" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(visit.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-teal-700 text-[10px]">Visit Date</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-green-50 rounded p-2">
                      <Clock className="w-4 h-4 text-slate-700" />
                      <div>
                        <p className="font-medium text-gray-900">{visit.startTime} - {visit.endTime}</p>
                        <p className="text-teal-700 text-[10px]">Time Range</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-purple-50 rounded p-2">
                      <div className="w-4 h-4 bg-slate-700 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{visit.duration}</p>
                        <p className="text-slate-700 text-[10px]">Duration</p>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default EmployeeVisitHistory;
