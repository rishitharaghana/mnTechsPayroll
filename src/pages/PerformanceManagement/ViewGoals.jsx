import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Briefcase, User, Building, Calendar, Award, Target, Clock } from "lucide-react";
import { startOfQuarter, endOfQuarter } from "date-fns";
import Download from "/assets/download.png";
import { fetchEmployees, getCurrentUserProfile } from "../../redux/slices/employeeSlice";
import { fetchEmployeePerformance, submitSelfReview } from "../../redux/slices/performanceSlice";
import PageMeta from "../../Components/common/PageMeta";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import { toast } from "react-toastify";

const ViewGoals = () => {
  const dispatch = useDispatch();
  const { user,  role, loading: userLoading, error: userError } = useSelector((state) => state.auth);
  const { performance, loading: perfLoading, error: perfError } = useSelector((state) => state.performance);
  const { employees, employee_id,loading: empLoading, error: empError } = useSelector((state) => state.employee);
  const [selfReviewComments, setSelfReviewComments] = useState("");
  const [closingComments, setClosingComments] = useState("");
  const [activeTab, setActiveTab] = useState("goals");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(employee_id || "");

  useEffect(() => {
    if (employee_id) {
      dispatch(getCurrentUserProfile()).catch((err) => {
        toast.error("Failed to load user profile.");
      });
      dispatch(fetchEmployees()).catch((err) => {
        toast.error("Failed to load employees.");
      });
      dispatch(fetchEmployeePerformance(selectedEmployeeId)).catch((err) => {
        toast.error("Failed to load performance data.");
      });
     
    }
  }, [dispatch, employee_id, selectedEmployeeId]);

  const getDateRange = () => {
    const today = new Date();
    const start = startOfQuarter(today);
    const end = endOfQuarter(today);
    console.log("Date range:", { start: start.toISOString(), end: end.toISOString() });
    return { start, end };
  };

  const filteredPerformance = {
    goals: (performance?.goals || []).filter((goal) => {
      try {
        const dueDate = new Date(goal.due_date);
        const { start, end } = getDateRange();
        if (isNaN(dueDate.getTime())) {
          console.warn("Invalid goal due_date:", goal);
          return false;
        }
        return dueDate >= start && dueDate <= end;
      } catch (e) {
        console.error("Error parsing goal due_date:", goal, e);
        return false;
      }
    }),
    achievements: (performance?.achievements || []).filter((ach) => {
      try {
        const achDate = new Date(ach.date);
        const { start, end } = getDateRange();
        if (isNaN(achDate.getTime())) {
          console.warn("Invalid achievement date:", ach);
          return false;
        }
        return achDate >= start && achDate <= end;
      } catch (e) {
        console.error("Error parsing achievement date:", ach, e);
        return false;
      }
    }),
    competencies: (performance?.competencies || []).filter((comp) => {
      try {
        const compDate = new Date(comp.created_at || comp.updated_at);
        const { start, end } = getDateRange();
        if (isNaN(compDate.getTime())) {
          console.warn("Invalid competency date:", comp);
          return false;
        }
        return compDate >= start && compDate <= end;
      } catch (e) {
        console.error("Error parsing competency date:", comp, e);
        return false;
      }
    }),
    appraisals: (performance?.appraisals || []).filter((app) => {
      try {
        const appDate = new Date(app.created_at);
        const { start, end } = getDateRange();
        if (isNaN(appDate.getTime())) {
          console.warn("Invalid appraisal date:", app);
          return false;
        }
        return appDate >= start && appDate <= end;
      } catch (e) {
        console.error("Error parsing appraisal date:", app, e);
        return false;
      }
    }),
    bonuses: (performance?.bonuses || []).filter((bonus) => {
      try {
        const bonusDate = new Date(bonus.effective_date);
        const { start, end } = getDateRange();
        if (isNaN(bonusDate.getTime())) {
          console.warn("Invalid bonus date:", bonus);
          return false;
        }
        return bonusDate >= start && bonusDate <= end;
      } catch (e) {
        console.error("Error parsing bonus date:", bonus, e);
        return false;
      }
    }),
  };

  const handleSubmitComments = async (e) => {
    e.preventDefault();
    if (!selfReviewComments.trim()) {
      toast.error("Self-review comments are required.");
      return;
    }
    try {
      await dispatch(
        submitSelfReview({
          employee_id: selectedEmployeeId,
          comments: selfReviewComments,
          closing_comments: closingComments,
        })
      ).unwrap();
      setSelfReviewComments("");
      setClosingComments("");
      toast.success("Comments submitted successfully!");
    } catch (err) {
      toast.error(err || "Failed to submit comments.");
    }
  };

  const employeeDetails = {
    name: user?.name || "N/A",
    id: selectedEmployeeId || "N/A",
    email: user?.email || "N/A",
    jobTitle: user?.designation_name || "N/A",
    manager: user?.manager_name || "N/A",
    department: user?.department_name || "N/A",
    startDate: user?.join_date || "N/A",
    image: Download,
  };

  if (selectedEmployeeId !== employee_id && employees) {
    const selectedEmployee = employees.find((emp) => emp.employee_id === selectedEmployeeId);
    if (selectedEmployee) {
      employeeDetails.name = selectedEmployee.full_name || "N/A";
      employeeDetails.email = selectedEmployee.email || "N/A";
      employeeDetails.jobTitle = selectedEmployee.designation_name || "N/A";
      employeeDetails.department = selectedEmployee.department_name || "N/A";
      employeeDetails.manager = selectedEmployee.manager_name || "N/A";
      employeeDetails.startDate = selectedEmployee.join_date || "N/A";
    }
  }

  const tabs = [
    { id: "goals", label: "Goals & Tasks", icon: Target },
    { id: "competencies", label: "Competencies", icon: User },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "appraisals", label: "Appraisals", icon: Briefcase },
    { id: "bonuses", label: "Bonuses", icon: Award },
  ];

  const renderTabContent = () => {
    console.log(`Rendering tab: ${activeTab}`, filteredPerformance[activeTab]);
    switch (activeTab) {
      case "goals":
        return (
          <div className="space-y-4">
            {filteredPerformance.goals.length === 0 ? (
              <p className="text-gray-600">
                No goals assigned for this quarter. Contact HR to set goals.
              </p>
            ) : (
              filteredPerformance.goals.map((goal, index) => (
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
                            {task.title} - Due: {task.due_date || "N/A"} (Priority: {task.priority || "N/A"})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        );
      case "competencies":
        return (
          <div className="space-y-4">
            {filteredPerformance.competencies.length === 0 ? (
              <p className="text-gray-600">
                No competencies recorded for this quarter. Contact HR.
              </p>
            ) : (
              filteredPerformance.competencies.map((comp, index) => (
                <div key={comp.id || index} className="p-4 rounded-lg bg-gray-100">
                  <p className="text-gray-800 font-semibold">{comp.skill}</p>
                  <p className="text-sm text-gray-600">Manager Rating: {comp.manager_rating || "N/A"}/10</p>
                  <p className="text-sm text-gray-600 mt-1">{comp.feedback || "No feedback provided"}</p>
                </div>
              ))
            )}
          </div>
        );
      case "achievements":
        return (
          <div className="grid grid-cols-1 gap-4">
            {filteredPerformance.achievements.length === 0 ? (
              <p className="text-gray-600">
                No achievements recorded for this quarter. Contact HR.
              </p>
            ) : (
              filteredPerformance.achievements.map((ach, index) => (
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
        );
      case "appraisals":
        return (
          <div className="space-y-4">
            {filteredPerformance.appraisals.length === 0 ? (
              <p className="text-gray-600">
                No appraisals available for this quarter. Contact HR.
              </p>
            ) : (
              filteredPerformance.appraisals.map((appraisal, index) => (
                <div key={appraisal.appraisal_id || index} className="p-4 rounded-lg bg-gray-100">
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
                </div>
              ))
            )}
          </div>
        );
      case "bonuses":
        return (
          <div className="space-y-4">
            {filteredPerformance.bonuses.length === 0 ? (
              <p className="text-gray-600">
                No bonuses awarded for this quarter. Contact HR.
              </p>
            ) : (
              filteredPerformance.bonuses.map((bonus, index) => (
                <div key={bonus.id || index} className="p-4 rounded-lg bg-gray-100">
                  <p className="text-gray-800 font-semibold">{bonus.bonus_type === "one_time" ? "One-Time Bonus" : "Recurring Bonus"}</p>
                  <p className="text-sm text-gray-600">Amount: ₹{bonus.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Effective Date: {bonus.effective_date}</p>
                  <p className="text-sm text-gray-600">Remarks: {bonus.remarks || "N/A"}</p>
                </div>
              ))
            )}
          </div>
        );
     
      default:
        return null;
    }
  };

  return (
    <div className="w-full mt-4 sm:mt-0">
      <div className="hidden sm:flex sm:justify-end sm:items-center">
        <PageBreadcrumb
          items={[
            { label: "Home", link: `/${role === "employee" ? "emp" : role}-dashboard` },
            { label: "My Performance", link: "/employee/viewgoals" },
          ]}
        />
        <PageMeta title="My Performance" description="View your goals, competencies, achievements, appraisals, bonuses" />
      </div>
      <div className="bg-white rounded-xl p-4 md:p-8 shadow-lg border-1 border-gray-300">
        <div className="bg-gradient-to-r from-slate-700 to-teal-600 rounded-xl p-6 mb-6">
          <h1 className="sm:text-3xl text-2xl font-bold text-white mb-1">My Performance Dashboard</h1>
          <p className="text-sm sm:text-lg md:text-md text-white">View your performance for the current 3-month cycle</p>
        </div>

        {["dept_head", "manager", "hr", "super_admin"].includes(role) && (
          <div className="mb-6">
            <label className="text-sm text-gray-600">Select Employee</label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              disabled={userLoading || perfLoading || empLoading}
            >
              <option value="">Select an employee</option>
              {employees
                ?.filter((emp) =>
                  role === "hr" || role === "super_admin"
                    ? true
                    : emp.department_name === user?.department_name || emp.employee_id === employee_id
                )
                .map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.full_name} ({emp.employee_id})
                  </option>
                ))}
            </select>
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

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center px-4 py-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? "border-b-2 border-teal-600 text-teal-600"
                    : "text-gray-600 hover:text-teal-600"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={16} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border-1 border-gray-300 rounded-xl shadow-lg p-6 mb-6 transition-all hover:shadow-xl">
          {renderTabContent()}
        </div>

        {role === "employee" && selectedEmployeeId === employee_id && (
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
                disabled={userLoading || perfLoading}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed transition-colors"
                aria-label="Submit self-review comments"
              >
                Submit Comments
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewGoals;