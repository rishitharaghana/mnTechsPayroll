import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, Clock, Download, ChevronDown, ChevronUp, Navigation, X } from 'lucide-react';
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

const LiveTrackingTable = ({ searchTerm, filterStatus }) => {
  const dispatch = useDispatch();
  const { activeVisits, locations, loading, error } = useSelector((state) => state.siteVisit);
  const [sortField, setSortField] = useState('start_time');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const [mapError, setMapError] = useState(null);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  // Fetch active site visits on mount
  useEffect(() => {
    dispatch(fetchActiveSiteVisits());
  }, [dispatch]);

  // Initialize Google Maps when modal opens
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

          // Update map with latest location
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

  // Filter and sort data
  const filteredData = activeVisits.filter((data) => {
    const matchesSearch =
      data.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.site_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || data.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleViewMap = (employee) => {
    const latestLocation = locations.find(
      (loc) => loc.employeeId === employee.employee_id && loc.visitId === employee.visit_id
    );
    setSelectedEmployee({
      ...employee,
      coordinates: latestLocation
        ? { lat: latestLocation.latitude, lng: latestLocation.longitude }
        : { lat: 0, lng: 0 },
      status: latestLocation ? 'online' : 'offline',
    });
    setShowLiveMap(true);
  };

  const formatDuration = (startTime) => {
    if (!startTime) return '0m';
    const start = new Date(startTime);
    const now = new Date();
    const diff = now - start;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = 'Employee ID,Full Name,Site Name,Date,Start Time,End Time,Duration,Status\n';
    const csv = headers + sortedData.map((data) =>
      `${data.employee_id},${data.full_name},${data.site_name},${new Date(data.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })},${new Date(data.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })},${data.end_time ? new Date(data.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Active'},${formatDuration(data.start_time)},${locations.some((loc) => loc.employeeId === data.employee_id && loc.visitId === data.visit_id) ? 'LIVE' : 'OFFLINE'}`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site_visits.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/20 overflow-hidden text-sm">
        {loading && <p className="p-4 text-gray-600">Loading...</p>}
        {error && <p className="p-4 text-red-600">Error: {error}</p>}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800">Live Tracking</h3>
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-teal-700 hover:to-teal-700 text-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Employee', 'Project & Location', 'Date', 'Start Time', 'End Time', 'Duration', 'Status', 'Actions'].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => handleSort(header.toLowerCase().replace(' & ', '').replace(' ', '_'))}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{header}</span>
                        <SortIcon field={header.toLowerCase().replace(' & ', '').replace(' ', '_')} />
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedData.map((data) => (
                <tr key={data.visit_id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                        {data.full_name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold text-gray-800">{data.full_name}</div>
                        <div className="text-gray-500 text-xs">{data.employee_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 truncate max-w-xs">
                    <div className="font-medium text-gray-800">{data.site_name}</div>
                    <div className="text-gray-500 text-xs truncate flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {data.site_name}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(data.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(data.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    {data.end_time ? (
                      new Date(data.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                    ) : (
                      <span className="text-teal-700 font-medium text-xs">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{formatDuration(data.start_time)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        locations.some((loc) => loc.employeeId === data.employee_id && loc.visitId === data.visit_id)
                          ? 'bg-green-200 text-teal-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {locations.some((loc) => loc.employeeId === data.employee_id && loc.visitId === data.visit_id)
                        ? 'LIVE'
                        : 'OFFLINE'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewMap(data)}
                      className={`text-xs font-medium ${
                        locations.some((loc) => loc.employeeId === data.employee_id && loc.visitId === data.visit_id)
                          ? 'text-teal-700 hover:text-teal-800'
                          : 'text-gray-600 hover:text-gray-800'
                      } transition`}
                    >
                      {locations.some((loc) => loc.employeeId === data.employee_id && loc.visitId === data.visit_id)
                        ? 'Live Map'
                        : 'View Map'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Map Modal */}
      {showLiveMap && selectedEmployee && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white text-teal-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {selectedEmployee.full_name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-semibold">{selectedEmployee.full_name}</h3>
                  <p className="text-xs text-teal-100">{selectedEmployee.employee_id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowLiveMap(false)}
                className="hover:bg-white/20 p-1 rounded-full transition"
              >
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
                      <p className="text-base font-bold text-gray-800">{formatDuration(selectedEmployee.start_time)}</p>
                      <p className="text-xs text-gray-700 flex items-center justify-center">
                        <Clock className="w-3 h-3 mr-1" /> Duration
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-base font-bold text-gray-800">
                        {new Date(selectedEmployee.start_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-gray-700 flex items-center justify-center">
                        <Clock className="w-3 h-3 mr-1" /> Start Time
                      </p>
                    </div>
                  </div>
                  <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200 shadow">
                    {selectedEmployee.coordinates.lat !== 0 && selectedEmployee.coordinates.lng !== 0 ? (
<div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200 shadow">
  {selectedEmployee.coordinates.lat !== 0 && selectedEmployee.coordinates.lng !== 0 ? (
    <iframe
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${
        selectedEmployee.coordinates.lng - 0.01
      },${selectedEmployee.coordinates.lat - 0.01},${
        selectedEmployee.coordinates.lng + 0.01
      },${selectedEmployee.coordinates.lat + 0.01}&layer=mapnik&marker=${
        selectedEmployee.coordinates.lat
      },${selectedEmployee.coordinates.lng}`}
      width="100%"
      height="100%"
      style={{ border: 'none' }}
    />
  ) : (
    <p className="h-full w-full flex items-center justify-center text-gray-500">
      No location data available
    </p>
  )}
</div>                    ) : (
                      <p className="h-full w-full flex items-center justify-center text-gray-500">
                        No location data available
                      </p>
                    )}
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Navigation className="w-4 h-4 text-teal-700" />
                      <p className="font-medium text-gray-800 text-sm">{selectedEmployee.site_name}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedEmployee.status === 'online'
                        ? `Live Location (Updated ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })})`
                        : `Last Known Location`}
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

export default LiveTrackingTable;