import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import DatePicker from '../../Components/ui/date/DatePicker';
import PageMeta from '../../Components/common/PageMeta';
import PageBreadcrumb from '../../Components/common/PageBreadcrumb';
import { fetchAllAttendance, updateAttendanceStatus, clearState } from '../../redux/slices/attendanceSlice';
import { format, parse, isValid } from 'date-fns';

const Attendance = () => {
  const dispatch = useDispatch();
  const { submissions, loading, error, successMessage } = useSelector((state) => state.attendance);

  // ✅ Keep Date object in state
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000); // IST offset
    return istDate;
  });

  const formattedDate = format(selectedDate, 'yyyy-MM-dd'); // string for comparisons

  const userToken = localStorage.getItem('userToken');
  const user = userToken ? JSON.parse(userToken) : null;
  const userRole = user?.role;

  useEffect(() => {
    if (['super_admin', 'hr', 'dept_head'].includes(userRole)) {
      dispatch(fetchAllAttendance());
    }
    return () => {
      dispatch(clearState());
    };
  }, [dispatch, userRole]);

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      dispatch(clearState());
    }
    if (error) {
      alert(error);
      dispatch(clearState());
    }
  }, [successMessage, error, dispatch]);

  const handleStatusUpdate = (id, status) => {
    dispatch(updateAttendanceStatus({ id, status }));
  };

  const getStatusColor = (status) =>
    ({
      Pending: 'bg-blue-100 text-blue-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
    }[status] || 'bg-slate-100 text-slate-800');

  const getLocationColor = (location) =>
    ({
      Office: 'bg-blue-100 text-blue-800',
      Remote: 'bg-purple-100 text-purple-800',
    }[location] || 'bg-slate-100 text-slate-800');

  const normalizeDate = (isoDate) => {
    try {
      const date = parse(isoDate, 'yyyy-MM-dd', new Date());
      if (!isValid(date)) return '';
      const istDate = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
      return format(istDate, 'yyyy-MM-dd');
    } catch {
      return '';
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const normalizedSubmissionDate = normalizeDate(submission.date);
    return (
      normalizedSubmissionDate === formattedDate &&
      normalizedSubmissionDate !== '' &&
      (userRole === 'dept_head' ? submission.recipient === 'hr' : submission.recipient === userRole)
    );
  });

  const stats = [
    {
      title: 'Present Today',
      value: filteredSubmissions.filter((s) => s.status === 'Approved').length,
      total: filteredSubmissions.length,
      percentage: filteredSubmissions.length
        ? ((filteredSubmissions.filter((s) => s.status === 'Approved').length / filteredSubmissions.length) * 100).toFixed(1) + '%'
        : '0%',
      color: 'bg-gradient-to-r from-teal-600 to-slate-700',
      icon: CheckCircle,
    },
    {
      title: 'Absent Today',
      value: filteredSubmissions.filter((s) => s.status === 'Rejected').length,
      total: filteredSubmissions.length,
      percentage: filteredSubmissions.length
        ? ((filteredSubmissions.filter((s) => s.status === 'Rejected').length / filteredSubmissions.length) * 100).toFixed(1) + '%'
        : '0%',
      color: 'bg-gradient-to-r from-teal-600 to-slate-700',
      icon: XCircle,
    },
    {
      title: 'Pending Approvals',
      value: filteredSubmissions.filter((s) => s.status === 'Pending').length,
      total: filteredSubmissions.length,
      percentage: filteredSubmissions.length
        ? ((filteredSubmissions.filter((s) => s.status === 'Pending').length / filteredSubmissions.length) * 100).toFixed(1) + '%'
        : '0%',
      color: 'bg-gradient-to-r from-teal-600 to-slate-700',
      icon: Clock,
    },
    {
      title: 'Remote Workers',
      value: filteredSubmissions.filter((s) => s.location === 'Remote').length,
      total: filteredSubmissions.length,
      percentage: filteredSubmissions.length
        ? ((filteredSubmissions.filter((s) => s.location === 'Remote').length / filteredSubmissions.length) * 100).toFixed(1) + '%'
        : '0%',
      color: 'bg-gradient-to-r from-teal-600 to-slate-700',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-2 bg-slate-50 min-h-screen p-6">
      <div className="flex justify-end">
        <PageMeta title="Attendance Management" description="Track and manage employee attendance efficiently." />
        <PageBreadcrumb
          items={[
            { label: 'Home', link: '/' },
            { label: 'Attendance', link: '/admin/attendance' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-[65%]">
            <h1 className="text-3xl font-bold text-white">Attendance Tracking</h1>
            <p className="text-slate-200 text-lg mt-1">Monitor employee attendance and working hours</p>
          </div>
          <div className="w-[35%] flex items-center space-x-4">
            <DatePicker
              name="attendanceDate"
              value={selectedDate} // ✅ Date object
              onChange={(date) => setSelectedDate(date)}
              className="w-full max-w-xs"
              aria-label="Select Attendance Date"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ title, value, total, percentage, color, icon: Icon }, index) => (
          <div
            key={index}
            className="bg-white/90 rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                <Icon className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-900">{percentage}</span>
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-xl font-bold text-slate-900">
              {value} <span className="text-sm text-slate-500">/ {total}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/90 rounded-lg border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <div className="p-6 border-b border-slate-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">Attendance Records</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">Date: {format(selectedDate, 'dd/MM/yyyy')}</span>
            <button className="px-4 py-2 bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-lg hover:from-teal-500 hover:to-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-transform duration-300 transform hover:scale-105">
              Export Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm" aria-label="Employee Attendance Table">
            <thead className="bg-gradient-to-r from-teal-600 to-slate-700">
              <tr>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-white uppercase">Employee</th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-white uppercase">Date</th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-white uppercase">Check In</th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-white uppercase">Check Out</th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-white uppercase">Location</th>
                <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-white uppercase">Status</th>
                {['super_admin', 'hr'].includes(userRole) && (
                  <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-white uppercase">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={['super_admin', 'hr'].includes(userRole) ? 7 : 6} className="px-4 py-3 text-sm text-slate-500 text-center">
                    No attendance records found for {format(selectedDate, 'dd/MM/yyyy')}.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map(({ id, employee_name, date, login_time, logout_time, location, status }) => (
                  <tr key={id} className="hover:bg-slate-100/80 transition-colors duration-200">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-slate-900">{employee_name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-900">{format(parse(date, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-900">{login_time}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-900">{logout_time || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLocationColor(location)}`}>{location}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}>{status}</span>
                    </td>
                    {['super_admin', 'hr'].includes(userRole) && (
                      <td className="px-4 py-3">
                        {status === 'Pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(id, 'Approved')}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-transform duration-300"
                              disabled={loading}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(id, 'Rejected')}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 transition-transform duration-300"
                              disabled={loading}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
