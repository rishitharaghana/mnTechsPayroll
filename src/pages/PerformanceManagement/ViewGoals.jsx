import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Briefcase, User, Building, Calendar, Award, Target } from "lucide-react";
import Download from "/assets/download.png";
import { getCurrentUserProfile } from "../../redux/slices/employeeSlice";
import { fetchEmployeePerformance, submitSelfReview } from "../../redux/slices/performanceSlice";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";

const ViewGoals = () => {
  const dispatch = useDispatch();
  const { user, employee_id, role, loading: userLoading, error: userError } = useSelector((state) => state.auth);
  const { performance, loading: perfLoading, error: perfError } = useSelector((state) => state.performance);
  const [selfReviewComments, setSelfReviewComments] = useState("");
  const [closingComments, setClosingComments] = useState("");

  useEffect(() => {
    if (employee_id) {
      dispatch(getCurrentUserProfile());
      dispatch(fetchEmployeePerformance(employee_id)).catch((err) => {
        console.error("Failed to fetch performance:", err);
      });
    }
    console.log("Employee ID:", employee_id);
    console.log("Performance data:", performance);
  }, [dispatch, employee_id]);

  const getDateRange = () => {
    const today = new Date();
    const start = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
    const end = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3 + 3, 0);
    return { start, end };
  };

  const filteredPerformance = {
    goals: (performance?.goals || []).filter((goal) => {
      try {
        const dueDate = new Date(goal.due_date);
        const { start, end } = getDateRange();
        // Comment out to disable filter for debugging
        // return isNaN(dueDate.getTime()) || (dueDate >= start && dueDate <= end);
        return true; // Temporarily include all goals
      } catch (e) {
        console.error("Invalid goal due_date:", goal.due_date);
        return true;
      }
    }),
    achievements: (performance?.achievements || []).filter((ach) => {
      try {
        const achDate = new Date(ach.date);
        const { start, end } = getDateRange();
        // return isNaN(achDate.getTime()) || (achDate >= start && achDate <= end);
        return true; // Temporarily include all achievements
      } catch (e) {
        console.error("Invalid achievement date:", ach.date);
        return true;
      }
    }),
    competencies: performance?.competencies || [],
    appraisal: performance?.appraisal || {},
  };

  const handleSubmitComments = async (e) => {
    e.preventDefault();
    if (!selfReviewComments.trim()) {
      alert("Self-review comments are required.");
      return;
    }
    try {
      await dispatch(
        submitSelfReview({
          employee_id,
          comments: selfReviewComments,
          closing_comments: closingComments,
        })
      ).unwrap();
      setSelfReviewComments("");
      setClosingComments("");
      alert("Comments submitted successfully!");
    } catch (err) {
      console.error("Error submitting comments:", err);
      alert("Failed to submit comments. Please try again.");
    }
  };

  const employeeDetails = {
    name: user?.name || "N/A",
    id: employee_id || "N/A",
    email: user?.email || "N/A",
    jobTitle: user?.designation_name || "N/A",
    manager: user?.manager_name || "N/A",
    department: user?.department_name || "N/A",
    startDate: user?.join_date || "N/A",
    image: Download,
  };

  const goals = filteredPerformance.goals;
  const competencies = filteredPerformance.competencies;
  const achievements = filteredPerformance.achievements;
  const appraisal = filteredPerformance.appraisal;

  const isHrOrSuperAdmin = ["hr", "super_admin"].includes(role);

  return (
    <div className="w-full mt-4 sm:mt-0">
      <div className="hidden sm:flex sm:justify-end sm:items-center">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/emp-dashboard" },
            { label: "View Goals", link: "/employee/viewgoals" },
          ]}
        />
        <PageMeta title="View Goals" description="View your assigned goals and performance details" />
      </div>
      <div className="bg-white rounded-xl p-4 md:p-8 shadow-lg border-1 border-gray-300">
        <div className="bg-gradient-to-r from-slate-700 to-teal-600 rounded-xl p-6 mb-6">
          <h1 className="sm:text-3xl text-2xl font-bold text-white mb-1">My Performance Dashboard</h1>
          <p className="text-sm sm:text-lg md:text-md text-white">View your goals, competencies, and achievements (3-Month Cycle)</p>
        </div>

        {(userError || perfError) && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {userError || perfError || "Failed to load performance data. Please contact HR."}
          </div>
        )}
        {(userLoading || perfLoading) && (
          <div className="flex justify-center mb-4">
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

        <div className="bg-white border-1 border-gray-300 rounded-xl shadow-lg p-6 mb-6 transition-all hover:shadow-xl">
          <div className="flex gap-6 mb-4">
            <div className="flex-shrink-0">
              <img
                src={employeeDetails.image}
                alt={`${employeeDetails.name}'s profile`}
                onError={(e) => (e.target.src = Download)}
                className="w-20 h-20 rounded-full object-cover border-2 border-teal-600"
              />
            </div>
            <div>
              <p className="text-lg text-gray-800 font-semibold">{employeeDetails.name}</p>
              <p className="text-sm text-gray-500">ID: {employeeDetails.id}</p>
              <p className="text-sm text-gray-500">{employeeDetails.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-teal-600 p-3 rounded-lg flex items-center gap-2">
              <Briefcase size={18} className="text-white" />
              <div>
                <p className="text-white text-sm">Job Title</p>
                <p className="text-white text-xs font-medium">{employeeDetails.jobTitle}</p>
              </div>
            </div>
            <div className="bg-teal-600 p-3 rounded-lg flex items-center gap-2">
              <User size={18} className="text-white" />
              <div>
                <p className="text-white text-sm">Manager</p>
                <p className="text-white text-xs font-medium">{employeeDetails.manager}</p>
              </div>
            </div>
            <div className="bg-teal-600 p-3 rounded-lg flex items-center gap-2">
              <Building size={18} className="text-white" />
              <div>
                <p className="text-white text-sm">Department</p>
                <p className="text-white text-xs font-medium">{employeeDetails.department}</p>
              </div>
            </div>
            <div className="bg-teal-600 p-3 rounded-lg flex items-center gap-2">
              <Calendar size={18} className="text-white" />
              <div>
                <p className="text-white text-sm">Start Date</p>
                <p className="text-white text-xs font-medium">{employeeDetails.startDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Goals & Targets */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div className="w-full sm:w-1/2 bg-white border-1 border-gray-300 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">My Goals & Targets</h2>
              {isHrOrSuperAdmin && (
                <button
                  className="bg-teal-600 text-sm text-white px-3 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                  aria-label="Add a new goal"
                >
                  + Add Goal
                </button>
              )}
            </div>
            <div className="space-y-4">
              {goals.length === 0 ? (
                <p className="text-gray-600">
                  No goals assigned for this quarter. Contact HR to set goals.
                </p>
              ) : (
                goals.map((goal, index) => (
                  <div key={goal.id || index} className="p-4 rounded-lg bg-gray-100">
                    <p className="text-gray-800 font-semibold">{goal.title}</p>
                    <p className="text-sm text-gray-600">{goal.description || "No description provided"}</p>
                    <p className="text-sm text-gray-500">Due: {goal.due_date || "N/A"}</p>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${
                            goal.status === "At Risk" ? "bg-red-500" : "bg-teal-600"
                          }`}
                          style={{ width: `${goal.progress || 0}%` }}
                        ></div>
                      </div>
                      <p className={`text-sm mt-1 ${goal.status === "At Risk" ? "text-red-500" : "text-gray-600"}`}>
                        {goal.status || "In Progress"} - {goal.progress || 0}%
                      </p>
                    </div>
                    {goal.tasks?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-gray-700">Tasks:</p>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          {goal.tasks.map((task, taskIndex) => (
                            <li key={task.id || taskIndex}>
                              {task.title} - Due: {task.due_date} (Priority: {task.priority || "N/A"})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* My Competencies */}
          <div className="w-full sm:w-1/2 bg-white border-1 border-gray-300 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">My Competencies</h2>
            <div className="space-y-4">
              {competencies.length === 0 ? (
                <p className="text-gray-600">
                  No competencies recorded for this quarter. Contact HR.
                </p>
              ) : (
                competencies.map((comp, index) => (
                  <div key={comp.id || index} className="p-4 rounded-lg bg-gray-100">
                    <p className="text-gray-800 font-semibold">{comp.skill}</p>
                    <p className="text-sm text-gray-600">Manager Rating: {comp.manager_rating || "N/A"}/10</p>
                    <p className="text-sm text-gray-600 mt-1">{comp.feedback || "No feedback provided"}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Appraisal Summary */}
        <div className="bg-white border-1 border-gray-300 rounded-xl shadow-lg p-6 mb-6 transition-all hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Appraisal Summary</h2>
          {appraisal.performance_score ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Performance Score</p>
                <p
                  className={`text-lg font-bold ${
                    appraisal.performance_score >= 90
                      ? "text-green-600"
                      : appraisal.performance_score >= 80
                      ? "text-blue-600"
                      : appraisal.performance_score >= 70
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {appraisal.performance_score}% / 100
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-lg font-bold text-yellow-600">
                  {(appraisal.performance_score / 20).toFixed(1)} / 5
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Manager Comments</p>
                <p className="text-sm text-gray-600 italic">"{appraisal.manager_comments || "No comments"}"</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bonus Eligible</p>
                <p className="text-sm text-gray-600">{appraisal.bonus_eligible ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Promotion Recommended</p>
                <p className="text-sm text-gray-600">{appraisal.promotion_recommended ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Salary Hike</p>
                <p className="text-sm text-gray-600">
                  {appraisal.salary_hike_percentage ? `${appraisal.salary_hike_percentage}%` : "N/A"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              No appraisal data available for this quarter. Contact HR to complete your appraisal.
            </p>
          )}
        </div>

        {/* Self-Review Comments */}
        <div className="bg-white border-1 border-gray-300 rounded-xl shadow-lg p-6 mb-6 transition-all hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Self-Review Comments</h2>
          <div className="space-y-4">
            <textarea
              value={selfReviewComments}
              onChange={(e) => setSelfReviewComments(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              rows="4"
              placeholder="Enter your self-review comments"
              aria-label="Self-review comments"
            ></textarea>
            <textarea
              value={closingComments}
              onChange={(e) => setClosingComments(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              rows="2"
              placeholder="Enter closing comments (optional)"
              aria-label="Closing comments"
            ></textarea>
            <button
              onClick={handleSubmitComments}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
              aria-label="Submit self-review comments"
            >
              Submit Comments
            </button>
          </div>
        </div>

        {/* My Achievements */}
        <div className="bg-white border-1 border-gray-300 rounded-xl shadow-lg p-6 mb-6 transition-all hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Achievements</h2>
          <div className="grid grid-cols-1 gap-4">
            {achievements.length === 0 ? (
              <p className="text-gray-600">
                No achievements recorded for this quarter. Contact HR.
              </p>
            ) : (
              achievements.map((ach, index) => (
                <div key={ach.id || index} className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-800 font-semibold">{ach.title}</p>
                  <div className="flex items-center mt-1">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-teal-700 bg-teal-100">
                      <Award size={12} className="mr-1" /> {ach.type}
                    </span>
                    <p className="text-xs text-gray-500 pl-2">{ach.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewGoals;