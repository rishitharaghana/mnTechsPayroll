import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, MapPin, User } from 'lucide-react';

const TimeTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [location, setLocation] = useState(null);
  const [isInGeofence, setIsInGeofence] = useState(false);
  const [marketingTeam] = useState(['EMP001', 'EMP002']); // Example: John and Sarah are marketing team

  useEffect(() => {
    let interval;
    if (isTracking) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  useEffect(() => {
    // Check geofence and start tracking for marketing team on site visit
    if (selectedEmployee && marketingTeam.includes(selectedEmployee) && location) {
      const siteGeofence = { lat: 37.7749, lng: -122.4194, radius: 100 }; // Example: San Francisco office
      const distance = calculateDistance(location.lat, location.lng, siteGeofence.lat, siteGeofence.lng);
      const inGeofence = distance <= siteGeofence.radius;
      setIsInGeofence(inGeofence);
      if (inGeofence && !isTracking) {
        setIsTracking(true); // Automatically start tracking when entering geofence
      } else if (!inGeofence && isTracking) {
        setIsTracking(false); // Pause tracking when leaving geofence
      }
    }
  }, [location, selectedEmployee, isTracking, marketingTeam]);

  useEffect(() => {
    // Request location updates
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const employees = [
    { id: 'EMP001', name: 'John Smith', status: 'online' },
    { id: 'EMP002', name: 'Sarah Wilson', status: 'online' },
    { id: 'EMP003', name: 'Mike Johnson', status: 'offline' },
    { id: 'EMP004', name: 'Emily Davis', status: 'online' },
  ];

  const timeEntries = [
    { employee: 'John Smith', date: '2024-01-15', loginTime: '09:00 AM', logoutTime: '06:00 PM', totalHours: '9h 0m', location: 'Office - Main Building', status: 'Completed' },
    { employee: 'Sarah Wilson', date: '2024-01-15', loginTime: '08:45 AM', logoutTime: '05:30 PM', totalHours: '8h 45m', location: 'Remote - Home Office', status: 'Completed' },
    { employee: 'Mike Johnson', date: '2024-01-15', loginTime: '09:15 AM', logoutTime: 'Active', totalHours: '7h 30m', location: 'Office - Design Lab', status: 'Active' },
    { employee: 'Emily Davis', date: '2024-01-15', loginTime: '09:00 AM', logoutTime: '06:15 PM', totalHours: '9h 15m', location: 'Office - HR Department', status: 'Completed' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Haversine formula to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Time Tracking System
        </h1>
        <p className="text-gray-600 mt-1">Track employee login/logout times and monitor working hours</p>
      </div>

      {/* Time Tracker Control */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6">
            <div className="text-4xl font-mono text-white">
              {formatTime(currentTime)}
            </div>
          </div>
          
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setIsTracking(!isTracking)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                isTracking 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg'
              }`}
            >
              {isTracking ? <Pause size={20} /> : <Play size={20} />}
              <span>{isTracking ? 'Pause' : 'Start'}</span>
            </button>
            <button
              onClick={() => {
                setIsTracking(false);
                setCurrentTime(0);
              }}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300"
            >
              <Square size={20} />
              <span>Stop</span>
            </button>
          </div>

          <div className="max-w-xs mx-auto">
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.id})
                </option>
              ))}
            </select>
          </div>
          {location && (
            <p className="mt-4 text-sm text-gray-600">
              Current Location: Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}{' '}
              {isInGeofence && <span className="text-green-600">(In Geofence)</span>}
            </p>
          )}
        </div>
      </div>

      {/* Employee Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {employees.map((employee) => (
          <div key={employee.id} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div className={`w-3 h-3 rounded-full ${
                employee.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{employee.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{employee.id}</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              employee.status === 'online' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {employee.status === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
        ))}
      </div>

      {/* Time Entries Table */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Time Entries</h2>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300">
                Export Report
              </button>
              <button className="px-4 py-2 bg-white/50 border border-gray-200 rounded-xl hover:bg-white/70 transition-all duration-200">
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Login Time</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logout Time</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {timeEntries.map((entry, index) => (
                <tr key={index} className="hover:bg-white/30 transition-all duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <User className="text-white" size={14} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{entry.employee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-green-500" />
                      <span className="text-sm text-gray-900">{entry.loginTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-red-500" />
                      <span className="text-sm text-gray-900">{entry.logoutTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{entry.totalHours}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{entry.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Google Maps Integration */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Employee Location Tracking</h2>
          <MapPin className="text-indigo-600" size={24} />
        </div>
        <div id="map" className="h-64 rounded-xl bg-gray-200">
          {/* Map will be rendered here with Google Maps API */}
        </div>
        {location && (
          <p className="mt-4 text-sm text-gray-600">
            Current Location: Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}{' '}
            {isInGeofence && <span className="text-green-600">(In Geofence)</span>}
          </p>
        )}
      </div>
    </div>
  );
};

export default TimeTracking;