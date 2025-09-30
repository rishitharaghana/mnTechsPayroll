import { useState, useEffect } from "react"; // Added useEffect import
import { useSelector } from "react-redux";
import DatePicker from "../../Components/ui/date/DatePicker";
import Select from "react-select";

// Custom styles for react-select
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    border: "1px solid #e2e8f0",
    padding: "0.1rem",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#14b8a6",
    },
    backgroundColor: "#ffffff",
    fontSize: "0.875rem",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    marginTop: "0.25rem",
    maxHeight: "200px",
    zIndex: 30,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#14b8a6"
      : state.isFocused
      ? "#f0fdfa"
      : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#1f2937",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    "&:hover": {
      backgroundColor: "#f0fdfa",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1f2937",
  }),
};

// Options for achievement type select
const achievementTypeOptions = [
  { value: "Recognition", label: "Recognition" },
  { value: "Achievement", label: "Achievement" },
  { value: "Award", label: "Award" },
];

// Options for bonus type select
const bonusTypeOptions = [
  { value: "one_time", label: "One-Time" },
  { value: "recurring", label: "Recurring" },
];

const AppraisalSummaryForm = ({ formData, setFormData, formErrors, handleChange, handleDateChange, perfError }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { role } = useSelector((state) => state.auth); // Get user role

  // Handle window resize with useEffect
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const addBonus = () => {
    setFormData((prev) => ({
      ...prev,
      appraisal: {
        ...prev.appraisal,
        bonuses: [
          ...(prev.appraisal.bonuses || []),
          {
            id: Date.now() + Math.random(),
            bonus_type: "one_time",
            amount: "",
            effective_date: "",
            remarks: "",
          },
        ],
      },
    }));
  };

  return (
    <div className="space-y-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {perfError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm">
            {perfError}
          </div>
        )}
        {/* Appraisal Section */}
        <div className="">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Appraisal</h3>
          
          {/* Performance Score Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Performance Score (0-100)</label>
              <input
                type="number"
                name="performance_score"
                value={formData.appraisal.performance_score}
                onChange={(e) => handleChange(e, "appraisal", "performance_score")}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="Enter score"
              />
              {formErrors.performance_score && (
                <p className="text-red-500 text-xs mt-2">{formErrors.performance_score}</p>
              )}
            </div>
            {/* Manager Comments Grid */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Manager Comments</label>
              <textarea
                name="manager_comments"
                value={formData.appraisal.manager_comments}
                onChange={(e) => handleChange(e, "appraisal", "manager_comments")}
                className="w-full h-12 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-y"
                rows={windowWidth < 640 ? 4 : 3}
                placeholder="Enter comments"
              />
              {formErrors.manager_comments && (
                <p className="text-red-500 text-xs mt-2">{formErrors.manager_comments}</p>
              )}
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h4>
              {(Array.isArray(formData.appraisal.achievements) ? formData.appraisal.achievements : []).map((ach, index) => (
                <div key={ach.id} className="mt-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:grid-cols-2 gap-4">
                    {/* Achievement Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        name={`ach_title_${index}`}
                        value={ach.title}
                        onChange={(e) => handleChange(e, "appraisal", "achievements", index, "title")}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        placeholder="Achievement title"
                      />
                      {formErrors[`ach_title_${index}`] && (
                        <p className="text-red-500 text-xs mt-2">{formErrors[`ach_title_${index}`]}</p>
                      )}
                    </div>

                    {/* Achievement Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <DatePicker
                        name={`ach_date_${index}`}
                        value={ach.date ? new Date(ach.date) : null}
                        onChange={(date) => handleDateChange(date, "appraisal", "achievements", index, "date")}
                        className="w-full border border-gray-300 rounded-lg px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                      />
                      {formErrors[`ach_date_${index}`] && (
                        <p className="text-red-500 text-xs mt-2">{formErrors[`ach_date_${index}`]}</p>
                      )}
                    </div>

                    {/* Achievement Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <Select
                        name={`ach_type_${index}`}
                        value={achievementTypeOptions.find((option) => option.value === ach.type)}
                        onChange={(selectedOption) =>
                          handleChange(
                            { target: { name: `ach_type_${index}`, value: selectedOption.value } },
                            "appraisal",
                            "achievements",
                            index,
                            "type"
                          )
                        }
                        options={achievementTypeOptions}
                        styles={customSelectStyles}
                        menuPlacement="auto"
                        maxMenuHeight={200}
                        className="text-sm"
                        placeholder="Select type"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    appraisal: {
                      ...prev.appraisal,
                      achievements: [
                        ...prev.appraisal.achievements,
                        { id: Date.now() + Math.random(), title: "", date: "", type: "Achievement" },
                      ],
                    },
                  }))
                }
                className="mt-4 text-teal-600 hover:text-teal-800 font-medium text-sm transition-colors flex items-center gap-2"
              >
                <span className="text-lg">+</span> Add Achievement
              </button>
            </div>
          </div>

          {/* Bonuses Grid (Super Admin Only) */}
          {role === "super_admin" && (
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Bonuses</h4>
                {(Array.isArray(formData.appraisal.bonuses) ? formData.appraisal.bonuses : []).map((bonus, index) => (
                  <div key={bonus.id} className="mt-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 lg:grid-cols-2 gap-4">
                      {/* Bonus Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bonus Type</label>
                        <Select
                          name={`bonus_type_${index}`}
                          value={bonusTypeOptions.find((option) => option.value === bonus.bonus_type)}
                          onChange={(selectedOption) =>
                            handleChange(
                              { target: { name: `bonus_type_${index}`, value: selectedOption.value } },
                              "appraisal",
                              "bonuses",
                              index,
                              "bonus_type"
                            )
                          }
                          options={bonusTypeOptions}
                          styles={customSelectStyles}
                          menuPlacement="auto"
                          maxMenuHeight={200}
                          className="text-sm"
                          placeholder="Select bonus type"
                        />
                        {formErrors[`bonus_type_${index}`] && (
                          <p className="text-red-500 text-xs mt-2">{formErrors[`bonus_type_${index}`]}</p>
                        )}
                      </div>

                      {/* Bonus Amount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                        <input
                          type="number"
                          name={`bonus_amount_${index}`}
                          value={bonus.amount}
                          onChange={(e) => handleChange(e, "appraisal", "bonuses", index, "amount")}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                          placeholder="Enter amount"
                          min="0"
                          step="0.01"
                        />
                        {formErrors[`bonus_amount_${index}`] && (
                          <p className="text-red-500 text-xs mt-2">{formErrors[`bonus_amount_${index}`]}</p>
                        )}
                      </div>

                      {/* Effective Date */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date</label>
                        <DatePicker
                          name={`bonus_effective_date_${index}`}
                          value={bonus.effective_date ? new Date(bonus.effective_date) : null}
                          onChange={(date) => handleDateChange(date, "appraisal", "bonuses", index, "effective_date")}
                          className="w-full border border-gray-300 rounded-lg px-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        />
                        {formErrors[`bonus_effective_date_${index}`] && (
                          <p className="text-red-500 text-xs mt-2">{formErrors[`bonus_effective_date_${index}`]}</p>
                        )}
                      </div>

                      {/* Remarks */}
                      <div className="sm:col-span-2 xl:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
                        <textarea
                          name={`bonus_remarks_${index}`}
                          value={bonus.remarks}
                          onChange={(e) => handleChange(e, "appraisal", "bonuses", index, "remarks")}
                          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-y"
                          rows={3}
                          placeholder="Enter remarks (optional)"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBonus}
                  className="mt-4 text-teal-600 hover:text-teal-800 font-medium text-sm transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">+</span> Add Bonus
                </button>
              </div>
            </div>
          )}

          {/* Bonus Eligible Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="bonus_eligible"
                checked={formData.appraisal.bonus_eligible}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    appraisal: { ...prev.appraisal, bonus_eligible: e.target.checked },
                  }))
                }
                className="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">Bonus Eligible</label>
            </div>
          </div>

          {/* Promotion Recommended Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="promotion_recommended"
                checked={formData.appraisal.promotion_recommended}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    appraisal: { ...prev.appraisal, promotion_recommended: e.target.checked },
                  }))
                }
                className="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">Promotion Recommended</label>
            </div>
          </div>

          {/* Salary Hike Percentage Grid */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary Hike Percentage</label>
              <input
                type="number"
                name="salary_hike_percentage"
                value={formData.appraisal.salary_hike_percentage}
                onChange={(e) => handleChange(e, "appraisal", "salary_hike_percentage")}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                placeholder="Enter percentage"
              />
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-8">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Summary</h3>
          
          {/* Employee Details Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="p-5 bg-gray-50 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Employee Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <p><strong>ID:</strong> {formData.employeeDetails.employee_id}</p>
                <p><strong>Name:</strong> {formData.employeeDetails.name}</p>
                <p><strong>Email:</strong> {formData.employeeDetails.email}</p>
                <p><strong>Job Title:</strong> {formData.employeeDetails.jobTitle}</p>
                <p><strong>Department:</strong> {formData.employeeDetails.department}</p>
                <p><strong>Review Date:</strong> {formData.employeeDetails.reviewDate}</p>
              </div>
            </div>
          </div>

          {/* Goals & Tasks Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="p-5 bg-gray-50 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Goals & Tasks</h4>
              {(Array.isArray(formData.goals) ? formData.goals : []).map((goal, index) => (
                <div key={goal.id} className="mb-4 text-sm text-gray-700">
                  <p className="font-medium">
                    <strong>Goal {index + 1}:</strong> {goal.title} (Due: {goal.due_date})
                  </p>
                  <p className="mt-1">{goal.description || "No description"}</p>
                  <ul className="list-disc pl-6 mt-2">
                    {(Array.isArray(goal.tasks) ? goal.tasks : []).map((task) => (
                      <li key={task.id}>
                        {task.title} (Due: {task.due_date}, Priority: {task.priority})
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Competencies Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="p-5 bg-gray-50 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Competencies</h4>
              <div className="text-sm text-gray-700">
                {(Array.isArray(formData.competencies) ? formData.competencies : []).map((comp) => (
                  <p key={comp.id} className="mb-2">
                    <strong>{comp.skill}:</strong> Rating {comp.manager_rating}/10, {comp.feedback || "No feedback"}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Progress Grid */}
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="p-5 bg-gray-50 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Learning Progress</h4>
              <div className="text-sm text-gray-700">
                {(Array.isArray(formData.learningGrowth) && formData.learningGrowth.length > 0) ? (
                  <ul className="list-disc pl-6">
                    {formData.learningGrowth.map((lg) => (
                      <li key={lg.id}>
                        {lg.title} (Progress: {lg.progress}%, Completed: {lg.completed ? "Yes" : "No"})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No learning progress data available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Bonuses Summary (Super Admin Only) */}
          {role === "super_admin" && (
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="p-5 bg-gray-50 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Bonuses</h4>
                <div className="text-sm text-gray-700">
                  {(Array.isArray(formData.appraisal.bonuses) ? formData.appraisal.bonuses : []).map((bonus) => (
                    <p key={bonus.id} className="mb-2">
                      <strong>{bonus.bonus_type === "one_time" ? "One-Time" : "Recurring"} Bonus:</strong> ₹{bonus.amount}, Effective: {bonus.effective_date}, Remarks: {bonus.remarks || "None"}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Appraisal Summary Grid */}
          <div className="grid grid-cols-1 gap-6">
            <div className="p-5 bg-gray-50 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Appraisal</h4>
              <div className="text-sm text-gray-700">
                <p><strong>Performance Score:</strong> {formData.appraisal.performance_score}</p>
                <p><strong>Manager Comments:</strong> {formData.appraisal.manager_comments}</p>
                <p className="mt-2"><strong>Achievements:</strong></p>
                <ul className="list-disc pl-6">
                  {(Array.isArray(formData.appraisal.achievements) ? formData.appraisal.achievements : []).map((ach) => (
                    <li key={ach.id}>
                      {ach.title} ({ach.date}, {ach.type})
                    </li>
                  ))}
                </ul>
                <p><strong>Bonus Eligible:</strong> {formData.appraisal.bonus_eligible ? "Yes" : "No"}</p>
                <p><strong>Promotion Recommended:</strong> {formData.appraisal.promotion_recommended ? "Yes" : "No"}</p>
                <p><strong>Salary Hike:</strong> {formData.appraisal.salary_hike_percentage || 0}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppraisalSummaryForm;