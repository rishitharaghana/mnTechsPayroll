import React, { useState } from "react";
import SettingsNav from "../pages/settings/SettingsNav";
import SettingsProfile from "../pages/settings/SettingsProfile";
import PageBreadcrumb from "../Components/common/PageBreadcrumb";
import PageMeta from "../Components/common/PageMeta";

const EditProfile = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [profile, setProfile] = useState({
    profile: {
      name: "John Administrator",
      email: "admin@payrollhub.com",
      phone: "+1 (555) 123-4567",
      role: "System Administrator",
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      systemAlerts: true,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "30",
      passwordExpiry: "90",
    },
    system: {
      timezone: "UTC-5",
      dateFormat: "MM/DD/YYYY",
      currency: "USD",
      language: "English",
    },
  });

  return (
    <div className="w-78/100">
      <div className="flex justify-end">
        <PageBreadcrumb
          items={[
            { label: "Home", link: "/admin/dashboard" },
            { label: "Profile", link: "/profile" },
          ]}
        />
        <PageMeta title="Edit Profile" description="Manage your account and system preferences" />
      </div>
      <div className="space-y-6 bg-white rounded-2xl p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your account and system preferences
          </p>
        </div>

        <div className="grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <SettingsNav
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div>
              {activeSection === "profile" && (
                <SettingsProfile settings={profile} setProfile={setProfile} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
