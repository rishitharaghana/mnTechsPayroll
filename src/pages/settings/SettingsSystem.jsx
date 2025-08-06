import React from 'react';

const SettingsSystem = ({ settings, setSettings }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">System Preferences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="timezone">
            Timezone <span className="text-red-500">*</span>
          </label>
          <select
            id="timezone"
            required
            value={settings.system.timezone}
            onChange={(e) =>
              setSettings({
                ...settings,
                system: { ...settings.system, timezone: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Timezone</option>
            <option value="UTC-8">Pacific Time (UTC-8)</option>
            <option value="UTC-5">Eastern Time (UTC-5)</option>
            <option value="UTC+0">GMT (UTC+0)</option>
            <option value="UTC+5:30">India Standard Time (UTC+5:30)</option>
          </select>
        </div>

        {/* Date Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="dateFormat">
            Date Format <span className="text-red-500">*</span>
          </label>
          <select
            id="dateFormat"
            required
            value={settings.system.dateFormat}
            onChange={(e) =>
              setSettings({
                ...settings,
                system: { ...settings.system, dateFormat: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Date Format</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="currency">
            Currency <span className="text-red-500">*</span>
          </label>
          <select
            id="currency"
            required
            value={settings.system.currency}
            onChange={(e) =>
              setSettings({
                ...settings,
                system: { ...settings.system, currency: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Currency</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="language">
            Language <span className="text-red-500">*</span>
          </label>
          <select
            id="language"
            required
            value={settings.system.language}
            onChange={(e) =>
              setSettings({
                ...settings,
                system: { ...settings.system, language: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>

      </div>
    </div>
  );
};

export default SettingsSystem;
