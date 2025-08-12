import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Play, MessageCircle, History, Star, X } from 'lucide-react';
import EmployeeLiveTrack from '../../pages/timetracking/EmployeeLiveTrack';
import EmployeeVisitHistory from '../../pages/timetracking/EmployeeVisitHistory';
import EmployeeFeedback from '../../pages/timetracking/EmployeeFeedback';

const EmployeeTimeTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [trackingTime, setTrackingTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('tracking');

  const employee = {
    id: 'EMP001',
    name: 'John Davidson',
    employeeId: 'JD-2024-001',
    department: 'Project Management',
    avatar: 'JD'
  };

  useEffect(() => {
    let interval = null;
    if (isTracking) {
      interval = setInterval(() => {
        setTrackingTime(time => time + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const handleStartTracking = () => {
    setIsTracking(true);
    setTrackingTime(0);
    setStartTime(new Date());
    setCurrentLocation('Downtown Office Complex');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
      });
    }
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setCurrentLocation('');
    setStartTime(null);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Employee Profile Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-md border border-white/10 p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br bg-slate-700 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-md">
            {employee.avatar}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{employee.name}</h2>
            <p className="text-gray-600 text-sm">{employee.employeeId}</p>
            <p className="text-teal-700 font-medium text-sm">{employee.department}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full font-medium text-xs flex items-center border ${
              isTracking ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-1.5 ${
                isTracking ? 'bg-green-500' : 'bg-gray-400'
              }`}
            ></span>
            {isTracking ? 'On Site Visit' : 'Available'}
          </div>
        </div>

        {/* Quick Stats */}
        {isTracking && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-slate-700" />
              <div>
                <p className="text-base font-semibold text-blue-900">{formatTime(trackingTime)}</p>
                <p className="text-xs text-slate-700">Duration</p>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-100 flex items-center space-x-2">
              <Play className="w-5 h-5 text-slate-700" />
              <div>
                <p className="text-sm font-semibold text-green-900">
                  {startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-green-600">Start Time</p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-100 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs font-semibold text-purple-900">Live Tracking</p>
                <p className="text-xs text-purple-600">Active</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/10 p-1">
        <div className="flex space-x-1">
          {[
            { id: 'tracking', label: 'Live Tracking', icon: MapPin },
            { id: 'history', label: 'Visit History', icon: History },
            { id: 'feedback', label: 'Feedback', icon: Star },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex-1 py-2 px-4 rounded-lg text-xs font-medium flex items-center justify-center space-x-1 transition-all ${
                activeSection === id
                  ? 'bg-teal-700 text-white shadow'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Section Content */}
      {activeSection === 'tracking' && (
        <EmployeeLiveTrack
          isTracking={isTracking}
          trackingTime={trackingTime}
          startTime={startTime}
          currentLocation={currentLocation}
          onStartTracking={handleStartTracking}
          onStopTracking={handleStopTracking}
          formatTime={formatTime}
          formatDuration={formatDuration}
        />
      )}
      {activeSection === 'history' && <EmployeeVisitHistory />}
      {activeSection === 'feedback' && <EmployeeFeedback />}      
    </div>
  );
};

export default EmployeeTimeTracking;
