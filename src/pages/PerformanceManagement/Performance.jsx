import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select"; // Import react-select
import { TrendingUp, Award, Target, Star } from "lucide-react";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import { fetchEmployeePerformance } from "../../redux/slices/performanceSlice";
import { fetchEmployees } from "../../redux/slices/employeeSlice";

// Custom styles for employee select
const employeeSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: '#e2e8f0',
    borderRadius: '0.5rem',
    padding: '0.25rem',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#14b8a6',
    },
    backgroundColor: '#fff',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#14b8a6' : state.isFocused ? '#f0fdfa' : '#fff',
    color: state.isSelected ? '#fff' : '#1f2937',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f0fdfa',
      color: '#1f2937',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#1f2937',
    fontWeight: '500',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#6b7280',
  }),
};

// Custom styles for period select
const periodSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: '#e2e8f0',
    borderRadius: '0.5rem',
    padding: '0.25rem',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#0ea5e9',
    },
    backgroundColor: '#f8fafc',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#0ea5e9' : state.isFocused ? '#e0f2fe' : '#fff',
    color: state.isSelected ? '#fff' : '#1f2937',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#e0f2fe',
      color: '#1f2937',
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#1f2937',
    fontWeight: '500',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#6b7280',
  }),
};

const Performance = () => {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employee);
  const { performance, loading, error } = useSelector((state) => state.performance);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Changed to null for react-select
  const [selectedPeriod, setSelectedPeriod] = useState({ value: "quarterly", label: "Quarterly" });

  // Employee options for react-select
  const employeeOptions = [
    { value: "all", label: "All Employees" },
    ...employees.map((e) => ({
      value: e.employee_id,
      label: `${e.full_name} (${e.employee_id})`,
    })),
  ];

  // Period options for react-select
  const periodOptions = [
    { value: "quarterly", label: "Quarterly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  useEffect(() => {
    dispatch(fetchEmployees());
    if (selectedEmployee?.value !== "all") {
      dispatch(fetchEmployeePerformance(selectedEmployee?.value)).catch((err) =>
        console.error("Failed to fetch performance:", err)
      );
    }
  }, [dispatch, selectedEmployee]);

  // Calculate date range for 3-month cycle
  const getDateRange = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
    const end = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 + 3, 0);
    return { start, end };
  };

  // Filter performance data by date range
  const filteredPerformance = {
    ...performance,
    reviews: (performance?.reviews || []).filter((review) => {
      if (selectedPeriod.value !== "quarterly") return true;
      const reviewDate = new Date(review.reviewDate);
      const { start, end } = getDateRange();
      return reviewDate >= start && reviewDate <= end;
    }),
    goals: (performance?.goals || []).filter((goal) => {
      if (selectedPeriod.value !== "quarterly") return true;
      const dueDate = new Date(goal.due_date);
      const { start, end } = getDateRange();
      return dueDate >= start && dueDate <= end;
    }),
  };

  const performanceMetrics = [
    {
      title: "Team Performance",
      value: filteredPerformance?.reviews?.length
        ? `${Math.round(
            filteredPerformance.reviews.reduce((sum, r) => sum + (r.performance_score || 0), 0) /
              filteredPerformance.reviews.length
          )}%`
        : "N/A",
      change: filteredPerformance?.reviews?.length ? "+4.2%" : "N/A",
      icon: TrendingUp,
    },
    {
      title: "Goals Achieved",
      value: filteredPerformance?.goals?.length
        ? `${Math.round(
            (filteredPerformance.goals.filter((g) => g.status === "Completed").length /
              filteredPerformance.goals.length) * 100
          )}%`
        : "N/A",
      change: filteredPerformance?.goals?.length ? "+7.1%" : "N/A",
      icon: Target,
    },
    {
      title: "Awards Given",
      value: filteredPerformance?.reviews?.reduce((sum, r) => sum + (r.achievements?.length || 0), 0) || 0,
      change: filteredPerformance?.reviews?.length ? "+12" : "N/A",
      icon: Award,
    },
    {
      title: "Avg Rating",
      value: filteredPerformance?.reviews?.length
        ? (
            filteredPerformance.reviews.reduce((sum, r) => sum + (r.performance_score || 0), 0) /
            filteredPerformance.reviews.length /
            20
          ).toFixed(1)
        : "N/A",
      change: filteredPerformance?.reviews?.length ? "+0.2" : "N/A",
      icon: Star,
    },
  ];

  const getPerformanceLabel = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredEmployees =
    selectedEmployee?.value === "all"
      ? employees
      : employees.filter((e) => e.employee_id === selectedEmployee?.value);

  return (
    <div className="w-full mt-4 sm:mt-0">
      <div className="hidden sm:flex sm:justify-end sm:items-center">
        <PageMeta
          title="Performance Management"
          description="Track and manage employee performance metrics."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/admin/dashboard" },
            { label: "Performance", link: "/admin/performance" },
          ]}
        />
      </div>
      <div className="bg-white rounded-xl p-4 md:p-8 shadow-lg border-1 border-gray-300">
        <div className="bg-gradient-to-r from-slate-700 to-teal-600 rounded-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Employee Performance Dashboard</h1>
          <p className="text-gray-200">Overview of employee metrics and achievements (3-Month Cycle)</p>
        </div>

        {(error || loading) && (
          <div className="mb-4 p-4 rounded-lg">
            {error && <p className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</p>}
            {loading && (
              <div className="flex justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-teal-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <Select
              value={selectedEmployee}
              onChange={setSelectedEmployee}
              options={employeeOptions}
              styles={employeeSelectStyles}
              placeholder="Select Employee"
              className="w-full lg:w-64"
              aria-label="Select employee"
            />
            <Select
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              options={periodOptions}
              styles={periodSelectStyles}
              placeholder="Select Period"
              className="w-full lg:w-40"
              aria-label="Select period"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {performanceMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="bg-white shadow-lg rounded-xl p-5 border-1 border-gray-300 hover:-translate-y-1 transition-all"
                role="region"
                aria-label={metric.title}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="text-teal-600" size={22} />
                  <h2 className="text-sm font-semibold text-gray-700">{metric.title}</h2>
                </div>
                <div className="text-xl font-bold text-gray-900">{metric.value}</div>
                <span className="text-sm text-green-600">{metric.change}</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.employee_id}
              className="bg-white shadow-lg rounded-xl sm:p-6 p-5 border-1 border-gray-300 hover:-translate-y-1 transition-all"
              role="region"
              aria-label={`Performance details for ${emp.full_name}`}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{emp.full_name}</h3>
                  <p className="text-sm text-gray-500">
                    {emp.designation_name} | {emp.department_name}
                  </p>
                </div>
              </div>

              {performance?.employee?.id === emp.employee_id && filteredPerformance.reviews[0] && (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Performance Score</p>
                      <p
                        className={`text-lg font-bold ${getPerformanceLabel(
                          filteredPerformance.reviews[0]?.performance_score || 0
                        )}`}
                      >
                        {filteredPerformance.reviews[0]?.performance_score || "N/A"}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Goals Completed</p>
                      <p className="text-lg font-bold text-gray-800">
                        {filteredPerformance.goals.filter((g) => g.status === "Completed").length}/
                        {filteredPerformance.goals.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <p className="text-lg font-bold text-yellow-600">
                        {filteredPerformance.reviews[0]?.performance_score
                          ? (filteredPerformance.reviews[0].performance_score / 20).toFixed(1)
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700">Manager Comments</h4>
                    <p className="text-sm text-gray-600 italic">
                      "{filteredPerformance.reviews[0]?.manager_comments || "No comments"}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Salary Hike:</strong>{" "}
                      {filteredPerformance.reviews[0]?.salary_hike_percentage
                        ? `${filteredPerformance.reviews[0].salary_hike_percentage}%`
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Bonus Eligible:</strong>{" "}
                      {filteredPerformance.reviews[0]?.bonus_eligible ? "Yes" : "No"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Promotion:</strong>{" "}
                      {filteredPerformance.reviews[0]?.promotion_recommended ? "Yes" : "No"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Reviewed By:</strong>{" "}
                      {filteredPerformance.reviews[0]?.reviewer_id || "N/A"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Achievements</h4>
                    <div className="flex flex-wrap gap-2">
                      {(filteredPerformance.reviews[0]?.achievements || []).map((ach, idx) => (
                        <span
                          key={ach.id}
                          className="px-2 py-1 text-xs bg-teal-100 text-teal-700 rounded-full inline-flex items-center gap-1"
                          title={`Date: ${ach.date}, Type: ${ach.type}`}
                        >
                          <Award size={12} /> {ach.title}
                        </span>
                      ))}
                      {(!filteredPerformance.reviews[0]?.achievements ||
                        filteredPerformance.reviews[0].achievements.length === 0) && (
                        <p className="text-sm text-gray-600">No achievements recorded</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Performance;