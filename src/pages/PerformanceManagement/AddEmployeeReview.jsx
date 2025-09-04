import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "../../Components/ui/date/DatePicker";
import {
  setEmployeeGoal,
  conductAppraisal,
  fetchEmployeePerformance,
} from "../../redux/slices/performanceSlice";
import { fetchEmployees } from "../../redux/slices/employeeSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";

const steps = [
  "Employee Info",
  "Goals & Tasks",
  "Competencies",
  "Appraisal",
  "Summary",
];

const AddEmployeeReview = () => {
  const dispatch = useDispatch();
  const {
    employees,
    loading: empLoading,
    error: empError,
  } = useSelector((state) => state.employee);
  const {
    loading: perfLoading,
    error: perfError,
    successMessage,
    performance,
  } = useSelector((state) => state.performance);
  const { role, employee_id: loggedInUserId } = useSelector(
    (state) => state.auth
  );

  const initialFormData = {
    employeeDetails: {
      employee_id: "",
      name: "",
      email: "",
      jobTitle: "",
      department: "",
      reviewDate: "",
    },
    goals: [
      {
        id: Date.now() + Math.random(),
        title: "",
        description: "",
        due_date: "",
        tasks: [
          {
            id: Date.now() + Math.random(),
            title: "",
            description: "",
            due_date: "",
            priority: "Medium",
          },
        ],
      },
    ],
    competencies: [
      {
        id: Date.now() + Math.random(),
        skill: "",
        manager_rating: "",
        feedback: "",
      },
    ],
    appraisal: {
      performance_score: "",
      manager_comments: "",
      achievements: [
        {
          id: Date.now() + Math.random(),
          title: "",
          date: "",
          type: "Achievement",
        },
      ],
      bonus_eligible: false,
      promotion_recommended: false,
      salary_hike_percentage: "",
    },
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  // Set default review date to end of current 3-month period
  useEffect(() => {
    const today = new Date();
    const quarterEnd = new Date(today);
    quarterEnd.setMonth(today.getMonth() + 3 - (today.getMonth() % 3));
    quarterEnd.setDate(0); // Last day of the quarter
    setFormData((prev) => ({
      ...prev,
      employeeDetails: {
        ...prev.employeeDetails,
        reviewDate: quarterEnd.toLocaleDateString("en-CA"),
      },
    }));
  }, []);

  useEffect(() => {
    dispatch(fetchEmployees());
    if (performance) {
      setFormData((prev) => ({
        ...prev,
        goals: Array.isArray(performance.goals)
          ? performance.goals.map((goal) => ({
              id: goal.id || Date.now() + Math.random(),
              title: goal.title || "",
              description: goal.description || "",
              due_date: goal.due_date || "",
              tasks: Array.isArray(performance.tasks)
                ? performance.tasks
                    .filter((task) => task.goal_id === goal.id)
                    .map((task) => ({
                      id: task.id || Date.now() + Math.random(),
                      title: task.title || "",
                      description: task.description || "",
                      due_date: task.due_date || "",
                      priority: task.priority || "Medium",
                    }))
                : [],
            }))
          : prev.goals,
        competencies: Array.isArray(performance.competencies)
          ? performance.competencies.map((comp) => ({
              id: Date.now() + Math.random(),
              skill: comp.skill || "",
              manager_rating: comp.manager_rating || "",
              feedback: comp.feedback || "",
            }))
          : prev.competencies,
        appraisal: {
          ...prev.appraisal,
          achievements: Array.isArray(performance.achievements)
            ? performance.achievements.map((ach) => ({
                id: Date.now() + Math.random(),
                title: ach.title || "",
                date: ach.date || "",
                type: ach.type || "Achievement",
              }))
            : prev.appraisal.achievements,
        },
      }));
    }
  }, [dispatch, performance]);

  const handleChange = (e, section, field, index = null, subField = null, taskIndex = null) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = {
        ...prev,
        goals: Array.isArray(prev.goals) ? [...prev.goals] : [],
        competencies: Array.isArray(prev.competencies) ? [...prev.competencies] : [],
        appraisal: {
          ...prev.appraisal,
          achievements: Array.isArray(prev.appraisal.achievements)
            ? [...prev.appraisal.achievements]
            : [],
        },
      };
      if (section === "employeeDetails" && field === "employee_id") {
        const employee = employees.find((emp) => emp.employee_id === value);
        newState.employeeDetails = {
          ...newState.employeeDetails,
          employee_id: value,
          name: employee?.full_name || "",
          email: employee?.email || "",
          jobTitle: employee?.designation_name || "N/A",
          department: employee?.department_name || "N/A",
        };
      } else if (section === "appraisal" && field === "achievements" && index !== null && subField) {
        newState.appraisal.achievements[index] = {
          ...newState.appraisal.achievements[index],
          [subField]: value,
        };
      } else if (section === "goals" && field === "tasks" && index !== null && subField && taskIndex !== null) {
        newState.goals[index].tasks = Array.isArray(newState.goals[index].tasks)
          ? [...newState.goals[index].tasks]
          : [];
        newState.goals[index].tasks[taskIndex] = {
          ...newState.goals[index].tasks[taskIndex],
          [subField]: value,
        };
      } else if (index !== null && subField) {
        newState[section][index] = {
          ...newState[section][index],
          [subField]: value,
        };
      } else if (section) {
        newState[section] = { ...newState[section], [field || name]: value };
      }
      return newState;
    });
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (date, section, field, index = null, subField = null, taskIndex = null) => {
    let formattedDate = "";
    if (date && !isNaN(new Date(date))) {
      formattedDate = new Date(date).toLocaleDateString("en-CA");
    }
    setFormData((prev) => {
      const newState = {
        ...prev,
        goals: Array.isArray(prev.goals) ? [...prev.goals] : [],
        competencies: Array.isArray(prev.competencies) ? [...prev.competencies] : [],
        appraisal: {
          ...prev.appraisal,
          achievements: Array.isArray(prev.appraisal.achievements)
            ? [...prev.appraisal.achievements]
            : [],
        },
      };
      if (section === "appraisal" && field === "achievements" && index !== null && subField) {
        newState.appraisal.achievements[index] = {
          ...newState.appraisal.achievements[index],
          [subField]: formattedDate,
        };
      } else if (section === "goals" && field === "tasks" && index !== null && subField && taskIndex !== null) {
        newState.goals[index].tasks = Array.isArray(newState.goals[index].tasks)
          ? [...newState.goals[index].tasks]
          : [];
        newState.goals[index].tasks[taskIndex] = {
          ...newState.goals[index].tasks[taskIndex],
          [subField]: formattedDate,
        };
      } else if (index !== null && subField) {
        newState[section][index] = {
          ...newState[section][index],
          [subField]: formattedDate,
        };
      } else {
        newState[section] = { ...newState[section], [field]: formattedDate };
      }
      return newState;
    });
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const addItem = (section) => {
    setFormData((prev) => {
      if (section === "achievements") {
        const newAchievements = Array.isArray(prev.appraisal.achievements)
          ? [...prev.appraisal.achievements]
          : [];
        newAchievements.push({
          id: Date.now() + Math.random(),
          title: "",
          date: "",
          type: "Achievement",
        });
        return {
          ...prev,
          appraisal: {
            ...prev.appraisal,
            achievements: newAchievements,
          },
        };
      }
      const newSection = Array.isArray(prev[section]) ? [...prev[section]] : [];
      newSection.push(
        section === "goals"
          ? {
              id: Date.now() + Math.random(),
              title: "",
              description: "",
              due_date: "",
              tasks: [],
            }
          : {
              id: Date.now() + Math.random(),
              skill: "",
              manager_rating: "",
              feedback: "",
            }
      );
      return { ...prev, [section]: newSection };
    });
  };

  const addTask = (goalIndex) => {
    setFormData((prev) => {
      const updatedGoals = Array.isArray(prev.goals) ? [...prev.goals] : [];
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        tasks: Array.isArray(updatedGoals[goalIndex].tasks)
          ? [
              ...updatedGoals[goalIndex].tasks,
              {
                id: Date.now() + Math.random(),
                title: "",
                description: "",
                due_date: "",
                priority: "Medium",
              },
            ]
          : [
              {
                id: Date.now() + Math.random(),
                title: "",
                description: "",
                due_date: "",
                priority: "Medium",
              },
            ],
      };
      return { ...prev, goals: updatedGoals };
    });
  };

  const validateStep = () => {
    const newErrors = {};
    const today = new Date();
    const quarterEnd = new Date(today);
    quarterEnd.setMonth(today.getMonth() + 3 - (today.getMonth() % 3));
    quarterEnd.setDate(0);

    if (currentStep === 0) {
      const { employee_id, name, email, department, reviewDate } =
        formData.employeeDetails;
      if (!employee_id) newErrors.employee_id = "Employee ID is required";
      if (!name) newErrors.name = "Employee name is required";
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        newErrors.email = "Valid email is required";
      if (!department) newErrors.department = "Department is required";
      if (!reviewDate) newErrors.reviewDate = "Review date is required";
      if (reviewDate && new Date(reviewDate) > quarterEnd)
        newErrors.reviewDate = "Review date must be within the 3-month cycle";
      if (employee_id) {
        const employee = employees.find((e) => e.employee_id === employee_id);
        if (!employee) newErrors.employee_id = "Selected employee not found";
      }
    } else if (currentStep === 1) {
      const goals = Array.isArray(formData.goals) ? formData.goals : [];
      if (goals.length === 0) {
        newErrors.form = "At least one goal is required";
      }
      goals.forEach((goal, index) => {
        if (!goal.title)
          newErrors[`goal_title_${index}`] = `Goal ${index + 1}: Title is required`;
        if (!goal.due_date)
          newErrors[`goal_due_date_${index}`] = `Goal ${index + 1}: Due date is required`;
        else if (new Date(goal.due_date) > quarterEnd)
          newErrors[`goal_due_date_${index}`] = `Goal ${index + 1}: Due date must be within the 3-month cycle`;
        const tasks = Array.isArray(goal.tasks) ? goal.tasks : [];
        tasks.forEach((task, taskIndex) => {
          if (!task.title)
            newErrors[`task_title_${index}_${taskIndex}`] = `Goal ${index + 1}, Task ${taskIndex + 1}: Title is required`;
          if (!task.due_date)
            newErrors[`task_due_date_${index}_${taskIndex}`] = `Goal ${index + 1}, Task ${taskIndex + 1}: Due date is required`;
          else if (new Date(task.due_date) > quarterEnd)
            newErrors[`task_due_date_${index}_${taskIndex}`] = `Goal ${index + 1}, Task ${taskIndex + 1}: Due date must be within the 3-month cycle`;
        });
      });
    } else if (currentStep === 2) {
      const competencies = Array.isArray(formData.competencies) ? formData.competencies : [];
      if (competencies.length === 0) {
        newErrors.form = "At least one competency is required";
      }
      competencies.forEach((comp, index) => {
        if (!comp.skill)
          newErrors[`comp_skill_${index}`] = `Competency ${index + 1}: Skill is required`;
        if (
          !comp.manager_rating ||
          comp.manager_rating < 0 ||
          comp.manager_rating > 10
        )
          newErrors[`comp_rating_${index}`] = `Competency ${index + 1}: Valid rating (0-10) is required`;
      });
    } else if (currentStep === 3) {
      const { performance_score, manager_comments, achievements } = formData.appraisal;
      if (!performance_score || performance_score < 0 || performance_score > 100)
        newErrors.performance_score = "Valid performance score (0-100) is required";
      if (!manager_comments)
        newErrors.manager_comments = "Manager comments are required";
      const achievementsArray = Array.isArray(achievements) ? achievements : [];
      if (achievementsArray.length === 0) {
        newErrors.form = "At least one achievement is required";
      }
      achievementsArray.forEach((ach, index) => {
        if (!ach.title)
          newErrors[`ach_title_${index}`] = `Achievement ${index + 1}: Title is required`;
        if (!ach.date)
          newErrors[`ach_date_${index}`] = `Achievement ${index + 1}: Date is required`;
        else if (new Date(ach.date) > quarterEnd)
          newErrors[`ach_date_${index}`] = `Achievement ${index + 1}: Date must be within the 3-month cycle`;
      });
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (!validateStep()) return;
    if (currentStep === 0) {
      const employeeId = formData.employeeDetails.employee_id;
      if (!employeeId) {
        setFormErrors((prev) => ({
          ...prev,
          employee_id: "Please select an employee",
        }));
        return;
      }
      try {
        await dispatch(fetchEmployeePerformance(employeeId)).unwrap();
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      } catch (error) {
        setFormErrors((prev) => ({
          ...prev,
          form: error.message || "Failed to fetch employee performance data",
        }));
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (!["hr", "super_admin"].includes(role)) {
      setFormErrors({ form: "Only HR or Admin can submit reviews" });
      return;
    }

    try {
      for (const goal of formData.goals) {
        await dispatch(
          setEmployeeGoal({
            employee_id: formData.employeeDetails.employee_id,
            title: goal.title,
            description: goal.description,
            due_date: goal.due_date,
            tasks: goal.tasks,
          })
        ).unwrap();
      }
      if (currentStep === steps.length - 1) {
        await dispatch(
          conductAppraisal({
            employee_id: formData.employeeDetails.employee_id,
            reviewer_id: loggedInUserId,
            ...formData.appraisal,
            competencies: formData.competencies,
          })
        ).unwrap();
        setFormData(initialFormData);
        setCurrentStep(0);
      } else {
        nextStep();
      }
    } catch (err) {
      setFormErrors({ form: err.message || "Failed to submit review" });
    }
  };

  return (
    <div className="min-h-screen w-78/100 bg-gray-100 p-4 md:p-8">
      <div className="">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/admin/dashboard" },
            { label: "Add Employee Review", link: "/admin/add-performance" },
          ]}
        />
        <PageMeta title="Add Employee Review" description="Add a performance review for an employee" />
        <div className="bg-gradient-to-r from-slate-700 to-teal-600 rounded-xl shadow-xl p-6 mb-6">
          <h2 className="text-3xl font-bold text-white text-center">
            Add Employee Review (3-Month Cycle)
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {(empError || perfError || formErrors.form) && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {formErrors.form || empError || perfError}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div key={index} className="flex-1 text-center">
                  <div
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                      currentStep >= index
                        ? "bg-gradient-to-r from-slate-700 to-teal-600"
                        : "bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm mt-2 text-gray-600">{step}</p>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-slate-700 to-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee</label>
                  <select
                    name="employee_id"
                    value={formData.employeeDetails.employee_id}
                    onChange={(e) => handleChange(e, "employeeDetails", "employee_id")}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.employee_id} value={emp.employee_id}>
                        {emp.employee_id} - {emp.full_name}
                      </option>
                    ))}
                  </select>
                  {formErrors.employee_id && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.employee_id}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.employeeDetails.name}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.employeeDetails.email}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    type="text"
                    value={formData.employeeDetails.jobTitle}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={formData.employeeDetails.department}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Review Date</label>
                  <DatePicker
                    name="reviewDate"
                    value={
                      formData.employeeDetails.reviewDate
                        ? new Date(formData.employeeDetails.reviewDate)
                        : null
                    }
                    onChange={(date) => handleDateChange(date, "employeeDetails", "reviewDate")}
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                  />
                  {formErrors.reviewDate && (
                    <p className="text-red-600 text-xs mt-1">{formErrors.reviewDate}</p>
                  )}
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Goals & Tasks</h3>
                {(Array.isArray(formData.goals) ? formData.goals : []).map((goal, index) => (
                  <div key={goal.id} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Goal Title</label>
                        <input
                          type="text"
                          name={`goal_title_${index}`}
                          value={goal.title}
                          onChange={(e) => handleChange(e, "goals", null, index, "title")}
                          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                        />
                        {formErrors[`goal_title_${index}`] && (
                          <p className="text-red-600 text-xs mt-1">{formErrors[`goal_title_${index}`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Due Date</label>
                        <DatePicker
                          name={`goal_due_date_${index}`}
                          value={goal.due_date ? new Date(goal.due_date) : null}
                          onChange={(date) => handleDateChange(date, "goals", null, index, "due_date")}
                          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                        />
                        {formErrors[`goal_due_date_${index}`] && (
                          <p className="text-red-600 text-xs mt-1">{formErrors[`goal_due_date_${index}`]}</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                          name={`goal_description_${index}`}
                          value={goal.description}
                          onChange={(e) => handleChange(e, "goals", null, index, "description")}
                          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                          rows="3"
                        />
                      </div>
                    </div>
                    <h4 className="text-md font-semibold text-gray-800 mt-4">Tasks</h4>
                    {(Array.isArray(goal.tasks) ? goal.tasks : []).map((task, taskIndex) => (
                      <div key={task.id} className="mt-2 p-3 bg-gray-100 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Task Title</label>
                            <input
                              type="text"
                              name={`task_title_${index}_${taskIndex}`}
                              value={task.title}
                              onChange={(e) =>
                                handleChange(e, "goals", "tasks", index, "title", taskIndex)
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                            />
                            {formErrors[`task_title_${index}_${taskIndex}`] && (
                              <p className="text-red-600 text-xs mt-1">
                                {formErrors[`task_title_${index}_${taskIndex}`]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Due Date</label>
                            <DatePicker
                              name={`task_due_date_${index}_${taskIndex}`}
                              value={task.due_date ? new Date(task.due_date) : null}
                              onChange={(date) =>
                                handleDateChange(date, "goals", "tasks", index, "due_date", taskIndex)
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                            />
                            {formErrors[`task_due_date_${index}_${taskIndex}`] && (
                              <p className="text-red-600 text-xs mt-1">
                                {formErrors[`task_due_date_${index}_${taskIndex}`]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Priority</label>
                            <select
                              name={`task_priority_${index}_${taskIndex}`}
                              value={task.priority}
                              onChange={(e) =>
                                handleChange(e, "goals", "tasks", index, "priority", taskIndex)
                              }
                              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addTask(index)}
                      className="mt-2 text-teal-600 hover:text-teal-800 transition-colors"
                    >
                      + Add Task
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem("goals")}
                  className="text-teal-600 hover:text-teal-800 transition-colors"
                >
                  + Add Goal
                </button>
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Competencies</h3>
                {(Array.isArray(formData.competencies) ? formData.competencies : []).map((comp, index) => (
                  <div key={comp.id} className="mb-4 p-4 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Skill</label>
                        <input
                          type="text"
                          name={`comp_skill_${index}`}
                          value={comp.skill}
                          onChange={(e) => handleChange(e, "competencies", null, index, "skill")}
                          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                        />
                        {formErrors[`comp_skill_${index}`] && (
                          <p className="text-red-600 text-xs mt-1">{formErrors[`comp_skill_${index}`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Manager Rating (0-10)</label>
                        <input
                          type="number"
                          name={`comp_rating_${index}`}
                          value={comp.manager_rating}
                          onChange={(e) =>
                            handleChange(e, "competencies", null, index, "manager_rating")
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                        />
                        {formErrors[`comp_rating_${index}`] && (
                          <p className="text-red-600 text-xs mt-1">{formErrors[`comp_rating_${index}`]}</p>
                        )}
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Feedback</label>
                        <textarea
                          name={`comp_feedback_${index}`}
                          value={comp.feedback}
                          onChange={(e) => handleChange(e, "competencies", null, index, "feedback")}
                          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                          rows="3"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem("competencies")}
                  className="text-teal-600 hover:text-teal-800 transition-colors"
                >
                  + Add Competency
                </button>
              </div>
            )}
            {currentStep === 3 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Appraisal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Performance Score (0-100)</label>
                    <input
                      type="number"
                      name="performance_score"
                      value={formData.appraisal.performance_score}
                      onChange={(e) => handleChange(e, "appraisal", "performance_score")}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                    />
                    {formErrors.performance_score && (
                      <p className="text-red-600 text-xs mt-1">{formErrors.performance_score}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Manager Comments</label>
                    <textarea
                      name="manager_comments"
                      value={formData.appraisal.manager_comments}
                      onChange={(e) => handleChange(e, "appraisal", "manager_comments")}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                      rows="3"
                    />
                    {formErrors.manager_comments && (
                      <p className="text-red-600 text-xs mt-1">{formErrors.manager_comments}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-md font-semibold text-gray-800">Achievements</h4>
                    {(Array.isArray(formData.appraisal.achievements) ? formData.appraisal.achievements : []).map(
                      (ach, index) => (
                        <div key={ach.id} className="mt-2 p-3 bg-gray-100 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Title</label>
                              <input
                                type="text"
                                name={`ach_title_${index}`}
                                value={ach.title}
                                onChange={(e) =>
                                  handleChange(e, "appraisal", "achievements", index, "title")
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                              />
                              {formErrors[`ach_title_${index}`] && (
                                <p className="text-red-600 text-xs mt-1">{formErrors[`ach_title_${index}`]}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Date</label>
                              <DatePicker
                                name={`ach_date_${index}`}
                                value={ach.date ? new Date(ach.date) : null}
                                onChange={(date) =>
                                  handleDateChange(date, "appraisal", "achievements", index, "date")
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                              />
                              {formErrors[`ach_date_${index}`] && (
                                <p className="text-red-600 text-xs mt-1">{formErrors[`ach_date_${index}`]}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Type</label>
                              <select
                                name={`ach_type_${index}`}
                                value={ach.type}
                                onChange={(e) =>
                                  handleChange(e, "appraisal", "achievements", index, "type")
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                              >
                                <option value="Recognition">Recognition</option>
                                <option value="Achievement">Achievement</option>
                                <option value="Award">Award</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => addItem("achievements")}
                      className="mt-2 text-teal-600 hover:text-teal-800 transition-colors"
                    >
                      + Add Achievement
                    </button>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="bonus_eligible"
                      checked={formData.appraisal.bonus_eligible}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          appraisal: {
                            ...prev.appraisal,
                            bonus_eligible: e.target.checked,
                          },
                        }))
                      }
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-600"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">Bonus Eligible</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="promotion_recommended"
                      checked={formData.appraisal.promotion_recommended}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          appraisal: {
                            ...prev.appraisal,
                            promotion_recommended: e.target.checked,
                          },
                        }))
                      }
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-600"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">Promotion Recommended</label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Salary Hike Percentage</label>
                    <input
                      type="number"
                      name="salary_hike_percentage"
                      value={formData.appraisal.salary_hike_percentage}
                      onChange={(e) => handleChange(e, "appraisal", "salary_hike_percentage")}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                    />
                  </div>
                </div>
              </div>
            )}
            {currentStep === 4 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-800">Employee Details</h4>
                    <p><strong>ID:</strong> {formData.employeeDetails.employee_id}</p>
                    <p><strong>Name:</strong> {formData.employeeDetails.name}</p>
                    <p><strong>Email:</strong> {formData.employeeDetails.email}</p>
                    <p><strong>Job Title:</strong> {formData.employeeDetails.jobTitle}</p>
                    <p><strong>Department:</strong> {formData.employeeDetails.department}</p>
                    <p><strong>Review Date:</strong> {formData.employeeDetails.reviewDate}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-800">Goals & Tasks</h4>
                    {(Array.isArray(formData.goals) ? formData.goals : []).map((goal, index) => (
                      <div key={goal.id} className="mb-2">
                        <p><strong>Goal {index + 1}:</strong> {goal.title} (Due: {goal.due_date})</p>
                        <p>{goal.description || "No description"}</p>
                        <ul className="list-disc pl-5">
                          {(Array.isArray(goal.tasks) ? goal.tasks : []).map((task, taskIndex) => (
                            <li key={task.id}>
                              {task.title} (Due: {task.due_date}, Priority: {task.priority})
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-800">Competencies</h4>
                    {(Array.isArray(formData.competencies) ? formData.competencies : []).map((comp, index) => (
                      <p key={comp.id}>
                        <strong>{comp.skill}:</strong> Rating {comp.manager_rating}/10, {comp.feedback || "No feedback"}
                      </p>
                    ))}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-800">Appraisal</h4>
                    <p><strong>Performance Score:</strong> {formData.appraisal.performance_score}</p>
                    <p><strong>Manager Comments:</strong> {formData.appraisal.manager_comments}</p>
                    <p><strong>Achievements:</strong></p>
                    <ul className="list-disc pl-5">
                      {(Array.isArray(formData.appraisal.achievements) ? formData.appraisal.achievements : []).map(
                        (ach, index) => (
                          <li key={ach.id}>
                            {ach.title} ({ach.date}, {ach.type})
                          </li>
                        )
                      )}
                    </ul>
                    <p><strong>Bonus Eligible:</strong> {formData.appraisal.bonus_eligible ? "Yes" : "No"}</p>
                    <p><strong>Promotion Recommended:</strong> {formData.appraisal.promotion_recommended ? "Yes" : "No"}</p>
                    <p><strong>Salary Hike:</strong> {formData.appraisal.salary_hike_percentage || 0}%</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0 || empLoading || perfLoading}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                type={currentStep === steps.length - 1 ? "submit" : "button"}
                onClick={currentStep === steps.length - 1 ? undefined : nextStep}
                disabled={empLoading || perfLoading}
                className="px-4 py-2 bg-gradient-to-r from-slate-700 to-teal-600 text-white rounded-lg hover:from-slate-800 hover:to-teal-700 disabled:from-slate-600 disabled:to-teal-500 disabled:cursor-not-allowed transition-all"
              >
                {empLoading || perfLoading ? (
                  <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : currentStep === steps.length - 1 ? (
                  "Submit"
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeReview;