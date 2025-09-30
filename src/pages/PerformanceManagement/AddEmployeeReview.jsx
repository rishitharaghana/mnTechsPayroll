import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmployeeGoal,
  conductAppraisal,
  fetchEmployeePerformance,
  awardBonus,
} from "../../redux/slices/performanceSlice";
import { fetchEmployees } from "../../redux/slices/employeeSlice";
import PageBreadcrumb from "../../Components/common/PageBreadcrumb";
import PageMeta from "../../Components/common/PageMeta";
import EmployeeInfoGoalsForm from "./EmployeeInfoGoalsForm";
import SelfReviewCompetenciesForm from "./SelfReviewCompetenciesForm";
import AppraisalSummaryForm from "./AppraisalSummaryForm";
import { toast } from "react-toastify";

const steps = [
  "Employee Info & Goals",
  "Self-Review & Competencies",
  "Appraisal & Summary",
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
    goals: [],
    competencies: [],
    appraisal: {
      performance_score: "",
      manager_comments: "",
      achievements: [],
      bonus_eligible: false,
      promotion_recommended: false,
      salary_hike_percentage: "",
      bonuses: [], // Added bonuses
    },
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const today = new Date();
    const quarterEnd = new Date(today);
    quarterEnd.setMonth(today.getMonth() + 3 - (today.getMonth() % 3));
    quarterEnd.setDate(0);
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
    if (formData.employeeDetails.employee_id) {
      dispatch(fetchEmployeePerformance(formData.employeeDetails.employee_id));
    }
  }, [dispatch, formData.employeeDetails.employee_id]);

  useEffect(() => {
    if (performance) {
      setFormData((prev) => ({
        ...prev,
        goals: Array.isArray(performance.goals)
          ? performance.goals.map((goal) => ({
              id: goal.id || Date.now() + Math.random(),
              title: goal.title || "",
              description: goal.description || "",
              due_date: goal.due_date || "",
              progress: goal.progress || 0,
              status: goal.status || "Not Started",
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
          bonuses: Array.isArray(performance.bonuses)
            ? performance.bonuses.map((bonus) => ({
                id: Date.now() + Math.random(),
                bonus_type: bonus.bonus_type || "one_time",
                amount: bonus.amount || "",
                effective_date: bonus.effective_date || "",
                remarks: bonus.remarks || "",
              }))
            : prev.appraisal.bonuses,
        },
      }));
    }
  }, [performance]);

  const handleChange = (
    e,
    section,
    field,
    index = null,
    subField = null,
    taskIndex = null
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = {
        ...prev,
        goals: Array.isArray(prev.goals) ? [...prev.goals] : [],
        competencies: Array.isArray(prev.competencies)
          ? [...prev.competencies]
          : [],
        appraisal: {
          ...prev.appraisal,
          achievements: Array.isArray(prev.appraisal.achievements)
            ? [...prev.appraisal.achievements]
            : [],
          bonuses: Array.isArray(prev.appraisal.bonuses)
            ? [...prev.appraisal.bonuses]
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
      } else if (
        section === "appraisal" &&
        field === "achievements" &&
        index !== null &&
        subField
      ) {
        newState.appraisal.achievements[index] = {
          ...newState.appraisal.achievements[index],
          [subField]: value,
        };
      } else if (
        section === "appraisal" &&
        field === "bonuses" &&
        index !== null &&
        subField
      ) {
        newState.appraisal.bonuses[index] = {
          ...newState.appraisal.bonuses[index],
          [subField]: value,
        };
      } else if (
        section === "goals" &&
        field === "tasks" &&
        index !== null &&
        subField &&
        taskIndex !== null
      ) {
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

  const handleDateChange = (
    date,
    section,
    field,
    index = null,
    subField = null,
    taskIndex = null
  ) => {
    const formattedDate =
      date && !isNaN(new Date(date))
        ? new Date(date).toLocaleDateString("en-CA")
        : "";
    setFormData((prev) => {
      const newState = {
        ...prev,
        goals: Array.isArray(prev.goals) ? [...prev.goals] : [],
        competencies: Array.isArray(prev.competencies)
          ? [...prev.competencies]
          : [],
        appraisal: {
          ...prev.appraisal,
          achievements: Array.isArray(prev.appraisal.achievements)
            ? [...prev.appraisal.achievements]
            : [],
          bonuses: Array.isArray(prev.appraisal.bonuses)
            ? [...prev.appraisal.bonuses]
            : [],
        },
      };
      if (
        section === "appraisal" &&
        field === "achievements" &&
        index !== null &&
        subField
      ) {
        newState.appraisal.achievements[index] = {
          ...newState.appraisal.achievements[index],
          [subField]: formattedDate,
        };
      } else if (
        section === "appraisal" &&
        field === "bonuses" &&
        index !== null &&
        subField
      ) {
        newState.appraisal.bonuses[index] = {
          ...newState.appraisal.bonuses[index],
          [subField]: formattedDate,
        };
      } else if (
        section === "goals" &&
        field === "tasks" &&
        index !== null &&
        subField &&
        taskIndex !== null
      ) {
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
      if (section === "goals") {
        return {
          ...prev,
          goals: [
            ...prev.goals,
            {
              id: Date.now() + Math.random(),
              title: "",
              description: "",
              due_date: "",
              tasks: [],
            },
          ],
        };
      }
      return {
        ...prev,
        [section]: [
          ...prev[section],
          {
            id: Date.now() + Math.random(),
            skill: "",
            manager_rating: "",
            feedback: "",
          },
        ],
      };
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
      if (
        employee_id &&
        !employees.find((e) => e.employee_id === employee_id)
      ) {
        newErrors.employee_id = "Selected employee not found";
      }
      const goals = Array.isArray(formData.goals) ? formData.goals : [];
      if (goals.length === 0) newErrors.form = "At least one goal is required";
      goals.forEach((goal, index) => {
        if (!goal.title)
          newErrors[`goal_title_${index}`] = `Goal ${
            index + 1
          }: Title is required`;
        if (!goal.due_date)
          newErrors[`goal_due_date_${index}`] = `Goal ${
            index + 1
          }: Due date is required`;
        else if (new Date(goal.due_date) > quarterEnd)
          newErrors[`goal_due_date_${index}`] = `Goal ${
            index + 1
          }: Due date must be within the 3-month cycle`;
        const tasks = Array.isArray(goal.tasks) ? goal.tasks : [];
        tasks.forEach((task, taskIndex) => {
          if (!task.title)
            newErrors[`task_title_${index}_${taskIndex}`] = `Goal ${
              index + 1
            }, Task ${taskIndex + 1}: Title is required`;
          if (!task.due_date)
            newErrors[`task_due_date_${index}_${taskIndex}`] = `Goal ${
              index + 1
            }, Task ${taskIndex + 1}: Due date is required`;
          else if (new Date(task.due_date) > quarterEnd)
            newErrors[`task_due_date_${index}_${taskIndex}`] = `Goal ${
              index + 1
            }, Task ${
              taskIndex + 1
            }: Due date must be within the 3-month cycle`;
        });
      });
    } else if (currentStep === 1) {
      const competencies = Array.isArray(formData.competencies)
        ? formData.competencies
        : [];
      if (competencies.length === 0)
        newErrors.form = "At least one competency is required";
      competencies.forEach((comp, index) => {
        if (!comp.skill)
          newErrors[`comp_skill_${index}`] = `Competency ${
            index + 1
          }: Skill is required`;
        if (
          !comp.manager_rating ||
          comp.manager_rating < 0 ||
          comp.manager_rating > 10
        ) {
          newErrors[`comp_rating_${index}`] = `Competency ${
            index + 1
          }: Valid rating (0-10) is required`;
        }
      });
    } else if (currentStep === 2) {
      const { performance_score, manager_comments, achievements, bonuses } =
        formData.appraisal;
      if (
        !performance_score ||
        performance_score < 0 ||
        performance_score > 100
      ) {
        newErrors.performance_score =
          "Valid performance score (0-100) is required";
      }
      if (!manager_comments)
        newErrors.manager_comments = "Manager comments are required";
      const achievementsArray = Array.isArray(achievements) ? achievements : [];
      if (achievementsArray.length === 0)
        newErrors.form = "At least one achievement is required";
      achievementsArray.forEach((ach, index) => {
        if (!ach.title)
          newErrors[`ach_title_${index}`] = `Achievement ${
            index + 1
          }: Title is required`;
        if (!ach.date)
          newErrors[`ach_date_${index}`] = `Achievement ${
            index + 1
          }: Date is required`;
        else if (new Date(ach.date) > quarterEnd)
          newErrors[`ach_date_${index}`] = `Achievement ${
            index + 1
          }: Date must be within the 3-month cycle`;
      });
      if (role === "super_admin" && Array.isArray(bonuses)) {
        bonuses.forEach((bonus, index) => {
          if (!bonus.bonus_type)
            newErrors[`bonus_type_${index}`] = `Bonus ${index + 1}: Type is required`;
          if (!bonus.amount || bonus.amount <= 0)
            newErrors[`bonus_amount_${index}`] = `Bonus ${index + 1}: Amount must be positive`;
          if (!bonus.effective_date)
            newErrors[`bonus_effective_date_${index}`] = `Bonus ${index + 1}: Effective date is required`;
          else if (new Date(bonus.effective_date) < new Date())
            newErrors[`bonus_effective_date_${index}`] = `Bonus ${index + 1}: Effective date must be today or later`;
        });
      }
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (!validateStep()) return;
    if (currentStep === 0 && formData.employeeDetails.employee_id) {
      try {
        await dispatch(
          fetchEmployeePerformance(formData.employeeDetails.employee_id)
        ).unwrap();
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      } catch (error) {
        setFormErrors((prev) => ({
          ...prev,
          form: error || "Failed to fetch employee performance data",
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
      toast.error("Only HR or Admin can submit reviews");
      return;
    }

    try {
      // Submit goals
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

      // Submit appraisal
      await dispatch(
        conductAppraisal({
          employee_id: formData.employeeDetails.employee_id,
          reviewer_id: loggedInUserId,
          ...formData.appraisal,
          competencies: formData.competencies,
        })
      ).unwrap();

      // Submit bonuses (super_admin only)
      if (role === "super_admin" && Array.isArray(formData.appraisal.bonuses) && formData.appraisal.bonuses.length > 0) {
        for (const bonus of formData.appraisal.bonuses) {
          await dispatch(
            awardBonus({
              employee_id: formData.employeeDetails.employee_id,
              bonusData: {
                bonus_type: bonus.bonus_type,
                amount: parseFloat(bonus.amount),
                effective_date: bonus.effective_date,
                remarks: bonus.remarks,
              },
            })
          ).unwrap();
        }
      }

      toast.success("Performance review submitted successfully");
      setFormData(initialFormData);
      setCurrentStep(0);
    } catch (err) {
      setFormErrors({ form: err || "Failed to submit review" });
      toast.error(err || "Failed to submit review");
    }
  };

  return (
    <div className="w-full mt-4 sm:mt-0">
      <div className="hidden sm:flex sm:justify-end sm:items-center">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/admin/dashboard" },
            { label: "Add Employee Review", link: "/admin/add-performance" },
          ]}
        />
        <PageMeta
          title="Add Employee Review"
          description="Add a performance review for an employee"
        />
      </div>
      <div className="bg-white rounded-xl p-4 md:p-8">
        <div className="bg-gradient-to-r from-slate-700 to-teal-600 border-1 border-gray-300 rounded-xl shadow-xl sm:p-6 p-4 mb-6">
          <h2 className="md:text-3xl sm:text-2xl text-xl font-bold text-white">
            Add Employee Review (3-Month Cycle)
          </h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-300 shadow-lg p-4 sm:p-6 md:p-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-sm sm:text-base">
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {perfError && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm sm:text-base">
              {perfError}
            </div>
          )}

          {/* Stepper */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-4 sm:space-y-0 sm:space-x-2">
              {steps.map((step, index) => (
                <div key={index} className="flex-1 text-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                      currentStep >= index
                        ? "bg-gradient-to-r from-slate-700 to-teal-600"
                        : "bg-gray-300"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-xs sm:text-sm mt-2 text-gray-600">
                    {step}
                  </p>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div
                className="bg-gradient-to-r from-slate-700 to-teal-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 0 && (
              <EmployeeInfoGoalsForm
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                handleChange={handleChange}
                handleDateChange={handleDateChange}
                addItem={addItem}
                addTask={addTask}
                employees={employees}
                performance={performance}
              />
            )}
            {currentStep === 1 && (
              <SelfReviewCompetenciesForm
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                handleChange={handleChange}
                performance={performance}
              />
            )}
            {currentStep === 2 && (
              <AppraisalSummaryForm
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                handleChange={handleChange}
                handleDateChange={handleDateChange}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0 || empLoading || perfLoading}
                className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                Previous
              </button>
              <button
                type={currentStep === steps.length - 1 ? "submit" : "button"}
                onClick={
                  currentStep === steps.length - 1 ? undefined : nextStep
                }
                disabled={empLoading || perfLoading}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-slate-700 to-teal-600 text-white rounded-lg hover:from-slate-800 hover:to-teal-700 disabled:from-slate-600 disabled:to-teal-500 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
              >
                {empLoading || perfLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mx-auto text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
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