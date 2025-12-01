import React from "react";
import { Outlet } from "react-router-dom";
import UserDashboard from "../dashboard/user-dashboard/UserDashboard";
import AdminSidebar from "../dashboard/admin-dashboard/AdminDashboard";
import { useCurrentUser } from "../context/useCurrentUser";

const Dashboard = () => {
  const newUser = useCurrentUser();
  console.log(newUser?.role)
  return (
    <div className="flex">
      <div>
       {newUser?.role === "admin" ? <AdminSidebar /> : ''}
        {newUser?.role === "user" ? <UserDashboard /> : ''}
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
