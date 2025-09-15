import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Clock, Calendar, ChevronRight, TrendingUp } from 'lucide-react';
import { fetchVisitHistory } from '../../redux/slices/siteVisitSlice';

const EmployeeVisitHistory = () => {
  const dispatch = useDispatch();
  const { visits = [], loading, error } = useSelector((state) => state.siteVisit);

  useEffect(() => {
    dispatch(fetchVisitHistory());
  }, [dispatch]);

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const totalHours = visits.reduce((acc, visit) => {
    if (visit.end_time) {
      const start = new Date(visit.start_time);
      const end = new Date(visit.end_time);
      const diff = (end - start) / (1000 * 60 * 60);
      return acc + diff;
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {loading && <p className="p-4 text-gray-600 text-center">Loading...</p>}
      {error && <p className="p-4 text-red-600 text-center">Error: {error}</p>}
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Calendar className="w-5 h-5 text-white" />, label: 'Total Visits', value: visits.length, bg: 'from-slate-700 to-slate-700' },
          { icon: <Clock className="w-5 h-5 text-white" />, label: 'Total Hours', value: `${totalHours.toFixed(1)}h`, bg: 'from-slate-700 to-slate-700' },
          { icon: <MapPin className="w-5 h-5 text-white" />, label: 'Locations', value: new Set(visits.map((v) => v.site_name)).size, bg: 'from-slate-700 to-slate-700' },
          { icon: <TrendingUp className="w-5 h-5 text-white" />, label: 'Avg Duration', value: visits.length ? `${(totalHours / visits.length).toFixed(1)}h` : '0h', bg: 'from-slate-700 to-slate-700' },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-gray-100 p-4 sm:p-5"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${stat.bg} rounded-lg flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-base sm:text-lg font-semibold text-gray-900">{stat.value}</p>
                <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Site Visits Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-gray-200 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Recent Site Visits</h3>
        <div className="space-y-3">
          {visits.map((visit, index) => (
            <div
              key={visit.id}
              className="group bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between flex-col sm:flex-row">
                <div className="flex-1 w-full">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-slate-700 to-slate-700 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{visit.site_name}</h4>
                      <p className="text-teal-700 text-xs sm:text-sm font-medium">{visit.site_name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                    <div className="flex items-center space-x-2 bg-blue-50 rounded p-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(visit.start_time).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-teal-700 text-[10px] sm:text-xs">Visit Date</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-50 rounded p-2">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(visit.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                          {visit.end_time
                            ? new Date(visit.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Active'}
                        </p>
                        <p className="text-teal-700 text-[10px] sm:text-xs">Time Range</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-purple-50 rounded p-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-slate-700 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {visit.end_time ? formatDuration(new Date(visit.end_time) - new Date(visit.start_time)) : 'Active'}
                        </p>
                        <p className="text-slate-700 text-[10px] sm:text-xs">Duration</p>
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-blue-500 transition-colors mt-2 sm:mt-0 sm:ml-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeVisitHistory;