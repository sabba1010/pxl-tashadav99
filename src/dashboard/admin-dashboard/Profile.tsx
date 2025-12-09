import React, { useState } from "react";

/**
 * Interface for mock admin data
 */
interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Moderator" | "Finance";
  lastLogin: string;
  isTwoFactorEnabled: boolean;
  notificationPreferences: {
    deposits: boolean;
    withdrawals: boolean;
    userReports: boolean;
  };
}

// --- MOCK DATA ---
const mockAdmin: AdminProfile = {
  id: "ADM001",
  name: "Aurora Borealis",
  email: "aurora.admin@platform.com",
  role: "Super Admin",
  lastLogin: "2024-07-25 09:30 AM UTC",
  isTwoFactorEnabled: true,
  notificationPreferences: {
    deposits: true,
    withdrawals: true,
    userReports: false,
  },
};

// --- HELPER COMPONENT: Profile Stat Card ---
interface StatCardProps {
  title: string;
  value: string | React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <div className={`p-5 rounded-xl shadow-lg border-l-4 ${color}`}>
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <div className="mt-1 text-xl font-bold text-gray-900">{value}</div>
  </div>
);

// --- MAIN COMPONENT: PROFILE ---

const Profile: React.FC = () => {
  // We use state to hold the profile data, simulating an API fetch or local store
  const [profile, setProfile] = useState<AdminProfile>(mockAdmin);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  // Simulated action for updating the profile name
  const handleSave = () => {
    setProfile((prev) => ({ ...prev, name: nameInput }));
    setIsEditing(false);
    // In a real app, an API call would be made here
    console.log(`Profile updated: Name changed to ${nameInput}`);
  };

  // Simulated action for changing password (modal/form placeholder)
  const handleChangePassword = () => {
    console.log("Change Password functionality triggered.");
    // Implement a dedicated modal/form for password change here
    alert("Password change form launched (simulated).");
  };

  // Simulated action for toggling 2FA
  const handleToggle2FA = () => {
    const newStatus = !profile.isTwoFactorEnabled;
    setProfile((prev) => ({ ...prev, isTwoFactorEnabled: newStatus }));
    console.log(`2FA status updated to: ${newStatus}`);
  };

  // Simulated action for toggling notification preferences
  const handleToggleNotification = (
    key: keyof AdminProfile["notificationPreferences"]
  ) => {
    setProfile((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key],
      },
    }));
  };

  return (
    <div className="p-4 space-y-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 border-b pb-2">
        Administrator Profile
      </h2>

      {/* Profile Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Admin Role"
          value={profile.role}
          color="border-indigo-500 bg-white"
        />
        <StatCard
          title="Account ID"
          value={<span className="font-mono text-sm">{profile.id}</span>}
          color="border-gray-500 bg-white"
        />
        <StatCard
          title="Last Login"
          value={
            <span className="text-sm">{profile.lastLogin.split(" ")[0]}</span>
          }
          color="border-green-500 bg-white"
        />
      </div>

      {/* General Information Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            General Information
          </h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-[#00183C] bg-indigo-100 rounded-lg hover:bg-indigo-200 transition duration-150"
            >
              Edit
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNameInput(profile.name);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Name Field */}
          <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
            <span className="w-full sm:w-1/3 text-sm font-medium text-gray-600">
              Full Name
            </span>
            <div className="w-full sm:w-2/3 mt-1 sm:mt-0">
              {isEditing ? (
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />
              ) : (
                <span className="text-base font-semibold text-gray-900">
                  {profile.name}
                </span>
              )}
            </div>
          </div>

          {/* Email Field (Read-only) */}
          <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100">
            <span className="w-full sm:w-1/3 text-sm font-medium text-gray-600">
              Email Address
            </span>
            <span className="w-full sm:w-2/3 text-base text-gray-900 mt-1 sm:mt-0">
              {profile.email}
            </span>
          </div>

          {/* Role Field (Read-only) */}
          <div className="flex flex-col sm:flex-row sm:items-center py-2">
            <span className="w-full sm:w-1/3 text-sm font-medium text-gray-600">
              Access Level
            </span>
            <span className="w-full sm:w-2/3 text-base font-bold text-indigo-600 mt-1 sm:mt-0">
              {profile.role}
            </span>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Security Settings
        </h3>

        <div className="space-y-4">
          {/* Change Password */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-base font-medium text-gray-900">
              Change Password
            </span>
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 text-sm font-medium text-white bg-[#D1A148] rounded-lg hover:bg-[#755823] transition duration-150 shadow-md"
            >
              Update Password
            </button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center space-x-2">
              <span className="text-base font-medium text-gray-900">
                Two-Factor Authentication (2FA)
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  profile.isTwoFactorEnabled
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {profile.isTwoFactorEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <button
              onClick={handleToggle2FA}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition duration-150 shadow-md ${
                profile.isTwoFactorEnabled
                  ? "bg-[#D1A148] hover:bg-[#755823]"
                  : "bg-[#D1A148] hover:bg-[#755823]"
              }`}
            >
              {profile.isTwoFactorEnabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Preferences Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Notification Preferences
        </h3>

        <div className="space-y-2">
          {Object.entries(profile.notificationPreferences).map(
            ([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="text-base text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()} Alerts
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() =>
                      handleToggleNotification(
                        key as keyof AdminProfile["notificationPreferences"]
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D1A148]"></div>
                </label>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
