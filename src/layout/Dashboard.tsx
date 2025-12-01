import { Outlet } from "react-router-dom";
import { useCurrentUser } from "../context/useCurrentUser";
import AdminAdmins from "../dashboard/admin-dashboard/AdminAdmins";

const Dashboard = () => {
  const newUser = useCurrentUser();
  console.log(newUser?.role);
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
