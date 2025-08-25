import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PageBreadcrumb from '../../Components/common/PageBreadcrumb';
import PageMeta from '../../Components/common/PageMeta';
import { Calendar } from 'lucide-react';
import Button from '../../Components/ui/date/Button';
import Download from '/assets/download.png';

const steps = ['Employee Info', 'Performance', 'Review', 'Summary'];

const AddEmployeeReview = () => {
  const initialFormData = {
    employeeDetails: {
      name: '',
      id: '',
      email: '',
      jobTitle: '',
      department: '',
      reviewerName: '',
      reviewDate: '',
      image: Download,
    },
    goals: {
      title: '',
      due: '',
      progress: '',
      status: ''
    },
    competencies: {
      skill: '',
      selfRating: '',
      managerRating: '',
      feedback: ''
    },
    feedback: {
      source: '',
      date: '',
      comment: ''
    },
    achievements: {
      title: '',
      date: '',
      type: ''
    },
    learningGrowth: {
      title: '',
      progressStatus: 'Progress',
      progress: '',
      completed: ''
    },
    reviewedBy: '',
    reviewedDate: '',
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Department-to-reviewer mapping
  const departmentReviewers = {
    Admin: ['John Smith', 'Alice Brown'],
    Manager: ['Sarah Johnson', 'Michael Lee'],
    HR: ['Emma Davis', 'Robert Wilson'],
    TeamLead: ['Lisa Taylor', 'James Clark'],
    Employee: ['Tom White', 'Sophie Green']
  };

  // Role hierarchy to prevent lower roles from reviewing higher roles
  const roleHierarchy = {
    Admin: 4,
    Manager: 3,
    HR: 2,
    TeamLead: 1,
    Employee: 0
  };

  const handleChange = (e, section, field = null) => {
    const { name, value } = e.target;
    if (section === 'employeeDetails' && field === 'department') {
      // Update department and reset reviewerName
      setFormData((prev) => ({
        ...prev,
        employeeDetails: { ...prev.employeeDetails, department: value, reviewerName: '' },
        competencies: { ...prev.competencies, selfRating: value, managerRating: value },
        feedback: { ...prev.feedback, source: `${value} Feedback` }
      }));
    } else if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field || name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleDateChange = (date, section, field) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: formattedDate },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: formattedDate }));
    }
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const nextStep = () => {
    // Validate hierarchy before moving to next step
    if (currentStep === 0 && formData.employeeDetails.department && formData.employeeDetails.reviewerName) {
      const reviewerRole = Object.keys(departmentReviewers).find(dep => 
        departmentReviewers[dep].includes(formData.employeeDetails.reviewerName)
      );
      const employeeRole = formData.employeeDetails.department;
      if (reviewerRole && employeeRole && roleHierarchy[reviewerRole] < roleHierarchy[employeeRole]) {
        setErrors((prev) => ({
          ...prev,
          reviewerName: 'Lower roles cannot review higher roles.'
        }));
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const goToStep = (index) => setCurrentStep(index);

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToStep(index);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    setFormData(initialFormData);
    setCurrentStep(0);
  };

  return (
    <div>
      <style>
        {`
          .react-datepicker-wrapper {
            width: 100%;
          }
          .react-datepicker__input-container input {
            width: 100%;
            padding: 0.75rem 2.5rem 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            transition: all 0.3s ease;
          }
          .react-datepicker__input-container input:focus {
            outline: none;
            border-color: #14b8a6;
            box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
          }
          .step-transition {
            animation: slideIn 0.3s ease-in-out;
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
      <div className="flex justify-end px-4 sm:px-6 lg:px-8">
        <PageMeta title="Add/Edit Employee Review" description="Add or edit an employee performance review" />
        <PageBreadcrumb
          items={[
            { label: 'Home', link: '/' },
            { label: 'Add/Edit Employee Review', link: '/admin/add-performance' },
          ]}
        />
      </div>
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 transform transition-all duration-500">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-8 tracking-tight">
            Employee Performance Review
          </h2>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-10 relative">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center z-10 group">
                <button
                  onClick={() => goToStep(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 ${
                    currentStep === index
                      ? 'bg-teal-600 text-white ring-2 ring-teal-600 ring-offset-2'
                      : currentStep > index
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2`}
                  aria-current={currentStep === index ? 'step' : undefined}
                  aria-label={`Go to ${step}`}
                >
                  {index + 1}
                </button>
                <span
                  className={`mt-2 text-xs sm:text-sm font-bold text-black tracking-tight transition-all duration-300 group-hover:scale-105 ${
                    currentStep === index ? 'scale-105 text-teal-600' : 'text-slate-700'
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
            <div className="absolute top-4 sm:top-5 left-0 right-0 h-0.5 bg-slate-700 z-0">
              <div
                className="h-full bg-teal-600 transition-all duration-500 ease-in-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 step-transition" key={currentStep}>
              {currentStep === 0 && (
                <>
                  <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="employee-name">
                      Employee Name
                    </label>
                    <input
                      id="employee-name"
                      type="text"
                      name="name"
                      value={formData.employeeDetails.name}
                      onChange={(e) => handleChange(e, 'employeeDetails')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
                      placeholder="Enter employee name"
                      aria-label="Employee Name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="employee-id">
                      Employee ID
                    </label>
                    <input
                      id="employee-id"
                      type="text"
                      name="id"
                      value={formData.employeeDetails.id}
                      onChange={(e) => handleChange(e, 'employeeDetails')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
                      placeholder="Enter employee ID"
                      aria-label="Employee ID"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="employee-email">
                      Email Address
                    </label>
                    <input
                      id="employee-email"
                      type="email"
                      name="email"
                      value={formData.employeeDetails.email}
                      onChange={(e) => handleChange(e, 'employeeDetails')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
                      placeholder="Enter email address"
                      aria-label="Email Address"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="job-title">
                      Job Title
                    </label>
                    <input
                      id="job-title"
                      type="text"
                      name="jobTitle"
                      value={formData.employeeDetails.jobTitle}
                      onChange={(e) => handleChange(e, 'employeeDetails')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 text-sm"
                      placeholder="Enter job title"
                      aria-label="Job Title"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="department">
                      Select Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.employeeDetails.department}
                      onChange={(e) => handleChange(e, 'employeeDetails', 'department')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-sm text-gray-500 font-medium"
                      aria-label="Select Department"
                    >
                      <option value="">Select Department</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="HR">HR</option>
                      <option value="TeamLead">Team Lead</option>
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="reviewerName">
                      Reviewer Name
                    </label>
                    <select
                      id="reviewerName"
                      name="reviewerName"
                      value={formData.employeeDetails.reviewerName}
                      onChange={(e) => handleChange(e, 'employeeDetails', 'reviewerName')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-sm text-gray-500 font-medium"
                      aria-label="Reviewer Name"
                      disabled={!formData.employeeDetails.department}
                    >
                      <option value="">Select Reviewer</option>
                      {formData.employeeDetails.department &&
                        departmentReviewers[formData.employeeDetails.department]?.map((reviewer) => (
                          <option key={reviewer} value={reviewer}>
                            {reviewer}
                          </option>
                        ))}
                    </select>
                    {errors.reviewerName && (
                      <p className="text-sm text-red-600">{errors.reviewerName}</p>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="start-date">
                      Review Date
                    </label>
                    <div className="relative">
                      <DatePicker
                        id="start-date"
                        selected={formData.employeeDetails.reviewDate ? new Date(formData.employeeDetails.reviewDate) : null}
                        onChange={(date) => handleDateChange(date, 'employeeDetails', 'reviewDate')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-500 text-sm font-medium transition-all duration-300 pr-10"
                        placeholderText="Select start date"
                        dateFormat="yyyy-MM-dd"
                        aria-label="Review Date"
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div className="flex flex-col col-span-1 sm:col-span-2">
                    <label className="mb-1 text-md font-semibold text-slate-700">Goals & Targets</label>
                    <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="goal-title">
                        Goal Title
                      </label>
                      <select
                        id="goal-title"
                        name="title"
                        value={formData.goals.title}
                        onChange={(e) => handleChange(e, 'goals', 'title')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-sm text-gray-500 font-medium"
                        aria-label="Goal Title"
                      >
                        <option value="">Select Goal</option>
                        <option value="Customer Satisfaction">Customer Satisfaction</option>
                        <option value="Leadership and Training">Leadership and Training</option>
                        <option value="Team Productivity">Team Productivity</option>
                      </select>
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="goal-due">
                        Due Date
                      </label>
                      <div className="relative mb-2">
                        <DatePicker
                          id="goal-due"
                          selected={formData.goals.due ? new Date(formData.goals.due) : null}
                          onChange={(date) => handleDateChange(date, 'goals', 'due')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 text-sm font-medium"
                          placeholderText="Select due date"
                          dateFormat="yyyy-MM-dd"
                          aria-label="Goal Due Date"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      </div>
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="goal-progress">
                        Progress (%)
                      </label>
                      <input
                        id="goal-progress"
                        type="number"
                        name="progress"
                        value={formData.goals.progress}
                        onChange={(e) => handleChange(e, 'goals', 'progress')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-sm"
                        placeholder="Enter progress (0-100)"
                        min="0"
                        max="100"
                        aria-label="Goal Progress"
                      />
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="goal-status">
                        Status
                      </label>
                      <select
                        id="goal-status"
                        name="status"
                        value={formData.goals.status}
                        onChange={(e) => handleChange(e, 'goals', 'status')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 font-medium"
                        aria-label="Goal Status"
                      >
                        <option value="">Select Status</option>
                        <option value="On Track">On Track</option>
                        <option value="At Risk">At Risk</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col col-span-1 sm:col-span-2">
                    <label className="mb-1 text-md font-semibold text-slate-700">Competencies</label>
                    <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="comp-skill">
                        Skill
                      </label>
                      <select
                        id="comp-skill"
                        name="skill"
                        value={formData.competencies.skill}
                        onChange={(e) => handleChange(e, 'competencies', 'skill')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-sm text-gray-500 font-medium"
                        aria-label="Competency Skill"
                      >
                        <option value="">Select Skill</option>
                        <option value="Communication">Communication</option>
                        <option value="Leadership">Leadership</option>
                        <option value="Technical Skills">Technical Skills</option>
                      </select>
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="comp-selfRating">
                        Self Rating Source
                      </label>
                      <select
                        id="comp-selfRating"
                        name="selfRating"
                        value={formData.competencies.selfRating}
                        onChange={(e) => handleChange(e, 'competencies', 'selfRating')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-sm text-gray-500 font-medium"
                        aria-label="Competency Self Rating Source"
                      >
                        <option value="">Select Source</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="HR">HR</option>
                        <option value="TeamLead">Team Lead</option>
                      </select>
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="comp-managerRating">
                        Manager Rating Source
                      </label>
                      <select
                        id="comp-managerRating"
                        name="managerRating"
                        value={formData.competencies.managerRating}
                        onChange={(e) => handleChange(e, 'competencies', 'managerRating')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-sm text-gray-500 font-medium"
                        aria-label="Competency Manager Rating Source"
                      >
                        <option value="">Select Source</option>
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="HR">HR</option>
                        <option value="TeamLead">Team Lead</option>
                      </select>
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="comp-feedback">
                        Feedback
                      </label>
                      <textarea
                        id="comp-feedback"
                        name="feedback"
                        value={formData.competencies.feedback}
                        onChange={(e) => handleChange(e, 'competencies', 'feedback')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter feedback"
                        rows={2}
                        aria-label="Competency Feedback"
                      />
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="flex flex-col col-span-1 sm:col-span-2">
                    <label className="mb-1 text-md font-semibold text-slate-700">Feedback Received</label>
                    <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="feedback-source">
                        Feedback Source
                      </label>
                      <select
                        id="feedback-source"
                        name="source"
                        value={formData.feedback.source}
                        onChange={(e) => handleChange(e, 'feedback', 'source')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-sm text-gray-500 font-medium"
                        aria-label="Feedback Source"
                      >
                        <option value="">Select Source</option>
                        <option value="Admin Feedback">Admin Feedback</option>
                        <option value="Manager Feedback">Manager Feedback</option>
                        <option value="HR Feedback">HR Feedback</option>
                        <option value="Team Lead Feedback">Team Lead Feedback</option>
                      </select>
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="feedback-date">
                        Feedback Date
                      </label>
                      <div className="relative mb-2">
                        <DatePicker
                          id="feedback-date"
                          selected={formData.feedback.date ? new Date(formData.feedback.date) : null}
                          onChange={(date) => handleDateChange(date, 'feedback', 'date')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 text-sm font-medium"
                          placeholderText="Select feedback date"
                          dateFormat="yyyy-MM-dd"
                          aria-label="Feedback Date"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      </div>
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="feedback-comment">
                        Feedback Comment
                      </label>
                      <textarea
                        id="feedback-comment"
                        name="comment"
                        value={formData.feedback.comment}
                        onChange={(e) => handleChange(e, 'feedback', 'comment')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Enter feedback comment"
                        rows={3}
                        aria-label="Feedback Comment"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col col-span-1 sm:col-span-2">
                    <label className="mb-1 text-md font-semibold text-slate-700">Achievements</label>
                    <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="ach-title">
                        Achievement Title
                      </label>
                      <select
                        id="ach-title"
                        name="title"
                        value={formData.achievements.title}
                        onChange={(e) => handleChange(e, 'achievements', 'title')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-sm text-gray-500 font-medium"
                        aria-label="Achievement Title"
                      >
                        <option value="">Select Achievement</option>
                        <option value="Employee of the Month">Employee of the Month</option>
                        <option value="Team Leadership Award">Team Leadership Award</option>
                        <option value="Project Alpha Success">Project Alpha Success</option>
                      </select>
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="ach-date">
                        Achievement Date
                      </label>
                      <div className="relative mb-2">
                        <DatePicker
                          id="ach-date"
                          selected={formData.achievements.date ? new Date(formData.achievements.date) : null}
                          onChange={(date) => handleDateChange(date, 'achievements', 'date')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 text-sm font-medium"
                          placeholderText="Select achievement date"
                          dateFormat="yyyy-MM-dd"
                          aria-label="Achievement Date"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      </div>
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="ach-type">
                        Achievement Type
                      </label>
                      <select
                        id="ach-type"
                        name="type"
                        value={formData.achievements.type}
                        onChange={(e) => handleChange(e, 'achievements', 'type')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 font-medium"
                        aria-label="Achievement Type"
                      >
                        <option value="">Select Type</option>
                        <option value="Recognition">Recognition</option>
                        <option value="Achievement">Achievement</option>
                        <option value="Award">Award</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col col-span-1 sm:col-span-2">
                    <label className="mb-1 text-md font-semibold text-slate-700">Learning & Growth</label>
                    <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="lg-title">
                        Learning Title
                      </label>
                      <select
                        id="lg-title"
                        name="title"
                        value={formData.learningGrowth.title}
                        onChange={(e) => handleChange(e, 'learningGrowth', 'title')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-sm text-gray-500 font-medium"
                        aria-label="Learning Title"
                      >
                        <option value="">Select Learning</option>
                        <option value="Project Management Fundamentals">Project Management Fundamentals</option>
                        <option value="Leadership Certification">Leadership Certification</option>
                      </select>
                      <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="lg-progressStatus">
                        Progress Status
                      </label>
                      <select
                        id="lg-progressStatus"
                        name="progressStatus"
                        value={formData.learningGrowth.progressStatus}
                        onChange={(e) => handleChange(e, 'learningGrowth', 'progressStatus')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-sm text-gray-500 font-medium"
                        aria-label="Learning Progress Status"
                      >
                        <option value="Progress">Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      {formData.learningGrowth.progressStatus === 'Progress' ? (
                        <>
                          <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="lg-progress">
                            Progress (%)
                          </label>
                          <input
                            id="lg-progress"
                            type="number"
                            name="progress"
                            value={formData.learningGrowth.progress}
                            onChange={(e) => handleChange(e, 'learningGrowth', 'progress')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 text-sm"
                            placeholder="Enter progress (0-100)"
                            min="0"
                            max="100"
                            aria-label="Learning Progress"
                          />
                        </>
                      ) : (
                        <>
                          <label className="mb-1 text-md font-semibold text-slate-700" htmlFor="lg-completed">
                            Completion Date
                          </label>
                          <div className="relative">
                            <DatePicker
                              id="lg-completed"
                              selected={formData.learningGrowth.completed ? new Date(formData.learningGrowth.completed) : null}
                              onChange={(date) => handleDateChange(date, 'learningGrowth', 'completed')}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 text-sm font-medium"
                              placeholderText="Select completion date"
                              dateFormat="yyyy-MM-dd"
                              aria-label="Learning Completion Date"
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <div className="col-span-1 sm:col-span-2 space-y-6">
                  <h3 className="text-lg font-semibold text-slate-700">Review Submitted Information</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-md font-semibold text-slate-700">Employee Details</h4>
                      <p className="text-sm text-gray-600">Name: {formData.employeeDetails.name || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">ID: {formData.employeeDetails.id || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Email: {formData.employeeDetails.email || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Job Title: {formData.employeeDetails.jobTitle || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Department: {formData.employeeDetails.department || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Reviewer Name: {formData.employeeDetails.reviewerName || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Review Date: {formData.employeeDetails.reviewDate || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-slate-700">Goals & Targets</h4>
                      <p className="text-sm text-gray-600">Title: {formData.goals.title || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Due Date: {formData.goals.due || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Progress: {formData.goals.progress ? `${formData.goals.progress}%` : 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Status: {formData.goals.status || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-slate-700">Competencies</h4>
                      <p className="text-sm text-gray-600">Skill: {formData.competencies.skill || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Self Rating Source: {formData.competencies.selfRating || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Manager Rating Source: {formData.competencies.managerRating || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Feedback: {formData.competencies.feedback || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-slate-700">Feedback Received</h4>
                      <p className="text-sm text-gray-600">Source: {formData.feedback.source || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Date: {formData.feedback.date || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Comment: {formData.feedback.comment || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-slate-700">Achievements</h4>
                      <p className="text-sm text-gray-600">Title: {formData.achievements.title || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Date: {formData.achievements.date || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Type: {formData.achievements.type || 'Not provided'}</p>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-slate-700">Learning & Growth</h4>
                      <p className="text-sm text-gray-600">Title: {formData.learningGrowth.title || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Progress Status: {formData.learningGrowth.progressStatus || 'Not provided'}</p>
                      {formData.learningGrowth.progressStatus === 'Progress' ? (
                        <p className="text-sm text-gray-600">Progress: {formData.learningGrowth.progress ? `${formData.learningGrowth.progress}%` : 'Not provided'}</p>
                      ) : (
                        <p className="text-sm text-gray-600">Completion Date: {formData.learningGrowth.completed || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-slate-700">Review Details</h4>
                      <p className="text-sm text-gray-600">Reviewed By: {formData.reviewedBy || 'Not provided'}</p>
                      <p className="text-sm text-gray-600">Reviewed Date: {formData.reviewedDate || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between mt-8 gap-4">
              <Button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="secondary"
                size="medium"
                className="w-full sm:w-auto px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-sm font-medium"
                aria-label="Previous step"
              >
                Back
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 text-sm font-medium"
                  aria-label="Next step"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 text-sm font-medium"
                  aria-label="Submit form"
                >
                  Submit
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeReview;