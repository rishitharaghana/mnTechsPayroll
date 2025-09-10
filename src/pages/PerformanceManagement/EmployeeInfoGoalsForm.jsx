import { useSelector } from "react-redux";
import DatePicker from "../../Components/ui/date/DatePicker";

const EmployeeInfoGoalsForm = ({ formData, setFormData, formErrors, handleChange, handleDateChange, addItem, addTask, employees, performance }) => {
  const goalTemplates = [
    { id: "1", title: "Increase Sales by 10%", description: "Achieve a 10% increase in quarterly sales.", due_date: "" },
    { id: "2", title: "Complete Project X", description: "Deliver project X by end of quarter.", due_date: "" },
    {id: "3", title:"Complete Course", description:"Complete any 2 courses by the end of quarter", due_date:""},
    
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Information</h3>
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
              value={formData.employeeDetails.reviewDate ? new Date(formData.employeeDetails.reviewDate) : null}
              onChange={(date) => handleDateChange(date, "employeeDetails", "reviewDate")}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
            />
            {formErrors.reviewDate && (
              <p className="text-red-600 text-xs mt-1">{formErrors.reviewDate}</p>
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Goals & Tasks</h3>
        <select
          onChange={(e) => {
            const template = goalTemplates.find(t => t.id === e.target.value);
            if (template) {
              setFormData(prev => ({
                ...prev,
                goals: [...prev.goals, { ...template, id: Date.now() + Math.random(), tasks: [] }],
              }));
            }
          }}
          className="mt-1 block w-full border border-gray-300 rounded-lg p-2 mb-4"
        >
          <option value="">Select Goal Template</option>
          {goalTemplates.map(t => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>
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
              {performance?.goals?.find(g => g.id === goal.id) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Progress</label>
                  <p>Progress: {performance.goals.find(g => g.id === goal.id).progress}% ({performance.goals.find(g => g.id === goal.id).status})</p>
                </div>
              )}
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
                      onChange={(e) => handleChange(e, "goals", "tasks", index, "title", taskIndex)}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                    />
                    {formErrors[`task_title_${index}_${taskIndex}`] && (
                      <p className="text-red-600 text-xs mt-1">{formErrors[`task_title_${index}_${taskIndex}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                    <DatePicker
                      name={`task_due_date_${index}_${taskIndex}`}
                      value={task.due_date ? new Date(task.due_date) : null}
                      onChange={(date) => handleDateChange(date, "goals", "tasks", index, "due_date", taskIndex)}
                      className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                    />
                    {formErrors[`task_due_date_${index}_${taskIndex}`] && (
                      <p className="text-red-600 text-xs mt-1">{formErrors[`task_due_date_${index}_${taskIndex}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      name={`task_priority_${index}_${taskIndex}`}
                      value={task.priority}
                      onChange={(e) => handleChange(e, "goals", "tasks", index, "priority", taskIndex)}
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
    </div>
  );
};

export default EmployeeInfoGoalsForm;