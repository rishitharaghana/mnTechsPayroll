import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import PageBreadcrumb from '../../Components/common/PageBreadcrumb';
import PageMeta from '../../Components/common/PageMeta';
import { Link } from 'react-router-dom';

const CalendarIntegration = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [events, setEvents] = useState({});
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user info');
      const user = await res.json();
      setUserInfo(user);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch user info:', err);
    }
  };

  const fetchCalendarEvents = async (token) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Failed to fetch calendar events');
      const data = await res.json();
      const formattedEvents = {};
      (data.items || []).forEach((event) => {
        const date = event.start.date || event.start.dateTime?.split('T')[0];
        if (date && !formattedEvents[date]) {
          formattedEvents[date] = [];
        }
        if (date) {
          formattedEvents[date].push({
            name: event.summary || 'No Title',
            startTime: event.start.dateTime || event.start.date,
            endTime: event.end.dateTime || event.end.date,
            isHoliday: event.summary?.toLowerCase().includes('holiday'),
          });
        }
      });
      setEvents(formattedEvents);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error('Failed to fetch calendar events:', err);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setToken(tokenResponse.access_token);
      fetchUserInfo(tokenResponse.access_token);
      fetchCalendarEvents(tokenResponse.access_token);
    },
    onError: (err) => {
      setError('Google authentication failed');
      console.error('Google login failed:', err);
    },
    scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile',
    clientId: 'https://www.googleapis.com/auth/userinfo.profile', // Replace with your actual web client ID
  });

  const generateDates = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const dates = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dates.push({ date: dateKey, events: events[dateKey] || [] });
    }
    return dates;
  };

  // Optional: Function to get holidays for integration with payroll/attendance
  const getHolidays = () => {
    const holidays = [];
    Object.keys(events).forEach((date) => {
      events[date].forEach((event) => {
        if (event.isHoliday) {
          holidays.push({ date, name: event.name });
        }
      });
    });
    return holidays;
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="w-78/100">
      <div className="flex justify-end">
        <PageBreadcrumb
        items={[
          {label:'Dashboard', link:'/'},
          {label: 'Calendar Integration', link: '/admin/calendar'},
        ]}
        />
        <PageMeta title="Calendar Integration" />
      </div>
    <div className="space-y-8 bg-white rounded-2xl p-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center">
              <CalendarIcon size={24} className="text-slate-400 mr-2" />
              Holiday Calendar
            </h1>
            <p className="text-slate-500 text-lg mt-1">
              View Google Calendar events and holidays
            </p>
          </div>
          {userInfo && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">Signed in as: {userInfo.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-600 rounded-lg">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        {userInfo ? (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
                aria-label="Select Year"
              >
                {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-900"
                aria-label="Select Month"
              >
                {months.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>

            {/* Events */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading ? (
                <p className="text-center text-slate-500 text-lg">Loading events...</p>
              ) : generateDates().length === 0 ? (
                <p className="text-center text-slate-500 text-lg">No days available for this month</p>
              ) : (
                generateDates().map((item) => (
                  <div
                    key={item.date}
                    className="mb-4 p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-slate-900">{item.date}</h3>
                    {item.events.length > 0 ? (
                      item.events.map((event, index) => (
                        <div
                          key={index}
                          className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <p className="text-sm font-medium text-slate-900">
                            {event.name} {event.isHoliday && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">
                                Holiday
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500">
                            {event.startTime} - {event.endTime}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic mt-2">No events</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <button
            onClick={() => login()}
            className="w-full sm:w-auto px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105"
          >
            Sign in with Google
          </button>
        )}
      </div>
      </div>
    </div>
  );
};

export default CalendarIntegration;