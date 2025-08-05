import React from 'react';

const FormInput = ({ label, type = 'text', value, onChange, required = true }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

export default FormInput;
