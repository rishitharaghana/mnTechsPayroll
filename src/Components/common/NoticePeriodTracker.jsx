import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../../redux/slices/employeeSlice';
import { toast } from 'react-toastify';

const NoticePeriodTracker = () => {
  const dispatch = useDispatch();
  const { employees, loading, error } = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const noticeEmployees = employees.filter(emp => emp.status === 'serving_notice');

  return (
    <div className="min-h-screen bg-white rounded-2xl p-4 sm:p-6">
      <h2 className="text-xl sm:text-3xl font-bold text-center text-teal-600 mb-8 uppercase tracking-tight">
        Employees Serving Notice
      </h2>
      {loading && <p className="text-center">Loading...</p>}
      {noticeEmployees.length === 0 && !loading && (
        <p className="text-center text-gray-500">No employees serving notice</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {noticeEmployees.map(emp => {
          const daysRemaining = Math.ceil(
            (new Date(emp.last_working_date) - new Date()) / (1000 * 60 * 60 * 24)
          );
          return (
            <div
              key={emp.id}
              className="p-4 rounded-xl border-2 border-gray-200 shadow-md text-center"
            >
              <h3 className="text-lg font-semibold">{emp.full_name}</h3>
              <p className="text-sm text-gray-500">{emp.employee_id}</p>
              <p className="text-sm text-teal-600">Days Remaining: {daysRemaining}</p>
              <p className="text-sm text-gray-500">Last Working Date: {emp.last_working_date}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NoticePeriodTracker;