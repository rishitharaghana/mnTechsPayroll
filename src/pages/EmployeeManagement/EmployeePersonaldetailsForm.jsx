import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import FileUpload from "./EmployeeFileUpload";

const EmployeePersonaldetailsForm = ({ formData, errors, handleChange, handleDateChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter full name"
          disabled={!!formData.fullName}
        />
        {errors.fullName && <span className="text-red-500 text-xs mt-1">{errors.fullName}</span>}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Father’s Name</label>
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter father’s name"
        />
        {errors.fatherName && <span className="text-red-500 text-xs mt-1">{errors.fatherName}</span>}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Mother’s Name</label>
        <input
          type="text"
          name="motherName"
          value={formData.motherName}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter mother’s name"
        />
        {errors.motherName && <span className="text-red-500 text-xs mt-1">{errors.motherName}</span>}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter phone number"
          disabled={!!formData.phone}
        />
        {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter email"
          disabled={!!formData.email}
        />
        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}
      </div>
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <span className="text-red-500 text-xs mt-1">{errors.gender}</span>}
      </div>
      {/* PAN Card Number */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">PAN Card Number</label>
        <input
          type="text"
          name="panCard"
          value={formData.panCard}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="e.g., ABCDE1234F"
          maxLength={10}
        />
        {errors.panCard && <span className="text-red-500 text-xs mt-1">{errors.panCard}</span>}
      </div>
      {/* Aadhar Card Number */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Aadhar Card Number</label>
        <input
          type="text"
          name="aadharCard"
          value={formData.aadharCard}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="e.g., 123456789012"
          maxLength={12}
        />
        {errors.aadharCard && <span className="text-red-500 text-xs mt-1">{errors.aadharCard}</span>}
      </div>
      <div className="flex flex-col col-span-2">
        <FileUpload
          name="image"
          onChange={handleChange}
          accept="image/*"
          label="Image Upload"
          preview={formData.image ? URL.createObjectURL(formData.image) : null}
          isPdf={false}
        />
        {errors.image && <span className="text-red-500 text-xs mt-1">{errors.image}</span>}
      </div>
      <div className="flex flex-col col-span-2">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Current Address</label>
        <input
          type="text"
          name="presentAddress"
          value={formData.presentAddress}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter present address"
        />
        {errors.presentAddress && (
          <span className="text-red-500 text-xs mt-1">{errors.presentAddress}</span>
        )}
      </div>
      <div className="flex flex-col col-span-2">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Permanent Address</label>
        <input
          type="text"
          name="previousAddress"
          value={formData.previousAddress}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
          placeholder="Enter previous address"
        />
        {errors.previousAddress && (
          <span className="text-red-500 text-xs mt-1">{errors.previousAddress}</span>
        )}
      </div>
      <div className="flex flex-col col-span-2">
        <label className="mb-1 text-sm font-bold text-black tracking-tight">Position Information</label>
        <select
          name="positionType"
          value={formData.positionType}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
        >
          <option value="">Select Position Type</option>
          <option value="fresher">Fresher</option>
          <option value="experienced">Experienced</option>
        </select>
        {errors.positionType && (
          <span className="text-red-500 text-xs mt-1">{errors.positionType}</span>
        )}
      </div>
      {formData.positionType === "experienced" && (
        <>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">Employer ID/Name</label>
            <input
              type="text"
              name="employerIdName"
              value={formData.employerIdName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
              placeholder="Enter employer ID or name"
            />
            {errors.employerIdName && (
              <span className="text-red-500 text-xs mt-1">{errors.employerIdName}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">Position Title</label>
            <input
              type="text"
              name="positionTitle"
              value={formData.positionTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
              placeholder="Enter position title"
            />
            {errors.positionTitle && (
              <span className="text-red-500 text-xs mt-1">{errors.positionTitle}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">Employment Type</label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300"
            >
              <option value="">Select Employment Type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>
            {errors.employmentType && (
              <span className="text-red-500 text-xs mt-1">{errors.employmentType}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">Joining Date</label>
            <div className="relative">
              <DatePicker
                selected={formData.joiningDate ? new Date(formData.joiningDate) : null}
                onChange={(date) => handleDateChange("joiningDate", date)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 pr-10"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select joining date"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
            {errors.joiningDate && (
              <span className="text-red-500 text-xs mt-1">{errors.joiningDate}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-bold text-black tracking-tight">Contract End Date</label>
            <div className="relative">
              <DatePicker
                selected={formData.contractEndDate ? new Date(formData.contractEndDate) : null}
                onChange={(date) => handleDateChange("contractEndDate", date)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-transparent text-gray-900 transition-all duration-300 pr-10"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select contract end date"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
            {errors.contractEndDate && (
              <span className="text-red-500 text-xs mt-1">{errors.contractEndDate}</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeePersonaldetailsForm;