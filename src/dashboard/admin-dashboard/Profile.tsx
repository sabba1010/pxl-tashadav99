import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "http://localhost:3200/api/user";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────

interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "blocked" | "suspended";
  isTwoFactorEnabled: boolean;
  profilePicture: string | null;
  phone: string;
  createdAt: string;
  lastLogin?: string;
  countryCode?: string;
  referralCode?: string;
  balance?: number;
  salesCredit?: number;
  subscribedPlan?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  dob?: string;
  accountCreationDate?: string;
  savedBankAccount?: {
    accountNumber: string;
    bankCode: string;
    fullName: string;
    bankName: string;
  };
}

interface UpdateResponse {
  success: boolean;
  message?: string;
  user?: AdminProfile;
}

// ────────────────────────────────────────────────
// Helper Components
// ────────────────────────────────────────────────

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
    {children}
  </h3>
);

const DetailItem: React.FC<{ label: string; value: string | number | null | undefined }> = ({
  label,
  value,
}) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition px-2 rounded-lg">
    <span className="text-gray-500 font-medium mb-1 sm:mb-0">{label}</span>
    <span className="text-gray-900 font-semibold text-right break-words max-w-full sm:max-w-[60%]">
      {value || <span className="text-gray-400 italic">Not set</span>}
    </span>
  </div>
);

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Fetch profile data
  useEffect(() => {
    if (!user?._id) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get<AdminProfile>(
          `${API_BASE_URL}/getall/${user._id}`
        );

        if (response.data) {
          setProfile(response.data);
          setEditForm({
            name: response.data.name || "",
            email: response.data.email || "",
          });
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?._id]);

  // Save edited name
  const handleEditSave = async () => {
    if (!profile) return;

    try {
      const { data } = await axios.put<UpdateResponse>(
        `${API_BASE_URL}/update-profile`,
        {
          email: profile.email,
          name: editForm.name.trim(),
        }
      );

      if (data.success) {
        setProfile((prev) =>
          prev ? { ...prev, name: editForm.name } : null
        );
        setIsEditModalOpen(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error updating profile");
    }
  };

  // Change password
  const handlePasswordChange = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      return toast.error("New passwords do not match");
    }

    if (passwordForm.new.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      if (!profile) return;

      const response = await axios.put<UpdateResponse>(
        `${API_BASE_URL}/update-password`,
        {
          email: profile.email,
          currentPassword: passwordForm.current,
          newPassword: passwordForm.new,
        }
      );

      if (response.data?.success) {
        setIsPasswordModalOpen(false);
        setPasswordForm({ current: "", new: "", confirm: "" });
        toast.success("Password changed successfully!");
      } else {
        toast.error(response.data?.message || "Password change failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error changing password");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-10 text-center text-red-600">Profile not found</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>

        {/* Profile header */}
        <div className="flex items-center gap-6 mb-10 pb-8 border-b">
          <div className="w-24 h-24 rounded-full bg-[#00183C] text-[#D1A148] flex items-center justify-center text-4xl font-bold uppercase">
            {profile.name.charAt(0) || "?"}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="mt-2 text-sm text-blue-600 hover:underline font-medium"
            >
              Edit name
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Profile Information */}
          <div>
            <SectionTitle>Profile Information</SectionTitle>
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
              <DetailItem label="Full Name" value={profile.name} />
              <DetailItem label="Email" value={profile.email} />
              <DetailItem
                label="Phone"
                value={profile.phone ? `${profile.countryCode || ""} ${profile.phone}` : null}
              />
              <DetailItem label="Role" value={profile.role} />
              <DetailItem label="Date of Birth" value={profile.dob} />
              <DetailItem
                label="Account Created"
                value={profile.accountCreationDate ? new Date(profile.accountCreationDate).toLocaleDateString() : new Date(profile.createdAt).toLocaleDateString()}
              />
            </div>
          </div>

          {/* Account & System Info */}
          <div>
            <SectionTitle>Account & System Info</SectionTitle>
            <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
              <DetailItem label="Subscribed Plan" value={profile.subscribedPlan} />
              <DetailItem label="Sales Credit" value={profile.salesCredit} />
              <DetailItem
                label="Balance"
                value={profile.balance !== undefined ? `$${profile.balance.toFixed(2)}` : null}
              />
              <DetailItem label="Referral Code" value={profile.referralCode} />
            </div>
          </div>
        </div>


        {/* Security section */}
        <div className="space-y-6">
          <h3 className="font-bold text-lg">Security</h3>

          <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
            <span>Password</span>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="text-blue-600 hover:underline"
            >
              Change
            </button>
          </div>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full mt-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition"
          >
            Logout
          </button>
        </div>

        {/* Edit Name Modal */}



        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4">
              <h2 className="text-xl font-bold mb-4">Edit Name</h2>
              <input
                className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 border py-3 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4">
              <h2 className="text-xl font-bold mb-4">Change Password</h2>

              <input
                type="password"
                placeholder="Current password"
                className="w-full border p-3 rounded mb-3"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
              />
              <input
                type="password"
                placeholder="New password"
                className="w-full border p-3 rounded mb-3"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full border p-3 rounded mb-5"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 border py-3 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="flex-1 bg-black text-white py-3 rounded hover:bg-gray-800"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation */}
        {isLogoutModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-xs mx-4 text-center">
              <p className="text-lg mb-5">Are you sure you want to log out?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 border py-3 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 text-white py-3 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;