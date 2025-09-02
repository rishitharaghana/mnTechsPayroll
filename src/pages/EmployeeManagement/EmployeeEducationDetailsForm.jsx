const EmployeeEducationDetailsForm = ({ formData, errors, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">10th Class Name</label>
        <input
          type="text"
          name="tenthClassName"
          value={formData.tenthClassName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter school name"
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
          value={formData.tenthClassMarks}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter marks in percentage"
          min="0"
          max="100"
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
          value={formData.intermediateName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter college name"
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
          value={formData.intermediateMarks}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter marks in percentage"
          min="0"
          max="100"
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
          value={formData.graduationName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter university name"
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
          value={formData.graduationMarks}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter marks in percentage"
          min="0"
          max="100"
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
          value={formData.postgraduationName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter university name"
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
          value={formData.postgraduationMarks}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter marks in percentage"
          min="0"
          max="100"
        />
        {errors.postgraduationMarks && (
          <span className="text-red-500 text-xs mt-1">{errors.postgraduationMarks}</span>
        )}
      </div>
    </div>
  );
};

export default EmployeeEducationDetailsForm;