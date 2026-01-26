import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import Home from "../pages/home/Home";
// import OnlineStore from "../pages/onile-store/OnlineStore";
import Layout from "../layout/Layout";
import Login from "../users/Login";
import Register from "../users/Register";

import AdminAdmins from "../dashboard/admin-dashboard/AdminAdmins";
import AllUsers from "../dashboard/admin-dashboard/AllUsers";
import DashboardOverview from "../dashboard/admin-dashboard/DashboardOverview";
import DepositRequests from "../dashboard/admin-dashboard/DepositRequests";
import Profile from "../dashboard/admin-dashboard/Profile";
import TotalListings from "../dashboard/admin-dashboard/TotalListings";
import WithdrawalRequests from "../dashboard/admin-dashboard/WithdrawalRequests";
import UserAccountChanges from "../dashboard/admin-dashboard/UserAccountChanges";

import BuyerAddProduct from "../dashboard/buyer-dahboard/BuyerAddProduct";

import Marketplace from "../components/Marketplace/Marketplace";
import ContactUs from "../components/ContactUs/ContactUs";

// import path from "path";
import Mypurchase from "../components/Mypurchase/Mypurchase";
import Report from "../components/Mypurchase/Report";
import Reports from "../components/Reports/Reports";
import Payment from "../components/Payment/Payment";
import Walet from "../components/Walte/Walet";
import Buyer from "../dashboard/buyer-dahboard/Buyer";
import Mysells from "../dashboard/buyer-dahboard/Mysells";
//import MyAds from "../components/HomeComponents/MYAd";
import MyOrder from "../components/MyOrder/MyOrder";
import Plan from "../pages/plan/Plan";

import PrivacyPolicy from "../components/Policy/PrivacyPolicy";
import ReferralProgram from "../components/Policy/ReferralProgram";
import RefundPolicy from "../components/Policy/RefundPolicy";
import RatingsReputationPanel from "../dashboard/admin-dashboard/RatingsReputationPanel";
import WhyChooseUs from "../pages/why/WhyChooseUs";
import AdminSettings from "../dashboard/admin-dashboard/AdminSettings";

import CartPage from "../components/Cart/CartPage";
import MyAds from "../components/Myproducts/MyAds";
import SellerGuide from "../components/SellerGuide";
import BuyerGuide from "../components/BuyerGuide";
import Post from "../components/Notification/Post";
import PaymentForm from "../components/Payment/Withdraw";
import SellerPay from "../components/Seller/SellerPay";
import SellerAccount from "../dashboard/admin-dashboard/SellerAccount";
import AddAccountCredentials from "../dashboard/buyer-dahboard/AddAccount";
import Review from "../dashboard/buyer-dahboard/Review";
import NotFound from "../components/NotFound/NotFound";
import CookiePolicy from "../components/Policy/CookiePolicy";
import SellForm from "../dashboard/user-dashboard/SellForm";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import SellerPrivateRoute from "./SellerPrivateRoute";
import BuyerPrivateRoute from "./BuyerPrivateRoute";
import Test from "../components/Test";
import ReportAdmin from "../dashboard/admin-dashboard/ReportAdmin";
import RefDetails from "../dashboard/admin-dashboard/RefDetails";
import MyReport from "../components/Seller/MyReport";
import DashboardSeller from "../dashboard/buyer-dahboard/dashbordseller";
import AccountSettings from "../components/Accountsettings";
import SentNotification from "../dashboard/admin-dashboard/SentNotification";
import SellerAdminChat from "../components/Seller/SellerAdminChat";


const Routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/marketplace",
        element: (
          <PrivateRoute>
            <Marketplace />
          </PrivateRoute>
        ),
      },
      {
        path: "/contact-us",
        element: (
          <PrivateRoute>
            <ContactUs />
          </PrivateRoute>
        ),
      },
      {
        path: "/referral",
        element: <ReferralProgram />,
      },
      {
        path: "/why-choose-us",
        element: <WhyChooseUs />,
      },
      {
       path: "/cart",
       element: <CartPage/>
      },
      {
        path: "/refund",
        element: <RefundPolicy />,
      },
      {
        path: "/privacy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/plans",
        element: <Plan />,
      },
      {
        path: "/withdraw",
        element: <PaymentForm />,
      },
      {
        path: "/seller-pay",
        element: <SellerPay />,
      },
      {
        path: "report-seller",
        element:<MyReport/>,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/purchases",
        element: (
          <PrivateRoute>
            <Mypurchase />
          </PrivateRoute>
        ),
      },
      {
        path: "/reports",
        element: (
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        ),
      },
      {
        path: "/orders",
        element: <MyOrder />,
      },
      {
        path: "/myproducts",
        element: (
          <SellerPrivateRoute>
            <MyAds />
          </SellerPrivateRoute>
        ),
      },
      {
        path: "/seller-guide",
        element: (
          <SellerPrivateRoute>
            <SellerGuide />
          </SellerPrivateRoute>
        ),
      },
       {
        path: "/seller-chat",
        element: (
          <SellerPrivateRoute>
           <SellerAdminChat />
          </SellerPrivateRoute>
        ),
      },

      {
        path: "/buyer-guide",
        element: (
          <BuyerPrivateRoute>
            <BuyerGuide />
          </BuyerPrivateRoute>
        ),
      },
      {
        path: "/wallet",
        element: <Walet />,
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
        element: <AddAccountCredentials />,
      },
      {
        path: "/review",
        element: <Review />,
      },
      {
        path: "/selling-form",
        element: (
          <SellerPrivateRoute>
            <SellForm />
          </SellerPrivateRoute>
        ),
      },
      {
        path: "buyer-dashboard",
        element: <Buyer />,
      },
      {
        path: "/payment",
        element: <Payment />,
      },
      {
        path: "/post-data",
        element: <Post />,
      },
      {
        path: "/test",
        element: <Test />,
      },
      {
        path: "/terms",
        element: <NotFound />,
      },
      {
        path: "/cookie-policy",
        element: <CookiePolicy />,
      },
      {
        path: "/seller-dashboard",
        element: <DashboardSeller/>,
      },
      {
        path: "/account-settings",
        element: <AccountSettings/>,
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ],
  },

  {
    path: "admin-dashboard",
    element: (
      <AdminRoute>
        <AdminAdmins />
      </AdminRoute>
    ),
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
        element: <SellerAccount />,
      },
      {
        path: "ratings",
        element: <RatingsReputationPanel />,
      },
      {
        path: "report",
        element: <ReportAdmin />,
      },
      {
        path: "ref",
        element:<RefDetails/>,
      },  {
        path: "Sent-Notifications",
        element: <SentNotification />,
      },
      {        path: "account-changes",
        element: <UserAccountChanges />,
      },
      {        path: "settings",
        element: <AdminSettings />,
      },
      // {
      //   path: "seller-management",
      //   element: <SellerManagement/>      
      // }
    ],
  },
  // admin routes can be added here for admin route
]);

export default Routes;
