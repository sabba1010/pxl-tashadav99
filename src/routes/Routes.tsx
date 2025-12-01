import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import Dashboard from "../layout/Dashboard";
import Home from "../pages/home/Home";
// import OnlineStore from "../pages/onile-store/OnlineStore";
import Login from "../users/Login";
import Register from "../users/Register";
import Layout from "../layout/Layout";
import AdminAdmins from "../dashboard/admin-dashboard/AdminAdmins";

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
      // admin routes can be added here
      {
        path: "admin",
        element: <AdminAdmins />,
      },
    ],
  },
]);

export default Routes;
