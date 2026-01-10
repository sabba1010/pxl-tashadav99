import { ReactNode, FC, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

interface PrivateRouteProps {
  children: ReactNode;
}

const BuyerPrivateRoute: FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const isAuthorized = user && user.role === "buyer";

  useEffect(() => {
    if (!loading && !isAuthorized) {
      toast.error("Please login as a buyer to see this page");
    }
  }, [loading, isAuthorized]);

  if (loading) {
    return <Loading />;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default BuyerPrivateRoute;
