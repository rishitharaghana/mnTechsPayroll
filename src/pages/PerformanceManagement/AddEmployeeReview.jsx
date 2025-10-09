import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isAfter, endOfQuarter, startOfQuarter } from "date-fns";
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
  const { employees, loading: empLoading, error: empError } = useSelector((state) => state.employee);
  const { loading: perfLoading, error: perfError, successMessage, performance } = useSelector((state) => state.performance);
  const { role, employee_id: loggedInUserId } = useSelector((state) => state.auth);

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
    learningGrowth: [],
    appraisal: {
      performance_score: "",
      manager_comments: "",
      achievements: [],
      bonus_eligible: false,
      promotion_recommended: false,
      salary_hike_percentage: "",
      new_designation_name: "",
      new_department_name: "",
      basic_salary: "",
      hra_percentage: "",
      hra: "",
      special_allowances: "",
      provident_fund_percentage: "",
      esic_percentage: "",
      bonuses: [],
    },
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const today = new Date();
    const quarterEnd = endOfQuarter(today);
    setFormData((prev) => ({
      ...prev,
      employeeDetails: {
        ...prev.employeeDetails,
        reviewDate: quarterEnd.toISOString().split("T")[0],
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
    if (performance && currentStep === 0 && formData.goals.length === 0) {
      setFormData((prev) => ({
        ...prev,
        goals: Array.isArray(performance.goals) && performance.goals.length > 0
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
        learningGrowth: Array.isArray(performance.learningGrowth)
          ? performance.learningGrowth.map((lg) => ({
              id: lg.id || Date.now() + Math.random(),
              title: lg.title || "",
              progress: lg.progress || 0,
              completed: lg.completed || false,
            }))
          : prev.learningGrowth,
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
  }, [performance, currentStep]);

  const handleChange = (e, section, field, index = null, subField = null, taskIndex = null) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newState = {
        ...prev,
        goals: Array.isArray(prev.goals) ? [...prev.goals] : [],
        competencies: Array.isArray(prev.competencies) ? [...prev.competencies] : [],
        learningGrowth: Array.isArray(prev.learningGrowth) ? [...prev.learningGrowth] : [],
        appraisal: {
          ...prev.appraisal,
          achievements: Array.isArray(prev.appraisal.achievements) ? [...prev.appraisal.achievements] : [],
          bonuses: Array.isArray(prev.appraisal.bonuses) ? [...prev.appraisal.bonuses] : [],
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
      } else if (section === "appraisal" && field === "bonuses" && index !== null && subField) {
        newState.appraisal.bonuses[index] = {
          ...newState.appraisal.bonuses[index],
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
    const formattedDate = date && !isNaN(new Date(date)) ? new Date(date).toISOString().split("T")[0] : "";
    setFormData((prev) => {
      const newState = {
        ...prev,
        goals: Array.isArray(prev.goals) ? [...prev.goals] : [],
        competencies: Array.isArray(prev.competencies) ? [...prev.competencies] : [],
        learningGrowth: Array.isArray(prev.learningGrowth) ? [...prev.learningGrowth] : [],
        appraisal: {
          ...prev.appraisal,
          achievements: Array.isArray(prev.appraisal.achievements) ? [...prev.appraisal.achievements] : [],
          bonuses: Array.isArray(prev.appraisal.bonuses) ? [...prev.appraisal.bonuses] : [],
        },
      };
      if (section === "appraisal" && field === "achievements" && index !== null && subField) {
        newState.appraisal.achievements[index] = {
          ...newState.appraisal.achievements[index],
          [subField]: formattedDate,
        };
      } else if (section === "appraisal" && field === "bonuses" && index !== null && subField) {
        newState.appraisal.bonuses[index] = {
          ...newState.appraisal.bonuses[index],
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
    const today = new Date();
    const defaultDueDate = endOfQuarter(today).toISOString().split("T")[0];
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
              due_date: defaultDueDate,
              tasks: [],
            },
          ],
        };
      } else if (section === "competencies") {
        return {
          ...prev,
          competencies: [
            ...prev.competencies,
            {
              id: Date.now() + Math.random(),
              skill: "",
              manager_rating: "",
              feedback: "",
            },
          ],
        };
      } else if (section === "achievements") {
        return {
          ...prev,
          appraisal: {
            ...prev.appraisal,
            achievements: [
              ...prev.appraisal.achievements,
              {
                id: Date.now() + Math.random(),
                title: "",
                date: "",
                type: "Achievement",
              },
            ],
          },
        };
      } else if (section === "bonuses") {
        return {
          ...prev,
          appraisal: {
            ...prev.appraisal,
            bonuses: [
              ...prev.appraisal.bonuses,
              {
                id: Date.now() + Math.random(),
                bonus_type: "one_time",
                amount: "",
                effective_date: "",
                remarks: "",
              },
            ],
          },
        };
      }
      return prev;
    });
  };

  const addTask = (goalIndex) => {
    const today = new Date();
    const defaultDueDate = endOfQuarter(today).toISOString().split("T")[0];
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
                due_date: defaultDueDate,
                priority: "Medium",
              },
            ]
          : [
              {
                id: Date.now() + Math.random(),
                title: "",
                description: "",
                due_date: defaultDueDate,
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
    const quarterStart = startOfQuarter(today);
    const quarterEnd = endOfQuarter(today);

    if (currentStep === 0) {
      const { employee_id, name, email, department, reviewDate } = formData.employeeDetails;
      if (!employee_id) newErrors.employee_id = "Employee ID is required";
      if (!name) newErrors.name = "Employee name is required";
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        newErrors.email = "Valid email is required";
      if (!department) newErrors.department = "Department is required";
      if (!reviewDate) newErrors.reviewDate = "Review date is required";
      if (reviewDate && (isAfter(new Date(reviewDate), quarterEnd) || new Date(reviewDate) < quarterStart))
        newErrors.reviewDate = "Review date must be within the current quarter";
      if (employee_id && !employees.find((e) => e.employee_id === employee_id)) {
        newErrors.employee_id = "Selected employee not found";
      }
      const goals = Array.isArray(formData.goals) ? formData.goals : [];
      if (goals.length === 0) newErrors.form = "At least one goal is required";
      goals.forEach((goal, index) => {
        if (!goal.title)
          newErrors[`goal_title_${index}`] = `Goal ${index + 1}: Title is required`;
        if (!goal.due_date)
          newErrors[`goal_due_date_${index}`] = `Goal ${index + 1}: Due date is required`;
        else if (isAfter(new Date(goal.due_date), quarterEnd) || new Date(goal.due_date) < quarterStart)
          newErrors[`goal_due_date_${index}`] = `Goal ${index + 1}: Due date must be within the current quarter`;
        const tasks = Array.isArray(goal.tasks) ? goal.tasks : [];
        if (tasks.length === 0)
          newErrors[`goal_tasks_${index}`] = `Goal ${index + 1}: At least one task is required`;
        tasks.forEach((task, taskIndex) => {
          if (!task.title)
            newErrors[`task_title_${index}_${taskIndex}`] = `Goal ${index + 1}, Task ${taskIndex + 1}: Title is required`;
          if (!task.due_date)
            newErrors[`task_due_date_${index}_${taskIndex}`] = `Goal ${index + 1}, Task ${taskIndex + 1}: Due date is required`;
          else if (isAfter(new Date(task.due_date), quarterEnd) || new Date(task.due_date) < quarterStart)
            newErrors[`task_due_date_${index}_${taskIndex}`] = `Goal ${index + 1}, Task ${taskIndex + 1}: Due date must be within the current quarter`;
          if (!task.priority)
            newErrors[`task_priority_${index}_${taskIndex}`] = `Goal ${index + 1}, Task ${taskIndex + 1}: Priority is required`;
        });
      });
    } else if (currentStep === 1) {
      const competencies = Array.isArray(formData.competencies) ? formData.competencies : [];
      if (competencies.length === 0)
        newErrors.form = "At least one competency is required";
      competencies.forEach((comp, index) => {
        if (!comp.skill)
          newErrors[`comp_skill_${index}`] = `Competency ${index + 1}: Skill is required`;
        if (!comp.manager_rating || comp.manager_rating < 0 || comp.manager_rating > 10) {
          newErrors[`comp_rating_${index}`] = `Competency ${index + 1}: Valid rating (0-10) is required`;
        }
      });
    } else if (currentStep === 2) {
      const { performance_score, manager_comments, achievements, bonuses, promotion_recommended, salary_hike_percentage } = formData.appraisal;
      if (!performance_score || performance_score < 0 || performance_score > 100) {
        newErrors.performance_score = "Valid performance score (0-100) is required";
      }
      if (!manager_comments)
        newErrors.manager_comments = "Manager comments are required";
      const achievementsArray = Array.isArray(achievements) ? achievements : [];
      if (achievementsArray.length === 0)
        newErrors.form = "At least one achievement is required";
      achievementsArray.forEach((ach, index) => {
        if (!ach.title)
          newErrors[`ach_title_${index}`] = `Achievement ${index + 1}: Title is required`;
        if (!ach.date)
          newErrors[`ach_date_${index}`] = `Achievement ${index + 1}: Date is required`;
        else if (isAfter(new Date(ach.date), quarterEnd) || new Date(ach.date) < quarterStart)
          newErrors[`ach_date_${index}`] = `Achievement ${index + 1}: Date must be within the current quarter`;
      });
      if (promotion_recommended) {
        if (!formData.appraisal.new_designation_name)
          newErrors.new_designation_name = "New designation is required for promotion";
        if (!formData.appraisal.new_department_name)
          newErrors.new_department_name = "New department is required for promotion";
      }
      if (salary_hike_percentage || promotion_recommended || (Array.isArray(bonuses) && bonuses.length > 0)) {
        if (!formData.appraisal.basic_salary || formData.appraisal.basic_salary <= 0)
          newErrors.basic_salary = "Valid basic salary is required";
        if (!formData.appraisal.hra_percentage || formData.appraisal.hra_percentage < 0 || formData.appraisal.hra_percentage > 100)
          newErrors.hra_percentage = "HRA percentage must be between 0 and 100";
        if (!formData.appraisal.hra || formData.appraisal.hra < 0)
          newErrors.hra = "Valid HRA is required";
        if (!formData.appraisal.special_allowances || formData.appraisal.special_allowances < 0)
          newErrors.special_allowances = "Special allowances must be non-negative";
        if (!formData.appraisal.provident_fund_percentage || formData.appraisal.provident_fund_percentage < 0)
          newErrors.provident_fund_percentage = "Provident fund percentage must be non-negative";
        if (!formData.appraisal.esic_percentage || formData.appraisal.esic_percentage < 0)
          newErrors.esic_percentage = "ESIC percentage must be non-negative";
      }
      if (role === "super_admin" && Array.isArray(bonuses)) {
        bonuses.forEach((bonus, index) => {
          if (!bonus.bonus_type)
            newErrors[`bonus_type_${index}`] = `Bonus ${index + 1}: Type is required`;
          if (!bonus.amount || bonus.amount <= 0)
            newErrors[`bonus_amount_${index}`] = `Bonus ${index + 1}: Amount must be positive`;
          if (!bonus.effective_date)
            newErrors[`bonus_effective_date_${index}`] = `Bonus ${index + 1}: Effective date is required`;
          else if (new Date(bonus.effective_date) < today)
            newErrors[`bonus_effective_date_${index}`] = `Bonus ${index + 1}: Effective date must be today or later`;
        });
      }
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (!validateStep()) {
      toast.error("Please fix all errors before proceeding");
      return;
    }
    if (currentStep === 0 && formData.employeeDetails.employee_id) {
      try {
        // Submit goals to backend
        const updatedGoals = [];
        for (const goal of formData.goals) {
          if (!goal.title || !goal.due_date) {
            throw new Error(`Invalid goal data: Title or due_date missing for goal ID ${goal.id}`);
          }
          const goalPayload = {
            employee_id: formData.employeeDetails.employee_id,
            title: goal.title,
            description: goal.description || "",
            due_date: goal.due_date,
            tasks: Array.isArray(goal.tasks)
              ? goal.tasks.map((task) => {
                  if (!task.title || !task.due_date) {
                    throw new Error(`Invalid task data: Title or due_date missing for task ID ${task.id} in goal ID ${goal.id}`);
                  }
                  return {
                    title: task.title,
                    description: task.description || "",
                    due_date: task.due_date,
                    priority: task.priority || "Medium",
                  };
                })
              : [],
            appraisal_id: null, // Set to null since appraisal is not yet created
          };
          console.log(`Submitting goal payload:`, JSON.stringify(goalPayload, null, 2));
          const result = await dispatch(setEmployeeGoal(goalPayload)).unwrap();
          console.log(`Goal ${goal.title} submitted successfully:`, result);
          updatedGoals.push(result.data);
        }

        // Update formData.goals with server response
        setFormData((prev) => ({
          ...prev,
          goals: updatedGoals,
        }));

        // Fetch employee performance data
        await dispatch(fetchEmployeePerformance(formData.employeeDetails.employee_id)).unwrap();
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      } catch (error) {
        console.error("Error in nextStep:", error);
        setFormErrors((prev) => ({
          ...prev,
          form: error.message || "Failed to save goals or fetch employee performance data",
        }));
        toast.error(error.message || "Failed to save goals or fetch employee performance data");
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    if (!["hr", "super_admin"].includes(role)) {
      setFormErrors({ form: "Only HR or Admin can submit reviews" });
      toast.error("Only HR or Admin can submit reviews");
      return;
    }

    try {
      // Submit goals (already submitted in nextStep, but re-validate)
      const updatedGoals = [];
      for (const goal of formData.goals) {
        if (!goal.title || !goal.due_date) {
          throw new Error(`Invalid goal data: Title or due_date missing for goal ID ${goal.id}`);
        }
        const goalPayload = {
          employee_id: formData.employeeDetails.employee_id,
          title: goal.title,
          description: goal.description || "",
          due_date: goal.due_date,
          tasks: Array.isArray(goal.tasks)
            ? goal.tasks.map((task) => {
                if (!task.title || !task.due_date) {
                  throw new Error(`Invalid task data: Title or due_date missing for task ID ${task.id} in goal ID ${goal.id}`);
                }
                return {
                  title: task.title,
                  description: task.description || "",
                  due_date: task.due_date,
                  priority: task.priority || "Medium",
                };
              })
            : [],
          appraisal_id: null,
        };
        console.log(`Submitting goal payload:`, JSON.stringify(goalPayload, null, 2));
        const result = await dispatch(setEmployeeGoal(goalPayload)).unwrap();
        console.log(`Goal ${goal.title} submitted successfully:`, result);
        updatedGoals.push(result.data);
      }

      // Update formData.goals with server response
      setFormData((prev) => ({
        ...prev,
        goals: updatedGoals,
      }));

      // Submit appraisal
      const appraisalPayload = {
        employee_id: formData.employeeDetails.employee_id,
        reviewer_id: loggedInUserId,
        performance_score: parseFloat(formData.appraisal.performance_score),
        manager_comments: formData.appraisal.manager_comments,
        achievements: formData.appraisal.achievements,
        bonus_eligible: formData.appraisal.bonus_eligible,
        promotion_recommended: formData.appraisal.promotion_recommended,
        salary_hike_percentage: formData.appraisal.salary_hike_percentage
          ? parseFloat(formData.appraisal.salary_hike_percentage)
          : null,
        new_designation_name: formData.appraisal.new_designation_name || null,
        new_department_name: formData.appraisal.new_department_name || null,
        basic_salary: formData.appraisal.basic_salary ? parseFloat(formData.appraisal.basic_salary) : null,
        hra_percentage: formData.appraisal.hra_percentage ? parseFloat(formData.appraisal.hra_percentage) : null,
        hra: formData.appraisal.hra ? parseFloat(formData.appraisal.hra) : null,
        special_allowances: formData.appraisal.special_allowances
          ? parseFloat(formData.appraisal.special_allowances)
          : null,
        provident_fund_percentage: formData.appraisal.provident_fund_percentage
          ? parseFloat(formData.appraisal.provident_fund_percentage)
          : null,
        esic_percentage: formData.appraisal.esic_percentage ? parseFloat(formData.appraisal.esic_percentage) : null,
        competencies: formData.competencies,
        goals: updatedGoals, // Include goals in appraisal payload
      };
      console.log("Submitting appraisal:", JSON.stringify(appraisalPayload, null, 2));
      const appraisalResult = await dispatch(conductAppraisal(appraisalPayload)).unwrap();
      console.log("Appraisal submitted successfully:", appraisalResult);

      // Submit bonuses (super_admin only)
      if (role === "super_admin" && Array.isArray(formData.appraisal.bonuses) && formData.appraisal.bonuses.length > 0) {
        for (const bonus of formData.appraisal.bonuses) {
          const bonusPayload = {
            employee_id: formData.employeeDetails.employee_id,
            bonusData: {
              bonus_type: bonus.bonus_type,
              amount: parseFloat(bonus.amount),
              effective_date: bonus.effective_date,
              remarks: bonus.remarks,
            },
          };
          console.log("Submitting bonus:", JSON.stringify(bonusPayload, null, 2));
          await dispatch(awardBonus(bonusPayload)).unwrap();
        }
      }

      toast.success("Performance review submitted successfully");
      setFormData(initialFormData);
      setCurrentStep(0);
    } catch (err) {
      console.error("Submission error:", err);
      setFormErrors({ form: err.message || "Failed to submit review. Please check all fields and try again." });
      toast.error(err.message || "Failed to submit review. Please check all fields and try again.");
    }
  };

  return (
    <div className="w-full mt-4 sm:mt-0">
      <div className="hidden sm:flex sm:justify-end sm:items-center">
        <PageBreadcrumb
          items={[
            { label: "Home", link: `/${role === "hr" ? "hr" : "admin"}-dashboard` },
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
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg text-sm sm:text-base">
              {successMessage}
            </div>
          )}
          {(perfError || empError || formErrors.form) && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm sm:text-base">
              {formErrors.form || perfError || empError || "An error occurred. Please try again."}
            </div>
          )}
          <div className="bg-gray-100 p-4 rounded-lg mb-4 hidden">
            <h3 className="text-sm font-semibold">Debug: Form Data</h3>
            <pre className="text-xs">{JSON.stringify(formData, null, 2)}</pre>
          </div>
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
                perfError={perfError}
              />
            )}
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
                onClick={currentStep === steps.length - 1 ? undefined : nextStep}
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