import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

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
    const cookieData = Cookies.get("acctempire_2XLD");
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
    Cookies.remove("acctempire_2XLD");
    setUser(null);
  };

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
