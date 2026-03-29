import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import Home from "../pages/home/Home";
// import OnlineStore from "../pages/onile-store/OnlineStore";
import Layout from "../layout/Layout";
import Login from "../users/Login";
import Register from "../users/Register";
import ForgotPassword from "../users/ForgotPassword";
import ResetPassword from "../users/ResetPassword";

import AdminAdmins from "../dashboard/admin-dashboard/AdminAdmins";
import AllUsers from "../dashboard/admin-dashboard/AllUsers";
import DashboardOverview from "../dashboard/admin-dashboard/DashboardOverview";
import DepositRequests from "../dashboard/admin-dashboard/DepositRequests";
import Profile from "../dashboard/admin-dashboard/Profile";
import TotalListings from "../dashboard/admin-dashboard/TotalListings";
import WithdrawalRequests from "../dashboard/admin-dashboard/WithdrawalRequests";
import UserAccountChanges from "../dashboard/admin-dashboard/UserAccountChanges";
import AdminOrders from "../dashboard/admin-dashboard/AdminOrders";

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
import ReferralDashboard from "../components/Referral/ReferralDashboard";
import ReferralProgram from "../components/Policy/ReferralProgram";
import RefundPolicy from "../components/Policy/RefundPolicy";
import TermsOfService from "../components/Policy/TermsOfService";
import RatingsReputationPanel from "../dashboard/admin-dashboard/RatingsReputationPanel";
import WhyChooseUs from "../pages/why/WhyChooseUs";
import AdminSettings from "../dashboard/admin-dashboard/AdminSettings";

import CartPage from "../components/Cart/CartPage";
import MyAds from "../components/Myproducts/MyAds";
import ActiveListings from "../components/Myproducts/ActiveListings";
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
import SellerStore from "../components/Marketplace/SellerStore";

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
        element: (
          <PrivateRoute>
            <ReferralDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/why-choose-us",
        element: (
          <PrivateRoute>
            <WhyChooseUs />
          </PrivateRoute>
        ),
      },
      {
        path: "/cart",
        element: (
          <PrivateRoute>
            <CartPage />
          </PrivateRoute>
        )
      },
      {
        path: "/refund",
        element: (
          <PrivateRoute>
            <RefundPolicy />
          </PrivateRoute>
        ),
      },
      {
        path: "/privacy",
        element: (
          <PrivateRoute>
            <PrivacyPolicy />
          </PrivateRoute>
        ),
      },
      {
        path: "/plans",
        element: (
          <PrivateRoute>
            <Plan />
          </PrivateRoute>
        ),
      },
      {
        path: "/withdraw",
        element: (
          <PrivateRoute>
            <PaymentForm />
          </PrivateRoute>
        ),
      },
      {
        path: "/seller-pay",
        element: (
          <PrivateRoute>
            <SellerPay />
          </PrivateRoute>
        ),
      },
      {
        path: "report-seller",
        element: (
          <PrivateRoute>
            <MyReport />
          </PrivateRoute>
        ),
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
        element: (
          <SellerPrivateRoute>
            <MyOrder />
          </SellerPrivateRoute>
        ),
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
        path: "/active-listings",
        element: (
          <SellerPrivateRoute>
            <ActiveListings />
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
          <PrivateRoute>
            <SellerAdminChat />
          </PrivateRoute>
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
        element: (
          <PrivateRoute>
            <Walet />
          </PrivateRoute>
        ),
      },
      {
        path: "/report",
        element: (
          <PrivateRoute>
            <Report />
          </PrivateRoute>
        ),
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "/mysells",
        element: (
          <PrivateRoute>
            <Mysells />
          </PrivateRoute>
        ),
      },
      {
        path: "add-product",
        element: (
          <PrivateRoute>
            <BuyerAddProduct />
          </PrivateRoute>
        ),
      },
      {
        path: "/sell-your-account",
        element: (
          <PrivateRoute>
            <AddAccountCredentials />
          </PrivateRoute>
        ),
      },
      {
        path: "/review",
        element: (
          <PrivateRoute>
            <Review />
          </PrivateRoute>
        ),
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
        element: (
          <PrivateRoute>
            <Buyer />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
      {
        path: "/post-data",
        element: (
          <PrivateRoute>
            <Post />
          </PrivateRoute>
        ),
      },
      {
        path: "/test",
        element: (
          <PrivateRoute>
            <Test />
          </PrivateRoute>
        ),
      },
      {
        path: "/terms",
        element: (
          <PrivateRoute>
            <TermsOfService />
          </PrivateRoute>
        ),
      },
      {
        path: "/cookie-policy",
        element: (
          <PrivateRoute>
            <CookiePolicy />
          </PrivateRoute>
        ),
      },
      {
        path: "/seller-dashboard",
        element: (
          <PrivateRoute>
            <DashboardSeller />
          </PrivateRoute>
        ),
      },
      {
        path: "/account-settings",
        element: (
          <PrivateRoute>
            <AccountSettings />
          </PrivateRoute>
        ),
      },
      {
        path: "/store/:email",
        element: (
          <PrivateRoute>
            <SellerStore />
          </PrivateRoute>
        ),
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
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "profile",
        element: <Profile />
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
        element: <RefDetails />,
      }, {
        path: "Sent-Notifications",
        element: <SentNotification />,
      },
      {
        path: "account-changes",
        element: <UserAccountChanges />,
      },
      {
        path: "settings",
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
