import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, Clock, FileText, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';
import { markAttendance, fetchEmployeeAttendance, clearState } from '../../redux/slices/attendanceSlice';
import { fetchUserProfile } from '../../redux/slices/userSlice';
import DatePicker from '../../Components/ui/date/DatePicker';

const EmployeeAttendance = () => {
  const dispatch = useDispatch();
  const { submissions, loading, error, successMessage } = useSelector((state) => state.attendance);
  const { profile, error: userError } = useSelector((state) => state.user);

  const [date, setDate] = useState(new Date());
  const [loginTime, setLoginTime] = useState('');
  const [logoutTime, setLogoutTime] = useState('');
  const [recipient, setRecipient] = useState('hr');
  const [location, setLocation] = useState('Office');

  const recipients = ['super_admin', 'hr'];
  const locations = ['Office', 'Remote'];

  const stored = localStorage.getItem('userToken');
  const parsed = stored ? JSON.parse(stored) : null;
  const userRole = parsed?.role || null;
  const employeeId = parsed?.id || null;

  const employee = profile;
  const employeeName = employee ? `${employee.name} (${employee.employee_id})` : 'Unknown';

  useEffect(() => {
    if (['employee', 'dept_head', 'hr', 'super_admin'].includes(userRole)) {
      dispatch(fetchEmployeeAttendance());
      if (!profile) {
        dispatch(fetchUserProfile());
      }
    }
    return () => {
      dispatch(clearState());
    };
  }, [dispatch, userRole, profile]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearState());
    }
    if (userError) {
      toast.error(userError);
      dispatch(clearState());
    }
  }, [successMessage, error, userError, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !loginTime || !recipient || !location) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (logoutTime) {
      const login = new Date(`1970-01-01T${loginTime}:00`);
      const logout = new Date(`1970-01-01T${logoutTime}:00`);
      if (logout <= login) {
        toast.error('Logout time must be after login time.');
        return;
      }
    }

    dispatch(
      markAttendance({
        employee_id: employee?.employee_id,
        date: date.toISOString().split('T')[0],
        login_time: loginTime,
        logout_time: logoutTime || null,
        recipient,
        location,
      })
    );

    setLoginTime('');
    setLogoutTime('');
    setRecipient('hr');
    setLocation('Office');
  };

  return (
    <div className="p-6 space-y-6 bg-slate-100 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold text-center text-slate-700 mb-2 tracking-tight">
          Mark Attendance
        </h1>
        <p className="text-slate-700 text-center">Submit your daily attendance for review</p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-slate-700 tracking-tight">Employee</label>
            <div className="flex items-center space-x-2">
              <FileText size={20} className="text-slate-700" />
              <input
                type="text"
                value={employeeName}
                className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 cursor-not-allowed"
                disabled
                aria-label="Employee"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-slate-700 tracking-tight">Date</label>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-slate-700" />
              <DatePicker
                value={date}
                onChange={(newDate) => setDate(newDate)}
                maxDate={new Date()}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-700 transition-all duration-300"
                required
                aria-label="Date"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-slate-700 tracking-tight">Login Time</label>
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-slate-700" />
              <input
                type="time"
                value={loginTime}
                onChange={(e) => setLoginTime(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-700 transition-all duration-300"
                required
                aria-label="Login Time"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-slate-700 tracking-tight">Logout Time</label>
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-slate-700" />
              <input
                type="time"
                value={logoutTime}
                onChange={(e) => setLogoutTime(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-700 transition-all duration-300"
                aria-label="Logout Time"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-slate-700 tracking-tight">Location</label>
            <div className="flex items-center space-x-2">
              <MapPin size={20} className="text-slate-700" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-700 transition-all duration-300"
                required
                aria-label="Location"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-slate-700 tracking-tight">Submit To</label>
            <div className="flex items-center space-x-2">
              <FileText size={20} className="text-slate-700" />
              <select
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-700 focus:border-transparent text-slate-700 transition-all duration-300"
                required
                aria-label="Submit To"
              >
                {recipients.map((rec) => (
                  <option key={rec} value={rec}>
                    {rec === 'super_admin' ? 'Super Admin' : 'HR'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-700 text-white hover:bg-teal-800 hover:scale-105'
              }`}
              aria-label="Submit Attendance"
            >
              <FileText size={20} />
              <span>Submit Attendance</span>
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Your Attendance Submissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-teal-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  Login Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  Logout Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  Submitted To
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-sm text-slate-700 text-center">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                submissions.map(({ id, date, login_time, logout_time, location, recipient, status }) => (
                  <tr key={id} className="hover:bg-teal-50 transition duration-200">
                    <td className="px-6 py-4 text-sm text-slate-700">{new Date(date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{login_time}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{logout_time || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{location}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {recipient === 'super_admin' ? 'Super Admin' : 'HR'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status === 'Approved'
                            ? 'bg-teal-100 text-teal-800'
                            : status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
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

export default EmployeeAttendance;