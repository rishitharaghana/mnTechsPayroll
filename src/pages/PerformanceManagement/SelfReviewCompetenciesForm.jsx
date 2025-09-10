const SelfReviewCompetenciesForm = ({ formData, setFormData, formErrors, handleChange, performance }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Self-Review</h3>
        <div className="p-4 border rounded-lg bg-gray-50">
          {performance?.feedback?.filter(f => f.source === "Self").length > 0 ? (
            performance.feedback.filter(f => f.source === "Self").map((f, idx) => (
              <p key={idx} className="text-sm text-gray-600">{f.comment} (Submitted: {new Date(f.timestamp).toLocaleDateString()})</p>
            ))
          ) : (
            <p>No self-review submitted</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Competencies</h3>
        {(Array.isArray(formData.competencies) ? formData.competencies : []).map((comp, index) => (
          <div key={comp.id} className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Skill</label>
                <select
                  name={`comp_skill_${index}`}
                  value={comp.skill}
                  onChange={(e) => handleChange(e, "competencies", null, index, "skill")}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                >
                  <option value="">Select Skill</option>
                  {["Communication", "Teamwork", "Problem Solving", "Leadership"].map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
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
                  onChange={(e) => handleChange(e, "competencies", null, index, "manager_rating")}
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
          onClick={() => setFormData(prev => ({
            ...prev,
            competencies: [...prev.competencies, { id: Date.now() + Math.random(), skill: "", manager_rating: "", feedback: "" }],
          }))}
          className="text-teal-600 hover:text-teal-800 transition-colors"
        >
          + Add Competency
        </button>
      </div>
    </div>
  );
};

export default SelfReviewCompetenciesForm;