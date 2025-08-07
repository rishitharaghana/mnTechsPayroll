import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '../Components/common/PageBreadcrumb';
import PageMeta from '../Components/common/PageMeta';

const IdCardForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee: '',
    empId: '',
    designation: '',
    bloodGroup: '',
    mobile: '',
    photo: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to save ID card (e.g., to localStorage or state)
    console.log('ID Card generated:', formData);
    navigate('/idcard');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <div className="flex justify-end">
        <PageMeta title="Generate ID Card" description="Create and manage employee ID cards." />
        <PageBreadcrumb items={[
          { label: 'Home', link: '/' },
          { label: 'Generate ID Card', link: '/idcard/idcard-form' },
        ]} />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Generate ID Card</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700">Employee Name</label>
          <input
            type="text"
            name="employee"
            value={formData.employee}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Employee ID</label>
          <input
            type="text"
            name="empId"
            value={formData.empId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Blood Group</label>
          <input
            type="text"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Photo URL (Optional)</label>
          <input
            type="text"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter photo URL or leave blank for placeholder"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Save ID Card
        </button>
      </form>
    </div>
  );
};

export default IdCardForm;