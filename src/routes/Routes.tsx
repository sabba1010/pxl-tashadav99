import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../components/ErrorPage";
import Consolidate from "../dashboard/user-dashboard/Consolidate";
import CreateShipment from "../dashboard/user-dashboard/CreateShipment";
import CubaShipping from "../dashboard/user-dashboard/CubaShipping";
import Locker from "../dashboard/user-dashboard/Locker";
import Packages from "../dashboard/user-dashboard/Packages";
import Payments from "../dashboard/user-dashboard/Payments";
import Pickup from "../dashboard/user-dashboard/Pickup";
import Profile from "../dashboard/user-dashboard/Profile";
import Shipments from "../dashboard/user-dashboard/Shipments";
import Dashboard from "../layout/Dashboard";
import Home from "../pages/home/Home";
// import OnlineStore from "../pages/onile-store/OnlineStore";
import Quienessomos from "../pages/Quienessomos/Quienessomos";
import RastrearPage from "../pages/rastrear-page/RastrearPage";
import RecogidaPage from "../pages/Recogida/Recogida";
import Login from "../users/Login";
import Register from "../users/Register";
import Users from "./../dashboard/admin-dashboard/Users";
import Layout from "../layout/Layout";
import AdminAdmins from "../dashboard/admin-dashboard/AdminAdmins";
import AdminTracking from "../dashboard/admin-dashboard/AdminTracking";
import AdminShipments from "../dashboard/admin-dashboard/AdminShipments";
import AdminReports from "../dashboard/admin-dashboard/AdminReports";
import AdminPickup from "../dashboard/admin-dashboard/AdminPickup";
import AdminPayments from "../dashboard/admin-dashboard/AdminPayments";
import AdminPackages from "../dashboard/admin-dashboard/AdminPackages";
import AdminCuba from "../dashboard/admin-dashboard/AdminCuba";
import AdminConsolidations from "../dashboard/admin-dashboard/AdminConsolidations";
import AdminSettings from "../dashboard/admin-dashboard/AdminSettings";
import AdminRates from "../dashboard/admin-dashboard/AdminRates";
import FAQPage from "../pages/FAQPage/FAQPage";
import DashbordUser from "../dashboard/user-dashboard/DashbordUser";
import Contact from "../pages/Contact/Contact";
import Nuestros from "../pages/Nuestros/Nuestros";
import CasilleroEscritorio from "../pages/casillero escritorio/casilleroescritorio";
import CasilleroVirtual from "../CasilleroVirtual/CasilleroVirtual";

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
        path: "/quiénes-somos",
        element: <Quienessomos />,
      },
      {
         path: "/CasilleroVirtual",
        element: <CasilleroVirtual/>
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
        path: "/faqpage",
        element: <FAQPage />,
      },
      {
        path: "/contacto",
        element: <Contact />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/recogida",
        element: <RecogidaPage />,
      },
      {
        path: "/nuestros",
        element: <Nuestros />,
      },
      {
        path: "/casilleroescritorio",
        element: <CasilleroEscritorio />,
      },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      // {
      //   path: "admin-dashboard",
      //   element: <AdminDashboard/>
      // },
      // {
      //   path: "user-dashboard",
      //   element: <UserDashboard/>
      // },
      {
        path: "locker",
        element: <Locker />,
      },
      {
        path: "packages",
        element: <Packages />,
      },
      {
        path: "user-dashboard",
        element: <DashbordUser />,
      },
      {
        path: "consolidate",
        element: <Consolidate />,
      },
      {
        path: "shipments",
        element: <Shipments />,
      },
      {
        path: "create-shipment",
        element: <CreateShipment />,
      },
      {
        path: "cuba-shipping",
        element: <CubaShipping />,
      },
      {
        path: "pickup",
        element: <Pickup />,
      },
      {
        path: "payments",
        element: <Payments />,
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
      {
        path: "admin-users",
        element: <Users />,
      },
      {
        path: "admin-rates",
        element: <AdminRates />,
      },
      {
        path: "admin-settings",
        element: <AdminSettings />,
      },
      {
        path: "admin-consolidations",
        element: <AdminConsolidations />,
      },
      {
        path: "admin-cuba",
        element: <AdminCuba />,
      },
      {
        path: "admin-packages",
        element: <AdminPackages />,
      },
      {
        path: "admin-payments",
        element: <AdminPayments />,
      },
      {
        path: "admin-pickup",
        element: <AdminPickup />,
      },
      {
        path: "admin-reports",
        element: <AdminReports />,
      },
      {
        path: "admin-shipments",
        element: <AdminShipments />,
      },
      {
        path: "admin-tracking",
        element: <AdminTracking />,
      },
    ],
  },
]);

export default Routes;
