// import React, { createContext, useContext, useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import axios from "axios";
// import { toast } from "sonner";

// interface StatusResponse {
//   success: boolean;
//   status?: string;
//   role?: string;
// }

// interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// interface AuthContextType {
//   user: User | null;
//   setUser: (user: User | null) => void;
//   logout: () => void;
//   isLoggedIn: boolean;
//   loading: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true); // added loading state

//   useEffect(() => {
//     const cookieData = Cookies.get("aAcctEmpire_2XLD");
//     if (cookieData) {
//       try {
//         const parsed = JSON.parse(cookieData);
//         setUser(parsed);
//       } catch (err) {
//         console.error("Invalid cookie data");
//         setUser(null);
//       }
//     }
//     setLoading(false); // cookie checked, loading finished
//   }, []);

//   const logout = () => {
//     Cookies.remove("aAcctEmpire_2XLD");
//     setUser(null);
//   };

//   // Periodically check backend for status changes (auto-logout if blocked)
//   useEffect(() => {
//     if (!user || !user.email) return;

//     let cancelled = false;

//     const checkStatus = async () => {
//       try {
//         const res = await axios.get<StatusResponse>(
//           `http://localhost:3200/api/user/status?email=${encodeURIComponent(user.email)}`
//         );

//         if (cancelled) return;

//         if (res.data?.success && res.data.status === "blocked" && res.data.role === "seller") {
//           toast.error("Your account was blocked by admin");
//           logout();
//           // Router isn't mounted inside this provider in index.tsx, so use full navigation
//           window.location.href = "/login";
//         }
//       } catch (err) {
//         // ignore network errors silently
//       }
//     };

//     // initial check and then interval
//     checkStatus();
//     const id = setInterval(checkStatus, 20000); // check every 20s

//     return () => {
//       cancelled = true;
//       clearInterval(id);
//     };
//   }, [user]);

//   return (
//     <AuthContext.Provider value={{ user, setUser, logout, isLoggedIn: !!user, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };









import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";

const CHAT_API = "http://localhost:3200/chat";

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
    try {
      if (user?.email) {
        axios.post(`${CHAT_API}/status`, { userId: user.email, status: 'offline' }).catch(() => {});
      }
    } catch (e) {}
    
    // Clear all authentication data
    Cookies.remove("aAcctEmpire_2XLD");
    
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
    
    // Clear user state immediately
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
          // Router isn't mounted inside this provider in index.tsx, so use full navigation
          window.location.href = "/login";
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

  // Presence heartbeat: keep backend lastSeen updated while user is active in the tab.
  useEffect(() => {
    if (!user || !user.email) return;

    let heartbeat: any = null;

    const sendOnline = async () => {
      try {
        await axios.post(`${CHAT_API}/status`, { userId: user.email, status: 'online' });
      } catch (e) {
        // ignore
      }
    };

    const startHeartbeat = () => {
      // send immediately and then every 25s while visible
      sendOnline();
      heartbeat = setInterval(sendOnline, 23200);
    };

    const stopHeartbeat = () => {
      if (heartbeat) { clearInterval(heartbeat); heartbeat = null; }
    };

    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        startHeartbeat();
      } else {
        stopHeartbeat();
      }
    };

    // start when mounted
    startHeartbeat();
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', startHeartbeat);
    window.addEventListener('blur', stopHeartbeat);

    return () => {
      stopHeartbeat();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', startHeartbeat);
      window.removeEventListener('blur', stopHeartbeat);
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
