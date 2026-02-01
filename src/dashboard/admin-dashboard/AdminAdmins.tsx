import {
  AccountBalanceWallet,
  Assessment,
  ChevronLeft as MuiChevronLeft,
  ChevronRight as MuiChevronRight,
  CompareArrows,
  Dashboard,
  ListAlt,
  Logout,
  People,
  Person,
  Star,
  Diversity3,
  ManageAccounts,
  NotificationsActive,

} from "@mui/icons-material";
import { Box } from "@mui/material";
import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import AdminSettings from "./AdminSettings";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    name: "Dashboard Overview",
    path: "/admin-dashboard",
    icon: <Dashboard />
  },
  {
    name: "Listings",
    path: "/admin-dashboard/listings",
    icon: <ListAlt />
  },
  {
    name: "Buyer Account",
    path: "/admin-dashboard/users",
    icon: <People />
  },
  {
    name: "Seller Account",
    path: "/admin-dashboard/seller-accounts",
    icon: <ManageAccounts />,
  },
  {
    name: "All Deposit",
    path: "/admin-dashboard/deposits",
    icon: <AccountBalanceWallet />,
  },
  {
    name: "Withdrawal Requests",
    path: "/admin-dashboard/withdrawals",
    icon: <CompareArrows />,
  },
  {
    name: "All Reports",
    path: "/admin-dashboard/report",
    icon: <Assessment />,
  },
  {
    name: "Ratings & Reputation",
    path: "/admin-dashboard/ratings",
    icon: <Star />,
  },
  {
    name: "Referral Management",
    path: "/admin-dashboard/ref",
    icon: <Diversity3 />,
  },
  // --- Sent Notifications Route Added Below ---
  {
    name: "Sent Notifications",
    path: "/admin-dashboard/sent-notifications",
    icon: <NotificationsActive />,
  },

  {
    name: "Account Rate",
    path: "/admin-dashboard/settings",
    icon: <ManageAccounts />,
  },


  {
    name: "Profile",
    path: "/admin-dashboard/profile",
    icon: <Person />,
  },
];

const AdminAdmins: React.FC = () => {
  const location = useLocation();
  const showSettingsAside = false;
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuth();
  const toggleSidebar = () => setCollapsed((prev) => !prev);
  const navigate = useNavigate();

  const handelLogout = () => {
    // @ts-ignore
    if (user && typeof user.logout === 'function') {
      user.logout();
    }
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-20" : "w-64"
          } bg-[#00183C] text-white flex flex-col transition-all duration-300 ease-in-out shadow-2xl z-50`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <Link
            to="/"
            className={`font-extrabold text-[#D1A148] transition-opacity ${collapsed ? "opacity-0 w-0" : "text-xl opacity-100"
              } overflow-hidden whitespace-nowrap`}
          >
            Admin Panel
          </Link>

          <button
            onClick={toggleSidebar}
            className="text-white hover:bg-[#D1A148]/20 p-2 rounded-lg transition"
          >
            {collapsed ? <MuiChevronRight fontSize="small" /> : <MuiChevronLeft fontSize="small" />}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 p-3 text-sm font-medium rounded-lg transition-all duration-150 group relative ${isActive
                  ? "bg-[#D1A148] text-white shadow-md"
                  : "text-gray-300 hover:bg-[#D1A148] hover:text-white"
                  }`}
              >
                <Box sx={{ display: "flex", alignItems: "center", minWidth: "24px" }}>
                  {item.icon}
                </Box>

                <span
                  className={`${collapsed
                    ? "opacity-0 w-0"
                    : "opacity-100 whitespace-nowrap"
                    } transition-all duration-300 overflow-hidden`}
                >
                  {item.name}
                </span>

                {collapsed && (
                  <span className="absolute left-16 ml-4 px-3 py-1 bg-[#111827] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-gray-700">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 p-4 space-y-2 bg-[#00122e]">


          <button
            onClick={handelLogout}
            className="w-full flex items-center gap-4 p-3 text-sm font-medium text-gray-300 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-all duration-150 group relative"
          >
            <Logout />
            <span
              className={`${collapsed ? "opacity-0 w-0" : "opacity-100 whitespace-nowrap"
                } transition-all duration-300 overflow-hidden`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className={showSettingsAside ? "lg:col-span-2" : "lg:col-span-3"}>
              <Outlet />
            </div>

            {showSettingsAside && (
              <aside className="hidden lg:block lg:col-span-1">
                <div className="sticky top-6">
                  <AdminSettings />
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAdmins;