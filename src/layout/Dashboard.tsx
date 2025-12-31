import { Outlet } from "react-router-dom";
import AdminAdmins from "../dashboard/admin-dashboard/AdminAdmins";
import { Box } from "@mui/material";

const Dashboard = () => {
  return (
    <div className="flex">
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
