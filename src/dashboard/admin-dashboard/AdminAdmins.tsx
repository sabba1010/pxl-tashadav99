import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

/**
 * Define the structure for sidebar navigation items
 */
interface NavItem {
  name: string;
  path: string;
}

// 💥 CORRECTED PATHS 💥
const navItems: NavItem[] = [
  // The path for the Dashboard Overview (index route of the admin-dashboard segment)
  { name: "Dashboard Overview", path: "/dashboard/admin-dashboard" },
  { name: "All Users", path: "/dashboard/admin-dashboard/users" },
  { name: "All Transactions", path: "/dashboard/admin-dashboard/transactions" },
  { name: "Total Listings", path: "/dashboard/admin-dashboard/listings" },
  // Action/Request Routes
  { name: "Deposit Requests", path: "/dashboard/admin-dashboard/deposits" },
  {
    name: "Withdrawal Requests",
    path: "/dashboard/admin-dashboard/withdrawals",
  },
  // Administrative/Personal Route
  { name: "My Profile", path: "/dashboard/admin-dashboard/profile" },
];

const AdminAdmins: React.FC = () => {
  const location = useLocation();

  // Component for a single sidebar link
  const SidebarLink: React.FC<NavItem> = ({ name, path }) => {
    // ... (rest of SidebarLink remains the same)
    const isActive = location.pathname === path;
    const baseClasses =
      "flex items-center p-3 text-sm font-medium rounded-lg transition duration-150";
    const activeClasses = "bg-indigo-700 text-white shadow-md";
    const inactiveClasses =
      "text-gray-300 hover:bg-indigo-600 hover:text-white";

    return (
      <Link
        to={path}
        className={`${baseClasses} ${
          isActive ? activeClasses : inactiveClasses
        }`}
      >
        {name}
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 🧭 Sidebar (Fixed Width) */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-extrabold text-indigo-400">
            Admin Panel
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarLink key={item.path} name={item.name} path={item.path} />
          ))}
        </nav>
      </aside>

      {/* 🖥️ Main Content Area (Dynamic Data Display) */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <header className="mb-6 pb-3 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {navItems.find((item) => item.path === location.pathname)?.name ||
              "Welcome to the Dashboard"}
          </h2>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-lg min-h-[calc(100vh-150px)]">
          <Outlet /> {/* Renders the content */}
        </div>
      </main>
    </div>
  );
};

export default AdminAdmins;
