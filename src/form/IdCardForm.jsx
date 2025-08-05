import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IdCardForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee: '',
    empId: '',
    designation: '',
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