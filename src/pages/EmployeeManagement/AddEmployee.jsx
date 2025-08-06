import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../form/FormInput';
import DatePicker from '../../Components/ui/date/DatePicker';

const AddEmployee = () => {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    joinDate: '',
    department: '',
    salary: '',
    position: '',
    type: 'Full-time',
    address: '',
    emergencyContact: '',
  });

  const handleInput = useCallback((field, value) => {
    setEmployee((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employee.joinDate) {
      alert('Please select a join date.');
      return;
    }

    // Save to localStorage (replace with API in production)
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const id = `EMP${(employees.length + 1).toString().padStart(3, '0')}`;
    const newEmp = { ...employee, id, status: 'Active', salary: parseFloat(employee.salary) || 0 };
    localStorage.setItem('employees', JSON.stringify([...employees, newEmp]));

    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-indigo-700">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', field: 'name', type: 'text' },
            { label: 'Email', field: 'email', type: 'email' },
            { label: 'Phone', field: 'phone', type: 'tel' },
            { label: 'Department', field: 'department', type: 'text' },
            { label: 'Annual Salary', field: 'salary', type: 'number' },
            { label: 'Position', field: 'position', type: 'text' },
          ].map(({ label, field, type }) => (
            <FormInput
              key={field}
              label={label}
              type={type}
              value={employee[field]}
              onChange={(e) => handleInput(field, e.target.value)}
            />
          ))}

          <DatePicker
            type="date"
            singleDate={employee.joinDate}
            onSingleDateChange={(value) => handleInput('joinDate', value)}
            labelSingle="Join Date"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee Type</label>
            <select
              value={employee.type}
              onChange={(e) => handleInput('type', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              aria-label="Select employee type"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Intern</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormInput
            label="Address"
            type="text"
            value={employee.address}
            onChange={(e) => handleInput('address', e.target.value)}
          />
          <FormInput
            label="Emergency Contact"
            type="tel"
            value={employee.emergencyContact}
            onChange={(e) => handleInput('emergencyContact', e.target.value)}
          />
        </div>

        <div className="flex justify-between gap-4 pt-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white py-3 px-6 rounded-xl hover:bg-indigo-700"
            aria-label="Add new employee"
          >
            Add Employee
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-200 text-gray-800 py-3 px-6 rounded-xl hover:bg-gray-300"
            aria-label="Cancel and return to previous page"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;