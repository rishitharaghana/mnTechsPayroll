const EmployeeBankDetailsForm = ({ formData, errors, handleChange, isSubmitted }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">
          Bank Account Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="bankACnumber"
          value={formData.bankACnumber}
          onChange={handleChange}
          disabled={isSubmitted}
          className={`w-full px-4 py-3 border rounded-lg text-gray-900 transition-all duration-300 ${
            isSubmitted
              ? "readonly-field border-gray-300"
              : "border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          } ${errors.bankACnumber ? "border-red-500" : ""}`}
          placeholder="Enter Bank Account Number"
        />
        {errors.bankACnumber && (
          <span className="text-red-500 text-xs mt-1">{errors.bankACnumber}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">
          IFSC Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="ifscNumber"
          value={formData.ifscNumber}
          onChange={handleChange}
          disabled={isSubmitted}
          className={`w-full px-4 py-3 border rounded-lg text-gray-900 transition-all duration-300 ${
            isSubmitted
              ? "readonly-field border-gray-300"
              : "border-gray-300 focus:ring-2 focus:ring-teal-600 focus:border-transparent"
          } ${errors.ifscNumber ? "border-red-500" : ""}`}
          placeholder="Enter IFSC number"
        />
        {errors.ifscNumber && (
          <span className="text-red-500 text-xs mt-1">{errors.ifscNumber}</span>
        )}
      </div>
    </div>
  );
};

export default EmployeeBankDetailsForm;