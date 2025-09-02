import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "../../Components/ui/date/DatePicker"; // Custom DatePicker
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
        title: "",
        description: "",
        due_date: "",
        tasks: [
          { title: "", description: "", due_date: "", priority: "Medium" },
        ],
      },
    ],
    competencies: [{ skill: "", manager_rating: "", feedback: "" }],
    appraisal: {
      performance_score: "",
      manager_comments: "",
      achievements: [{ title: "", date: "", type: "Achievement" }],
      bonus_eligible: false,
      promotion_recommended: false,
      salary_hike_percentage: "",
    },
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleChange = (e, section, field, index = null, subField = null) => {
    const { name, value } = e.target;
    if (section === "employeeDetails" && field === "employee_id") {
      const employee = employees.find((emp) => emp.employee_id === value);
      setFormData((prev) => ({
        ...prev,
        employeeDetails: {
          ...prev.employeeDetails,
          employee_id: value,
          name: employee?.name || "",
          email: employee?.email || "",
          jobTitle: employee?.designation_name || "N/A",
          department: employee?.department_name || "N/A",
        },
      }));
    } else if (index !== null && subField) {
      setFormData((prev) => {
        const updatedSection = [...prev[section]];
        updatedSection[index] = { ...updatedSection[index], [subField]: value };
        return { ...prev, [section]: updatedSection };
      });
    } else if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field || name]: value },
      }));
    }
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (
    date,
    section,
    field,
    index = null,
    subField = null
  ) => {
    let formattedDate = "";
    if (date && !isNaN(new Date(date))) {
      const d = new Date(date);
      formattedDate = d.toLocaleDateString("en-CA"); // gives YYYY-MM-DD in local timezone
    }

    if (index !== null && subField) {
      setFormData((prev) => {
        const updatedSection = [...prev[section]];
        if (section === "goals" && subField.startsWith("tasks_")) {
          const taskIndex = parseInt(subField.split("_")[1]);
          updatedSection[index].tasks[taskIndex] = {
            ...updatedSection[index].tasks[taskIndex],
            [field]: formattedDate,
          };
        } else if (section === "appraisal" && field === "achievements") {
          updatedSection[index] = {
            ...updatedSection[index],
            [subField]: formattedDate,
          };
        } else {
          updatedSection[index] = {
            ...updatedSection[index],
            [field]: formattedDate,
          };
        }
        return { ...prev, [section]: updatedSection };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: formattedDate },
      }));
    }

    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const addItem = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        section === "goals"
          ? { title: "", description: "", due_date: "", tasks: [] }
          : section === "competencies"
          ? { skill: "", manager_rating: "", feedback: "" }
          : { title: "", date: "", type: "Achievement" },
      ],
    }));
  };

  const addTask = (goalIndex) => {
    setFormData((prev) => {
      const updatedGoals = [...prev.goals];
      updatedGoals[goalIndex] = {
        ...updatedGoals[goalIndex],
        tasks: [
          ...updatedGoals[goalIndex].tasks,
          { title: "", description: "", due_date: "", priority: "Medium" },
        ],
      };
      return { ...prev, goals: updatedGoals };
    });
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 0) {
      const { employee_id, name, email, department, reviewDate } =
        formData.employeeDetails;
      if (!employee_id) newErrors.employee_id = "Employee ID is required";
      if (!name) newErrors.name = "Employee name is required";
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        newErrors.email = "Valid email is required";
      if (!department) newErrors.department = "Department is required";
      if (!reviewDate) newErrors.reviewDate = "Review date is required";
      if (employee_id) {
        const employee = employees.find((e) => e.employee_id === employee_id);
        if (!employee) newErrors.employee_id = "Selected employee not found";
      }
    } else if (currentStep === 1) {
      formData.goals.forEach((goal, index) => {
        if (!goal.title)
          newErrors[`goal_title_${index}`] = `Goal ${
            index + 1
          }: Title is required`;
        if (!goal.due_date)
          newErrors[`goal_due_date_${index}`] = `Goal ${
            index + 1
          }: Due date is required`;
        goal.tasks.forEach((task, taskIndex) => {
          if (!task.title)
            newErrors[`task_title_${index}_${taskIndex}`] = `Goal ${
              index + 1
            }, Task ${taskIndex + 1}: Title is required`;
          if (!task.due_date)
            newErrors[`task_due_date_${index}_${taskIndex}`] = `Goal ${
              index + 1
            }, Task ${taskIndex + 1}: Due date is required`;
        });
      });
    } else if (currentStep === 2) {
      formData.competencies.forEach((comp, index) => {
        if (!comp.skill)
          newErrors[`comp_skill_${index}`] = `Competency ${
            index + 1
          }: Skill is required`;
        if (
          !comp.manager_rating ||
          comp.manager_rating < 0 ||
          comp.manager_rating > 10
        )
          newErrors[`comp_rating_${index}`] = `Competency ${
            index + 1
          }: Valid rating (0-10) is required`;
      });
    } else if (currentStep === 3) {
      const { performance_score, manager_comments, achievements } =
        formData.appraisal;
      if (
        !performance_score ||
        performance_score < 0 ||
        performance_score > 100
      )
        newErrors.performance_score =
          "Valid performance score (0-100) is required";
      if (!manager_comments)
        newErrors.manager_comments = "Manager comments are required";
      achievements.forEach((ach, index) => {
        if (!ach.title)
          newErrors[`ach_title_${index}`] = `Achievement ${
            index + 1
          }: Title is required`;
        if (!ach.date)
          newErrors[`ach_date_${index}`] = `Achievement ${
            index + 1
          }: Date is required`;
      });
    }
    console.log("Validation errors:", newErrors);
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) {
      console.log("Validation failed, cannot proceed to next step");
      return;
    }
    if (currentStep === 0) {
      dispatch(fetchEmployeePerformance(formData.employeeDetails.employee_id));
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      if (["hr", "super_admin"].includes(role)) {
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
      } else {
        setFormErrors({ form: "Only HR or Admin can submit reviews" });
      }
    } catch (err) {
      console.error("Submission error:", err);
      setFormErrors({ form: err.message || "Failed to submit review" });
    }
  };

  return (
    <div className="w-78/100">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", to: "/" },
            {
              label: "Add Employee Review",
              to: "/add-employee-review",
              active: true,
            },
          ]}
        />
        <PageMeta
          title="Add Employee Review"
          description="Add employee review"
        />
      </div>
      <div className="w-full bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl underline font-bold text-gray-800 mb-10 text-center">
          Add Employee Review
        </h2>
        {formErrors.form && (
          <p className="text-red-600 text-sm mb-4">{formErrors.form}</p>
        )}
        {(empError || perfError) && (
          <p className="text-red-600 text-sm mb-4">{empError || perfError}</p>
        )}
        {successMessage && (
          <p className="text-green-600 text-sm mb-4">{successMessage}</p>
        )}

        <div className="flex justify-between mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 text-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  currentStep >= index
                    ? "bg-teal-600 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <p className="text-sm mt-2">{step}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employee
                </label>
                <select
                  value={formData.employeeDetails.employee_id}
                  onChange={(e) =>
                    handleChange(e, "employeeDetails", "employee_id")
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.employee_id} - {emp.name}
                    </option>
                  ))}
                </select>
                {formErrors.employee_id && (
                  <p className="text-red-600 text-xs mt-1">
                    {formErrors.employee_id}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.employeeDetails.name}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.employeeDetails.email}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.employeeDetails.jobTitle}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.employeeDetails.department}
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                />
              </div>
              <div className="w-8/12">
                <label className="block text-sm font-medium text-gray-700">
                  Review Date
                </label>
                <DatePicker
                  name="reviewDate"
                  value={
                    formData.employeeDetails.reviewDate
                      ? new Date(formData.employeeDetails.reviewDate)
                      : null
                  }
                  onChange={(date) =>
                    handleDateChange(date, "employeeDetails", "reviewDate")
                  }
                />
                {formErrors.reviewDate && (
                  <p className="text-red-600 text-xs mt-1">
                    {formErrors.reviewDate}
                  </p>
                )}
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Goals & Tasks
              </h3>
              {formData.goals.map((goal, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Goal Title
                      </label>
                      <input
                        type="text"
                        value={goal.title}
                        onChange={(e) =>
                          handleChange(e, "goals", "title", index)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                      />
                      {formErrors[`goal_title_${index}`] && (
                        <p className="text-red-600 text-xs mt-1">
                          {formErrors[`goal_title_${index}`]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Due Date
                      </label>
                      <DatePicker
                        name={`goal_due_date_${index}`}
                        value={goal.due_date ? new Date(goal.due_date) : null}
                        onChange={(date) =>
                          handleDateChange(date, "goals", "due_date", index)
                        }
                      />
                      {formErrors[`goal_due_date_${index}`] && (
                        <p className="text-red-600 text-xs mt-1">
                          {formErrors[`goal_due_date_${index}`]}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={goal.description}
                        onChange={(e) =>
                          handleChange(e, "goals", "description", index)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                        rows="3"
                      />
                    </div>
                  </div>
                  <h4 className="text-md font-semibold text-gray-800 mt-4">
                    Tasks
                  </h4>
                  {goal.tasks.map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className="mt-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Task Title
                          </label>
                          <input
                            type="text"
                            value={task.title}
                            onChange={(e) =>
                              handleChange(e, "goals", "tasks", index, `title`)
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                          />
                          {formErrors[`task_title_${index}_${taskIndex}`] && (
                            <p className="text-red-600 text-xs mt-1">
                              {formErrors[`task_title_${index}_${taskIndex}`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Due Date
                          </label>
                          <DatePicker
                            name={`task_due_date_${index}_${taskIndex}`}
                            value={
                              task.due_date ? new Date(task.due_date) : null
                            }
                            onChange={(date) =>
                              handleDateChange(
                                date,
                                "goals",
                                "due_date",
                                index,
                                `tasks_${taskIndex}`
                              )
                            }
                          />
                          {formErrors[
                            `task_due_date_${index}_${taskIndex}`
                          ] && (
                            <p className="text-red-600 text-xs mt-1">
                              {
                                formErrors[
                                  `task_due_date_${index}_${taskIndex}`
                                ]
                              }
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Priority
                          </label>
                          <select
                            value={task.priority}
                            onChange={(e) =>
                              handleChange(
                                e,
                                "goals",
                                "tasks",
                                index,
                                `priority`
                              )
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
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
                    className="mt-2 text-teal-600 hover:underline"
                  >
                    + Add Task
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem("goals")}
                className="text-teal-600 hover:underline"
              >
                + Add Goal
              </button>
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Competencies
              </h3>
              {formData.competencies.map((comp, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Skill
                      </label>
                      <input
                        type="text"
                        value={comp.skill}
                        onChange={(e) =>
                          handleChange(e, "competencies", "skill", index)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                      />
                      {formErrors[`comp_skill_${index}`] && (
                        <p className="text-red-600 text-xs mt-1">
                          {formErrors[`comp_skill_${index}`]}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Manager Rating (0-10)
                      </label>
                      <input
                        type="number"
                        value={comp.manager_rating}
                        onChange={(e) =>
                          handleChange(
                            e,
                            "competencies",
                            "manager_rating",
                            index
                          )
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                      />
                      {formErrors[`comp_rating_${index}`] && (
                        <p className="text-red-600 text-xs mt-1">
                          {formErrors[`comp_rating_${index}`]}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Feedback
                      </label>
                      <textarea
                        value={comp.feedback}
                        onChange={(e) =>
                          handleChange(e, "competencies", "feedback", index)
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem("competencies")}
                className="text-teal-600 hover:underline"
              >
                + Add Competency
              </button>
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Appraisal
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Performance Score (0-100)
                  </label>
                  <input
                    type="number"
                    value={formData.appraisal.performance_score}
                    onChange={(e) =>
                      handleChange(e, "appraisal", "performance_score")
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                  />
                  {formErrors.performance_score && (
                    <p className="text-red-600 text-xs mt-1">
                      {formErrors.performance_score}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Manager Comments
                  </label>
                  <textarea
                    value={formData.appraisal.manager_comments}
                    onChange={(e) =>
                      handleChange(e, "appraisal", "manager_comments")
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                    rows="3"
                  />
                  {formErrors.manager_comments && (
                    <p className="text-red-600 text-xs mt-1">
                      {formErrors.manager_comments}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <h4 className="text-md font-semibold text-gray-800">
                    Achievements
                  </h4>
                  {formData.appraisal.achievements.map((ach, index) => (
                    <div key={index} className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Title
                          </label>
                          <input
                            type="text"
                            value={ach.title}
                            onChange={(e) =>
                              handleChange(
                                e,
                                "appraisal",
                                "achievements",
                                index,
                                "title"
                              )
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                          />
                          {formErrors[`ach_title_${index}`] && (
                            <p className="text-red-600 text-xs mt-1">
                              {formErrors[`ach_title_${index}`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Date
                          </label>
                          <DatePicker
                            name={`ach_date_${index}`}
                            value={ach.date ? new Date(ach.date) : null}
                            onChange={(date) =>
                              handleDateChange(
                                date,
                                "appraisal",
                                "achievements",
                                index,
                                "date"
                              )
                            }
                          />
                          {formErrors[`ach_date_${index}`] && (
                            <p className="text-red-600 text-xs mt-1">
                              {formErrors[`ach_date_${index}`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Type
                          </label>
                          <select
                            value={ach.type}
                            onChange={(e) =>
                              handleChange(
                                e,
                                "appraisal",
                                "achievements",
                                index,
                                "type"
                              )
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                          >
                            <option value="Recognition">Recognition</option>
                            <option value="Achievement">Achievement</option>
                            <option value="Award">Award</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addItem("achievements")}
                    className="mt-2 text-teal-600 hover:underline"
                  >
                    + Add Achievement
                  </button>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Bonus Eligible
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
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
                    className="h-4 w-4 text-teal-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Promotion Recommended
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Salary Hike Percentage
                  </label>
                  <input
                    type="number"
                    value={formData.appraisal.salary_hike_percentage}
                    onChange={(e) =>
                      handleChange(e, "appraisal", "salary_hike_percentage")
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Summary
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800">
                    Employee Details
                  </h4>
                  <p>
                    <strong>ID:</strong> {formData.employeeDetails.employee_id}
                  </p>
                  <p>
                    <strong>Name:</strong> {formData.employeeDetails.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.employeeDetails.email}
                  </p>
                  <p>
                    <strong>Job Title:</strong>{" "}
                    {formData.employeeDetails.jobTitle}
                  </p>
                  <p>
                    <strong>Department:</strong>{" "}
                    {formData.employeeDetails.department}
                  </p>
                  <p>
                    <strong>Review Date:</strong>{" "}
                    {formData.employeeDetails.reviewDate}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800">
                    Goals & Tasks
                  </h4>
                  {formData.goals.map((goal, index) => (
                    <div key={index} className="mb-2">
                      <p>
                        <strong>Goal {index + 1}:</strong> {goal.title} (Due:{" "}
                        {goal.due_date})
                      </p>
                      <p>{goal.description || "No description"}</p>
                      <ul className="list-disc pl-5">
                        {goal.tasks.map((task, taskIndex) => (
                          <li key={taskIndex}>
                            {task.title} (Due: {task.due_date}, Priority:{" "}
                            {task.priority})
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800">
                    Competencies
                  </h4>
                  {formData.competencies.map((comp, index) => (
                    <p key={index}>
                      <strong>{comp.skill}:</strong> Rating{" "}
                      {comp.manager_rating}/10, {comp.feedback || "No feedback"}
                    </p>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-md font-semibold text-gray-800">
                    Appraisal
                  </h4>
                  <p>
                    <strong>Performance Score:</strong>{" "}
                    {formData.appraisal.performance_score}
                  </p>
                  <p>
                    <strong>Manager Comments:</strong>{" "}
                    {formData.appraisal.manager_comments}
                  </p>
                  <p>
                    <strong>Achievements:</strong>
                  </p>
                  <ul className="list-disc pl-5">
                    {formData.appraisal.achievements.map((ach, index) => (
                      <li key={index}>
                        {ach.title} ({ach.date}, {ach.type})
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>Bonus Eligible:</strong>{" "}
                    {formData.appraisal.bonus_eligible ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Promotion Recommended:</strong>{" "}
                    {formData.appraisal.promotion_recommended ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Salary Hike:</strong>{" "}
                    {formData.appraisal.salary_hike_percentage || 0}%
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type={currentStep === steps.length - 1 ? "submit" : "button"}
              onClick={currentStep === steps.length - 1 ? undefined : nextStep}
              disabled={empLoading || perfLoading}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed"
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeReview;
