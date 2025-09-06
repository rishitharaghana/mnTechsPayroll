import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format, subDays } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from '../../Components/ui/date/DatePicker';
import PageMeta from '../../Components/common/PageMeta';
import PageBreadcrumb from '../../Components/common/PageBreadcrumb';
import {
  fetchAllEmployeesTotalHours,
  fetchEmployeeAverageHours,
  fetchTotalAverageWorkingHours,
  clearState,
} from '../../redux/slices/attendanceSlice';

const EmployeeAvgHours = () => {
  const dispatch = useDispatch();
  const { totalEmployeesHours, averageHours, totalAverageHours, loading, error, successMessage } = useSelector(
    (state) => state.attendance
  );

  const [dateRange, setDateRange] = useState({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [currentTab, setCurrentTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [tooltip, setTooltip] = useState(null);
  const employeesPerPage = 10;

  const userToken = localStorage.getItem('userToken');
  const user = userToken ? JSON.parse(userToken) : null;
  const userRole = user?.role;

  // Debugging: Log data
  useEffect(() => {
    console.log('totalEmployeesHours:', totalEmployeesHours);
    console.log('totalAverageHours:', totalAverageHours);
    console.log('averageHours:', averageHours);
    console.log('loading:', loading, 'error:', error, 'successMessage:', successMessage);
  }, [totalEmployeesHours, totalAverageHours, averageHours, loading, error, successMessage]);

  // Validate date range
  useEffect(() => {
    if (dateRange.startDate > dateRange.endDate) {
      toast.error('Start date must be before end date');
      setDateRange({ startDate: subDays(dateRange.endDate, 30), endDate: dateRange.endDate });
    }
  }, [dateRange]);

  // Fetch data
  useEffect(() => {
    if (['super_admin', 'hr'].includes(userRole)) {
      dispatch(
        fetchAllEmployeesTotalHours({
          start_date: format(dateRange.startDate, 'yyyy-MM-dd'),
          end_date: format(dateRange.endDate, 'yyyy-MM-dd'),
        })
      );
      dispatch(
        fetchTotalAverageWorkingHours({
          start_date: format(dateRange.startDate, 'yyyy-MM-dd'),
          end_date: format(dateRange.endDate, 'yyyy-MM-dd'),
        })
      );
    }
    return () => {
      dispatch(clearState());
    };
  }, [dispatch, userRole, dateRange]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearState());
    }
  }, [successMessage, error, dispatch]);

  const handleFetchAverageHours = (employee_id) => {
    setSelectedEmployeeId(employee_id);
    setCurrentTab('employee');
    dispatch(
      fetchEmployeeAverageHours({
        employee_id,
        start_date: format(dateRange.startDate, 'yyyy-MM-dd'),
        end_date: format(dateRange.endDate, 'yyyy-MM-dd'),
      })
    );
  };

  // Retry fetching data
  const retryFetch = () => {
    dispatch(
      fetchAllEmployeesTotalHours({
        start_date: format(dateRange.startDate, 'yyyy-MM-dd'),
        end_date: format(dateRange.endDate, 'yyyy-MM-dd'),
      })
    );
    dispatch(
      fetchTotalAverageWorkingHours({
        start_date: format(dateRange.startDate, 'yyyy-MM-dd'),
        end_date: format(dateRange.endDate, 'yyyy-MM-dd'),
      })
    );
  };

  // Filter employees by department
  const filteredEmployees = useMemo(() => {
    if (departmentFilter === 'all') return totalEmployeesHours || [];
    return (totalEmployeesHours || []).filter(emp => emp.department_name === departmentFilter);
  }, [totalEmployeesHours, departmentFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  // Department options for filter
  const departments = useMemo(() => {
    const uniqueDepts = [...new Set((totalEmployeesHours || []).map(emp => emp.department_name).filter(Boolean))];
    return ['all', ...uniqueDepts];
  }, [totalEmployeesHours]);

  // SVG Pie Chart for Hours Distribution by Department
  const renderPieChart = () => {
    if (!totalEmployeesHours?.length) {
      console.log('No data for pie chart');
      return (
        <div className="text-center">
          <p className="text-slate-500">No employee data available for pie chart.</p>
          <button
            onClick={retryFetch}
            className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-500"
          >
            Retry
          </button>
        </div>
      );
    }

    // Filter valid employees
    const validEmployees = totalEmployeesHours.filter(
      emp => emp.department_name && emp.total_working_hours != null && !isNaN(emp.total_working_hours) && emp.total_working_hours > 0
    );
    if (!validEmployees.length) {
      console.log('No valid employee hours for pie chart');
      return (
        <div className="text-center">
          <p className="text-slate-500">No valid working hours data available.</p>
          <button
            onClick={retryFetch}
            className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-500"
          >
            Retry
          </button>
        </div>
      );
    }

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 20;
    const centerX = width / 2;
    const centerY = height / 2;

    // Aggregate hours by department
    const deptHours = validEmployees.reduce((acc, emp) => {
      acc[emp.department_name] = (acc[emp.department_name] || 0) + emp.total_working_hours;
      return acc;
    }, {});
    console.log('deptHours:', deptHours);
    const totalHours = Object.values(deptHours).reduce((sum, h) => sum + h, 0) || 1;
    const colors = ['#14b8a6', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#10b981', '#f97316'];

    let startAngle = 0;
    const slices = Object.entries(deptHours).map(([dept, hours], index) => {
      const angle = (hours / totalHours) * 360;
      const radians = (startAngle * Math.PI) / 180;
      const endRadians = ((startAngle + angle) * Math.PI) / 180;
      const largeArc = angle > 180 ? 1 : 0;
      const x1 = centerX + radius * Math.cos(radians);
      const y1 = centerY + radius * Math.sin(radians);
      const x2 = centerX + radius * Math.cos(endRadians);
      const y2 = centerY + radius * Math.sin(endRadians);
      const path = `M${centerX},${centerY} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;
      startAngle += angle;
      return (
        <g key={`slice-${dept}-${index}`}>
          <path
            d={path}
            fill={colors[index % colors.length]}
            onMouseOver={(e) => setTooltip({
              x: e.clientX,
              y: e.clientY,
              text: `${dept}: ${(hours / totalHours * 100).toFixed(1)}% (${hours.toFixed(1)}h)`
            })}
            onMouseOut={() => setTooltip(null)}
          >
            <title>{`${dept}: ${(hours / totalHours * 100).toFixed(1)}%`}</title>
          </path>
          <text
            x={centerX + (radius * 0.7) * Math.cos((startAngle - angle / 2) * Math.PI / 180)}
            y={centerY + (radius * 0.7) * Math.sin((startAngle - angle / 2) * Math.PI / 180)}
            textAnchor="middle"
            fontSize="10"
            fill="#fff"
          >
            {dept}
          </text>
        </g>
      );
    });

    return (
      <div className="flex flex-col items-center relative">
        <svg width={width} height={height} style={{ display: 'block' }}>
          {slices}
          <text x={centerX} y={20} textAnchor="middle" fontSize="14" fill="#1e293b">
            Hours Distribution by Department
          </text>
        </svg>
        {tooltip && (
          <div
            className="absolute bg-slate-800 text-white text-xs rounded p-2"
            style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
          >
            {tooltip.text}
          </div>
        )}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Object.entries(deptHours).map(([dept, hours], index) => (
            <div key={`legend-${dept}-${index}`} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-slate-700">
                {dept}: {(hours / totalHours * 100).toFixed(1)}% ({hours.toFixed(1)}h)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // SVG Line Graph for Trend Data
  const renderLineGraph = (data, title, color = '#14b8a6') => {
    if (!data?.trend_data?.length || data.trend_data.every(d => d.hours == null)) {
      console.log(`No valid trend data for ${title}`);
      return (
        <div className="text-center">
          <p className="text-slate-500">No valid trend data available.</p>
          <button
            onClick={retryFetch}
            className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-500"
          >
            Retry
          </button>
        </div>
      );
    }

    const width = 600;
    const height = 300;
    const margin = { top: 30, right: 20, bottom: 50, left: 50 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;

    const validTrendData = data.trend_data.filter(d => d.hours != null && !isNaN(d.hours));
    if (!validTrendData.length) {
      console.log(`No valid hours in trend data for ${title}`);
      return (
        <div className="text-center">
          <p className="text-slate-500">No valid hours data available.</p>
          <button
            onClick={retryFetch}
            className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-500"
          >
            Retry
          </button>
        </div>
      );
    }

    const maxHours = Math.max(...validTrendData.map(d => d.hours), 10);
    const points = validTrendData.map((d, index) => {
      const x = margin.left + (index / (validTrendData.length - 1)) * graphWidth;
      const y = margin.top + graphHeight - (d.hours / maxHours) * graphHeight;
      return `${x},${y}`;
    }).join(' ');

    const yAxisTicks = Array.from({ length: 5 }, (_, i) => (maxHours * i) / 4).map((tick, index) => (
      <g key={`y-tick-${index}`}>
        <line
          x1={margin.left}
          x2={margin.left + graphWidth}
          y1={margin.top + graphHeight - (tick / maxHours) * graphHeight}
          y2={margin.top + graphHeight - (tick / maxHours) * graphHeight}
          stroke="#e2e8f0"
        />
        <text
          x={margin.left - 10}
          y={margin.top + graphHeight - (tick / maxHours) * graphHeight + 3}
          textAnchor="end"
          fontSize="10"
          fill="#1e293b"
        >
          {tick.toFixed(1)}
        </text>
      </g>
    ));

    const xAxisTicks = validTrendData.map((d, index) => (
      <g key={`x-tick-${d.date}-${index}`}>
        <text
          x={margin.left + (index / (validTrendData.length - 1)) * graphWidth}
          y={margin.top + graphHeight + 15}
          textAnchor="middle"
          fontSize="10"
          fill="#1e293b"
          transform={`rotate(-45 ${margin.left + (index / (validTrendData.length - 1)) * graphWidth} ${margin.top + graphHeight + 15})`}
        >
          {format(new Date(d.date), 'MMM dd')}
        </text>
      </g>
    ));

    return (
      <div className="relative">
        <svg width={width} height={height} style={{ display: 'block' }}>
          <g>
            <line
              x1={margin.left}
              x2={margin.left}
              y1={margin.top}
              y2={margin.top + graphHeight}
              stroke="#1e293b"
            />
            <line
              x1={margin.left}
              x2={margin.left + graphWidth}
              y1={margin.top + graphHeight}
              y2={margin.top + graphHeight}
              stroke="#1e293b"
            />
            {yAxisTicks}
            {xAxisTicks}
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="2"
            />
            {validTrendData.map((d, index) => (
              <g key={`point-${d.date}-${index}`}>
                <circle
                  cx={margin.left + (index / (validTrendData.length - 1)) * graphWidth}
                  cy={margin.top + graphHeight - (d.hours / maxHours) * graphHeight}
                  r="4"
                  fill={color}
                  onMouseOver={(e) => setTooltip({
                    x: e.clientX,
                    y: e.clientY,
                    text: `${format(new Date(d.date), 'MMM dd')}: ${d.hours.toFixed(1)} hours`
                  })}
                  onMouseOut={() => setTooltip(null)}
                />
                <title>{`${format(new Date(d.date), 'MMM dd')}: ${d.hours.toFixed(1)} hours`}</title>
              </g>
            ))}
            <text
              x={width / 2}
              y={height - 10}
              textAnchor="middle"
              fontSize="12"
              fill="#1e293b"
            >
              Date
            </text>
            <text
              x={-height / 2}
              y={margin.left - 30}
              textAnchor="middle"
              fontSize="12"
              fill="#1e293b"
              transform="rotate(-90)"
            >
              Hours
            </text>
            <text
              x={width / 2}
              y={margin.top - 10}
              textAnchor="middle"
              fontSize="14"
              fill="#1e293b"
            >
              {title}
            </text>
          </g>
        </svg>
        {tooltip && (
          <div
            className="absolute bg-slate-800 text-white text-xs rounded p-2"
            style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
    );
  };

  if (!['super_admin', 'hr'].includes(userRole)) {
    return (
      <div className="w-78/100 p-6">
        <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-slate-600">This page is restricted to Super Admin and HR roles.</p>
      </div>
    );
  }

  return (
    <div className="w-78/100">
      <ToastContainer />
      <div className="flex justify-end">
        <PageMeta
          title="Working Hours Analytics"
          description="Visualize employee working hours and trends."
        />
        <PageBreadcrumb
          items={[
            { label: 'Home', link: '/' },
            { label: 'Attendance', link: '/admin/attendance' },
            { label: 'Working Hours Analytics', link: '/admin/working-hours-analytics' },
          ]}
        />
      </div>
      <div className="space-y-6 bg-white rounded-2xl min-h-screen p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-slate-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-[65%]">
              <h1 className="text-3xl font-bold text-white">Working Hours Analytics</h1>
              <p className="text-slate-200 text-lg mt-1">
                Analyze employee working hours with intuitive visualizations
              </p>
            </div>
            <div className="w-full sm:w-[35%] flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <DatePicker
                name="startDate"
                value={dateRange.startDate}
                onChange={(date) => setDateRange((prev) => ({ ...prev, startDate: date }))}
                className="w-full max-w-xs"
                aria-label="Select Start Date"
              />
              <DatePicker
                name="endDate"
                value={dateRange.endDate}
                onChange={(date) => setDateRange((prev) => ({ ...prev, endDate: date }))}
                className="w-full max-w-xs"
                aria-label="Select End Date"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          {['overview', 'employees', 'employee'].map((tab, index) => (
            <button
              key={`tab-${tab}-${index}`}
              onClick={() => setCurrentTab(tab)}
              className={`px-4 py-2 text-sm font-medium ${
                currentTab === tab
                  ? 'border-b-2 border-teal-600 text-teal-600'
                  : 'text-slate-600 hover:text-teal-600'
              }`}
            >
              {tab === 'overview' && 'Overview'}
              {tab === 'employees' && 'All Employees'}
              {tab === 'employee' && 'Employee Details'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {currentTab === 'overview' && (
          <div className="space-y-6">
            {loading && <p className="text-slate-600">Loading data...</p>}
            {totalAverageHours ? (
              <div className="bg-white/90 rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Organization-Wide Statistics
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <p className="text-sm text-slate-600">Average Hours per Day</p>
                    <p className="text-2xl font-bold text-teal-600">
                      {totalAverageHours.total_average_working_hours != null && !isNaN(totalAverageHours.total_average_working_hours)
                        ? totalAverageHours.total_average_working_hours.toFixed(1)
                        : '0.0'} hours
                    </p>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <p className="text-sm text-slate-600">Total Days Counted</p>
                    <p className="text-2xl font-bold text-teal-600">
                      {totalAverageHours.total_days_counted || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <p className="text-sm text-slate-600">Employees Tracked</p>
                    <p className="text-2xl font-bold text-teal-600">
                      {totalAverageHours.employee_count || 0}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-slate-500">No organization-wide data available.</p>
                <button
                  onClick={retryFetch}
                  className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-500"
                >
                  Retry
                </button>
              </div>
            )}
            <div className="bg-white/90 rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Hours Distribution by Department
              </h2>
              {renderPieChart()}
            </div>
            <div className="bg-white/90 rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Organization-Wide Working Hours Trend
              </h2>
              {renderLineGraph(totalAverageHours, 'Organization-Wide Working Hours Trend', '#14b8a6')}
            </div>
          </div>
        )}

        {/* All Employees Tab */}
        {currentTab === 'employees' && (
          <div className="space-y-6">
            <div className="bg-white/90 rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-4">All Employees</h2>
              <div className="mb-4">
                <label className="text-sm text-slate-600 mr-2">Filter by Department:</label>
                <select
                  value={departmentFilter}
                  onChange={(e) => {
                    setDepartmentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  {departments.map((dept, index) => (
                    <option key={`dept-option-${dept}-${index}`} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="overflow-x-auto">
                <table
                  className="w-full table-fixed text-sm"
                  aria-label="Employee Working Hours Table"
                >
                  <thead className="bg-gradient-to-r from-teal-600 to-slate-700">
                    <tr>
                      <th className="w-1/5 px-4 py-3 text-left text-xs font-medium text-white uppercase">
                        Employee ID
                      </th>
                      <th className="w-1/5 px-4 py-3 text-left text-xs font-medium text-white uppercase">
                        Employee Name
                      </th>
                      <th className="w-1/5 px-4 py-3 text-left text-xs font-medium text-white uppercase">
                        Department
                      </th>
                      <th className="w-1/5 px-4 py-3 text-left text-xs font-medium text-white uppercase">
                        Total Hours
                      </th>
                      <th className="w-1/5 px-4 py-3 text-left text-xs font-medium text-white uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                 <tbody className="divide-y divide-slate-200/50">
  {loading ? (
    <tr>
      <td colSpan={5} className="px-4 py-3 text-sm text-slate-500 text-center">
        Loading employees...
      </td>
    </tr>
  ) : paginatedEmployees.length === 0 ? (
    <tr>
      <td colSpan={5} className="px-4 py-3 text-sm text-slate-500 text-center">
        No working hours data available.
      </td>
    </tr>
  ) : (
    paginatedEmployees.map(
      ({ employee_id, employee_name, department_name, total_working_hours }, index) => (
        <tr
          key={`${employee_id}-${department_name}-${total_working_hours}-${currentPage}-${index}`}
          className="hover:bg-slate-100/80 transition-colors duration-200"
        >
          <td className="px-4 py-3 text-sm text-slate-900">{employee_id || 'N/A'}</td>
          <td className="px-4 py-3 text-sm text-slate-900">{employee_name || 'Unknown'}</td>
          <td className="px-4 py-3 text-sm text-slate-900">{department_name || 'N/A'}</td>
          <td className="px-4 py-3 text-sm text-slate-900">
            {total_working_hours != null && !isNaN(total_working_hours)
              ? total_working_hours.toFixed(1)
              : '0.0'} hours
          </td>
          <td className="px-4 py-3">
            <button
              onClick={() => handleFetchAverageHours(employee_id)}
              className="text-xs text-teal-600 hover:underline"
              disabled={loading}
            >
              View Details
            </button>
          </td>
        </tr>
      )
    )
  )}
</tbody>

                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1 bg-teal-600 text-white rounded disabled:bg-slate-300"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 bg-teal-600 text-white rounded disabled:bg-slate-300"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Employee Details Tab */}
        {currentTab === 'employee' && averageHours && selectedEmployeeId && (
          <div className="space-y-6">
            <div className="bg-white/90 rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Average Working Hours for {averageHours.employee_name || 'Unknown'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-teal-50 rounded-lg">
                  <p className="text-sm text-slate-600">Average Hours per Day</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {averageHours.average_working_hours != null && !isNaN(averageHours.average_working_hours)
                      ? averageHours.average_working_hours.toFixed(1)
                      : '0.0'} hours
                  </p>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <p className="text-sm text-slate-600">Days Counted</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {averageHours.days_counted || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/90 rounded-lg border border-slate-200/50 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Historical Trend for {averageHours.employee_name || 'Unknown'}
              </h2>
              {renderLineGraph(averageHours, `Working Hours Trend for ${averageHours.employee_name || 'Employee'}`, '#3b82f6')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeAvgHours;