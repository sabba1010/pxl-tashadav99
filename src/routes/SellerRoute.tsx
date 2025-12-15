import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

interface PrivateRouteProps {
  children: ReactNode;
}

const SellerRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (user && user.role === "seller") {
    return <>{children}</>;
  }

  if (!user) {
    toast.error("Please Login To See Details");
  }

  return <Navigate to="/seller-pay" state={{ from: location }} replace />;
};

export default SellerRoute;
