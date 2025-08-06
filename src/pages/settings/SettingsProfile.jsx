// ProfileSettings.jsx
import React from 'react';

const ProfileSettings = ({ settings, setSettings }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={settings.profile.name}
            onChange={(e) =>
              setSettings({
                ...settings,
                profile: { ...settings.profile, name: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={settings.profile.email}
            onChange={(e) =>
              setSettings({
                ...settings,
                profile: { ...settings.profile, email: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={settings.profile.phone}
            onChange={(e) =>
              setSettings({
                ...settings,
                profile: { ...settings.profile, phone: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="role">
            Role
          </label>
          <input
            id="role"
            type="text"
            value={settings.profile.role}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;