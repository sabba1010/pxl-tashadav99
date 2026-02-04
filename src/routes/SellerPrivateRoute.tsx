import { ReactNode, FC, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

interface PrivateRouteProps {
  children: ReactNode;
}

const SellerPrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isAuthorized =
    user && (user.role === "seller" || user.role === "admin");

  // 🔔 show toast once when user is not authorized
  useEffect(() => {
    if (!loading && !isAuthorized) {
      toast.error("Subscribe And Sell Product");
    }
  }, [loading, isAuthorized]);

  // loading state
  if (loading) {
    return <Loading />;
  }

  // completely logged out - redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // authorized
  if (isAuthorized) {
    return <>{children}</>;
  }

  // logged in but not seller/admin - redirect to seller-pay
  return (
    <Navigate
      to="/seller-pay"
      state={{ from: location }}
      replace
    />
  );
};

export default SellerPrivateRoute;
