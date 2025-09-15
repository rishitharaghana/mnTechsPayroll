
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Clock, Play, History, Star } from 'lucide-react';
import { initializeWebSocket } from '../../redux/slices/siteVisitSlice';
import EmployeeLiveTrack from './EmployeeLiveTrack';
import EmployeeVisitHistory from './EmployeeVisitHistory';
// import EmployeeFeedback from '../timetracking/EmployeeFeedback';
import PageBreadcrumb from './../../Components/common/PageBreadcrumb';
import PageMeta from './../../Components/common/PageMeta';

const EmployeeTimeTracking = () => {
  const dispatch = useDispatch();
  const { currentVisit, locations, error } = useSelector((state) => state.siteVisit);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingTime, setTrackingTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('');
  const [activeSection, setActiveSection] = useState('tracking');
  const [showConsent, setShowConsent] = useState(!localStorage.getItem('locationConsent'));

  const employee = {
    id: 'EMP001',
    name: 'John Davidson',
    employeeId: 'JD-2024-001',
    department: 'Project Management',
    avatar: 'JD',
  };

  useEffect(() => {
    dispatch(initializeWebSocket());
  }, [dispatch]);

  useEffect(() => {
    let interval = null;
    if (isTracking) {
      interval = setInterval(() => {
        setTrackingTime((time) => time + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  useEffect(() => {
    if (currentVisit) {
      setIsTracking(true);
      setStartTime(new Date(currentVisit.start_time));
      const latestLocation = locations.find(
        (loc) => loc.visitId === currentVisit.visit_id && loc.employeeId === employee.id
      );
      setCurrentLocation(
        latestLocation
          ? `${latestLocation.latitude.toFixed(4)}, ${latestLocation.longitude.toFixed(4)}`
          : currentVisit.site_name || 'Location not available'
      );
      const start = new Date(currentVisit.start_time);
      const now = new Date();
      setTrackingTime(Math.floor((now - start) / 1000));
    } else {
      setIsTracking(false);
      setCurrentLocation('');
      setStartTime(null);
      setTrackingTime(0);
    }
  }, [currentVisit, locations, employee.id]);

  const handleConsent = () => {
    localStorage.setItem('locationConsent', 'true');
    setShowConsent(false);
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
    <div className="w-full mt-4 sm:mt-0">
      <div className="hidden sm:flex sm:justify-end sm:items-center ">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Time Tracking", link: "/employee/emp-timetracking" },
          ]}
        />
        <PageMeta title="Time Tracking" description="Track your employee's time and location" />
      </div>
    <div className="space-y-6 bg-white rounded-2xl p-6">
      {/* Consent Modal */}
      {showConsent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900">Location Tracking Consent</h3>
            <p className="text-sm text-gray-600 mt-2">
              Allow location tracking for site visits? This will share your location with your employer.
            </p>
            <button
              onClick={handleConsent}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 rounded-lg hover:from-teal-700 hover:to-teal-700"
            >
              Agree
            </button>
          </div>
        </div>
      )}

      {/* Employee Profile Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-md border-1 border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="w-13 sm:w-16 h-13 sm:h-16 bg-gradient-to-br from-slate-700 to-slate-700 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-md">
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
              className={`w-2 h-2 rounded-full mr-1.5 ${isTracking ? 'bg-green-500' : 'bg-gray-400'}`}
            ></span>
            {isTracking ? 'On Site Visit' : 'Available'}
          </div>
        </div>
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
                <p className="text-xs font-semibold text-purple-900">{currentLocation}</p>
                <p className="text-xs text-purple-600">Live Location</p>
              </div>
            </div>
          </div>
        )}
        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border-1 border-gray-200 p-1">
        <div className="flex space-x-1">
          {[
            { id: 'tracking', label: 'Live Tracking', icon: MapPin },
            { id: 'history', label: 'Visit History', icon: History },
            // { id: 'feedback', label: 'Feedback', icon: Star },
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

      {activeSection === 'tracking' && (
        <EmployeeLiveTrack
          isTracking={isTracking}
          trackingTime={trackingTime}
          startTime={startTime}
          currentLocation={currentLocation}
          formatTime={formatTime}
          formatDuration={formatDuration}
        />
      )}
      {activeSection === 'history' && <EmployeeVisitHistory />}
      {/* {activeSection === 'feedback' && <EmployeeFeedback />} */}
    </div>
    </div>
  );
};

export default EmployeeTimeTracking;