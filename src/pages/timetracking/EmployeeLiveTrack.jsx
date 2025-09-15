import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Clock, Play, Square, Navigation, Timer, Zap } from 'lucide-react';
import { startSiteVisit, endSiteVisit } from '../../redux/slices/siteVisitSlice';

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

const EmployeeLiveTrack = ({
  isTracking,
  trackingTime,
  startTime,
  currentLocation,
  formatTime,
  formatDuration,
}) => {
  const dispatch = useDispatch();
  const { currentVisit, locations, error } = useSelector((state) => state.siteVisit);
  const [siteName, setSiteName] = useState('');
  const [mapError, setMapError] = useState(null);
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);

  useEffect(() => {
    if (isTracking && currentVisit && mapRef.current) {
      loadGoogleMapsScript('YOUR_GOOGLE_MAPS_API_KEY')
        .then(() => {
          const latestLocation = locations.find(
            (loc) => loc.visitId === currentVisit.visit_id && loc.employeeId === currentVisit.employee_id
          );
          const coordinates = latestLocation
            ? { lat: latestLocation.latitude, lng: latestLocation.longitude }
            : { lat: 0, lng: 0 };

          if (coordinates.lat === 0 && coordinates.lng === 0) {
            setMapError('No valid location data available');
            return;
          }

          const map = new window.google.maps.Map(mapRef.current, {
            center: coordinates,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          new window.google.maps.Marker({
            position: coordinates,
            map,
            title: 'Current Location',
            icon: { url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' },
          });

          googleMapRef.current = map;

          if (latestLocation) {
            map.setCenter({ lat: latestLocation.latitude, lng: latestLocation.longitude });
          }
        })
        .catch((error) => {
          setMapError('Failed to load Google Maps. Please check your API key or network.');
        });
    }
  }, [isTracking, currentVisit, locations]);

  const handleStartTracking = () => {
    if (siteName.trim() && localStorage.getItem('locationConsent')) {
      dispatch(startSiteVisit({ site_name: siteName }));
    }
  };

  const handleStopTracking = () => {
    if (currentVisit) {
      dispatch(endSiteVisit({ visit_id: currentVisit.visit_id }));
    }
  };

  return (
    <div className="w-full grid lg:grid-cols-2 gap-6 relative">
      <div className="bg-white backdrop-blur-xl rounded-2xl shadow-md border-1 border-gray-200 p-4">
        <div className="text-center space-y-6">
          <div
            className={`mx-auto w-13 h-13 rounded-xl flex items-center justify-center transition-all duration-500 ${
              isTracking
                ? 'bg-gradient-to-br from-slate-700 to-slate-700 shadow-lg animate-pulse'
                : 'bg-gradient-to-br from-gray-400 to-gray-600 shadow'
            }`}
          >
            {isTracking ? (
              <Zap className="w-8 h-8 text-white" />
            ) : (
              <Timer className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {isTracking ? 'Live Tracking Active' : 'Start Site Visit'}
            </h3>
            <p className="text-gray-600 text-sm">
              {isTracking
                ? 'Your location is being monitored in real-time'
                : 'Begin tracking your site visit location and duration'}
            </p>
          </div>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Enter site name"
            className="w-full border rounded-lg p-2 text-sm"
            disabled={isTracking}
          />
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="text-3xl font-mono font-bold text-gray-900 mb-1">
              {formatTime(trackingTime)}
            </div>
            <p className="text-gray-600 text-xs">Active Duration</p>
            {startTime && (
              <p className="text-xs text-blue-600 mt-1">
                Started at {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          {!isTracking ? (
            <button
              onClick={handleStartTracking}
              disabled={!siteName.trim() || !localStorage.getItem('locationConsent')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 sm:py-4 px-5 rounded-xl font-semibold text-sm hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-md disabled:bg-gray-400"
            >
              <Play className="w-4 h-4 inline mr-2" />
              Start Live Tracking
            </button>
          ) : (
            <button
              onClick={handleStopTracking}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 px-6 rounded-xl font-semibold text-sm hover:from-red-600 hover:to-rose-700 transition-all transform hover:scale-105 shadow-md"
            >
              <Square className="w-4 h-4 inline mr-2" />
              End Site Visit
            </button>
          )}
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-md border-1 border-gray-200 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Live Location</h3>
            <div
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${
                isTracking
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}
              ></div>
              {isTracking ? 'Live' : 'Inactive'}
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm mb-0.5">
                  {currentLocation || 'Location not available'}
                </p>
                <p className="text-teal-700 text-xs">
                  {isTracking ? 'Updated just now' : 'Enable tracking to see location'}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`rounded-xl h-60 flex items-center justify-center border border-dashed transition-all duration-500 ${
              isTracking
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300'
                : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300'
            }`}
          >
            {isTracking && !mapError ? (
              <div ref={mapRef} className="h-full w-full"></div>
            ) : (
              <div className="text-center space-y-2">
                <div
                  className={`w-14 h-14 rounded-lg mx-auto flex items-center justify-center ${
                    isTracking ? 'bg-slate-700 shadow-lg' : 'bg-gray-400 shadow'
                  }`}
                >
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${isTracking ? 'text-slate-700' : 'text-gray-600'}`}>
                    {isTracking ? 'Live Map Tracking' : 'Map View'}
                  </p>
                  <p className={`text-xs ${isTracking ? 'text-slate-700' : 'text-gray-500'}`}>
                    {isTracking ? mapError || 'Real-time location monitoring active' : 'Start tracking to view live location'}
                  </p>
                </div>
              </div>
            )}
          </div>
          {isTracking && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-900">Live</p>
                  <p className="text-xs text-purple-600">Status</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-orange-900">{formatDuration(trackingTime)}</p>
                  <p className="text-xs text-orange-600">Duration</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeLiveTrack;