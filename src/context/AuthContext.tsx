import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";

interface StatusResponse {
  success: boolean;
  status?: string;
  role?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoggedIn: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // added loading state

  useEffect(() => {
    const cookieData = Cookies.get("aAcctEmpire_2XLD");
    if (cookieData) {
      try {
        const parsed = JSON.parse(cookieData);
        setUser(parsed);
      } catch (err) {
        console.error("Invalid cookie data");
        setUser(null);
      }
    }
    setLoading(false); // cookie checked, loading finished
  }, []);

  const logout = () => {
    Cookies.remove("aAcctEmpire_2XLD");
    setUser(null);
  };

  // Periodically check backend for status changes (auto-logout if blocked)
  useEffect(() => {
    if (!user || !user.email) return;

    let cancelled = false;

    const checkStatus = async () => {
      try {
        const res = await axios.get<StatusResponse>(
          `http://localhost:3200/api/user/status?email=${encodeURIComponent(user.email)}`
        );

        if (cancelled) return;

        if (res.data?.success && res.data.status === "blocked" && res.data.role === "seller") {
          toast.error("Your account was blocked by admin");
          logout();
          // Optionally force a reload to update app state
          window.location.reload();
        }
      } catch (err) {
        // ignore network errors silently
      }
    };

    // initial check and then interval
    checkStatus();
    const id = setInterval(checkStatus, 20000); // check every 20s

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isLoggedIn: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
