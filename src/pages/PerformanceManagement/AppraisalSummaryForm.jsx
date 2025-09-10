import DatePicker from "../../Components/ui/date/DatePicker";

const AppraisalSummaryForm = ({ formData, setFormData, formErrors, handleChange, handleDateChange }) => {
  return (
    <div className="space-y-6">
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
            {(Array.isArray(formData.appraisal.achievements) ? formData.appraisal.achievements : []).map((ach, index) => (
              <div key={ach.id} className="mt-2 p-3 bg-gray-100 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      name={`ach_title_${index}`}
                      value={ach.title}
                      onChange={(e) => handleChange(e, "appraisal", "achievements", index, "title")}
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
                      onChange={(date) => handleDateChange(date, "appraisal", "achievements", index, "date")}
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
                      onChange={(e) => handleChange(e, "appraisal", "achievements", index, "type")}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
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
              onClick={() => setFormData(prev => ({
                ...prev,
                appraisal: {
                  ...prev.appraisal,
                  achievements: [...prev.appraisal.achievements, { id: Date.now() + Math.random(), title: "", date: "", type: "Achievement" }],
                },
              }))}
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
              onChange={(e) => setFormData(prev => ({
                ...prev,
                appraisal: { ...prev.appraisal, bonus_eligible: e.target.checked },
              }))}
              className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-600"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">Bonus Eligible</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="promotion_recommended"
              checked={formData.appraisal.promotion_recommended}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                appraisal: { ...prev.appraisal, promotion_recommended: e.target.checked },
              }))}
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
              {(Array.isArray(formData.appraisal.achievements) ? formData.appraisal.achievements : []).map((ach, index) => (
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
  );
};

export default AppraisalSummaryForm;