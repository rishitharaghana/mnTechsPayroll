// Settings.jsx
import React, { useState } from 'react';
import SettingsNav from '../../pages/settings/SettingsNav';
import ProfileSettings from '../../pages/settings/SettingsProfile';
import SystemSettings from '../../pages/settings/SettingsSystem';
import SaveButton from '../../pages/settings/SaveButton';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Administrator',
      email: 'admin@payrollhub.com',
      phone: '+1 (555) 123-4567',
      role: 'System Administrator',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      systemAlerts: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordExpiry: '90',
    },
    system: {
      timezone: 'UTC-5',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      language: 'English',
    },
  });

  const handleSave = () => {
    // Save settings logic here (e.g., API call)
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and system preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <SettingsNav activeSection={activeSection} setActiveSection={setActiveSection} />

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {activeSection === 'profile' && (
              <ProfileSettings settings={settings} setSettings={setSettings} />
            )}
            {activeSection === 'system' && (
              <SystemSettings settings={settings} setSettings={setSettings} />
            )}
            <SaveButton onSave={handleSave} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;