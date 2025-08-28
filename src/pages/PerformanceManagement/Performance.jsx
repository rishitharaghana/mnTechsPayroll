import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TrendingUp, Award, Target, Star } from "lucide-react";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import { fetchEmployeePerformance } from "../../redux/slices/performanceSlice";
import { fetchEmployees } from "../../redux/slices/employeeSlice";

const Performance = () => {
  const dispatch = useDispatch();
  const { employees } = useSelector((state) => state.employee);
  const { performance, loading, error } = useSelector((state) => state.performance);
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  useEffect(() => {
    dispatch(fetchEmployees());
    if (selectedEmployee !== "all") {
      dispatch(fetchEmployeePerformance(selectedEmployee));
    }
  }, [dispatch, selectedEmployee]);

  const performanceMetrics = [
    {
      title: "Team Performance",
      value: performance?.reviews?.length
        ? `${Math.round(
            performance.reviews.reduce((sum, r) => sum + r.performance_score, 0) /
              performance.reviews.length
          )}%`
        : "N/A",
      change: "+4.2%",
      icon: TrendingUp,
    },
    {
      title: "Goals Achieved",
      value: performance?.goals?.length
        ? `${Math.round(
            (performance.goals.filter((g) => g.status === "Completed").length /
              performance.goals.length) *
              100
          )}%`
        : "N/A",
      change: "+7.1%",
      icon: Target,
    },
    {
      title: "Awards Given",
      value: performance?.reviews?.reduce((sum, r) => sum + r.achievements.length, 0) || 0,
      change: "+12",
      icon: Award,
    },
    {
      title: "Avg Rating",
      value: performance?.reviews?.length
        ? (performance.reviews.reduce((sum, r) => sum + r.performance_score, 0) /
            performance.reviews.length /
            20
          ).toFixed(1)
        : "N/A",
      icon: Star,
    },
  ];

  const getPerformanceLabel = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredEmployees = selectedEmployee === "all" ? employees : employees.filter((e) => e.employee_id === selectedEmployee);

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-end">
        <PageMeta
          title="Performance Management"
          description="Track and manage employee performance metrics."
        />
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/" },
            { label: "Performance", link: "/admin/performance" },
          ]}
        />
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Employee Performance Dashboard
          </h1>
          <p className="text-gray-500">Overview of employee metrics and achievements</p>
        </div>
        <div className="flex gap-4">
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="all">All Employees</option>
            {employees.map((e) => (
              <option key={e.employee_id} value={e.employee_id}>
                {e.name}
              </option>
            ))}
          </select>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="bg-white shadow rounded-xl p-5 flex flex-col items-start"
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className="text-indigo-600" size={22} />
                <h2 className="text-lg font-semibold text-gray-700">{metric.title}</h2>
              </div>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <span className="text-sm text-green-600">{metric.change}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEmployees.map((emp) => (
          <div key={emp.employee_id} className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{emp.name}</h3>
                <p className="text-sm text-gray-500">
                  {emp.designation_name} | {emp.department_name}
                </p>
              </div>
            </div>

            {performance && performance.employee.id === emp.employee_id && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Performance Score</p>
                    <p
                      className={`text-lg font-bold ${getPerformanceLabel(
                        performance.reviews[0]?.performance_score || 0
                      )}`}
                    >
                      {performance.reviews[0]?.performance_score || "N/A"}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Goals Completed</p>
                    <p className="text-lg font-bold text-gray-800">
                      {performance.goals.filter((g) => g.status === "Completed").length}/
                      {performance.goals.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-lg font-bold text-yellow-600">
                      {performance.reviews[0]?.performance_score
                        ? (performance.reviews[0].performance_score / 20).toFixed(1)
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700">Manager Comments</h4>
                  <p className="text-sm text-gray-600 italic">
                    "{performance.reviews[0]?.manager_comments || "No comments"}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Salary Hike:</strong>{" "}
                    {performance.reviews[0]?.salary_hike_percentage
                      ? `${performance.reviews[0].salary_hike_percentage}%`
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Bonus Eligible:</strong>{" "}
                    {performance.reviews[0]?.bonus_eligible ? "Yes" : "No"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Promotion:</strong>{" "}
                    {performance.reviews[0]?.promotion_recommended ? "Yes" : "No"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Reviewed By:</strong>{" "}
                    {performance.reviews[0]?.reviewer_id || "N/A"}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Achievements
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {performance.reviews[0]?.achievements.map((ach, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full inline-flex items-center gap-1"
                      >
                        <Award size={12} /> {ach}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Performance;