import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Clock, Phone, MessageCircle, Users, X, Navigation, Eye } from 'lucide-react';
import { fetchActiveSiteVisits } from '../../redux/slices/siteVisitSlice';

// Load Google Maps script
const loadGoogleMapsScript = (apiKey) => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Maps script loaded');
      resolve();
    };
    script.onerror = (error) => {
      console.error('Google Maps script failed to load:', error);
      reject(error);
    };
    document.head.appendChild(script);
  });
};

const EmployeeStatusCards = ({ searchTerm, filterStatus }) => {
  const dispatch = useDispatch();
  const { activeVisits, locations, loading, error } = useSelector((state) => state.siteVisit);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const [mapError, setMapError] = useState(null);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  useEffect(() => {
    dispatch(fetchActiveSiteVisits());
  }, [dispatch]);

  useEffect(() => {
    if (showLiveMap && selectedEmployee && mapRef.current) {
      if (selectedEmployee.coordinates.lat === 0 && selectedEmployee.coordinates.lng === 0) {
        setMapError('No valid location data available');
        return;
      }
      setMapError(null);
      loadGoogleMapsScript('YOUR_GOOGLE_MAPS_API_KEY')
        .then(() => {
          const map = new window.google.maps.Map(mapRef.current, {
            center: selectedEmployee.coordinates,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          new window.google.maps.Marker({
            position: selectedEmployee.coordinates,
            map,
            title: selectedEmployee.full_name,
            icon: {
              url: selectedEmployee.status === 'online'
                ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            },
          });

          googleMapRef.current = map;

          const latestLocation = locations.find(
            (loc) => loc.employeeId === selectedEmployee.employee_id && loc.visitId === selectedEmployee.visit_id
          );
          if (latestLocation) {
            map.setCenter({ lat: latestLocation.latitude, lng: latestLocation.longitude });
            new window.google.maps.Marker({
              position: { lat: latestLocation.latitude, lng: latestLocation.longitude },
              map,
              title: `${selectedEmployee.full_name} (Updated)`,
              icon: { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' },
            });
          }
        })
        .catch((error) => {
          setMapError('Failed to load Google Maps. Please check your API key or network.');
        });
    }
  }, [showLiveMap, selectedEmployee, locations]);

  const filteredEmployees = activeVisits.filter((emp) => {
    const matchesSearch =
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.site_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || (filterStatus === 'online' && locations.some((loc) => loc.employeeId === emp.employee_id && loc.visitId === emp.visit_id)) ||
      (filterStatus === 'offline' && !locations.some((loc) => loc.employeeId === emp.employee_id && loc.visitId === emp.visit_id));
    return matchesSearch && matchesFilter;
  });

  const onlineCount = activeVisits.filter((emp) =>
    locations.some((loc) => loc.employeeId === emp.employee_id && loc.visitId === emp.visit_id)
  ).length;
  const offlineCount = activeVisits.length - onlineCount;
  const totalActiveTime = activeVisits
    .filter((emp) => locations.some((loc) => loc.employeeId === emp.employee_id && loc.visitId === emp.visit_id))
    .reduce((acc, emp) => {
      const start = new Date(emp.start_time);
      const now = new Date();
      const diff = (now - start) / (1000 * 60 * 60);
      return acc + diff;
    }, 0);

  const handleViewLiveMap = (employee) => {
    const latestLocation = locations.find(
      (loc) => loc.employeeId === employee.employee_id && loc.visitId === employee.visit_id
    );
    setSelectedEmployee({
      ...employee,
      coordinates: latestLocation
        ? { lat: latestLocation.latitude, lng: latestLocation.longitude }
        : { lat: 0, lng: 0 },
      status: latestLocation ? 'online' : 'offline',
      currentLocation: latestLocation ? `${latestLocation.latitude.toFixed(4)}, ${latestLocation.longitude.toFixed(4)}` : employee.site_name,
      activeTime: formatDuration(new Date() - new Date(employee.start_time)),
      startTime: new Date(employee.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      lastUpdate: latestLocation ? new Date(latestLocation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
    });
    setShowLiveMap(true);
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-900">{activeVisits.length}</p>
              <p className="text-gray-600 text-xs font-medium">Total Employees</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-700 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-green-600">{onlineCount}</p>
              <p className="text-gray-600 text-xs font-medium">Currently Online</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-emerald-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-600">{offlineCount}</p>
              <p className="text-gray-600 text-xs font-medium">Currently Offline</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-700 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-900">{totalActiveTime.toFixed(1)}h</p>
              <p className="text-gray-600 text-xs font-medium">Total Active Time</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-teal-600 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Cards Grid */}
      {loading && <p className="p-4 text-gray-600">Loading...</p>}
      {error && <p className="p-4 text-red-600">Error: {error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
        {filteredEmployees.map((employee) => (
          <div key={employee.visit_id} className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/20 p-4 hover:shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {employee.full_name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{employee.full_name}</h3>
                  <p className="text-gray-600 text-xs">{employee.employee_id}</p>
                </div>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  locations.some((loc) => loc.employeeId === employee.employee_id && loc.visitId === employee.visit_id)
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${
                    locations.some((loc) => loc.employeeId === employee.employee_id && loc.visitId === employee.visit_id)
                      ? 'bg-green-500 animate-pulse'
                      : 'bg-gray-400'
                  }`}
                ></div>
                {locations.some((loc) => loc.employeeId === employee.employee_id && loc.visitId === employee.visit_id)
                  ? 'LIVE'
                  : 'OFFLINE'}
              </div>
            </div>
            <div className="mb-3">
              <p className="text-blue-600 font-medium text-xs bg-blue-50 px-2 py-1 rounded-lg inline-block">
                {employee.department || 'N/A'}
              </p>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex items-start space-x-2 bg-gray-50 rounded-lg p-2">
                <MapPin className="w-4 h-4 text-slate-700 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-xs">{employee.site_name}</p>
                  <p className="text-blue-600 text-xs font-medium mt-1">{employee.site_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div className="flex-1">
                  {locations.some((loc) => loc.employeeId === employee.employee_id && loc.visitId === employee.visit_id) ? (
                    <div>
                      <p className="font-medium text-gray-900 text-xs">
                        Active for {formatDuration(new Date() - new Date(employee.start_time))}
                      </p>
                      <p className="text-green-600 text-xs">
                        Started at {new Date(employee.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-xs">Last seen N/A</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewLiveMap(employee)}
                className={`flex-1 ${
                  locations.some((loc) => loc.employeeId === employee.employee_id && loc.visitId === employee.visit_id)
                    ? 'bg-gradient-to-r from-slate-700 to-slate-700 text-white'
                    : 'bg-gray-100 text-gray-600'
                } py-2 px-3 rounded-lg text-xs font-medium hover:from-teal-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center space-x-1`}
              >
                <Eye className="w-3 h-3" />
                <span>{locations.some((loc) => loc.employeeId === employee.employee_id && loc.visitId === employee.visit_id) ? 'View Live' : 'Last Location'}</span>
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200">
                <Phone className="w-3 h-3 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all duration-200">
                <MessageCircle className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Map Modal */}
      {showLiveMap && selectedEmployee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-700 text-white p-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white text-teal-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {selectedEmployee.full_name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-semibold">{selectedEmployee.full_name}</h3>
                  <p className="text-xs text-green-100">{selectedEmployee.employee_id}</p>
                </div>
              </div>
              <button onClick={() => setShowLiveMap(false)} className="hover:bg-white/20 p-1 rounded-full transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {mapError ? (
                <p className="text-red-600 text-sm text-center">{mapError}</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-base font-bold text-slate-700">{selectedEmployee.activeTime}</p>
                      <p className="text-xs text-slate-700 flex items-center justify-center">
                        <Clock className="w-3 h-3 mr-1" /> Duration
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-base font-bold text-slate-700">{selectedEmployee.startTime}</p>
                      <p className="text-xs text-slate-700 flex items-center justify-center">
                        <Clock className="w-3 h-3 mr-1" /> Start Time
                      </p>
                    </div>
                  </div>
                  <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200 shadow">
                    {selectedEmployee.coordinates.lat !== 0 && selectedEmployee.coordinates.lng !== 0 ? (
                      <div ref={mapRef} className="h-full w-full"></div>
                    ) : (
                      <p className="h-full w-full flex items-center justify-center text-gray-500">
                        No location data available
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Navigation className="w-4 h-4 text-slate-700" />
                      <p className="font-medium text-gray-800 text-sm">{selectedEmployee.currentLocation}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedEmployee.status === 'online'
                        ? `Live Location (Updated ${selectedEmployee.lastUpdate})`
                        : `Last Known Location (Updated ${selectedEmployee.lastUpdate})`}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeStatusCards;