import React from 'react';
import Select from 'react-select'; // Import react-select

const SelfReviewCompetenciesForm = ({ formData, setFormData, formErrors, handleChange, performance }) => {
  // Define options for the skill dropdown
  const skillOptions = [
    { value: '', label: 'Select Skill' },
    { value: 'Communication', label: 'Communication' },
    { value: 'Teamwork', label: 'Teamwork' },
    { value: 'Problem Solving', label: 'Problem Solving' },
    { value: 'Leadership', label: 'Leadership' },
  ];

  // Custom styles for react-select
  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: '#d1d5db', // Tailwind gray-300
      borderRadius: '0.5rem',
      padding: '0.1rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#14b8a6', // Tailwind teal-600
      },
      '&:focus': {
        borderColor: '#14b8a6',
        ring: '2px',
        ringColor: '#14b8a6',
      },
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: '200px', // Limit height to show ~5 items
      borderRadius: '0.5rem',
      zIndex: 10,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '200px', // Ensure only ~5 items are visible
      overflowY: 'auto',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#14b8a6' // Tailwind teal-600 for selected
        : state.isFocused
        ? '#e0f2fe' // Tailwind sky-100 for hover
        : '#fff',
      color: state.isSelected ? '#fff' : '#374151', // Tailwind gray-700
      padding: '0.75rem',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#e0f2fe', // Tailwind sky-100
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#374151', // Tailwind gray-700
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af', // Tailwind gray-400
    }),
  };

  // Handle change for react-select
  const handleSelectChange = (selectedOption, index) => {
    handleChange(
      { target: { name: `comp_skill_${index}`, value: selectedOption ? selectedOption.value : '' } },
      'competencies',
      null,
      index,
      'skill'
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Employee Self-Review</h3>
        <div className="p-2 border rounded-lg bg-gray-50">
          {performance?.feedback?.filter((f) => f.source === 'Self').length > 0 ? (
            performance.feedback
              .filter((f) => f.source === 'Self')
              .map((f, idx) => (
                <p key={idx} className="text-sm text-gray-600">
                  {f.comment} (Submitted: {new Date(f.timestamp).toLocaleDateString()})
                </p>
              ))
          ) : (
            <p>No self-review submitted</p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Competencies</h3>
        {(Array.isArray(formData.competencies) ? formData.competencies : []).map((comp, index) => (
          <div key={comp.id} className="mb-4 p-2 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Skill</label>
                <Select
                  name={`comp_skill_${index}`}
                  value={skillOptions.find((option) => option.value === comp.skill)}
                  onChange={(selectedOption) => handleSelectChange(selectedOption, index)}
                  options={skillOptions}
                  styles={customSelectStyles}
                  placeholder="Select Skill"
                  className="mt-1"
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
                  onChange={(e) => handleChange(e, 'competencies', null, index, 'manager_rating')}
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
                  onChange={(e) => handleChange(e, 'competencies', null, index, 'feedback')}
                  className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-600"
                  rows="3"
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
              competencies: [
                ...prev.competencies,
                { id: Date.now() + Math.random(), skill: '', manager_rating: '', feedback: '' },
              ],
            }))
          }
          className="text-teal-600 hover:text-teal-800 transition-colors"
        >
          + Add Competency
        </button>
      </div>
    </div>
  );
};

export default SelfReviewCompetenciesForm;