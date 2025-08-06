import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const SettingsProfile = ({ settings, setSettings }) => {
  const [previewImage, setPreviewImage] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setSettings({
          ...settings,
          profile: { ...settings.profile, profileImage: reader.result },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!settings.profile.fullName) newErrors.fullName = 'Full Name is required';
    if (!settings.profile.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(settings.profile.email))
      newErrors.email = 'Invalid email format';
    if (!settings.profile.phone) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(settings.profile.phone))
      newErrors.phone = 'Phone number must be a 10-digit Indian number starting with 6, 7, 8, or 9';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save changes
  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate saving data (replace with API call if needed)
      setIsSaved(true);
      // Clear form inputs
      setSettings({
        ...settings,
        profile: {
          profileImage: '',
          fullName: '',
          email: '',
          phone: '',
          designation: '',
          department: '',
          employeeId: '',
        },
      });
      setPreviewImage('');
      setErrors({});
      // Reset save status after 3 seconds
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900">Profile Settings</h2>

      {/* Save Confirmation Message */}
      {isSaved && (
        <div className="p-3 bg-green-100 text-green-700 rounded-lg">
          Profile settings saved successfully!
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSaveChanges}>
        {/* Profile Image Upload */}
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
                {settings.profile.fullName?.charAt(0) || '?'}
              </div>
            )}
            <label
              htmlFor="profileImage"
              className="absolute bottom-0 right-0 cursor-pointer bg-blue-500 text-white rounded-full p-1.5 hover:bg-blue-600 transition-colors duration-200"
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

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="fullName"
            >
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              value={settings.profile.fullName || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, fullName: e.target.value },
                })
              }
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={settings.profile.email || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, email: e.target.value },
                })
              }
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="phone"
            >
              Phone *
            </label>
            <input
              id="phone"
              type="tel"
              value={settings.profile.phone || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, phone: e.target.value },
                })
              }
              required
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
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
              value={settings.profile.designation || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, designation: e.target.value },
                })
              }
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
              value={settings.profile.department || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, department: e.target.value },
                })
              }
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
              value={settings.profile.employeeId || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, employeeId: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsProfile;