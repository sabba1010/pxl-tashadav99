import React, { useState, useEffect, useCallback } from 'react';
import { Eye, Calendar, User, Lock, Bell, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAuthHook } from '../hook/useAuthHook';
import { getAllNotifications } from './Notification/Notification';
import ListingsManagement from './Listings/ListingsManagement';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { data: userData } = useAuthHook();

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    ...(userData?.role === 'seller' || userData?.role === 'admin'
      ? [{ id: 'listings', label: 'Listings', icon: Package }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your profile, security and notification preferences
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-all
                    ${isActive
                      ? 'text-white shadow-sm'
                      : 'text-gray-700 bg-white border border-gray-300 hover:text-gray-900'
                    }
                  `}
                  style={isActive ? { backgroundColor: '#d4a643' } : {}}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-14">
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'security' && <SecuritySection />}
          {activeTab === 'notifications' && <NotificationsSection />}
          {activeTab === 'listings' && <ListingsManagement />}
        </div>
      </div>
    </div>
  );
};

const ProfileSection = () => (
  <div className="space-y-14">
    {/* Personal Information */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Personal Information</h2>
      <p className="text-sm text-gray-500 mb-6">
        Make adjustments to your personal information and save them.
      </p>

      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            defaultValue="Legityankeelogshub"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
          />
          <p className="mt-1.5 text-xs text-gray-500">
            You can update your name after 7 days
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            defaultValue="tajudeentoyeeb095@gmail.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
          <div className="flex rounded-lg border border-gray-300 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 overflow-hidden">
            <span className="inline-flex items-center bg-gray-100 px-4 text-gray-600 text-lg">
              🇳🇬
            </span>
            <input
              type="tel"
              defaultValue="+234 903 433 538 9"
              className="flex-1 px-4 py-3 bg-white outline-none"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Avatar */}
    {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Avatar</h2>
      <p className="text-sm text-gray-500 mb-6">Select a nice picture of yourself.</p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
        <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden">
          <div className="bg-gray-700 p-2.5 rounded-full">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-orange-400 transition-colors cursor-pointer">
            <div className="mx-auto bg-gray-50 p-3 rounded-full w-fit mb-3">
              <Camera className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm">
              <span className="text-orange-600 font-medium">Click to replace</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-2">
              SVG, PNG, JPG or GIF (max 800 x 400px)
            </p>
          </div>
        </div>
      </div>
    </div> */}

    {/* Additional Information */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Additional Information</h2>
      <p className="text-sm text-gray-500 mb-6">Verify your identity</p>

      <div className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white">
              <option>Nigeria</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white">
              <option>OS</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white">
            <option>Osogbo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User address</label>
          <input
            type="text"
            defaultValue="Second gate uniosun sogbo area"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <div className="relative">
            <input
              type="text"
              defaultValue="07-07-2000"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button className="text-white px-8 py-3 rounded-lg font-semibold transition shadow-sm" style={{ backgroundColor: '#d4a643' }} onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#c4952f'} onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#d4a643'}>
            Save & Proceed
          </button>
        </div>
      </div>
    </div>
  </div>
);

const SecuritySection = () => (
  <div className="space-y-14">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Password</h2>
      <p className="text-sm text-gray-500 mb-6">
        Please enter your current password to change your password.
      </p>

      <div className="space-y-5 max-w-xl">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            placeholder="Current Password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
          />
          <Eye className="absolute right-3 top-[42px] w-5 h-5 text-gray-400 cursor-pointer" />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            placeholder="New Password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
          />
          <Eye className="absolute right-3 top-[42px] w-5 h-5 text-gray-400 cursor-pointer" />
        </div>

        <ul className="text-xs text-gray-500 list-disc pl-5 space-y-1">
          <li>Minimum length of 3-30 characters</li>
          <li>Only lowercase, numeric and symbols allowed</li>
        </ul>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
          <input
            type="password"
            placeholder="Confirm password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
          />
          <Eye className="absolute right-3 top-[42px] w-5 h-5 text-gray-400 cursor-pointer" />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button className="px-8 py-2.5 border rounded-lg transition font-medium" style={{ borderColor: '#d4a643', color: '#d4a643' }} onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#f5f0e8'} onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'}>
            Cancel
          </button>
          <button className="px-8 py-2.5 text-white rounded-lg transition font-medium" style={{ backgroundColor: '#d4a643' }} onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#c4952f'} onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#d4a643'}>
            Update password
          </button>
        </div>
      </div>
    </div>

    {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">Withdrawal PIN</h2>
      <p className="text-sm text-gray-500 mb-2">Set your withdrawal pin</p>

      <p className="text-sm text-gray-500 mb-5">Create Withdrawal pin</p>

      <div className="flex gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            defaultValue="-"
            className="w-14 h-14 text-center text-2xl font-medium border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-white"
          />
        ))}
      </div>

      <div className="flex justify-end">
        <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition shadow-sm">
          Create Pin
        </button>
      </div>
    </div> */}
  </div>
);

const NotificationsSection = () => {
  const { user } = useAuth();
  const { data: userData } = useAuthHook();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await getAllNotifications();
      const userRole = userData?.role;

      const myNotifs = Array.isArray(res)
        ? res.filter((n: any) => {
            const isDirect = n.userEmail === user?.email;
            const isAll = n.target === "all";
            const isRoleMatch = userRole && n.target === `${userRole}s`;
            return isDirect || isAll || isRoleMatch;
          })
        : [];

      const sortedNotifs = myNotifs.sort(
        (a: any, b: any) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );

      setNotifications(sortedNotifs);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [user?.email, userData?.role]);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      await fetchNotifications();
      setLoading(false);
    };

    if (user?.email) {
      loadNotifications();
      const interval = setInterval(async () => {
        await fetchNotifications();
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [user?.email, userData?.role, fetchNotifications]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Notifications</h2>
        <p className="text-sm text-gray-500 mb-6">
          Get notified on activities within Acctbazaar
        </p>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Notifications</h2>
          <p className="text-sm text-gray-500">
            Get notified on activities within Acctbazaar
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
            refreshing
              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
              : 'text-white hover:opacity-90'
          }`}
          style={!refreshing ? { backgroundColor: '#d4a643' } : {}}
        >
          <svg
            className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-3">
          {notifications.map((notification, idx) => (
            <div
              key={notification._id || idx}
              className={`p-5 rounded-xl border-l-4 hover:shadow-lg transition-all ${
                notification.read
                  ? 'bg-gray-50 border-l-gray-300'
                  : 'bg-blue-50 border-l-blue-600'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                    {!notification.read && (
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {notification.message || notification.description || 'No description'}
                  </p>
                  <p className="text-[12px] text-gray-500 font-medium">
                    {notification.createdAt
                      ? new Date(notification.createdAt).toLocaleString()
                      : 'Date not available'}
                  </p>
                </div>
                {notification.type && (
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-bold uppercase whitespace-nowrap"
                    style={{
                      backgroundColor:
                        notification.type === 'warning'
                          ? '#FEF3C7'
                          : notification.type === 'alert'
                          ? '#FEE2E2'
                          : '#DBEAFE',
                      color:
                        notification.type === 'warning'
                          ? '#92400E'
                          : notification.type === 'alert'
                          ? '#991B1B'
                          : '#1E40AF',
                    }}
                  >
                    {notification.type}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bell size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-semibold">No notifications</p>
          <p className="text-sm text-gray-300 mt-2">You're all set! No new notifications at this time.</p>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;