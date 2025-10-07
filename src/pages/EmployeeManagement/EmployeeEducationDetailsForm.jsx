const EmployeeEducationDetailsForm = ({ formData, errors, handleChange, isSubmitted }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">10th Class Name</label>
        <input
          type="text"
          name="tenthClassName"
          value={formData.tenthClassName || ''}
          onChange={handleChange}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 ${
            isSubmitted ? 'bg-gray-100 cursor-not-allowed readonly-field' : ''
          }`}
          placeholder="Enter school name"
          disabled={isSubmitted}
          readOnly={isSubmitted}
        />
        {errors.tenthClassName && (
          <span className="text-red-500 text-xs mt-1">{errors.tenthClassName}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">10th Class Marks (%)</label>
        <input
          type="number"
          name="tenthClassMarks"
          value={formData.tenthClassMarks || ''}
          onChange={handleChange}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 ${
            isSubmitted ? 'bg-gray-100 cursor-not-allowed readonly-field' : ''
          }`}
          placeholder="Enter marks in percentage"
          min="0"
          max="100"
          disabled={isSubmitted}
          readOnly={isSubmitted}
        />
        {errors.tenthClassMarks && (
          <span className="text-red-500 text-xs mt-1">{errors.tenthClassMarks}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Intermediate Name</label>
        <input
          type="text"
          name="intermediateName"
          value={formData.intermediateName || ''}
          onChange={handleChange}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 ${
            isSubmitted ? 'bg-gray-100 cursor-not-allowed readonly-field' : ''
          }`}
          placeholder="Enter college name"
          disabled={isSubmitted}
          readOnly={isSubmitted}
        />
        {errors.intermediateName && (
          <span className="text-red-500 text-xs mt-1">{errors.intermediateName}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Intermediate Marks (%)</label>
        <input
          type="number"
          name="intermediateMarks"
          value={formData.intermediateMarks || ''}
          onChange={handleChange}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 ${
            isSubmitted ? 'bg-gray-100 cursor-not-allowed readonly-field' : ''
          }`}
          placeholder="Enter marks in percentage"
          min="0"
          max="100"
          disabled={isSubmitted}
          readOnly={isSubmitted}
        />
        {errors.intermediateMarks && (
          <span className="text-red-500 text-xs mt-1">{errors.intermediateMarks}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Graduation Name</label>
        <input
          type="text"
          name="graduationName"
          value={formData.graduationName || ''}
          onChange={handleChange}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 ${
            isSubmitted ? 'bg-gray-100 cursor-not-allowed readonly-field' : ''
          }`}
          placeholder="Enter university name"
          disabled={isSubmitted}
          readOnly={isSubmitted}
        />
        {errors.graduationName && (
          <span className="text-red-500 text-xs mt-1">{errors.graduationName}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Graduation Marks (%)</label>
        <input
          type="number"
          name="graduationMarks"
          value={formData.graduationMarks || ''}
          onChange={handleChange}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 ${
            isSubmitted ? 'bg-gray-100 cursor-not-allowed readonly-field' : ''
          }`}
          placeholder="Enter marks in percentage"
          min="0"
          max="100"
          disabled={isSubmitted}
          readOnly={isSubmitted}
        />
        {errors.graduationMarks && (
          <span className="text-red-500 text-xs mt-1">{errors.graduationMarks}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Postgraduation Name</label>
        <input
          type="text"
          name="postgraduationName"
          value={formData.postgraduationName || ''}
          onChange={handleChange}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 ${
            isSubmitted ? 'bg-gray-100 cursor-not-allowed readonly-field' : ''
          }`}
          placeholder="Enter university name"
          disabled={isSubmitted}
          readOnly={isSubmitted}
        />
        {errors.postgraduationName && (
          <span className="text-red-500 text-xs mt-1">{errors.postgraduationName}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Postgraduation Marks (%)</label>
        <input
          type="number"
          name="postgraduationMarks"
          value={formData.postgraduationMarks || ''}
          onChange={handleChange}
          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 ${
            isSubmitted ? 'bg-gray-100 cursor-not-allowed readonly-field' : ''
          }`}
          placeholder="Enter marks in percentage"
          min="0"
          max="100"
          disabled={isSubmitted}
          readOnly={isSubmitted}
        />
        {errors.postgraduationMarks && (
          <span className="text-red-500 text-xs mt-1">{errors.postgraduationMarks}</span>
        )}
      </div>
    </div>
  );
};

export default EmployeeEducationDetailsForm;