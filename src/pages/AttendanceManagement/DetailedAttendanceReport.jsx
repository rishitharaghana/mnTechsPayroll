import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchDetailedAttendance, clearState as clearAttendanceState } from '../../redux/slices/attendanceSlice';
import PageBreadcrumb from '../../Components/common/PageBreadcrumb';
import PageMeta from '../../Components/common/PageMeta';

const DetailedAttendanceReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { detailedAttendance, loading: attendanceLoading, error: attendanceError, successMessage: attendanceSuccess } = useSelector((state) => state.attendance);
  const { profile, loading: userLoading, error: userError } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  let stored, parsed, userRole;
  try {
    stored = localStorage.getItem('userToken');
    parsed = stored ? JSON.parse(stored) : null;
    userRole = parsed?.role || null;
  } catch (error) {
    console.error('Error parsing userToken:', error.message);
    toast.error('Invalid session data. Please log in again.');
    navigate('/login');
    return null;
  }

  const employeeName = profile ? `${profile.full_name} (${profile.employee_id})` : 'No profile data available. Please contact HR.';

  useEffect(() => {
    if (!stored || !parsed) {
      toast.error('Session expired. Please log in again.');
      navigate('/login');
      return;
    }
    if (['employee', 'dept_head', 'hr', 'super_admin'].includes(userRole) && profile?.employee_id) {
      const defaultStart = new Date();
      defaultStart.setDate(defaultStart.getDate() - 30);
      dispatch(fetchDetailedAttendance({
        employee_id: profile.employee_id,
        start_date: defaultStart.toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
      }));
    }
    setIsLoading(false);
    return () => {
      dispatch(clearAttendanceState());
    };
  }, [dispatch, userRole, profile, navigate]);

  useEffect(() => {
    if (attendanceSuccess) {
      toast.success(attendanceSuccess);
    }
    if (attendanceError) {
      if (attendanceError === 'Access denied: Insufficient permissions') {
        toast.error('You do not have permission to view this report.');
      } else if (attendanceError === 'Unauthorized') {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
      } else {
        toast.error(attendanceError || 'An error occurred while fetching the report.');
      }
    }
  }, [attendanceSuccess, attendanceError, navigate]);

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const applyDateFilter = () => {
    if (dateRange.start && dateRange.end && profile?.employee_id) {
      dispatch(fetchDetailedAttendance({
        employee_id: profile.employee_id,
        start_date: dateRange.start,
        end_date: dateRange.end,
      }));
    } else {
      toast.error('Please select a valid date range.');
    }
  };

  if (isLoading || !stored || !parsed) return null;

  return (
    <div className="w-11/12 max-w-7xl mx-auto">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { label: 'Home', link: '/emp-dashboard' },
            { label: 'Attendance Overview', link: '/employee/attendance-overview' },
            { label: 'Detailed Report', link: '/employee/attendance-report' },
          ]}
        />
        <PageMeta
          title="Detailed Attendance Report"
          description="View detailed attendance records and metrics"
        />
      </div>
      <div className="p-8 space-y-8 bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-xl rounded-3xl min-h-screen">
        <div>
          <h1 className="text-3xl font-extrabold text-center text-slate-900 mb-2 tracking-tight">
            Detailed Attendance Report
          </h1>
          <p className="text-slate-500 text-center">Comprehensive view of your attendance records</p>
        </div>

        {/* Employee Details */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Employee Details</h3>
          {userLoading ? (
            <div className="flex justify-center">
              <svg className="w-8 h-8 animate-spin text-teal-500" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z" />
              </svg>
            </div>
          ) : profile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-sm text-slate-600"><strong>Name:</strong> {employeeName}</p>
              <p className="text-sm text-slate-600"><strong>Department:</strong> {profile.department_name || 'N/A'}</p>
              <p className="text-sm text-slate-600"><strong>Designation:</strong> {profile.designation_name || 'N/A'}</p>
              <p className="text-sm text-slate-600"><strong>Email:</strong> {profile.email || 'N/A'}</p>
            </div>
          ) : (
            <p className="text-slate-500 text-center">{userError || 'No employee details available. Please contact HR.'}</p>
          )}
        </div>

        {/* Date Range Filter */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Date Range</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="date"
              name="start"
              value={dateRange.start}
              onChange={handleDateRangeChange}
              className="border border-slate-200 rounded-lg p-2 text-sm text-slate-600"
            />
            <input
              type="date"
              name="end"
              value={dateRange.end}
              onChange={handleDateRangeChange}
              className="border border-slate-200 rounded-lg p-2 text-sm text-slate-600"
            />
            <button
              onClick={applyDateFilter}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:scale-105 hover:shadow-md hover:shadow-teal-500/20 transition-all duration-300"
            >
              Apply Filter
            </button>
          </div>
        </div>

        {/* Detailed Attendance Report */}
        <div className="relative bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-xl rounded-2xl shadow-md border border-slate-100/60 p-8 transition-all duration-500 hover:shadow-lg animate-shimmer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-effect"></div>
          <h2 className="text-base font-medium text-slate-700 mb-6">Attendance Details</h2>
          {attendanceLoading ? (
            <div className="flex justify-center py-10">
              <svg className="w-8 h-8 animate-spin text-teal-500" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z" />
              </svg>
            </div>
          ) : detailedAttendance && detailedAttendance.records?.length > 0 ? (
            <div className="animate-fade-in">
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-white/80 rounded-lg border border-slate-200/50">
                  <p className="text-sm text-slate-600">Total Hours</p>
                  <p className="text-lg font-semibold text-teal-600">{detailedAttendance.total_hours?.toFixed(2) || '0.00'}h</p>
                </div>
                <div className="text-center p-4 bg-white/80 rounded-lg border border-slate-200/50">
                  <p className="text-sm text-slate-600">Attendance Rate</p>
                  <p className="text-lg font-semibold text-teal-600">{detailedAttendance.attendance_rate?.toFixed(1) || '0.0'}%</p>
                </div>
                <div className="text-center p-4 bg-white/80 rounded-lg border border-slate-200/50">
                  <p className="text-sm text-slate-600">Absences</p>
                  <p className="text-lg font-semibold text-teal-600">{detailedAttendance.absences || 0}</p>
                </div>
              </div>
              {/* Daily Attendance Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse" aria-label="Detailed attendance records">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="w-1/5 px-4 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-tight border-b border-slate-200">Date</th>
                      <th className="w-1/5 px-4 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-tight border-b border-slate-200">Check-in</th>
                      <th className="w-1/5 px-4 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-tight border-b border-slate-200">Check-out</th>
                      <th className="w-1/5 px-4 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-tight border-b border-slate-200">Hours</th>
                      <th className="w-1/5 px-4 py-3 text-left text-xs font-bold text-slate-900 uppercase tracking-tight border-b border-slate-200">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {detailedAttendance.records.map((record, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 text-sm text-slate-900">{new Date(record.date).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.check_in || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.check_out || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-slate-900">{record.hours?.toFixed(2) || '0.00'}h</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === 'Present' ? 'bg-teal-50 text-teal-700' :
                              record.status === 'Absent' ? 'bg-rose-50 text-rose-700' :
                              record.status === 'Late' ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-700'
                            }`}
                          >
                            {record.status || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Policy Note */}
              <div className="mt-6 text-sm text-slate-600">
                <p><strong>Policy Note:</strong> Ensure timely check-ins and notify HR for absences or leaves. Contact HR for discrepancies.</p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-center py-8 text-sm">
              {attendanceError || 'No attendance records found for the selected period.'}
            </p>
          )}
        </div>

        {/* Navigation Link */}
        <div className="flex justify-end">
          <Link
            to="/employee/attendance-overview"
            className="px-5 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:scale-105 hover:shadow-md hover:shadow-teal-500/20 transition-all duration-300"
          >
            Back to Overview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DetailedAttendanceReport;