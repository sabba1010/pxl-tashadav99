import { Button } from "@mui/material";
import { useEffect, useRef, useState, useCallback } from "react";
import { FaBreadSlice, FaTrash } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

import { useAuth } from "../context/AuthContext";
import { getAllNotifications, clearNotifications } from "../components/Notification/Notification";
import headerlogo from "../assets/headerlogo.png";
import { useAuthHook } from "../hook/useAuthHook";
import { motion, AnimatePresence } from "framer-motion";
import {
  ListCheck,
  ShoppingBag,
  ShoppingCart,
  WalletMinimal,
  Bell,
  BellOff,
  Trash2,
  RefreshCw,
  Info,
  MessageSquare,
  ChevronRight,
  LayoutDashboard,
  Settings,
  LogOut,
  Plus
} from "lucide-react";
import AnnouncementBar from "./AnnouncementBar";

const FaBreadSliceIcon = FaBreadSlice as unknown as React.ComponentType<any>;
const FaTrashIcon = FaTrash as unknown as React.ComponentType<any>;

// API URL
const API_URL = "http://localhost:3200/api/notification";

type NItem = {
  _id?: string;
  type?: string;
  title: string;
  message?: string;
  description?: string;
  link?: string;
  read?: boolean;
  readBy?: string[]; // ✅ ADD
  deletedBy?: string[]; // ✅ ADD
  createdAt?: string;
  userEmail?: string;
  target?: string;
  senderId?: string;
  productId?: string; // ✅ ADD
  productTitle?: string; // ✅ ADD
  data?: any;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const user = useAuth();
  const loginUser = user.user;
  const navigate = useNavigate();

  const loginUserData = useAuthHook();
  const currentUserEmail =
    loginUserData.data?.email || localStorage.getItem("userEmail");

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NItem[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const EMPIRE_BLUE = "#0A1A3A";
  const ROYAL_GOLD = "#D4A643";
  const CHARCOAL = "#111111";
  const CLEAN_WHITE = "#FFFFFF";

  const handelLougt = () => {
    // Immediately fade entire page to prevent any content visibility
    document.documentElement.style.opacity = '0';
    document.documentElement.style.transition = 'opacity 0.1s ease-out';
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.1s ease-out';
    document.body.style.overflow = 'hidden';

    // Clear all DOM content
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = '';
      root.style.opacity = '0';
      root.style.backgroundColor = '#fff';
    }

    // Call logout to clear all auth data
    user.logout();

    // Don't show toast since page is clearing
    // Redirect immediately with hard reload to ensure clean session
    setTimeout(() => {
      window.location.href = "/login?session=cleared";
      window.location.reload();
    }, 150);
  };

  const handleSellProduct = () => {
    if (!loginUser) {
      navigate("/login");
    } else {
      navigate("/myproducts");
    }
  };

  // --- FETCH NOTIFICATIONS (Updated Filter Logic) ---
  const fetchNotifications = useCallback(async () => {
    if (!currentUserEmail) return;

    try {
      if (!notifications.length && !notifOpen) setLoadingNotifs(true);

      const userRole = loginUserData.data?.role;
      // রেজাল্ট ব্যাকএন্ড থেকেই ফিল্টার হয়ে আসবে
      const res = await getAllNotifications(currentUserEmail, userRole);

      setNotifications(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoadingNotifs(false);
    }
  }, [currentUserEmail, loginUserData.data?.role, notifications.length, notifOpen]);

  // --- CLICK HANDLER (MARK READ) ---
  const handleShowNotifications = async () => {
    const isOpening = !notifOpen;
    setNotifOpen(isOpening);

    if (isOpening && unreadCount > 0) {
      const userRole = loginUserData.data?.role;

      // ১. ফ্রন্টএন্ডে সাথে সাথে আপডেট
      setNotifications(prev => prev.map(n => {
        if (n.userEmail === currentUserEmail) return { ...n, read: true };
        return { ...n, readBy: [...(n.readBy || []), currentUserEmail as string] };
      }));

      // ২. ব্যাকএন্ডে সিঙ্ক
      if (currentUserEmail) {
        try {
          await axios.post(`${API_URL}/mark-read`, {
            email: currentUserEmail,
            role: userRole
          });
        } catch (error) {
          console.error("Failed to sync read status with server", error);
        }
      }
    }
  };

  // --- CLEAR ALL NOTIFICATIONS ---
  const clearAllNotifications = async () => {
    if (!currentUserEmail) return;
    if (!window.confirm("Are you sure?")) return;
    try {
      const userRole = loginUserData.data?.role;
      await clearNotifications(currentUserEmail, userRole || "");
      setNotifications([]);
      toast.success("All notifications cleared!");
    } catch (error) {
      console.error("Failed to clear notifications", error);
      toast.error("Failed to clear notifications");
    }
  };

  useEffect(() => {
    if (!currentUserEmail) return;
    fetchNotifications();
    const id = setInterval(fetchNotifications, 8000);
    return () => clearInterval(id);
  }, [currentUserEmail, fetchNotifications]);

  const unreadCount = notifications.filter((n) => {
    if (n.userEmail === currentUserEmail) return !n.read;
    return !n.readBy?.includes(currentUserEmail || "");
  }).length;

  return (
    <>
      <AnnouncementBar />
      <header
        className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-2 transition-all duration-300"
      >
        <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen((s) => !s)}
                className="hidden p-2 rounded-md hover:bg-gray-100 transition lg:hidden"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke={EMPIRE_BLUE} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke={EMPIRE_BLUE} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              <NavLink
                to="/"
                className="flex items-center gap-3 pr-4 ml-0 md:ml-[40px] lg:ml-[90px]"
              >
                <img
                  src={headerlogo}
                  alt="AcctEmpire"
                  className="h-16 sm:h-18 md:h-20 lg:h-24 w-auto object-contain transition-transform hover:scale-105 duration-300"
                />
              </NavLink>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {[
                { to: "/marketplace", label: "Marketplace" },
                { to: "/purchases", label: "Mypurchase" },
                ...(loginUserData.data?.role === "seller" || loginUserData.data?.role === "admin" ? [{ to: "/orders", label: "Orders" }] : []),
                ...(loginUser ? [{ to: "/wallet", label: "Wallet" }] : []),
                ...(loginUser?.role === "seller" || loginUser?.role === "admin" ? [{ to: "/myproducts", label: "My Ads" }, { to: "/seller-guide", label: "Seller Guide" }] : []),
                ...(loginUser?.role === "buyer" || loginUser?.role === "admin" ? [{ to: "/buyer-guide", label: "Buyer Guide" }] : [])
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `font-medium text-sm tracking-wide transition-colors duration-200 hover:text-[#D4A643] ${isActive ? "text-[#D4A643]" : "text-[#111111]"}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <button onClick={handleSellProduct} className="px-6 py-2.5 rounded-full font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-[#D4A643] to-[#b88c30]">
                Sell Product
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowNotifications}
                  className={`p-2.5 rounded-full transition-all duration-200 relative ${notifOpen ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 text-gray-700"}`}
                >
                  <Bell className={`w-6 h-6 ${notifOpen ? "fill-current" : ""}`} />

                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-sm"
                      >
                        {unreadCount}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 rounded-full bg-red-400 animate-ping opacity-75"></span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="fixed top-16 left-4 right-4 md:absolute md:top-full md:left-auto md:right-[-80px] md:mt-4 md:w-[420px] bg-white/95 backdrop-blur-xl border border-gray-100/50 rounded-2xl shadow-2xl z-50 overflow-hidden ring-1 ring-black/5"
                    >
                      {/* Header */}
                      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white/50">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                          <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs font-bold">
                            {unreadCount} New
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => fetchNotifications()}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
                            title="Refresh"
                          >
                            <RefreshCw size={16} className={loadingNotifs ? "animate-spin" : ""} />
                          </button>
                          {notifications.length > 0 && (
                            <button
                              onClick={clearAllNotifications}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                              title="Clear All"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* List */}
                      <div className="max-h-[65vh] md:max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        <AnimatePresence mode="popLayout">
                          {notifications.length === 0 && !loadingNotifs ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex flex-col items-center justify-center py-16 text-center"
                            >
                              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <BellOff className="w-8 h-8 text-gray-300" />
                              </div>
                              <p className="text-gray-500 font-medium">No notifications yet</p>
                              <p className="text-xs text-gray-400 mt-1">We'll notify you when something arrives</p>
                            </motion.div>
                          ) : (
                            notifications.map((n) => {
                              const isRead = n.userEmail === currentUserEmail ? n.read : n.readBy?.includes(currentUserEmail || "");
                              const timeAgo = n.createdAt ? new Date(n.createdAt).toLocaleString() : ""; // Simplified for now

                              return (
                                <motion.div
                                  layout
                                  key={n._id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  className={`group relative p-4 transition-all duration-200 hover:bg-gray-50 border-b border-gray-50 last:border-0 ${!isRead ? "bg-blue-50/30" : ""}`}
                                >
                                  {!isRead && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full" />
                                  )}

                                  <div className="flex gap-4">
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${!isRead ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                                      {n.type === 'report' ? <Info size={18} /> :
                                        n.productTitle ? <ShoppingBag size={18} /> :
                                          <MessageSquare size={18} />}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm ${!isRead ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
                                          {n.senderId?.split("@")[0] || n.title}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{timeAgo}</span>
                                      </div>

                                      {n.productTitle && (
                                        <p className="text-xs font-medium text-blue-600 mb-1 flex items-center gap-1">
                                          <ShoppingBag size={10} /> {n.productTitle}
                                        </p>
                                      )}

                                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                        {n.message || n.description || "No content"}
                                      </p>

                                      {n.link && (
                                        <a
                                          href={n.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded-md transition-colors"
                                        >
                                          View Details <ChevronRight size={10} />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Footer */}
                      <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                        <button
                          onClick={() => {
                            fetchNotifications();
                            toast.success("Notifications updated");
                          }}
                          className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          View all activity
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


              {/* Avatar Dropdown */}
              <div className="relative" ref={dropdownRef}>
                {user.user ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOpen((o) => !o)}
                    className="flex items-center gap-2 p-1 pl-2 pr-1 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-200"
                  >
                    <div className="text-right hidden md:block">
                      <div className="text-xs font-bold text-gray-900 leading-tight">{loginUser?.name}</div>
                      <div className="text-[10px] text-gray-500">{loginUser?.role}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white" style={{ background: `linear-gradient(135deg, ${EMPIRE_BLUE} 0%, ${ROYAL_GOLD} 100%)` }}>
                      {loginUser?.name ? loginUser.name[0].toUpperCase() : "A"}
                    </div>
                  </motion.button>
                ) : (
                  <div className="flex gap-3 md:ml-6">
                    <Link to="/login"><Button variant="text" sx={{ color: "#333", fontWeight: 600, textTransform: "none" }}>Log in</Button></Link>
                    <Link to="/register"><Button variant="contained" sx={{ backgroundColor: "#111", color: "white", borderRadius: "99px", px: 3, textTransform: "none", fontWeight: 600, "&:hover": { backgroundColor: "#333" } }}>Sign up</Button></Link>
                  </div>
                )}

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="fixed right-4 top-20 md:absolute md:right-0 md:top-full md:left-auto md:mt-4 md:w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 ring-1 ring-black/5"
                    >
                      <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <div className="relative z-10">
                          <div className="text-lg font-bold">{loginUser?.name}</div>
                          <div className="text-sm text-gray-300 mb-4">{loginUser?.email}</div>

                          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                            <div className="text-xs text-gray-300 uppercase tracking-wider mb-1">Wallet Balance</div>
                            <div className="text-2xl font-bold text-[#D4A643]">${loginUserData.data?.balance?.toFixed(2) || "0.00"}</div>
                            <NavLink to="/wallet" onClick={() => setOpen(false)} className="text-[10px] text-white/80 hover:text-white underline mt-1 inline-block">Manage Wallet &rarr;</NavLink>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        {[
                          ...(loginUser?.role === "admin" ? [{ to: "/admin-dashboard", label: "Admin Dashboard", icon: <LayoutDashboard size={16} /> }] : []),
                          ...(loginUser?.role === "seller" ? [{ to: "/seller-dashboard", label: "Seller Dashboard", icon: <LayoutDashboard size={16} /> }] : []),
                          { to: "/purchases", label: "My Purchases", icon: <ShoppingBag size={16} /> },
                          { to: "/account-settings", label: "Settings", icon: <Settings size={16} /> },
                        ].map((item) => (
                          <NavLink
                            key={item.label}
                            to={item.to}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
                          >
                            {item.icon} {item.label}
                          </NavLink>
                        ))}

                        <div className="h-px bg-gray-100 my-2 mx-6"></div>

                        <button onClick={handelLougt} className="w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors text-left">
                          <LogOut size={16} /> Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Nav - Kept Simple for Performance */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200 lg:hidden pb-safe">
        <div className="flex items-end justify-between h-16 px-6">
          <NavLink to="/marketplace" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full gap-1 ${isActive ? "text-[#D4A643]" : "text-gray-400"}`}>
            <ShoppingBag size={20} />
          </NavLink>
          <NavLink to="/purchases" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full gap-1 ${isActive ? "text-[#D4A643]" : "text-gray-400"}`}>
            <ShoppingCart size={20} />
          </NavLink>
          <div className="relative -top-5">
            <button onClick={handleSellProduct} className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-[#D4A643] text-white shadow-lg shadow-orange-200">
              <Plus size={24} />
            </button>
          </div>
          <NavLink to="/orders" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full gap-1 ${isActive ? "text-[#D4A643]" : "text-gray-400"}`}>
            <ListCheck size={20} />
          </NavLink>
          <NavLink to="/wallet" className={({ isActive }) => `flex flex-col items-center justify-center flex-1 h-full gap-1 ${isActive ? "text-[#D4A643]" : "text-gray-400"}`}>
            <WalletMinimal size={20} />
          </NavLink>
        </div>
      </nav>
    </>
  );
}

// import { Button } from "@mui/material";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { FaBreadSlice, FaTrash } from "react-icons/fa";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import axios from "axios";

// import { useAuth } from "../context/AuthContext";
// import { getAllNotifications } from "../components/Notification/Notification";
// import headerlogo from "../assets/headerlogo.png";
// import { useAuthHook } from "../hook/useAuthHook";
// import {
//   ListCheck,
//   ShoppingBag,
//   ShoppingCart,
//   WalletMinimal,
// } from "lucide-react";

// const FaBreadSliceIcon = FaBreadSlice as unknown as React.ComponentType<any>;
// const FaTrashIcon = FaTrash as unknown as React.ComponentType<any>;

// // API URL
// const API_URL = "http://localhost:3200/api/notification";

// type NItem = {
//   _id?: string;
//   type?: string;
//   title: string;
//   message?: string;
//   description?: string;
//   read?: boolean;
//   createdAt?: string;
//   userEmail?: string;
//   data?: any;
// };

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const notifRef = useRef<HTMLDivElement | null>(null);
//   const user = useAuth();
//   const loginUser = user.user;
//   const navigate = useNavigate();

//   const loginUserData = useAuthHook();
//   // console.log(loginUserData.data);
//   const currentUserEmail =
//     loginUserData.data?.email || localStorage.getItem("userEmail");

//   const [notifOpen, setNotifOpen] = useState(false);
//   const [notifications, setNotifications] = useState<NItem[]>([]);
//   const [loadingNotifs, setLoadingNotifs] = useState(false);

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//       if (
//         notifRef.current &&
//         !notifRef.current.contains(event.target as Node)
//       ) {
//         setNotifOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const EMPIRE_BLUE = "#0A1A3A";
//   const ROYAL_GOLD = "#D4A643";
//   const CHARCOAL = "#111111";
//   const CLEAN_WHITE = "#FFFFFF";

//   const handelLougt = () => {
//     user.logout();
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   // --- FETCH NOTIFICATIONS ---
//   const fetchNotifications = useCallback(async () => {
//     if (!currentUserEmail) return;

//     try {
//       if (!notifications.length && !notifOpen) setLoadingNotifs(true);

//       const res = await getAllNotifications();

//       const myNotifs = Array.isArray(res)
//         ? res.filter((n: NItem) => n.userEmail === currentUserEmail)
//         : [];

//       const sortedNotifs = myNotifs.sort(
//         (a, b) =>
//           new Date(b.createdAt || 0).getTime() -
//           new Date(a.createdAt || 0).getTime()
//       );

//       setNotifications(sortedNotifs);
//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//     } finally {
//       setLoadingNotifs(false);
//     }
//   }, [currentUserEmail, notifications.length, notifOpen]);

//   // --- CLICK HANDLER (MARK READ) ---
//   const handleShowNotifications = async () => {
//     setNotifOpen((prev) => !prev);

//     if (!notifOpen && notifications.length > 0) {
//       // Frontend Update
//       const readNotifications = notifications.map((n) => ({
//         ...n,
//         read: true,
//       }));
//       setNotifications(readNotifications);

//       // Backend Update
//       if (currentUserEmail) {
//         try {
//           await axios.post(`${API_URL}/mark-read`, { email: currentUserEmail });
//         } catch (error) {
//           console.error(
//             "Failed to mark notifications as read on server",
//             error
//           );
//         }
//       }
//     }
//   };

//   // --- CLEAR ALL NOTIFICATIONS FUNCTION ---
//   const clearAllNotifications = async () => {
//     if (!currentUserEmail) return;

//     if (!window.confirm("Are you sure you want to clear all notifications?"))
//       return;

//     try {
//       await axios.delete(`${API_URL}/clear-all/${currentUserEmail}`);
//       setNotifications([]);
//       toast.success("All notifications cleared!");
//     } catch (error) {
//       console.error("Failed to clear notifications", error);
//       toast.error("Failed to clear notifications");
//     }
//   };

//   // Poll notifications
//   useEffect(() => {
//     if (!currentUserEmail) return;
//     fetchNotifications();
//     const id = setInterval(fetchNotifications, 8000);
//     return () => clearInterval(id);
//   }, [currentUserEmail, fetchNotifications]);

//   // Count only unread notifications
//   const unreadCount = notifications.filter((n) => !n.read).length;

//   return (
//     <>
//       <header
//         className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm"
//         style={{ backgroundColor: CLEAN_WHITE }}
//       >
//         <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-14 md:h-16">
//             {/* Logo Section */}
//             <div className="flex items-center">
//               <button
//                 onClick={() => setMobileMenuOpen((s) => !s)}
//                 className="hidden p-2 rounded-md hover:bg-gray-100 transition"
//               >
//                 {mobileMenuOpen ? (
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke={EMPIRE_BLUE}
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke={EMPIRE_BLUE}
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 6h16M4 12h16M4 18h16"
//                     />
//                   </svg>
//                 )}
//               </button>

//               <NavLink to="/" className="flex items-center gap-3 pr-4">
//                 <img
//                   src={headerlogo}
//                   alt="AcctEmpire"
//                   className="h-14 md:h-16 lg:h-18 w-auto"
//                 />
//               </NavLink>
//             </div>

//             {/* Desktop Menu */}
//             <div className="hidden lg:flex items-center gap-8">
//               <NavLink
//                 to="/marketplace"
//                 className="font-medium"
//                 style={({ isActive }) => ({
//                   color: isActive ? ROYAL_GOLD : CHARCOAL,
//                 })}
//               >
//                 Marketplace
//               </NavLink>
//               <NavLink
//                 to="/purchases"
//                 className="font-medium"
//                 style={({ isActive }) => ({
//                   color: isActive ? ROYAL_GOLD : CHARCOAL,
//                 })}
//               >
//                 Mypurchase
//               </NavLink>
//               {loginUserData.data?.role === "seller" ||
//               loginUserData.data?.role === "admin" ? (
//                 <NavLink
//                   to="/orders"
//                   className="font-medium"
//                   style={({ isActive }) => ({
//                     color: isActive ? ROYAL_GOLD : CHARCOAL,
//                   })}
//                 >
//                   Orders
//                 </NavLink>
//               ) : (
//                 ""
//               )}
//               {loginUser ? (
//                 <NavLink
//                   to="/wallet"
//                   className="font-medium"
//                   style={({ isActive }) => ({
//                     color: isActive ? ROYAL_GOLD : CHARCOAL,
//                   })}
//                 >
//                   Wallet
//                 </NavLink>
//               ) : (
//                 ""
//               )}
//               {loginUser?.role === "seller" || loginUser?.role === "admin" ? (
//                 <NavLink
//                   to="/myproducts"
//                   className="font-medium"
//                   style={({ isActive }) => ({
//                     color: isActive ? ROYAL_GOLD : CHARCOAL,
//                   })}
//                 >
//                   My Ads
//                 </NavLink>
//               ) : (
//                 ""
//               )}
//               {loginUser?.role === "seller" || loginUser?.role === "admin" ? (
//                 <NavLink
//                   to="/seller-guide"
//                   className="font-medium"
//                   style={({ isActive }) => ({
//                     color: isActive ? ROYAL_GOLD : CHARCOAL,
//                   })}
//                 >
//                   Seller Guide
//                 </NavLink>
//               ) : (
//                 ""
//               )}
//                {loginUser?.role === "buyer" || loginUser?.role === "admin" ? (
//                 <NavLink
//                   to="/buyer-guide"
//                   className="font-medium"
//                   style={({ isActive }) => ({
//                     color: isActive ? ROYAL_GOLD : CHARCOAL,
//                   })}
//                 >
//                   Buyer Guide
//                 </NavLink>
//               ) : (
//                 ""
//               )}
//               <NavLink
//                 to="/selling-form"
//                 className="px-6 py-2.5 rounded-lg font-medium text-white shadow-sm"
//                 style={{ backgroundColor: ROYAL_GOLD }}
//               >
//                 Sell Product
//               </NavLink>
//             </div>

//             {/* Right Icons */}
//             <div className="flex items-center gap-1">
//               {/* Notifications Icon */}
//               <div className="relative" ref={notifRef}>
//                 <button
//                   onClick={handleShowNotifications}
//                   className="p-2 rounded-md hover:bg-gray-100 transition relative"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke={EMPIRE_BLUE}
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                     />
//                   </svg>

//                   {/* Red Badge (Solid Color) */}
//                   {unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full shadow-sm border border-white">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </button>

//                 {/* Dropdown - Mobile Responsive Update */}
//                 {notifOpen && (
//                   <div
//                     className="fixed top-14 left-4 right-4 md:absolute md:top-full md:left-auto md:right-0 md:mt-2 md:w-96 bg-white border rounded-xl shadow-2xl z-50 overflow-hidden"
//                     style={{ backgroundColor: CLEAN_WHITE }}
//                   >
//                     <div className="px-4 py-3 border-b flex items-center justify-between">
//                       <div className="font-bold text-gray-900">
//                         Notifications
//                       </div>
//                       <div className="text-xs font-semibold text-gray-600">
//                         {loadingNotifs
//                           ? "Loading..."
//                           : `${notifications.length} total`}
//                       </div>
//                     </div>

//                     <div className="max-h-[60vh] md:max-h-80 overflow-y-auto divide-y">
//                       {notifications.length === 0 && !loadingNotifs && (
//                         <div className="p-4 text-center text-sm text-gray-500">
//                           No notifications found for <br />{" "}
//                           <span className="font-semibold">
//                             {currentUserEmail}
//                           </span>
//                         </div>
//                       )}

//                       {notifications.map((n) => (
//                         <div
//                           key={n._id || `${n.title}-${n.createdAt}`}
//                           className={`p-3 hover:bg-gray-50 transition-colors ${
//                             n.read
//                               ? "bg-white"
//                               : "bg-blue-50 border-l-4 border-blue-600"
//                           }`}
//                         >
//                           <div className="flex items-start justify-between gap-3">
//                             <div className="flex-1">
//                               {/* TITLE */}
//                               <div className="text-sm font-bold text-black">
//                                 {n.title}
//                               </div>
//                               {/* MESSAGE */}
//                               <div className="text-xs text-gray-800 font-medium mt-1 line-clamp-2 leading-relaxed">
//                                 {n.message || n.description || "No description"}
//                               </div>
//                               {/* DATE */}
//                               <div className="text-[10px] text-gray-600 font-semibold mt-1 flex justify-between">
//                                 <span>
//                                   {n.createdAt
//                                     ? new Date(n.createdAt).toLocaleString()
//                                     : ""}
//                                 </span>
//                               </div>
//                             </div>
//                             {!n.read && (
//                               <div className="ml-2 w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shadow-sm" />
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Footer Actions */}
//                     <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
//                       <button
//                         onClick={clearAllNotifications}
//                         className="text-xs text-red-600 hover:text-red-800 hover:underline font-bold flex items-center gap-1"
//                         disabled={notifications.length === 0}
//                       >
//                         <FaTrashIcon /> Clear All
//                       </button>

//                       <button
//                         onClick={() => fetchNotifications()}
//                         className="text-xs text-blue-700 hover:underline font-bold"
//                       >
//                         Refresh List
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Avatar Dropdown */}
//               <div className="relative" ref={dropdownRef}>
//                 {user.user ? (
//                   <button
//                     onClick={() => setOpen((o) => !o)}
//                     className="flex items-center p-1 rounded-full hover:bg-gray-100 transition"
//                   >
//                     <div
//                       className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
//                       style={{
//                         background: `linear-gradient(90deg, ${EMPIRE_BLUE} 0%, ${ROYAL_GOLD} 100%)`,
//                       }}
//                     >
//                       {loginUser?.name ? loginUser.name[0].toUpperCase() : "A"}
//                     </div>
//                   </button>
//                 ) : (
//                   <div className="hidden md:flex gap-2">
//                     <Link to="/login">
//                       <Button
//                         variant="contained"
//                         sx={{
//                           px: 4,
//                           borderRadius: "10px",
//                           textTransform: "none",
//                           fontWeight: 600,
//                           backgroundColor: ROYAL_GOLD,
//                         }}
//                       >
//                         Login
//                       </Button>
//                     </Link>
//                     <Link to="/register">
//                       <Button
//                         variant="outlined"
//                         sx={{
//                           px: 4,
//                           borderRadius: "10px",
//                           textTransform: "none",
//                           fontWeight: 600,
//                           borderWidth: "2px",
//                         }}
//                       >
//                         Register
//                       </Button>
//                     </Link>
//                   </div>
//                 )}

//                 {open && (
//                   <div
//                     className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
//                     style={{ backgroundColor: CLEAN_WHITE }}
//                   >
//                     <div
//                       className="px-6 py-5 border-b"
//                       style={{ backgroundColor: "#F9FAFB" }}
//                     >
//                       <div
//                         className="font-bold text-lg"
//                         style={{ color: EMPIRE_BLUE }}
//                       >
//                         {loginUser?.name}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {loginUser?.email}
//                       </div>
//                     </div>
//                     <div className="px-6 py-4 border-b">
//                       <div
//                         className="rounded-xl p-5 text-white relative overflow-hidden"
//                         style={{
//                           background: `linear-gradient(135deg, ${EMPIRE_BLUE} 0%, #1a3a6e 100%)`,
//                         }}
//                       >
//                         <div className="absolute inset-0 opacity-20">
//                           <div
//                             className="absolute inset-0"
//                             style={{
//                               backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`,
//                             }}
//                           />
//                         </div>
//                         <div className="relative z-10">
//                           <div className="text-sm opacity-90">Your Balance</div>
//                           <div className="text-3xl font-bold mt-2">
//                             ${loginUserData.data?.balance?.toFixed(2) || "0.00"}
//                           </div>
//                         </div>
//                         <NavLink
//                           to="/wallet"
//                           onClick={() => setOpen(false)}
//                           className="absolute bottom-4 right-4 text-sm underline opacity-90"
//                         >
//                           View Wallet →
//                         </NavLink>
//                       </div>
//                     </div>
//                     <div className="py-2">
//                       {loginUser?.role === "admin" && (
//                         <NavLink
//                           to="/admin-dashboard"
//                           onClick={() => setOpen(false)}
//                           className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
//                           style={{ color: CHARCOAL }}
//                         >
//                           <span className="text-sm font-medium">
//                             My Account Dashboard
//                           </span>
//                         </NavLink>
//                       )}
//                       {loginUser?.role === "seller" && (
//                         <NavLink
//                           to="/seller-dashboard"
//                           onClick={() => setOpen(false)}
//                           className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
//                           style={{ color: CHARCOAL }}
//                         >
//                           <span className="text-sm font-medium">
//                             My Dashboard
//                           </span>
//                         </NavLink>
//                       )}
//                       <NavLink
//                         to="/referral"
//                         onClick={() => setOpen(false)}
//                         className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
//                         style={{ color: CHARCOAL }}
//                       >
//                         <span className="text-sm font-medium">Referral</span>
//                       </NavLink>
//                       <NavLink
//                         to="/plans"
//                         onClick={() => setOpen(false)}
//                         className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
//                         style={{ color: CHARCOAL }}
//                       >
//                         <span className="text-sm font-medium">Plans</span>
//                       </NavLink>
//                       <NavLink
//                         to="/purchases"
//                         onClick={() => setOpen(false)}
//                         className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
//                         style={{ color: CHARCOAL }}
//                       >
//                         <span className="text-sm font-medium">
//                           My Purchases
//                         </span>
//                       </NavLink>
//                       {/* Report route added in dropdown for Seller/Admin */}
//                       {(loginUser?.role === "seller" || loginUser?.role === "admin") && (
//                         <NavLink
//                           to="/report-seller"
//                           onClick={() => setOpen(false)}
//                           className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
//                           style={{ color: CHARCOAL }}
//                         >
//                           <span className="text-sm font-medium">Report</span>
//                         </NavLink>
//                       )}
//                       {loginUser?.role === "seller" || loginUser?.role === "admin" ? (
//                         <NavLink
//                           to="/seller-guide"
//                           onClick={() => setOpen(false)}
//                           className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition lg:hidden"
//                           style={({ isActive }) => ({
//                             color: isActive ? ROYAL_GOLD : CHARCOAL,
//                           })}
//                         >
//                           <span className="text-sm font-medium">Seller Guide</span>
//                         </NavLink>
//                       ) : null}
//                       {loginUser?.role === "buyer" || loginUser?.role === "admin" ? (
//                         <NavLink
//                           to="/buyer-guide"
//                           onClick={() => setOpen(false)}
//                           className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition lg:hidden"
//                           style={({ isActive }) => ({
//                             color: isActive ? ROYAL_GOLD : CHARCOAL,
//                           })}
//                         >
//                           <span className="text-sm font-medium">Buyer Guide</span>
//                         </NavLink>
//                       ) : null}
//                       <NavLink
//                         to="/account-settings"
//                         onClick={() => setOpen(false)}
//                         className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
//                         style={{ color: CHARCOAL }}
//                       >
//                         <span className="text-sm font-medium">
//                           Account Settings
//                         </span>
//                       </NavLink>
//                       <button
//                         onClick={handelLougt}
//                         className="w-full flex items-center gap-4 px-6 py-3 hover:bg-yellow-50 transition text-left"
//                         style={{ color: "#B45309" }}
//                       >
//                         <span className="text-sm font-medium">Log out</span>
//                       </button>
//                     </div>
//                     <div className="px-6 py-4">
//                       <NavLink
//                         to="/selling-form"
//                         onClick={() => setOpen(false)}
//                         className="block w-full text-center py-3 rounded-lg font-semibold text-white"
//                         style={{ backgroundColor: ROYAL_GOLD }}
//                       >
//                         Sell Product
//                       </NavLink>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </nav>
//       </header>

//    {/* Mobile Bottom Nav */}
// <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
//   <div className="relative max-w-screen-xl mx-auto">
//     <div className="flex items-end justify-between h-20 px-4">

//       {/* Marketplace – all */}
//       <NavLink
//         to="/marketplace"
//         className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
//         style={({ isActive }) => ({
//           color: isActive ? ROYAL_GOLD : CHARCOAL,
//         })}
//       >
//         <ShoppingBag />
//         <span className="text-xs">Marketplace</span>
//       </NavLink>

//       {/* Purchases – all */}
//       <NavLink
//         to="/purchases"
//         className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
//         style={({ isActive }) => ({
//           color: isActive ? ROYAL_GOLD : CHARCOAL,
//         })}
//       >
//         <ShoppingCart />
//         <span className="text-xs">Purchases</span>
//       </NavLink>

//       {/* Sell Product – all */}
//       <NavLink
//         to="/selling-form"
//         className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
//         style={({ isActive }) => ({
//           color: isActive ? ROYAL_GOLD : CHARCOAL,
//         })}
//       >
//         <FaBreadSliceIcon className="w-5 h-5 mb-1" />
//         <span className="text-xs">Sell</span>
//       </NavLink>

//       {/* Orders – seller / admin */}
//       {(loginUser?.role === "seller" || loginUser?.role === "admin") && (
//         <NavLink
//           to="/orders"
//           className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
//           style={({ isActive }) => ({
//             color: isActive ? ROYAL_GOLD : CHARCOAL,
//           })}
//         >
//           <ListCheck />
//           <span className="text-xs">Orders</span>
//         </NavLink>
//       )}

//       {/* Wallet – logged in */}
//       {loginUser && (
//         <NavLink
//           to="/wallet"
//           className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
//           style={({ isActive }) => ({
//             color: isActive ? ROYAL_GOLD : CHARCOAL,
//           })}
//         >
//           <WalletMinimal />
//           <span className="text-xs">Wallet</span>
//         </NavLink>
//       )}

//     </div>
//   </div>
// </nav>


//     </>
//   );
// }

// import { Button } from "@mui/material";
// import { useEffect, useRef, useState } from "react";
// import { FaBreadSlice, FaTrash } from "react-icons/fa";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import axios from "axios";

// import { useAuth } from "../context/AuthContext";
// import { getAllNotifications } from "../components/Notification/Notification";
// import headerlogo from "../assets/headerlogo.png";
// import { useAuthHook } from "../hook/useAuthHook";
// import {
//   ListCheck,
//   ShoppingBag,
//   ShoppingCart,
//   WalletMinimal,
// } from "lucide-react";

// const FaBreadSliceIcon = FaBreadSlice as unknown as React.ComponentType<any>;
// const FaTrashIcon = FaTrash as unknown as React.ComponentType<any>;

// // API URL
// const API_URL = "http://localhost:3200/api/notification";

// type NItem = {
//   _id?: string;
//   type?: string;
//   title: string;
//   message?: string;
//   description?: string;
//   read?: boolean;
//   createdAt?: string;
//   userEmail?: string;
//   data?: any;
// };

// export default function Navbar() {
//   const [open, setOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const notifRef = useRef<HTMLDivElement | null>(null);
//   const user = useAuth();
//   const loginUser = user.user;
//   const navigate = useNavigate();

//   const loginUserData = useAuthHook();
//   // console.log(loginUserData.data);
//   const currentUserEmail =
//     loginUserData.data?.email || localStorage.getItem("userEmail");

//   const [notifOpen, setNotifOpen] = useState(false);
//   const [notifications, setNotifications] = useState<NItem[]>([]);
//   const [loadingNotifs, setLoadingNotifs] = useState(false);

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//       if (
//         notifRef.current &&
//         !notifRef.current.contains(event.target as Node)
//       ) {
//         setNotifOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const EMPIRE_BLUE = "#0A1A3A";
//   const ROYAL_GOLD = "#D4A643";
//   const CHARCOAL = "#111111";
//   const CLEAN_WHITE = "#FFFFFF";

//   const handelLougt = () => {
//     user.logout();
//     toast.success("Logged out successfully");
//     navigate("/");
//   };

//   // --- FETCH NOTIFICATIONS ---
//   const fetchNotifications = async () => {
//     if (!currentUserEmail) return;

//     try {
//       if (!notifications.length && !notifOpen) setLoadingNotifs(true);

//       const res = await getAllNotifications();

//       const myNotifs = Array.isArray(res)
//         ? res.filter((n: NItem) => n.userEmail === currentUserEmail)
//         : [];

//       const sortedNotifs = myNotifs.sort(
//         (a, b) =>
//           new Date(b.createdAt || 0).getTime() -
//           new Date(a.createdAt || 0).getTime()
//       );

//       setNotifications(sortedNotifs);
//     } catch (err) {
//       console.error("Failed to fetch notifications:", err);
//     } finally {
//       setLoadingNotifs(false);
//     }
//   };

//   // --- CLICK HANDLER (MARK READ) ---
//   const handleShowNotifications = async () => {
//     setNotifOpen((prev) => !prev);

//     if (!notifOpen && notifications.length > 0) {
//       // Frontend Update
//       const readNotifications = notifications.map((n) => ({
//         ...n,
//         read: true,
//       }));
//       setNotifications(readNotifications);

//       // Backend Update
//       if (currentUserEmail) {
//         try {
//           await axios.post(`${API_URL}/mark-read`, { email: currentUserEmail });
//         } catch (error) {
//           console.error(
//             "Failed to mark notifications as read on server",
//             error
//           );
//         }
//       }
//     }
//   };

//   // --- CLEAR ALL NOTIFICATIONS FUNCTION ---
//   const clearAllNotifications = async () => {
//     if (!currentUserEmail) return;

//     if (!window.confirm("Are you sure you want to clear all notifications?"))
//       return;

//     try {
//       await axios.delete(`${API_URL}/clear-all/${currentUserEmail}`);
//       setNotifications([]);
//       toast.success("All notifications cleared!");
//     } catch (error) {
//       console.error("Failed to clear notifications", error);
//       toast.error("Failed to clear notifications");
//     }
//   };

//   // Poll notifications
//   useEffect(() => {
//     if (!currentUserEmail) return;
//     fetchNotifications();
//     const id = setInterval(fetchNotifications, 8000);
//     return () => clearInterval(id);
//   }, [currentUserEmail]);

//   // Count only unread notifications
//   const unreadCount = notifications.filter((n) => !n.read).length;

//   return (
//     <>
//       <header
//         className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm"
//         style={{ backgroundColor: CLEAN_WHITE }}
//       >
//         <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-14 md:h-16">
//             {/* Logo Section */}
//             <div className="flex items-center">
//               <button
//                 onClick={() => setMobileMenuOpen((s) => !s)}
//                 className="hidden p-2 rounded-md hover:bg-gray-100 transition"
//               >
//                 {mobileMenuOpen ? (
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke={EMPIRE_BLUE}
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M6 18L18 6M6 6l12 12"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke={EMPIRE_BLUE}
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 6h16M4 12h16M4 18h16"
//                     />
//                   </svg>
//                 )}
//               </button>

//               <NavLink to="/" className="flex items-center gap-3 pr-4">
//                 <img
//                   src={headerlogo}
//                   alt="AcctEmpire"
//                   className="h-14 md:h-16 lg:h-18 w-auto"
//                 />
//               </NavLink>
//             </div>

//             {/* Desktop Menu */}
//             <div className="hidden lg:flex items-center gap-8">
//               <NavLink
//                 to="/marketplace"
//                 className="font-medium"
//                 style={({ isActive }) => ({
//                   color: isActive ? ROYAL_GOLD : CHARCOAL,
//                 })}
//               >
//                 Marketplace
//               </NavLink>
//               <NavLink
//                 to="/purchases"
//                 className="font-medium"
//                 style={({ isActive }) => ({
//                   color: isActive ? ROYAL_GOLD : CHARCOAL,
//                 })}
//               >
//                 Mypurchase
//               </NavLink>
//               {loginUserData.data?.role === "seller" ||
//               loginUserData.data?.role === "admin" ? (
//                 <NavLink
//                   to="/orders"
//                   className="font-medium"
//                   style={({ isActive }) => ({
//                     color: isActive ? ROYAL_GOLD : CHARCOAL,
//                   })}
//                 >
//                   Orders
//                 </NavLink>
//               ) : (
//                 ""
//               )}
//               {loginUser ? (
//                 <NavLink
//                   to="/wallet"
//                   className="font-medium"
//                   style={({ isActive }) => ({
//                     color: isActive ? ROYAL_GOLD : CHARCOAL,
//                   })}
//                 >
//                   Wallet
//                 </NavLink>
//               ) : (
//                 ""
//               )}
//               {loginUser?.role === "seller" || loginUser?.role === "admin" ? (
//                 <NavLink
//                   to="/myproducts"
//                   className="font-medium"
//                   style={({ isActive }) => ({
//                     color: isActive ? ROYAL_GOLD : CHARCOAL,
//                   })}
//                 >
//                   My Ads
//                 </NavLink>
//               ) : (
//                 ""
//               )}
//               {loginUser?.role === "seller" || loginUser?.role === "admin" ? (
//                 <NavLink
//                   to="/seller-guide"
//                   className="font-medium"
//                   style={({ isActive }) => ({
//                     color: isActive ? ROYAL_GOLD : CHARCOAL,
//                   })}
//                 >
//                   Seller Guide
//                 </NavLink>
//               ) : (
//                 ""
//               )}
//               <NavLink
//                 to="/selling-form"
//                 className="px-6 py-2.5 rounded-lg font-medium text-white shadow-sm"
//                 style={{ backgroundColor: ROYAL_GOLD }}
//               >
//                 Sell Product
//               </NavLink>
//             </div>

//             {/* Right Icons */}
//             <div className="flex items-center gap-1">
//               {/* Notifications Icon */}
//               <div className="relative" ref={notifRef}>
//                 <button
//                   onClick={handleShowNotifications}
//                   className="p-2 rounded-md hover:bg-gray-100 transition relative"
//                 >
//                   <svg
//                     className="w-6 h-6"
//                     fill="none"
//                     stroke={EMPIRE_BLUE}
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                     />
//                   </svg>

//                   {/* Red Badge (Solid Color) */}
//                   {unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full shadow-sm border border-white">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </button>

//                 {/* Dropdown - Mobile Responsive Update */}
//                 {notifOpen && (
//                   <div
//                     className="fixed top-14 left-4 right-4 md:absolute md:top-full md:left-auto md:right-0 md:mt-2 md:w-96 bg-white border rounded-xl shadow-2xl z-50 overflow-hidden"
//                     style={{ backgroundColor: CLEAN_WHITE }}
//                   >
//                     <div className="px-4 py-3 border-b flex items-center justify-between">
//                       <div className="font-bold text-gray-900">
//                         Notifications
//                       </div>
//                       <div className="text-xs font-semibold text-gray-600">
//                         {loadingNotifs
//                           ? "Loading..."
//                           : `${notifications.length} total`}
//                       </div>
//                     </div>

//                     <div className="max-h-[60vh] md:max-h-80 overflow-y-auto divide-y">
//                       {notifications.length === 0 && !loadingNotifs && (
//                         <div className="p-4 text-center text-sm text-gray-500">
//                           No notifications found for <br />{" "}
//                           <span className="font-semibold">
//                             {currentUserEmail}
//                           </span>
//                         </div>
//                       )}

//                       {notifications.map((n) => (
//                         <div
//                           key={n._id || `${n.title}-${n.createdAt}`}
//                           className={`p-3 hover:bg-gray-50 transition-colors ${
//                             n.read
//                               ? "bg-white"
//                               : "bg-blue-50 border-l-4 border-blue-600"
//                           }`}
//                         >
//                           <div className="flex items-start justify-between gap-3">
//                             <div className="flex-1">
//                               {/* TITLE */}
//                               <div className="text-sm font-bold text-black">
//                                 {n.title}
//                               </div>
//                               {/* MESSAGE */}
//                               <div className="text-xs text-gray-800 font-medium mt-1 line-clamp-2 leading-relaxed">
//                                 {n.message || n.description || "No description"}
//                               </div>
//                               {/* DATE */}
//                               <div className="text-[10px] text-gray-600 font-semibold mt-1 flex justify-between">
//                                 <span>
//                                   {n.createdAt
//                                     ? new Date(n.createdAt).toLocaleString()
//                                     : ""}
//                                 </span>
//                               </div>
//                             </div>
//                             {!n.read && (
//                               <div className="ml-2 w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shadow-sm" />
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Footer Actions */}
//                     <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
//                       <button
//                         onClick={clearAllNotifications}
//                         className="text-xs text-red-600 hover:text-red-800 hover:underline font-bold flex items-center gap-1"
//                         disabled={notifications.length === 0}
//                       >
//                         <FaTrashIcon /> Clear All
//                       </button>

//                       <button
//                         onClick={() => fetchNotifications()}
//                         className="text-xs text-blue-700 hover:underline font-bold"
//                       >
//                         Refresh List
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Avatar Dropdown */}
//               <div className="relative" ref={dropdownRef}>
//                 {user.user ? (
//                   <button
//                     onClick={() => setOpen((o) => !o)}
//                     className="flex items-center p-1 rounded-full hover:bg-gray-100 transition"
//                   >
//                     <div
//                       className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
//                       style={{
//                         background: `linear-gradient(90deg, ${EMPIRE_BLUE} 0%, ${ROYAL_GOLD} 100%)`,
//                       }}
//                     >
//                       {loginUser?.name ? loginUser.name[0].toUpperCase() : "A"}
//                     </div>
//                   </button>
//                 ) : (
//                   <div className="hidden md:flex gap-2">
//                     <Link to="/login">
//                       <Button
//                         variant="contained"
//                         sx={{
//                           px: 4,
//                           borderRadius: "10px",
//                           textTransform: "none",
//                           fontWeight: 600,
//                           backgroundColor: ROYAL_GOLD,
//                         }}
//                       >
//                         Login
//                       </Button>
//                     </Link>
//                     <Link to="/register">
//                       <Button
//                         variant="outlined"
//                         sx={{
//                           px: 4,
//                           borderRadius: "10px",
//                           textTransform: "none",
//                           fontWeight: 600,
//                           borderWidth: "2px",
//                         }}
//                       >
//                         Register
//                       </Button>
//                     </Link>
//                   </div>
//                 )}

//                 {open && (
//                   <div
//                     className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
//                     style={{ backgroundColor: CLEAN_WHITE }}
//                   >
//                     <div
//                       className="px-6 py-5 border-b"
//                       style={{ backgroundColor: "#F9FAFB" }}
//                     >
//                       <div
//                         className="font-bold text-lg"
//                         style={{ color: EMPIRE_BLUE }}
//                       >
//                         {loginUser?.name}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         {loginUser?.email}
//                       </div>
//                     </div>
//                     <div className="px-6 py-4 border-b">
//                       <div
//                         className="rounded-xl p-5 text-white relative overflow-hidden"
//                         style={{
//                           background: `linear-gradient(135deg, ${EMPIRE_BLUE} 0%, #1a3a6e 100%)`,
//                         }}
//                       >
//                         <div className="absolute inset-0 opacity-20">
//                           <div
//                             className="absolute inset-0"
//                             style={{
//                               backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`,
//                             }}
//                           />
//                         </div>
//                         <div className="relative z-10">
//                           <div className="text-sm opacity-90">Your Balance</div>
//                           <div className="text-3xl font-bold mt-2">
//                             ${loginUserData.data?.balance?.toFixed(2) || "0.00"}
//                           </div>
//                         </div>
//                         <NavLink
//                           to="/wallet"
//                           onClick={() => setOpen(false)}
//                           className="absolute bottom-4 right-4 text-sm underline opacity-90"
//                         >
//                           View Wallet →
//                         </NavLink>
//                       </div>
//                     </div>
//                     <div className="py-2">
//                       {loginUser?.role === "admin" && (
//                         <NavLink
//                           to="/admin-dashboard"
//                           onClick={() => setOpen(false)}
//                           className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
//                           style={{ color: CHARCOAL }}
//                         >
//                           <span className="text-sm font-medium">
//                             My Account Dashboard
//                           </span>
//                         </NavLink>
//                       )}
//                       <NavLink
//                         to="/referral"
//                         onClick={() => setOpen(false)}
//                         className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
//                         style={{ color: CHARCOAL }}
//                       >
//                         <span className="text-sm font-medium">Referral</span>
//                       </NavLink>
//                       <NavLink
//                         to="/plans"
//                         onClick={() => setOpen(false)}
//                         className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
//                         style={{ color: CHARCOAL }}
//                       >
//                         <span className="text-sm font-medium">Plans</span>
//                       </NavLink>
//                       <NavLink
//                         to="/purchases"
//                         onClick={() => setOpen(false)}
//                         className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
//                         style={{ color: CHARCOAL }}
//                       >
//                         <span className="text-sm font-medium">
//                           My Purchases
//                         </span>
//                       </NavLink>
//                       {loginUser?.role === "seller" || loginUser?.role === "admin" ? (
//                         <NavLink
//                           to="/seller-guide"
//                           onClick={() => setOpen(false)}
//                           className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition lg:hidden"
//                           style={({ isActive }) => ({
//                             color: isActive ? ROYAL_GOLD : CHARCOAL,
//                           })}
//                         >
//                           <span className="text-sm font-medium">Seller Guide</span>
//                         </NavLink>
//                       ) : null}
//                       <NavLink
//                         to="/account-settings"
//                         onClick={() => setOpen(false)}
//                         className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
//                         style={{ color: CHARCOAL }}
//                       >
//                         <span className="text-sm font-medium">
//                           Account Settings
//                         </span>
//                       </NavLink>
//                       <button
//                         onClick={handelLougt}
//                         className="w-full flex items-center gap-4 px-6 py-3 hover:bg-yellow-50 transition text-left"
//                         style={{ color: "#B45309" }}
//                       >
//                         <span className="text-sm font-medium">Log out</span>
//                       </button>
//                     </div>
//                     <div className="px-6 py-4">
//                       <NavLink
//                         to="/selling-form"
//                         onClick={() => setOpen(false)}
//                         className="block w-full text-center py-3 rounded-lg font-semibold text-white"
//                         style={{ backgroundColor: ROYAL_GOLD }}
//                       >
//                         Sell Product
//                       </NavLink>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </nav>
//       </header>

//    {/* Mobile Bottom Nav */}
// <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
//   <div className="relative max-w-screen-xl mx-auto">
//     <div className="flex items-end justify-between h-20 px-4">

//       {/* Marketplace – all */}
//       <NavLink
//         to="/marketplace"
//         className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
//         style={({ isActive }) => ({
//           color: isActive ? ROYAL_GOLD : CHARCOAL,
//         })}
//       >
//         <ShoppingBag />
//         <span className="text-xs">Marketplace</span>
//       </NavLink>

//       {/* Purchases – all */}
//       <NavLink
//         to="/purchases"
//         className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
//         style={({ isActive }) => ({
//           color: isActive ? ROYAL_GOLD : CHARCOAL,
//         })}
//       >
//         <ShoppingCart />
//         <span className="text-xs">Purchases</span>
//       </NavLink>

//       {/* Sell Product – all */}
//       <NavLink
//         to="/selling-form"
//         className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
//         style={({ isActive }) => ({
//           color: isActive ? ROYAL_GOLD : CHARCOAL,
//         })}
//       >
//         <FaBreadSliceIcon className="w-5 h-5 mb-1" />
//         <span className="text-xs">Sell</span>
//       </NavLink>

//       {/* Orders – seller / admin */}
//       {(loginUser?.role === "seller" || loginUser?.role === "admin") && (
//         <NavLink
//           to="/orders"
//           className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
//           style={({ isActive }) => ({
//             color: isActive ? ROYAL_GOLD : CHARCOAL,
//           })}
//         >
//           <ListCheck />
//           <span className="text-xs">Orders</span>
//         </NavLink>
//       )}

//       {/* Wallet – logged in */}
//       {loginUser && (
//         <NavLink
//           to="/wallet"
//           className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
//           style={({ isActive }) => ({
//             color: isActive ? ROYAL_GOLD : CHARCOAL,
//           })}
//         >
//           <WalletMinimal />
//           <span className="text-xs">Wallet</span>
//         </NavLink>
//       )}

//     </div>
//   </div>
// </nav>


//     </>
//   );
// }
