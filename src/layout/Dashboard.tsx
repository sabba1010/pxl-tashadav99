import { Outlet } from "react-router-dom";
import AdminAdmins from "../dashboard/admin-dashboard/AdminAdmins";
import { Box } from "@mui/material";
import NotificationListener from "../components/NotificationListener";
import { useAuthHook } from "../hook/useAuthHook";

const Dashboard = () => {
  const { data: user } = useAuthHook();

  return (
    <div className="flex">
      {/* Notification Alert System with Sound */}
      {user && user.email && <NotificationListener userEmail={user.email} pollInterval={3000} />}
      
      <div>
        <AdminAdmins />
      </div>
      <div className="flex-1">
        <Box sx={{ p: 4 }}>
          <Outlet />
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;
