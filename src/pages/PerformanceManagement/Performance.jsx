import React, { useState } from 'react';
import { TrendingUp, Award, Target, Star, Users, DollarSign } from 'lucide-react';
import PageBreadcrumb from '../../Components/common/PageBreadcrumb';
import PageMeta from '../../Components/common/PageMeta';

const Performance = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const employees = [
    {
      id: 'EMP001',
      name: 'John Smith',
      department: 'Engineering',
      position: 'Senior Developer',
      performanceScore: 94,
      goals: 8,
      completedGoals: 7,
      incentives: 2500,
      rating: 4.8,
      bonusEligible: true,
      promotionRecommended: true,
      salaryHike: '10%',
      managerComments: 'Excellent performance, exceeded expectations.',
      reviewedBy: 'Jane HR',
      reviewedDate: '2025-07-15',
      achievements: ['Code Quality Award', 'Team Player'],
    },
    {
      id: 'EMP002',
      name: 'Sarah Wilson',
      department: 'Marketing',
      position: 'Marketing Manager',
      performanceScore: 88,
      goals: 6,
      completedGoals: 5,
      incentives: 2000,
      rating: 4.5,
      bonusEligible: true,
      promotionRecommended: false,
      salaryHike: '8%',
      managerComments: 'Strong leadership in campaign execution.',
      reviewedBy: 'Tom HR',
      reviewedDate: '2025-07-12',
      achievements: ['Campaign Excellence', 'Leadership Award'],
    },
  ];

  const performanceMetrics = [
    { title: 'Team Performance', value: '89.8%', change: '+4.2%', icon: TrendingUp },
    { title: 'Goals Achieved', value: '85%', change: '+7.1%', icon: Target },
    { title: 'Awards Given', value: '24', change: '+12', icon: Award },
    { title: 'Avg Rating', value: '4.55', change: '+0.3', icon: Star }
  ];

  const getPerformanceLabel = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredEmployees = selectedEmployee === 'all' ? employees : employees.filter(e => e.id === selectedEmployee);

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-end">
        <PageMeta title="Performance Management" description="Track and manage employee performance metrics." />
        <PageBreadcrumb items={[
          { label: 'Home', link: '/' },
          { label: 'Performance', link: '/admin/performance' }
          ]} 
        />
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Employee Performance Dashboard</h1>
          <p className="text-gray-500">Overview of employee metrics and achievements</p>
        </div>
        <div className="flex gap-4">
          <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="border rounded-md p-2">
            <option value="all">All Employees</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="border rounded-md p-2">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-white shadow rounded-xl p-5 flex flex-col items-start">
              <div className="flex items-center gap-3 mb-2">
                <Icon className="text-indigo-600" size={22} />
                <h2 className="text-lg font-semibold text-gray-700">{metric.title}</h2>
              </div>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <span className="text-sm text-green-600">{metric.change}</span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEmployees.map((emp) => (
          <div key={emp.id} className="bg-white shadow-lg rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{emp.name}</h3>
                <p className="text-sm text-gray-500">{emp.position} | {emp.department}</p>
              </div>
              <Users className="text-indigo-500" size={28} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Performance Score</p>
                <p className={`text-lg font-bold ${getPerformanceLabel(emp.performanceScore)}`}>{emp.performanceScore}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Goals Completed</p>
                <p className="text-lg font-bold text-gray-800">{emp.completedGoals}/{emp.goals}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-lg font-bold text-yellow-600">{emp.rating}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Incentives</p>
                <p className="text-lg font-bold text-green-600">${emp.incentives}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700">Manager Comments</h4>
              <p className="text-sm text-gray-600 italic">"{emp.managerComments}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <p className="text-sm text-gray-600"><strong>Salary Hike:</strong> {emp.salaryHike}</p>
              <p className="text-sm text-gray-600"><strong>Bonus Eligible:</strong> {emp.bonusEligible ? 'Yes' : 'No'}</p>
              <p className="text-sm text-gray-600"><strong>Promotion:</strong> {emp.promotionRecommended ? 'Yes' : 'No'}</p>
              <p className="text-sm text-gray-600"><strong>Reviewed By:</strong> {emp.reviewedBy}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {emp.achievements.map((ach, idx) => (
                  <span key={idx} className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full inline-flex items-center gap-1">
                    <Award size={12} /> {ach}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Performance;
