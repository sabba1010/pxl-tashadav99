import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import Profile from "../dashboard/user-dashboard/Profile";
import Dashboard from "../layout/Dashboard";
import Home from "../pages/home/Home";
// import OnlineStore from "../pages/onile-store/OnlineStore";
import RastrearPage from "../pages/rastrear-page/RastrearPage";
import Login from "../users/Login";
import Register from "../users/Register";
import Layout from "../layout/Layout";
import AdminAdmins from "../dashboard/admin-dashboard/AdminAdmins";

import DashbordUser from "../dashboard/user-dashboard/DashbordUser";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
    
      
      {
        path: "/rasterear",
        element: <RastrearPage />,
      },
      //   {
      //     path: "/tienda",
      //     element: <OnlineStore />,
      //   },

     
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
     
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [

  
      {
        path: "user-dashboard",
        element: <DashbordUser />,
      },
     
     
     
     
      {
        path: "profile",
        element: <Profile />,
      },

      // admin routes can be added here
      {
        path: "admin",
        element: <AdminAdmins />,
      },
    
    ],
  },
]);

export default Routes;
