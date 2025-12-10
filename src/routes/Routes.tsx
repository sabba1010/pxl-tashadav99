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

import Marketplace from "../components/Marketplace/Marketplace";

// import path from "path";
import Mypurchase from "../components/Mypurchase/Mypurchase";
import Report from "../components/Mypurchase/Report";
import Payment from "../components/Payment/Payment";
import Walet from "../components/Walte/Walet";
import Buyer from "../dashboard/buyer-dahboard/Buyer";
import Mysells from "../dashboard/buyer-dahboard/Mysells";
//import MyAds from "../components/HomeComponents/MYAd";
import MyOrder from "../components/MyOrder/MyOrder";
import Plan from "../pages/plan/Plan";


import MyAds from "../components/Myproducts/MyAds";
import PaymentForm from "../components/Payment/PaymentForm";
import PrivacyPolicy from "../components/Policy/PrivacyPolicy";
import ReferralProgram from "../components/Policy/ReferralProgram";
import RatingsReputationPanel from "../dashboard/admin-dashboard/RatingsReputationPanel";
import SellerAccount from "../dashboard/admin-dashboard/SellerAccount";
import AddAccountCredentials from "../dashboard/buyer-dahboard/AddAccountCredentials";
import Review from "../dashboard/buyer-dahboard/Review";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      
      {
        path: "/marketplace",
        element: <Marketplace />,
      },
      {
        path: "/referral",
        element: <ReferralProgram />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
       {
         path:"/plans",
         element: <Plan/>
       },
        {
          path:"/payment-done",
          element:<PaymentForm/>
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
         path: "/orders",
         element:<MyOrder/>,
      },
      {
          path: "/myproducts",
          element: <MyAds/>,
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
        path: "/sell-your-account",
        element: <AddAccountCredentials/>,
      },
        {
          path: "/review",
          element: <Review />,
        },
      {
        path: "buyer-dashboard",
        element: <Buyer />,
      },
      {
        path: '/payment',
        element:<Payment/>,
      }
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
      {
        path: "seller-accounts",
        element: <SellerAccount/>,
      },
      {
        path: "ratings",
        element: <RatingsReputationPanel/>,
      }
    ],
  },
  // admin routes can be added here for admin route
]);

export default Routes;
