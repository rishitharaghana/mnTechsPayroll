import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const SettingsProfile = ({ settings, setSettings }) => {
  const [previewImage, setPreviewImage] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setSettings({
          ...settings,
          profileImage: reader.result, 
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full space-y-6 p-6 bg-white boarder-1 border-gray-700 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900">Profile Settings</h2>

      {isSaved && (
        <div className="p-3 bg-green-100 text-green-700 rounded-lg">
          Profile settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSaveChanges}>
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full border-2 border-gray-200 object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-2xl text-gray-500 border-2 border-gray-200">
                {settings.name?.charAt(0) || '?'}
              </div>
            )}
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 cursor-pointer bg-slate-700 text-white rounded-full p-1.5 transition-colors duration-200"
            >
              <Camera className="h-5 w-5" />
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="fullName"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={settings.name || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  name: e.target.value,
                })
              }
              placeholder="Enter full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={settings.email || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  email: e.target.value,
                })
              }
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="phone"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={settings.phone || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  phone: e.target.value,
                })
              }
              placeholder="Enter number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="designation"
            >
              Designation
            </label>
            <input
              id="designation"
              type="text"
              value={settings.designation || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  designation: e.target.value,
                })
              }
              placeholder="Enter designation"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="department"
            >
              Department
            </label>
            <input
              id="department"
              type="text"
              value={settings.department || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  department: e.target.value,
                })
              }
              placeholder="Enter department"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="employeeId"
            >
              Employee ID
            </label>
            <input
              id="employeeId"
              type="text"
              value={settings.employeeId || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  employeeId: e.target.value,
                })
              }
              placeholder="Enter employee ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-slate-700 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsProfile;