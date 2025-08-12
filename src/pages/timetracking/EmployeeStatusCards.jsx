import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Phone, MessageCircle, Users, X, Navigation, Eye } from 'lucide-react';

// LoadGoogleMapsScript function
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
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const EmployeeStatusCards = ({ searchTerm, filterStatus }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  const employees = [
    {
      id: '1',
      name: 'John Davidson',
      employeeId: 'JD-2024-001',
      department: 'Project Management',
      status: 'online',
      currentLocation: 'Metro Shopping Complex, Downtown',
      coordinates: { lat: 17.4375, lng: 78.4482 },
      activeTime: '2h 15m',
      startTime: '09:30 AM',
      project: 'Metro Shopping Complex',
      phone: '+1-555-0123',
      email: 'john.davidson@company.com',
      lastUpdate: '2 minutes ago',
    },
    {
      id: '2',
      name: 'Sarah Chen',
      employeeId: 'SC-2024-002',
      department: 'Engineering',
      status: 'online',
      currentLocation: 'Tech Hub Development, IT Corridor',
      coordinates: { lat: 17.4108, lng: 78.4294 },
      activeTime: '4h 32m',
      startTime: '08:15 AM',
      project: 'Tech Hub Development',
      phone: '+1-555-0124',
      email: 'sarah.chen@company.com',
      lastUpdate: '5 minutes ago',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      employeeId: 'MJ-2024-003',
      department: 'Quality Control',
      status: 'offline',
      lastSeen: '45 minutes ago',
      currentLocation: 'Riverside Office Tower',
      coordinates: { lat: 17.4071, lng: 78.3396 },
      phone: '+1-555-0125',
      email: 'mike.johnson@company.com',
      lastUpdate: '45 minutes ago',
    },
  ];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const onlineCount = employees.filter(emp => emp.status === 'online').length;
  const offlineCount = employees.filter(emp => emp.status === 'offline').length;
  const totalActiveTime = employees
    .filter(emp => emp.status === 'online' && emp.activeTime)
    .reduce((acc, emp) => {
      const [hours, minutes] = emp.activeTime.split('h ');
      const h = parseInt(hours);
      const m = parseInt(minutes.replace('m', ''));
      return acc + h + (m / 60);
    }, 0);

  const handleViewLiveMap = (employee) => {
    setSelectedEmployee(employee);
    setShowLiveMap(true);
  };

  useEffect(() => {
    if (showLiveMap && selectedEmployee && mapRef.current) {
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
            title: selectedEmployee.name,
            icon: {
              url: selectedEmployee.status === 'online'
                ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            },
          });

          googleMapRef.current = map;
        })
        .catch((error) => {
          console.error('Error loading Google Maps:', error);
        });
    }
  }, [showLiveMap, selectedEmployee]);

  return (
    <>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-gray-900">{employees.length}</p>
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
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/20 p-4 hover:shadow-lg hover:scale-105 transition-all duration-300">
            {/* Employee Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{employee.name}</h3>
                  <p className="text-gray-600 text-xs">{employee.employeeId}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                employee.status === 'online'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${
                  employee.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                {employee.status === 'online' ? 'LIVE' : 'OFFLINE'}
              </div>
            </div>

            {/* Department */}
            <div className="mb-3">
              <p className="text-blue-600 font-medium text-xs bg-blue-50 px-2 py-1 rounded-lg inline-block">
                {employee.department}
              </p>
            </div>

            {/* Location & Time Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-start space-x-2 bg-gray-50 rounded-lg p-2">
                <MapPin className="w-4 h-4 text-slate-700 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-xs">
                    {employee.currentLocation}
                  </p>
                  {employee.project && (
                    <p className="text-blue-600 text-xs font-medium mt-1">{employee.project}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div className="flex-1">
                  {employee.status === 'online' ? (
                    <div>
                      <p className="font-medium text-gray-900 text-xs">
                        Active for {employee.activeTime}
                      </p>
                      <p className="text-green-600 text-xs">
                        Started at {employee.startTime}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-xs">
                      Last seen {employee.lastSeen}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {employee.status === 'online' ? (
                <button
                  onClick={() => handleViewLiveMap(employee)}
                  className="flex-1 bg-gradient-to-r from-slate-700 to-slate-700 text-white py-2 px-3 rounded-lg text-xs font-bold hover:from-teal-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center space-x-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>View Live</span>
                </button>
              ) : (
                <button
                  onClick={() => handleViewLiveMap(employee)}
                  className="flex-1 bg-gray-100 text-gray-600 py-2 px-3 rounded-lg text-xs font-medium"
                >
                  Last Location
                </button>
              )}
              
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
            {/* Modal Header */}
            <div className="bg-gradient-to-r bg-slate-700 text-white p-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white text-teal-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {selectedEmployee.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-semibold">{selectedEmployee.name}</h3>
                  <p className="text-xs text-green-100">{selectedEmployee.employeeId}</p>
                </div>
              </div>
              <button onClick={() => setShowLiveMap(false)} className="hover:bg-white/20 p-1 rounded-full transition">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3">
              {/* Time Section */}
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

              {/* Map Container */}
              <div className="h-55 w-full rounded-lg overflow-hidden border border-gray-200 shadow">
                <div ref={mapRef} className="h-full w-full"></div>
              </div>

              {/* Location Info */}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeStatusCards;