import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import Select from "react-select";
import FileUpload from "./EmployeeFileUpload";

// Custom styles for Select components (unchanged)
const genderSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "#d1d5db",
    borderRadius: "0.5rem",
    padding: "0",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    transition: "all 300ms",
    "&:hover": { borderColor: "#14b8a6" },
    "&:focus-within": { borderColor: "#14b8a6", boxShadow: "0 0 0 2px rgba(20, 184, 166, 0.2)" },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#14b8a6" : state.isFocused ? "#e6fffa" : "white",
    color: state.isSelected ? "white" : "#1f2937",
    fontWeight: state.isSelected ? "600" : "400",
    "&:hover": { backgroundColor: "#e6fffa", color: "#1f2937" },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1f2937",
    fontSize: "0.875rem",
  }),
};

const positionTypeSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "#d1d5db",
    borderRadius: "0.5rem",
    padding: "0",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    transition: "all 300ms",
    backgroundColor: "white",
    "&:hover": { borderColor: "#3b82f6" },
    "&:focus-within": { borderColor: "#3b82f6", boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)" },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#06b66c" : state.isFocused ? "#dbeafe" : "white",
    color: state.isSelected ? "white" : "#1f2937",
    fontWeight: state.isSelected ? "600" : "400",
    "&:hover": { backgroundColor: "#dbeafe", color: "#1f2937" },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1f2937",
    fontSize: "0.875rem",
  }),
};

const employmentTypeSelectStyles = {
  control: (provided) => ({
    ...provided,
    borderColor: "#d1d5db",
    borderRadius: "0.5rem",
    padding: "0",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    transition: "all 300ms",
    backgroundColor: "white",
    "&:hover": { borderColor: "#ef4444" },
    "&:focus-within": { borderColor: "#ef4444", boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.2)" },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#196c2e" : state.isFocused ? "#fee2e2" : "white",
    color: state.isSelected ? "white" : "#1f2937",
    fontWeight: state.isSelected ? "600" : "400",
    "&:hover": { backgroundColor: "#fee2e2", color: "#1f2937" },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.5rem",
    border: "1px solid #d1d5db",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#1f2937",
    fontSize: "0.875rem",
  }),
};

// Updated gender options to match backend (title case)
const genderOptions = [
  { value: "", label: "Select Gender" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Others", label: "Others" },
];

const positionTypeOptions = [
  { value: "", label: "Select Position Type" },
  { value: "fresher", label: "Fresher" },
  { value: "experienced", label: "Experienced" },
];

const employmentTypeOptions = [
  { value: "", label: "Select Employment Type" },
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "intern", label: "Internship" },
  { value: "contract", label: "Contract" },
];

