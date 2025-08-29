// components/ViewGoals.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Briefcase, User, Building, Calendar } from "lucide-react";
import Download from "/assets/download.png";
import { fetchUserProfile } from "../../redux/slices/userSlice";
import { fetchEmployeePerformance, submitSelfReview } from "../../redux/slices/performanceSlice";

const ViewGoals = () => {
  const dispatch = useDispatch();
  const { user, employee_id, name, role, loading: userLoading, error: userError } = useSelector((state) => state.auth);
  const { performance, loading: perfLoading, error: perfError } = useSelector((state) => state.performance);
  const [selfReviewComments, setSelfReviewComments] = useState("");
  const [closingComments, setClosingComments] = useState("");

  useEffect(() => {
    if (employee_id) {
      dispatch(fetchUserProfile());
      dispatch(fetchEmployeePerformance(employee_id));
    }
  }, [dispatch, employee_id]);

  const handleSubmitComments = async (e) => {
    e.preventDefault();
    if (!selfReviewComments.trim()) return;
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
    } catch (err) {
      console.error("Error submitting comments:", err);
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

  const goals = performance?.goals || [];
  const competencies = performance?.competencies || [];
  const achievements = performance?.achievements || [];
  const feedback = performance?.feedback || [];
  const learningGrowth = performance?.learningGrowth || [];

  return (
    <div className="min-h-screen p-4 sm:p-4 md:p-4 lg:p-6">
      {(userError || perfError) && (
        <p className="text-red-600 text-sm mb-4">{userError || perfError}</p>
      )}
      {(userLoading || perfLoading) && (
        <p className="text-gray-600 text-sm mb-4">Loading...</p>
      )}

      <div className="bg-white rounded-xl shadow-lg p-4 mb-8 transition-all duration-300 hover:shadow-xl">
        <div>
          <div className="flex gap-6 mb-4">
            <div className="flex-shrink-0">
              <img
                src={employeeDetails.image}
                alt={`${employeeDetails.name}'s profile`}
                onError={(e) => (e.target.src = Download)}
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-700"
              />
            </div>
            <div>
              <div>
                <p className="text-lg text-slate-700 font-medium">{employeeDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{employeeDetails.id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{employeeDetails.email}</p>
              </div>
            </div>
          </div>
          <div className="grid items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-grow">
            <div className="bg-slate-700 p-3 rounded-lg flex items-center gap-2">
              <Briefcase size={18} className="text-white" />
              <div>
                <p className="text-white mb-1 text-sm">Job Title</p>
                <p className="text-white text-xs font-medium">{employeeDetails.jobTitle}</p>
              </div>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg flex items-center gap-2">
              <User size={18} className="text-white" />
              <div>
                <p className="text-white mb-1 text-sm">Manager</p>
                <p className="text-white text-xs font-medium">{employeeDetails.manager}</p>
              </div>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg flex items-center gap-2">
              <Building size={18} className="text-white" />
              <div>
                <p className="text-white mb-1 text-sm">Department</p>
                <p className="text-white text-xs font-medium">{employeeDetails.department}</p>
              </div>
            </div>
            <div className="bg-slate-700 p-3 rounded-lg flex items-center gap-2">
              <Calendar size={18} className="text-white" />
              <div>
                <p className="text-white mb-1 text-sm">Start Date</p>
                <p className="text-white text-xs font-medium">{employeeDetails.startDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Goals & Targets */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="w-full sm:w-1/2 bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">My Goals & Targets</h2>
            <button className="bg-slate-700 text-sm text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
              + Add Goal
            </button>
          </div>
          <div className="space-y-4">
            {goals.length === 0 ? (
              <p className="text-gray-600">No goals assigned.</p>
            ) : (
              goals.map((goal, index) => (
                <div key={index} className="p-3 rounded-lg bg-gray-100 transition-colors duration-200">
                  <div className="mb-2">
                    <p className="text-gray-700 font-medium">{goal.title}</p>
                    <p className="text-sm text-gray-500">Due: {goal.due_date}</p>
                  </div>
                  <div className="w-full">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 w-full rounded-full transition-all duration-300 ${
                          goal.status === "At Risk" ? "bg-red-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        goal.status === "At Risk" ? "text-red-500" : "text-gray-600"
                      }`}
                    >
                      {goal.status} - {goal.progress}%
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Competencies */}
        <div className="w-full sm:w-1/2 bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-lg font-medium text-gray-800 mb-4">My Competencies</h2>
          <div className="space-y-4">
            {competencies.length === 0 ? (
              <p className="text-gray-600">No competencies recorded.</p>
            ) : (
              competencies.map((comp, index) => (
                <div key={index} className="p-3 rounded-lg bg-gray-100 transition-colors duration-200">
                  <div className="mb-2">
                    <p className="text-gray-700 font-medium">{comp.skill}</p>
                    <p className="text-sm font-semibold text-gray-500">
                      Self Rating: {comp.self_rating}/10 | Manager Rating: {comp.manager_rating}/10
                    </p>
                  </div>
                  <div className="pt-1">
                    <p className="text-slate-700 font-medium">{comp.feedback}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Feedback Received */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Feedback Received</h2>
        <div className="space-y-4">
          {feedback.length === 0 ? (
            <p className="text-gray-600">No feedback received.</p>
          ) : (
            feedback.map((fb, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg">
                <p className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                  {fb.source}
                </p>
                <strong className="text-xs text-gray-500 font-semibold pl-2">{fb.timestamp}</strong>
                <p className="text-slate-700 mt-2">{fb.comment}</p>
              </div>
            ))
          )}
          <div className="mt-4">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Add Self-Review Comments</h3>
            <textarea
              value={selfReviewComments}
              onChange={(e) => setSelfReviewComments(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
              rows="4"
              placeholder="Enter your self-review comments"
            ></textarea>
            <button
              onClick={handleSubmitComments}
              className="mt-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              Submit Comments
            </button>
          </div>
        </div>
      </div>

      {/* My Achievements */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Achievements</h2>
        <div className="grid grid-cols-1 gap-4">
          {achievements.length === 0 ? (
            <p className="text-gray-600">No achievements recorded.</p>
          ) : (
            achievements.map((ach, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded-lg transition-colors duration-200">
                <p className="text-gray-700 font-medium">{ach.title}</p>
                <div className="flex items-center mt-1">
                  <p className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground">
                    {ach.type}
                  </p>
                  <p className="text-xs font-semibold pl-2 text-gray-500">{ach.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Learning & Growth</h2>
        <div className="space-y-4">
          {learningGrowth.length === 0 ? (
            <p className="text-gray-600">No learning or growth activities recorded.</p>
          ) : (
            learningGrowth.map((item, index) => (
              <div key={index} className="p-3 rounded-lg bg-gray-50 transition-colors duration-200">
                <p className="text-gray-700 font-medium">{item.title}</p>
                {item.progress ? (
                  <div className="w-full sm:w-1/3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Progress - {item.progress}%</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Completed: {item.completed}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewGoals;