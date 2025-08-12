import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Clock, Download, ChevronDown, ChevronUp, Navigation, X } from 'lucide-react';

// LoadGoogleMapsScript function (unchanged)
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

const LiveTrackingTable = ({ searchTerm, filterStatus }) => {
  const [sortField, setSortField] = useState('startTime');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showLiveMap, setShowLiveMap] = useState(false);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  const trackingData = [
    {
      id: '1',
      employeeName: 'John Davidson',
      employeeId: 'JD-2024-001',
      date: '2024-01-15',
      startTime: '09:30 AM',
      location: 'Ameerpet',
      coordinates: { lat: 17.4375, lng: 78.4482 },
      duration: '2h 15m',
      status: 'online',
      project: 'Metro Shopping Complex',
      department: 'Project Management',
      lastUpdate: '2 minutes ago',
    },
    {
      id: '2',
      employeeName: 'Sarah Chen',
      employeeId: 'SC-2024-002',
      date: '2024-01-15',
      startTime: '08:15 AM',
      location: 'Banjara Hills',
      coordinates: { lat: 17.4108, lng: 78.4294 },
      duration: '4h 32m',
      status: 'online',
      project: 'Tech Hub Development',
      department: 'Engineering',
      lastUpdate: '5 minutes ago',
    },
    {
      id: '3',
      employeeName: 'Mike Johnson',
      employeeId: 'MJ-2024-003',
      date: '2024-01-15',
      startTime: '10:45 AM',
      endTime: '02:30 PM',
      location: 'Kollur',
      coordinates: { lat: 17.4071, lng: 78.3396 },
      duration: '3h 45m',
      status: 'offline',
      project: 'Riverside Office Tower',
      department: 'Quality Control',
      lastUpdate: '45 minutes ago',
    },
    {
      id: '4',
      employeeName: 'Emily Rodriguez',
      employeeId: 'ER-2024-004',
      date: '2024-01-15',
      startTime: '11:20 AM',
      location: 'Gachibowli',
      coordinates: { lat: 17.4401, lng: 78.3488 },
      duration: '1h 48m',
      status: 'online',
      project: 'Green Valley Residentials',
      department: 'Architecture',
      lastUpdate: '1 minute ago',
    },
    {
      id: '5',
      employeeName: 'David Kim',
      employeeId: 'DK-2024-005',
      date: '2024-01-15',
      startTime: '07:30 AM',
      endTime: '01:15 PM',
      location: 'Durgam Cheruvu',
      coordinates: { lat: 17.4305, lng: 78.3654 },
      duration: '5h 45m',
      status: 'offline',
      project: 'Industrial Park Phase 1',
      department: 'Safety Inspection',
      lastUpdate: '2 hours ago',
    },
    {
      id: '6',
      employeeName: 'Lisa Thompson',
      employeeId: 'LT-2024-006',
      date: '2024-01-15',
      startTime: '06:45 AM',
      location: 'Kondapur',
      coordinates: { lat: 17.4623, lng: 78.3559 },
      duration: '6h 12m',
      status: 'online',
      project: 'Coastal Development',
      department: 'Project Management',
      lastUpdate: '3 minutes ago',
    },
  ];

  const filteredData = trackingData.filter((data) => {
    const matchesSearch =
      data.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.project.toLowerCase().includes(searchTerm.toLowerCase());
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
            title: selectedEmployee.employeeName,
            icon: {
              url: selectedEmployee.status === 'online' ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
            },
          });

          googleMapRef.current = map;
        })
        .catch((error) => {
          console.error('Error loading Google Maps:', error);
        });
    }
  }, [showLiveMap, selectedEmployee]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden text-sm">
        {/* Table Header (unchanged) */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800">Live Tracking</h3>
          <button className="flex items-center space-x-1 px-3 py-1.5 bg-slate-700 text-white rounded-lg hover:bg-teal-700 text-xs transition">
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

        {/* Table (unchanged) */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Employee', 'Project & Location', 'Date', 'Start Time', 'End Time', 'Duration', 'Status', 'Actions'].map(
                  (header, index) => (
                    <th
                      key={index}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-100 transition"
                      onClick={() => handleSort(header.toLowerCase().replace(' & ', ''))}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{header}</span>
                        <SortIcon field={header.toLowerCase().replace(' & ', '')} />
                      </div>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedData.map((data) => (
                <tr key={data.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-slate-700 text-white rounded-lg flex items-center justify-center text-xs font-bold">
                        {data.employeeName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold text-gray-800">{data.employeeName}</div>
                        <div className="text-gray-500 text-xs">{data.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 truncate max-w-xs">
                    <div className="font-medium text-gray-800">{data.project}</div>
                    <div className="text-gray-500 text-xs truncate flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {data.location}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">{data.startTime}</td>
                  <td className="px-4 py-3">{data.endTime || <span className="text-teal-700 font-medium text-xs">Active</span>}</td>
                  <td className="px-4 py-3">{data.duration}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        data.status === 'online' ? 'bg-slate-200 text-teal-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {data.status === 'online' ? 'LIVE' : 'OFFLINE'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewMap(data)}
                      className={`text-xs font-medium ${
                        data.status === 'online' ? 'text-teal-700 hover:text-green-800' : 'text-gray-600 hover:text-gray-800'
                      } transition`}
                    >
                      {data.status === 'online' ? 'Live Map' : 'View Map'}
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
            {/* Modal Header */}
            <div className="bg-gradient-to-r bg-slate-700 text-white p-3 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white text-teal-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {selectedEmployee.employeeName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-semibold">{selectedEmployee.employeeName}</h3>
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
                  <p className="text-base font-bold text-slate-700">{selectedEmployee.duration}</p>
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
                  <p className="font-medium text-gray-800 text-sm">{selectedEmployee.location}</p>
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

export default LiveTrackingTable;