const EmployeePersonaldetailsForm = ({ formData, errors, handleChange, handleDateChange }) => {
  console.log("EmployeePersonaldetailsForm props:", { formData, errors });

  // Handle react-select change
  const handleSelectChange = (name) => (selectedOption) => {
    console.log("handleSelectChange:", { name, value: selectedOption ? selectedOption.value : "" });
    handleChange({ target: { name, value: selectedOption ? selectedOption.value : "" } });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Full Name */}
      <div className="flex flex-col">
        <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName || ''} // Fixed: Use formData.fullName
          onChange={handleChange}
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300 ${
            formData.fullName ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          placeholder="Enter full name"
          disabled={!!formData.fullName} // Disable if fullName exists
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
        />
        {errors.fullName && (
          <span id="fullName-error" className="text-red-500 text-xs mt-1">{errors.fullName}</span>
        )}
      </div>

      {/* Father’s Name */}
      <div className="flex flex-col">
        <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Father’s Name</label>
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300"
          placeholder="Enter father’s name"
        />
        {errors.fatherName && <span className="text-red-500 text-xs mt-1">{errors.fatherName}</span>}
      </div>

      {/* Mother’s Name */}
      <div className="flex flex-col">
        <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Mother’s Name</label>
        <input
          type="text"
          name="motherName"
          value={formData.motherName || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300"
          placeholder="Enter mother’s name"
        />
        {errors.motherName && <span className="text-red-500 text-xs mt-1">{errors.motherName}</span>}
      </div>

      {/* Phone */}
      <div className="flex flex-col">
        <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300 ${
            formData.phone ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          placeholder="Enter phone number"
          disabled={!!formData.phone}
        />
        {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}
      </div>

      {/* Date of Birth */}
      <div className="flex flex-col">
        <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Date of Birth</label>
        <div className="relative">
          <DatePicker
            selected={formData.dob ? new Date(formData.dob) : null}
            onChange={(date) => handleDateChange("dob", date)} // Fixed: Use "dob" to match formData
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300 pr-10"
            dateFormat="yyyy-MM-dd"
            placeholderText="Select date of birth"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            maxDate={new Date()}
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
        </div>
        {errors.dob && <span className="text-red-500 text-xs mt-1">{errors.dob}</span>}
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300 ${
            formData.email ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          placeholder="Enter email"
          disabled={!!formData.email}
        />
        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
      </div>

      {/* Gender */}
      <div className="flex flex-col">
        <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Gender</label>
        <Select
          name="gender"
          value={genderOptions.find((option) => option.value === formData.gender) || null}
          onChange={handleSelectChange("gender")}
          options={genderOptions}
          styles={genderSelectStyles}
          className="w-full"
          placeholder="Select Gender"
          isDisabled={!!formData.gender} // Disable if gender exists
        />
        {errors.gender && <span className="text-red-500 text-xs mt-1">{errors.gender}</span>}
      </div>

      {/* PAN Card Number */}
      <div className="flex flex-col">
        <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">PAN Card Number</label>
        <input
          type="text"
          name="panCard"
          value={formData.panCard || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300"
          placeholder="e.g., ABCDE1234F"
          maxLength={10}
        />
        {errors.panCard && <span className="text-red-500 text-xs mt-1">{errors.panCard}</span>}
      </div>

      {/* Aadhar Card Number */}
      <div className="flex flex-col">
        <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Aadhar Card Number</label>
        <input
          type="text"
          name="aadharCard"
          value={formData.aadharCard || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300"
          placeholder="e.g., 123456789012"
          maxLength={12}
        />
        {errors.aadharCard && <span className="text-red-500 text-xs mt-1">{errors.aadharCard}</span>}
      </div>

      {/* Image Upload */}
      <div className="flex flex-col col-span-1 sm:col-span-2">
        <FileUpload
          name="image"
          onChange={handleChange}
          accept="image/*"
          label="Image Upload"
          preview={formData.image ? URL.createObjectURL(formData.image) : null}
          isPdf={false}
          className="w-full"
        />
        {errors.image && <span className="text-red-500 text-xs mt-1">{errors.image}</span>}
      </div>

      {/* Current Address */}
      <div className="flex flex-col col-span-1 sm:col-span-2">
        <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Current Address</label>
        <input
          type="text"
          name="presentAddress"
          value={formData.presentAddress || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300"
          placeholder="Enter present address"
        />
        {errors.presentAddress && (
          <span className="text-red-500 text-xs mt-1">{errors.presentAddress}</span>
        )}
      </div>

      {/* Permanent Address */}
      <div className="flex flex-col col-span-1 sm:col-span-2">
        <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Permanent Address</label>
        <input
          type="text"
          name="previousAddress"
          value={formData.previousAddress || ''}
          onChange={handleChange}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300"
          placeholder="Enter permanent address"
        />
        {errors.previousAddress && (
          <span className="text-red-500 text-xs mt-1">{errors.previousAddress}</span>
        )}
      </div>

      {/* Position Information */}
      <div className="flex flex-col col-span-1 sm:col-span-2">
        <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Position Information</label>
        <Select
          name="positionType"
          value={positionTypeOptions.find((option) => option.value === formData.positionType) || null}
          onChange={handleSelectChange("positionType")}
          options={positionTypeOptions}
          styles={positionTypeSelectStyles}
          className="w-full"
          placeholder="Select Position Type"
        />
        {errors.positionType && (
          <span className="text-red-500 text-xs mt-1">{errors.positionType}</span>
        )}
      </div>

      {/* Conditional Fields for Experienced */}
      {formData.positionType === "experienced" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 col-span-1 sm:col-span-2">
          {/* Employer ID/Name */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Employer ID/Name</label>
            <input
              type="text"
              name="employerIdName"
              value={formData.employerIdName || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300"
              placeholder="Enter employer ID or name"
            />
            {errors.employerIdName && (
              <span className="text-red-500 text-xs mt-1">{errors.employerIdName}</span>
            )}
          </div>

          {/* Position Title */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Position Title</label>
            <input
              type="text"
              name="positionTitle"
              value={formData.positionTitle || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300"
              placeholder="Enter position title"
            />
            {errors.positionTitle && (
              <span className="text-red-500 text-xs mt-1">{errors.positionTitle}</span>
            )}
          </div>

          {/* Employment Type */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Employment Type</label>
            <Select
              name="employmentType"
              value={employmentTypeOptions.find((option) => option.value === formData.employmentType) || null}
              onChange={handleSelectChange("employmentType")}
              options={employmentTypeOptions}
              styles={employmentTypeSelectStyles}
              className="w-full"
              placeholder="Select Employment Type"
            />
            {errors.employmentType && (
              <span className="text-red-500 text-xs mt-1">{errors.employmentType}</span>
            )}
          </div>

          {/* Joining Date */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Joining Date</label>
            <div className="relative">
              <DatePicker
                selected={formData.joiningDate ? new Date(formData.joiningDate) : null}
                onChange={(date) => handleDateChange("joiningDate", date)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300 pr-10"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select joining date"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </div>
            {errors.joiningDate && (
              <span className="text-red-500 text-xs mt-1">{errors.joiningDate}</span>
            )}
          </div>

          {/* Contract End Date */}
          <div className="flex flex-col">
            <label className="mb-1 text-xs sm:text-sm font-bold text-black tracking-tight">Contract End Date</label>
            <div className="relative">
              <DatePicker
                selected={formData.contractEndDate ? new Date(formData.contractEndDate) : null}
                onChange={(date) => handleDateChange("contractEndDate", date)}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 text-sm sm:text-base transition-all duration-300 pr-10"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select contract end date"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </div>
            {errors.contractEndDate && (
              <span className="text-red-500 text-xs mt-1">{errors.contractEndDate}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePersonaldetailsForm;