// SettingsNav.jsx
import React from 'react';
import { User, Bell, Shield, Database } from 'lucide-react';

const sections = [
  { id: 'profile', label: 'Profile', icon: User, path:'/settings/profile' },
];

const SettingsNav = ({ activeSection, setActiveSection }) => {
  return (
    <div className="w-full lg:col-span-1">
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <nav className="space-y-2 flex gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-2xs m-0 flex items-center space-x-3 px-2 py-2 rounded-lg transition-colors duration-200 ${
                  activeSection === section.id
                    ? 'bg-slate-700 text-white'
                    : 'text-gray-700 bg-gray-100'
                }`}
                aria-current={activeSection === section.id ? 'page' : undefined}
              >
                <Icon size={18} />
                <span className="font-medium">{section.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default SettingsNav;