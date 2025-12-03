import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import Home from "../pages/home/Home";
// import OnlineStore from "../pages/onile-store/OnlineStore";
import Layout from "../layout/Layout";
import Login from "../users/Login";
import Register from "../users/Register";

import AdminAdmins from "../dashboard/admin-dashboard/AdminAdmins";
import AllTransactions from "../dashboard/admin-dashboard/AllTransactions";
import AllUsers from "../dashboard/admin-dashboard/AllUsers";
import DashboardOverview from "../dashboard/admin-dashboard/DashboardOverview";
import DepositRequests from "../dashboard/admin-dashboard/DepositRequests";
import Profile from "../dashboard/admin-dashboard/Profile";
import TotalListings from "../dashboard/admin-dashboard/TotalListings";
import WithdrawalRequests from "../dashboard/admin-dashboard/WithdrawalRequests";

import BuyerAddProduct from "../dashboard/buyer-dahboard/BuyerAddProduct";

import Marketplace from "../Marketplace/Marketplace";

// import path from "path";
import Buyer from "../dashboard/buyer-dahboard/Buyer";
import Mypurchase from "../Mypurchase/Mypurchase";
import Report from "../Mypurchase/Report";
import Walet from "../Walte/Walet";
import Mysells from "../dashboard/buyer-dahboard/Mysells";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Marketplace/>,
      },
      {
        path: "/marketplace",
        element: <Marketplace />,
      },

      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/purchases",
        element: <Mypurchase />,
      },
      {
        path: "/wallet",
        element: <Walet/>,
      },
      {
        path: "/report",
        element: <Report />,
      },
      {
        path: "/register",
        element: <Register />,
      },
       {
        path: "/mysells",
        element: <Mysells />,
      },
      {
        path: "add-product",
        element: <BuyerAddProduct />,
      },
      {
        path: "buyer-dashboard",
        element: <Buyer />,
      },
    ],
  },

  {
    path: "admin-dashboard",
    element: <AdminAdmins />,
    children: [
      {
        index: true,
        element: <DashboardOverview />,
      },
      {
        path: "users",
        element: <AllUsers />,
      },
      {
        path: "transactions",
        element: <AllTransactions />,
      },
      {
        path: "deposits",
        element: <DepositRequests />,
      },
      {
        path: "withdrawals",
        element: <WithdrawalRequests />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "listings",
        element: <TotalListings />,
      },
    ],
  },
  // admin routes can be added here for admin route
]);

export default Routes;
