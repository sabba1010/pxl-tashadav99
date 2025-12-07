import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Dashboard,
  People,
  ReceiptLong,
  ListAlt,
  AccountBalanceWallet,
  CompareArrows,
  Person,
  Menu as MenuIcon,
  ChevronLeft,
} from "@mui/icons-material";
import { Box } from "@mui/material";

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { name: "Dashboard Overview", path: "/admin-dashboard", icon: <Dashboard /> },
  { name: "All Users", path: "/admin-dashboard/users", icon: <People /> },
  {
    name: "All Transactions",
    path: "/admin-dashboard/transactions",
    icon: <ReceiptLong />,
  },
  { name: "Total Listings", path: "/admin-dashboard/listings", icon: <ListAlt /> },
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
  { name: "My Profile", path: "/admin-dashboard/profile", icon: <Person /> },
];

const AdminAdmins: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-[#00183C] text-white flex flex-col transition-all duration-300 ease-in-out shadow-2xl`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <Link
            to="/"
            className={`font-extrabold text-[#D1A148] transition-opacity ${
              collapsed ? "opacity-0 w-0" : "text-xl opacity-100"
            } overflow-hidden whitespace-nowrap`}
          >
            Admin Panel
          </Link>

          {/* Collapse Button */}
          <button
            onClick={toggleSidebar}
            className="text-white hover:bg-[#D1A148]/20 p-2 rounded-lg transition"
          >
            {collapsed ? <MenuIcon /> : <ChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 p-3 text-sm font-medium rounded-lg transition-all duration-150 group ${
                  isActive
                    ? "bg-[#D1A148] text-white shadow-md"
                    : "text-gray-300 hover:bg-[#D1A148] hover:text-white"
                }`}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {React.cloneElement(item.icon as React.ReactElement, )}
                </Box>

                {/* Text – hidden when collapsed */}
                <span
                  className={`${
                    collapsed
                      ? "opacity-0 w-0"
                      : "opacity-100 whitespace-nowrap"
                  } transition-all duration-300 overflow-hidden`}
                >
                  {item.name}
                </span>

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <span className="absolute left-20 ml-2 px-3 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <header className="mb-6 pb-3 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {navItems.find((item) => item.path === location.pathname)?.name ||
              "Welcome to the Dashboard"}
          </h2>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-lg min-h-[calc(100vh-150px)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminAdmins;