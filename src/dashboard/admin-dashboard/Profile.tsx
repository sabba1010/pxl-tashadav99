import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  ShieldCheck, ShieldX, Clock, LogOut, UserCog, Key, Mail, Phone, Calendar, MapPin,
  Upload, RefreshCw, Wallet, Eye, EyeOff
} from "lucide-react";

const API_BASE_URL = "http://localhost:3200/api/user";

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  profilePicture: string | null;
  phone: string;
  countryCode?: string;
  createdAt: string;
  lastLogin?: string;
  lastLoginIp?: string;
  referralCode?: string;
  balance?: number;
  salesCredit?: number;
  subscribedPlan?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  dob?: string;
}

interface UpdateResponse {
  success: boolean;
  message?: string;
  user?: Partial<AdminProfile>;
}

// ────────────────────────────────────────────────
// Helper Components
// ────────────────────────────────────────────────
const SectionTitle: React.FC<{ icon?: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-200">
    {icon}
    <h3 className="text-xl font-bold text-gray-800">{children}</h3>
  </div>
);

const DetailItem: React.FC<{
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}> = ({ icon, label, value, highlight = false }) => (
  <div className="flex items-start gap-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition rounded-lg px-3">
    {icon && <div className="text-gray-500 mt-1">{icon}</div>}
    <div className="flex-1">
      <div className="text-sm text-gray-500 font-medium">{label}</div>
      <div className={`font-semibold ${highlight ? "text-blue-700" : "text-gray-900"} break-words`}>
        {value || <span className="text-gray-400 italic">Not set</span>}
      </div>
    </div>
  </div>
);

const StatusBadge: React.FC = () => (
  <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold border bg-green-100 text-green-800 border-green-200">
    ACTIVE
  </span>
);

// ────────────────────────────────────────────────
// Password Input with Eye Toggle
// ────────────────────────────────────────────────
const PasswordInput: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}> = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none pr-10"
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    country: "",
    balance: 0,
    salesCredit: 0,
    subscribedPlan: "",
  });
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const fetchProfile = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await axios.get<AdminProfile>(`${API_BASE_URL}/getall/${user._id}`);
      if (res.data) {
        setProfile(res.data);
        setEditForm({
          name: res.data.name || "",
          phone: res.data.phone || "",
          dob: res.data.dob || "",
          address: res.data.address || "",
          city: res.data.city || "",
          state: res.data.state || "",
          country: res.data.country || "",
          balance: res.data.balance || 0,
          salesCredit: res.data.salesCredit || 0,
          subscribedPlan: res.data.subscribedPlan || "",
        });
      }
    } catch (err) {
      console.error("Profile fetch failed:", err);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    const interval = setInterval(fetchProfile, 60000);
    return () => clearInterval(interval);
  }, [user?._id]);

  const handleEditSave = async () => {
    if (!profile) return;
    try {
      const response = await axios.put<UpdateResponse>(`${API_BASE_URL}/update-profile`, {
        _id: profile._id,
        email: profile.email,
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        dob: editForm.dob,
        address: editForm.address,
        city: editForm.city,
        state: editForm.state,
        country: editForm.country,
        balance: editForm.balance,
        salesCredit: editForm.salesCredit,
        subscribedPlan: editForm.subscribedPlan,
      });
      const { data } = response;
      if (data.success) {
        setProfile((prev) =>
          prev ? { ...prev, ...editForm, name: editForm.name, phone: editForm.phone } : null
        );
        setIsEditModalOpen(false);
        toast.success("Profile updated successfully");
        fetchProfile();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.new !== passwordForm.confirm) return toast.error("Passwords do not match");
    if (passwordForm.new.length < 6) return toast.error("Password must be at least 6 characters");
    try {
      const response = await axios.put<UpdateResponse>(`${API_BASE_URL}/update-password`, {
        _id: profile?._id,
        email: profile?.email,
        currentPassword: passwordForm.current,
        newPassword: passwordForm.new,
      });
      const { data } = response;
      if (data.success) {
        setIsPasswordModalOpen(false);
        setPasswordForm({ current: "", new: "", confirm: "" });
        toast.success("Password updated successfully");
      } else {
        toast.error(data.message || "Password change failed");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Password change failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-gray-500">Loading profile...</div>;
  if (!profile) return <div className="text-center text-red-600 min-h-screen flex items-center justify-center">Profile not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 relative">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold uppercase border-4 border-white/30">
                {profile.name?.charAt(0) || "?"}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white hover:bg-blue-700 transition">
                <Upload size={16} />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-gray-300 mt-1">{profile.email}</p>
              <div className="mt-3 flex flex-wrap gap-3 justify-center sm:justify-start">
                <StatusBadge />
              </div>
            </div>
          </div>
          <button
            onClick={fetchProfile}
            className="absolute top-4 right-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
            title="Refresh Profile"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Personal Information */}
            <div className="md:col-span-1">
              <SectionTitle icon={<UserCog size={20} />}>Personal Information</SectionTitle>
              <div className="space-y-1 bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
                <DetailItem icon={<Mail size={18} />} label="Email" value={profile.email} highlight />
                <DetailItem icon={<Phone size={18} />} label="Phone" value={profile.phone ? `${profile.countryCode || ""}${profile.phone}` : null} />
                <DetailItem icon={<Calendar size={18} />} label="Date of Birth" value={profile.dob} />
                <DetailItem icon={<MapPin size={18} />} label="Address" value={profile.address} />
                <DetailItem icon={<MapPin size={18} />} label="Location" value={profile.city && profile.state && profile.country ? `${profile.city}, ${profile.state}, ${profile.country}` : null} />
                <DetailItem icon={<Clock size={18} />} label="Member Since" value={new Date(profile.createdAt).toLocaleDateString()} />
              </div>
            </div>

            {/* Account & Security */}
            <div className="md:col-span-1">
              <SectionTitle icon={<Key size={20} />}>Account & Security</SectionTitle>
              <div className="space-y-1 bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
                <DetailItem
                  icon={<ShieldCheck size={18} />}
                  label="Last Login"
                  value={profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : "Never"}
                />
                <DetailItem
                  icon={<Clock size={18} />}
                  label="Account Status"
                  value={<StatusBadge />}
                />
                <DetailItem icon={<Key size={18} />} label="Password" value="••••••••••" />
                <div className="pt-3">
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                  >
                    <Key size={16} /> Change Password
                  </button>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="md:col-span-2">
              <SectionTitle icon={<Wallet size={20} />}>Financial Information</SectionTitle>
              <div className="space-y-1 bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
                <DetailItem label="Balance" value={profile.balance?.toFixed(2)} />
                <DetailItem label="Sales Credit" value={profile.salesCredit} />
                <DetailItem label="Subscribed Plan" value={profile.subscribedPlan} />
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="mt-10">
            <SectionTitle icon={<UserCog size={20} />}>Permissions</SectionTitle>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Manage Users", "View Reports", "Process Refunds", "Edit Products",
                  "View Analytics", "Manage Admins", "Access Financials", "System Settings",
                ].map((perm, i) => (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className="w-5 h-5 rounded bg-green-100 flex items-center justify-center">
                      <ShieldCheck size={14} className="text-green-600" />
                    </div>
                    <span className="text-gray-800 font-medium">{perm}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4 italic">
                Note: Permissions are based on role: <strong>{profile.role}</strong>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 shadow-md"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium flex items-center justify-center gap-2 shadow-md"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl overflow-y-auto max-h-[80vh]">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={editForm.dob}
                  onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={editForm.state}
                  onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={editForm.country}
                  onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={editForm.balance}
                  onChange={(e) => setEditForm({ ...editForm, balance: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sales Credit</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={editForm.salesCredit}
                  onChange={(e) => setEditForm({ ...editForm, salesCredit: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subscribed Plan</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={editForm.subscribedPlan}
                  onChange={(e) => setEditForm({ ...editForm, subscribedPlan: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-7 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <div className="space-y-5">
              <PasswordInput
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                placeholder="Current Password"
              />
              <PasswordInput
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                placeholder="New Password"
              />
              <PasswordInput
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                placeholder="Confirm New Password"
              />
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">Confirm Logout</h2>
            <p className="text-gray-600 mb-8">Are you sure you want to log out?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;