import { Outlet } from "react-router-dom";
import AdminAdmins from "../dashboard/admin-dashboard/AdminAdmins";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const newUser = useAuth();
  return (
    <div className="flex">
      <div>
        <AdminAdmins/>
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
