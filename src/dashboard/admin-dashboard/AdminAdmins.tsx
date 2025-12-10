import {
  AccountBalanceWallet,
  ChevronLeft,
  CompareArrows,
  Dashboard,
  ListAlt,
  Logout,
  Menu as MenuIcon,
  People,
  PeopleOutline,
  Person,
  ReceiptLong,
} from "@mui/icons-material";
import { Box, Avatar, Divider } from "@mui/material";
import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: "Dashboard Overview", path: "/admin-dashboard", icon: <Dashboard /> },
  { name: "Listings", path: "/admin-dashboard/listings", icon: <ListAlt /> },
  { name: "All Users", path: "/admin-dashboard/users", icon: <People /> },
  {
    name: "Seller Accounts",
    path: "/admin-dashboard/seller-accounts",
    icon: <PeopleOutline />,
  },
  {
    name: "All Transactions",
    path: "/admin-dashboard/transactions",
    icon: <ReceiptLong />,
  },
  {
    name: "Deposit Requests",
    path: "/admin-dashboard/deposits",
    icon: <AccountBalanceWallet />,
  },
  {
    name: "Withdrawal Requests",
    path: "/admin-dashboard/withdrawals",
    icon: <CompareArrows />,
  },
];

const AdminAdmins: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const handleLogout = () => {
    // TODO: logout logic (clear token, etc.)
    navigate("/login");
  };

  const currentPageName =
    navItems.find((item) => item.path === location.pathname)?.name ||
    "Admin Dashboard";

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-72"
        } bg-black/90 backdrop-blur-2xl text-white flex flex-col transition-all duration-500 ease-out border-r border-white/10 shadow-2xl`}
        style={{ background: "rgba(0, 0, 0, 0.9)" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link
            to="/"
            className={`font-black text-2xl tracking-tight bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent transition-all ${
              collapsed ? "opacity-0 w-0" : "opacity-100"
            }`}
          >
            ADMIN
          </Link>

          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-amber-500/30 backdrop-blur-md transition-all hover:scale-110"
          >
            {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeft />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group relative overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xl shadow-amber-500/20 scale-105"
                    : "text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-2"
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-all ${
                    isActive
                      ? "bg-white/20"
                      : "bg-white/5 group-hover:bg-amber-500/20"
                  }`}
                >
                  {item.icon}
                </div>

                <span
                  className={`font-medium transition-all duration-500 ${
                    collapsed ? "opacity-0 w-0" : "opacity-100"
                  }`}
                >
                  {item.name}
                </span>

                {/* Hover Tooltip */}
                {collapsed && (
                  <span className="absolute left-20 ml-2 px-4 py-2 bg-gray-900/95 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-white/20 backdrop-blur-xl">
                    {item.name}
                  </span>
                )}

                {/* Active Indicator */}
                {isActive && !collapsed && (
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-600/40 to-transparent rounded-2xl" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Profile & Logout */}
        <div className="p-4 border-t border-white/10">
          {/* Profile */}
          <Link
            to="/admin-dashboard/profile"
            className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group mb-3 ${
              location.pathname === "/admin-dashboard/profile"
                ? "bg-amber-500/20 border border-amber-500/50"
                : "hover:bg-white/10"
            }`}
          >
            <Avatar
              sx={{
                width: 44,
                height:44,
                bgcolor: "#D1A148",
                fontWeight: "bold",
              }}
            >
              A
            </Avatar>
            <div
              className={`transition-all duration-500 ${
                collapsed ? "opacity-0 w-0" : "opacity-100"
              } overflow-hidden`}
            >
              <p className="font-semibold text-white">Admin User</p>
              <p className="text-xs text-gray-400">admin@site.com</p>
            </div>
          </Link>

          <Divider sx={{ bgcolor: "white" }} className="my-3" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 group`}
          >
            <div className="p-2 rounded-xl bg-red-500/20 group-hover:bg-red-500/30 transition">
              <Logout fontSize="small" />
            </div>
            <span
              className={`transition-all duration-500 ${
                collapsed ? "opacity-0 w-0" : "opacity-100"
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-50">
        <div className="p-8 pb-12">

          {/* Content Card */}
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-8 lg:p-12">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAdmins;