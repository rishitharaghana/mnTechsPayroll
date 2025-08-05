import {
  Calendar, Clock, CreditCard, FileText, MapPin,
  TrendingUp, Users
} from 'lucide-react';
import React from 'react';

const AppSidebar = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'timetracking', label: 'Time Tracking', icon: Clock },
    { id: 'payroll', label: 'Payroll', icon: CreditCard },
    { id: 'payslips', label: 'Payslips', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'visitingcards', label: 'Visiting Cards', icon: MapPin },
  ];

  return (
    <>
      <aside className={`${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white/80 backdrop-blur-md border-r border-white/20 transition-transform duration-300 ease-in-out`}>
        <nav className="p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-700 hover:bg-white/50 hover:backdrop-blur-sm'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default AppSidebar;
