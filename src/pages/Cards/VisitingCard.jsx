import React, { useState } from 'react';
import { CreditCard, Download, Eye, User, Mail, Phone, MapPin, Building } from 'lucide-react';

const VisitingCard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('EMP001');
  const [cardStyle, setCardStyle] = useState('modern');
  const [showPreview, setShowPreview] = useState(false);

  const employees = [
    {
      id: 'EMP001',
      name: 'John Smith',
      position: 'Senior Developer',
      department: 'Engineering',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business Ave, Tech City, TC 12345'
    },
    {
      id: 'EMP002',
      name: 'Sarah Wilson',
      position: 'Marketing Manager',
      department: 'Marketing',
      email: 'sarah.wilson@techcorp.com',
      phone: '+1 (555) 123-4568',
      address: '123 Business Ave, Tech City, TC 12345'
    },
    {
      id: 'EMP003',
      name: 'Mike Johnson',
      position: 'UI Designer',
      department: 'Design',
      email: 'mike.johnson@techcorp.com',
      phone: '+1 (555) 123-4569',
      address: '123 Business Ave, Tech City, TC 12345'
    }
  ];

  const companyInfo = {
    name: 'TechCorp Solutions',
    tagline: 'Innovation Through Technology',
    website: 'www.techcorp.com',
    logo: '🏢'
  };

  const cardStyles = [
    { id: 'modern', name: 'Modern', preview: 'Gradient with clean typography' },
    { id: 'classic', name: 'Classic', preview: 'Traditional business card design' },
    { id: 'minimal', name: 'Minimal', preview: 'Clean and simple layout' },
    { id: 'corporate', name: 'Corporate', preview: 'Professional business theme' }
  ];

  const selectedEmployeeData = employees.find(emp => emp.id === selectedEmployee);

  const generateCard = () => {
    setShowPreview(true);
  };

  const getCardStyleClasses = (style) => {
    switch (style) {
      case 'modern':
        return 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white';
      case 'classic':
        return 'bg-white border-2 border-gray-800 text-gray-800';
      case 'minimal':
        return 'bg-gray-50 border border-gray-200 text-gray-800';
      case 'corporate':
        return 'bg-gradient-to-r from-gray-800 to-gray-900 text-white';
      default:
        return 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Visiting Card Generator
        </h1>
        <p className="text-gray-600 mt-1">Create professional business cards for employees</p>
      </div>

      {/* Controls */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.position})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card Style</label>
            <select
              value={cardStyle}
              onChange={(e) => setCardStyle(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {cardStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={generateCard}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Eye size={20} />
              <span>Preview Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* Style Options */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Card Styles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cardStyles.map((style) => (
            <div
              key={style.id}
              onClick={() => setCardStyle(style.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                cardStyle === style.id 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
              }`}
            >
              <div className={`w-full h-20 rounded-lg mb-3 ${getCardStyleClasses(style.id)} flex items-center justify-center`}>
                <CreditCard size={24} className="opacity-70" />
              </div>
              <h3 className="font-semibold text-gray-900">{style.name}</h3>
              <p className="text-sm text-gray-600">{style.preview}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Generation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="text-white" size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Single Card</h3>
          <p className="text-gray-600 text-sm mb-4">Generate card for selected employee</p>
          <button className="w-full bg-blue-100 text-blue-800 py-2 rounded-xl hover:bg-blue-200 transition-all duration-200">
            Generate
          </button>
        </div>
        
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building className="text-white" size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Department Cards</h3>
          <p className="text-gray-600 text-sm mb-4">Generate cards for entire department</p>
          <button className="w-full bg-green-100 text-green-800 py-2 rounded-xl hover:bg-green-200 transition-all duration-200">
            Generate
          </button>
        </div>
        
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center hover:shadow-xl transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Download className="text-white" size={24} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Bulk Export</h3>
          <p className="text-gray-600 text-sm mb-4">Download all cards as ZIP file</p>
          <button className="w-full bg-purple-100 text-purple-800 py-2 rounded-xl hover:bg-purple-200 transition-all duration-200">
            Export All
          </button>
        </div>
      </div>

      {/* Card Preview */}
      {showPreview && selectedEmployeeData && (
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">Card Preview</h2>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
              <Download size={20} />
              <span>Download PDF</span>
            </button>
          </div>

          {/* Business Card */}
          <div className="flex justify-center">
            <div className={`w-96 h-56 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all duration-300 ${getCardStyleClasses(cardStyle)}`}>
              {/* Front Side */}
              <div className="h-full flex flex-col justify-between">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-3xl mb-2">{companyInfo.logo}</div>
                    <div className={`text-lg font-bold ${cardStyle === 'classic' || cardStyle === 'minimal' ? 'text-gray-800' : 'text-white'}`}>
                      {companyInfo.name}
                    </div>
                    <div className={`text-sm opacity-90 ${cardStyle === 'classic' || cardStyle === 'minimal' ? 'text-gray-600' : 'text-white'}`}>
                      {companyInfo.tagline}
                    </div>
                  </div>
                </div>

                {/* Employee Info */}
                <div>
                  <div className={`text-xl font-bold mb-1 ${cardStyle === 'classic' || cardStyle === 'minimal' ? 'text-gray-800' : 'text-white'}`}>
                    {selectedEmployeeData.name}
                  </div>
                  <div className={`text-sm mb-3 opacity-90 ${cardStyle === 'classic' || cardStyle === 'minimal' ? 'text-gray-600' : 'text-white'}`}>
                    {selectedEmployeeData.position}
                  </div>
                  
                  <div className={`space-y-1 text-xs opacity-80 ${cardStyle === 'classic' || cardStyle === 'minimal' ? 'text-gray-600' : 'text-white'}`}>
                    <div className="flex items-center space-x-2">
                      <Mail size={12} />
                      <span>{selectedEmployeeData.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone size={12} />
                      <span>{selectedEmployeeData.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={12} />
                      <span>{companyInfo.website}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Details */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Employee Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="text-indigo-600" size={16} />
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{selectedEmployeeData.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="text-indigo-600" size={16} />
                  <span className="text-gray-600">Position:</span>
                  <span className="font-medium">{selectedEmployeeData.position}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="text-indigo-600" size={16} />
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{selectedEmployeeData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-indigo-600" size={16} />
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{selectedEmployeeData.phone}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Company Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Building className="text-indigo-600" size={16} />
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium">{companyInfo.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="text-indigo-600" size={16} />
                  <span className="text-gray-600">Style:</span>
                  <span className="font-medium">{cardStyles.find(s => s.id === cardStyle)?.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="text-indigo-600" size={16} />
                  <span className="text-gray-600">Website:</span>
                  <span className="font-medium">{companyInfo.website}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitingCard;