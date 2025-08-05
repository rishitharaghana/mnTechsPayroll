import React, { useState } from 'react';
import { TrendingUp, Award, Target, Star, Users, Calendar } from 'lucide-react';

const Performance = () => {
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const employees = [
    { id: 'EMP001', name: 'John Smith', department: 'Engineering', position: 'Senior Developer', performanceScore: 94, goals: 8, completedGoals: 7, incentives: 2500, rating: 4.8, achievements: ['Code Quality Award', 'Team Player'] },
    { id: 'EMP002', name: 'Sarah Wilson', department: 'Marketing', position: 'Marketing Manager', performanceScore: 88, goals: 6, completedGoals: 5, incentives: 2000, rating: 4.5, achievements: ['Campaign Excellence', 'Leadership Award'] },
    { id: 'EMP003', name: 'Mike Johnson', department: 'Design', position: 'UI Designer', performanceScore: 91, goals: 5, completedGoals: 4, incentives: 1800, rating: 4.6, achievements: ['Design Innovation', 'Client Satisfaction'] },
    { id: 'EMP004', name: 'Emily Davis', department: 'HR', position: 'HR Manager', performanceScore: 86, goals: 7, completedGoals: 6, incentives: 1500, rating: 4.3, achievements: ['Employee Engagement'] }
  ];

  const performanceMetrics = [
    { title: 'Team Performance', value: '89.8%', change: '+4.2%', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { title: 'Goals Achieved', value: '85%', change: '+7.1%', icon: Target, color: 'from-blue-500 to-cyan-500' },
    { title: 'Awards Given', value: '24', change: '+12', icon: Award, color: 'from-purple-500 to-pink-500' },
    { title: 'Avg Rating', value: '4.55', change: '+0.3', icon: Star, color: 'from-orange-500 to-red-500' }
  ];

  const getPerformanceBadge = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 80) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 70) return { label: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  const filteredEmployees = selectedEmployee === 'all' ? employees : employees.filter(emp => emp.id === selectedEmployee);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Performance Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor employee performance and manage incentives</p>
        </div>
        <div className="flex items-center space-x-4">
          <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="px-4 py-2 bg-white/70 border rounded-xl focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Employees</option>
            {employees.map((e) => (<option key={e.id} value={e.id}>{e.name}</option>))}
          </select>
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-4 py-2 bg-white/70 border rounded-xl focus:ring-2 focus:ring-indigo-500">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="bg-white/70 rounded-2xl p-6 border hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{metric.change}</span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEmployees.map((emp) => {
          const badge = getPerformanceBadge(emp.performanceScore);
          return (
            <div key={emp.id} className="bg-white/70 rounded-2xl p-6 border hover:shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{emp.name}</h3>
                    <p className="text-gray-600">{emp.position}</p>
                    <p className="text-sm text-gray-500">{emp.department}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full font-semibold ${badge.color}`}>{badge.label}</span>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Performance Score</span>
                  <span className="font-bold text-gray-800">{emp.performanceScore}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: `${emp.performanceScore}%` }} />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Goals Completion</span>
                  <span className="font-medium">{emp.completedGoals}/{emp.goals}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: `${(emp.completedGoals / emp.goals) * 100}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-white/50 rounded-xl">
                  <Star className="text-yellow-500 mx-auto mb-1" size={16} />
                  <div className="text-lg font-bold text-gray-900">{emp.rating}</div>
                  <div className="text-xs text-gray-600">Rating</div>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-xl">
                  <Award className="text-purple-500 mx-auto mb-1" size={16} />
                  <div className="text-lg font-bold text-gray-900">${emp.incentives}</div>
                  <div className="text-xs text-gray-600">Incentives</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm text-gray-600 mb-3">Recent Achievements</h4>
                <div className="flex flex-wrap gap-2">
                  {emp.achievements.map((ach, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full">
                      <Award size={12} className="mr-1" />{ach}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Performance;
