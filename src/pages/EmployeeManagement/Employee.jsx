import React, { useState } from 'react';
import {
  Plus, Search, Filter, Edit, Trash2, User,
  Mail, Phone, Calendar
} from 'lucide-react';

const Employee = () => {
  const [employees, setEmployees] = useState([
    {
      id: 'EMP001',
      name: 'John Smith',
      email: 'john.smith@company.com',
      phone: '+1 234 567 8900',
      type: 'Full-time',
      department: 'Engineering',
      position: 'Senior Developer',
      joinDate: '2023-01-15',
      salary: 75000,
      status: 'Active',
    },
    {
      id: 'EMP002',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      phone: '+1 234 567 8901',
      type: 'Full-time',
      department: 'Marketing',
      position: 'Marketing Manager',
      joinDate: '2023-03-20',
      salary: 65000,
      status: 'Active',
    },
    {
      id: 'EMP003',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      phone: '+1 234 567 8902',
      type: 'Part-time',
      department: 'Design',
      position: 'UI Designer',
      joinDate: '2023-06-10',
      salary: 45000,
      status: 'Active',
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Full-time',
    department: '',
    position: '',
    joinDate: '',
    salary: '',
    address: '',
    emergencyContact: '',
  });

  const handleInput = (field, value) => {
    setNewEmployee((prev) => ({ ...prev, [field]: value }));
  };

  const generateEmployeeId = () => `EMP${(employees.length + 1).toString().padStart(3, '0')}`;

  const handleAdd = (e) => {
    e.preventDefault();
    const employee = {
      ...newEmployee,
      id: generateEmployeeId(),
      salary: parseFloat(newEmployee.salary),
      status: 'Active',
    };
    setEmployees([...employees, employee]);
    setNewEmployee({
      name: '', email: '', phone: '', type: 'Full-time',
      department: '', position: '', joinDate: '',
      salary: '', address: '', emergencyContact: ''
    });
    setShowForm(false);
  };

  const filtered = employees.filter(({ name, email, department }) =>
    [name, email, department].some(field =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Employee Management
          </h1>
          <p className="text-gray-600 mt-1">Manage team members and their data</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-transform hover:scale-105"
        >
          <Plus size={20} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border bg-white/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 bg-white/50 border border-gray-200 rounded-xl hover:bg-white/70 transition">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((emp) => (
          <div
            key={emp.id}
            className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:shadow-xl hover:-translate-y-1 transition"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                  <Edit size={16} />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{emp.name}</h3>
                <p className="text-indigo-600 font-medium">{emp.id}</p>
              </div>

              <div className="space-y-2 text-gray-600 text-sm">
                <div className="flex items-center gap-2"><Mail size={14} /> {emp.email}</div>
                <div className="flex items-center gap-2"><Phone size={14} /> {emp.phone}</div>
                <div className="flex items-center gap-2"><Calendar size={14} /> Joined: {emp.joinDate}</div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">{emp.department}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    emp.type === 'Full-time' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {emp.type}
                  </span>
                </div>
                <p className="font-medium text-gray-900">{emp.position}</p>
                <p className="text-lg font-bold text-indigo-600">${emp.salary.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-2xl">×</button>
            </div>

            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', field: 'name', type: 'text' },
                  { label: 'Email', field: 'email', type: 'email' },
                  { label: 'Phone', field: 'phone', type: 'tel' },
                  { label: 'Join Date', field: 'joinDate', type: 'date' },
                  { label: 'Position', field: 'position', type: 'text' },
                  { label: 'Department', field: 'department', type: 'text' },
                  { label: 'Annual Salary', field: 'salary', type: 'number' },
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input
                      type={type}
                      required
                      value={newEmployee[field]}
                      onChange={(e) => handleInput(field, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Type</label>
                  <select
                    value={newEmployee.type}
                    onChange={(e) => handleInput('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Intern</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  rows={3}
                  value={newEmployee.address}
                  onChange={(e) => handleInput('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={newEmployee.emergencyContact}
                  onChange={(e) => handleInput('emergencyContact', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-xl hover:shadow-lg"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 py-3 rounded-xl hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
