import { Button } from "@mui/material";
import { useEffect, useRef, useState, useCallback } from "react";
import { FaBreadSlice, FaTrash } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../context/AuthContext";
import { getAllNotifications, clearNotifications } from "../components/Notification/Notification";
import headerlogo from "../assets/headerlogo.png";
import { useAuthHook } from "../hook/useAuthHook";
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
  Plus,
  Users,
  FileText,
  BookOpen,
  Headphones,
  CreditCard
} from "lucide-react";
import AnnouncementBar from "./AnnouncementBar";

const FaBreadSliceIcon = FaBreadSlice as unknown as React.ComponentType<any>;

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
  readBy?: string[];
  deletedBy?: string[];
  createdAt?: string;
  userEmail?: string;
  target?: string;
  senderId?: string;
  productId?: string;
  productTitle?: string;
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

      // 1. Frontend update
      setNotifications(prev => prev.map(n => {
        if (n.userEmail === currentUserEmail) return { ...n, read: true };
        return { ...n, readBy: [...(n.readBy || []), currentUserEmail as string] };
      }));

      // 2. Backend sync
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
        className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm py-2"
        style={{}}
      >
        <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen((s) => !s)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition mr-2"
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
                className="flex items-center gap-3 pr-4 ml-0 md:ml-[20px] lg:ml-[40px]"
              >
                <img
                  src={headerlogo}
                  alt="AcctEmpire"
                  className="h-14 sm:h-16 md:h-20 lg:h-24 w-auto object-contain transition-all duration-300"
                />
              </NavLink>
            </div>

            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <NavLink to="/marketplace" className="font-medium text-sm xl:text-base hover:text-[#D4A643] transition-colors" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>Marketplace</NavLink>
              <NavLink to="/purchases" className="font-medium text-sm xl:text-base hover:text-[#D4A643] transition-colors" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>My Purchases</NavLink>
              {(loginUserData.data?.role === "seller" || loginUserData.data?.role === "admin") && (
                <NavLink to="/orders" className="font-medium text-sm xl:text-base hover:text-[#D4A643] transition-colors" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>Orders</NavLink>
              )}
              {loginUser && (
                <NavLink to="/wallet" className="font-medium text-sm xl:text-base hover:text-[#D4A643] transition-colors" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>Wallet</NavLink>
              )}
              {(loginUser?.role === "seller" || loginUser?.role === "admin") && (
                <NavLink to="/myproducts" className="font-medium text-sm xl:text-base hover:text-[#D4A643] transition-colors" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>My Ads</NavLink>
              )}
              {(loginUser?.role === "seller" || loginUser?.role === "admin") && (
                <NavLink to="/seller-guide" className="font-medium text-sm xl:text-base hover:text-[#D4A643] transition-colors" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>Seller Guide</NavLink>
              )}
              {(loginUser?.role === "buyer" || loginUser?.role === "admin") && (
                <NavLink to="/buyer-guide" className="font-medium text-sm xl:text-base hover:text-[#D4A643] transition-colors" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>Buyer Guide</NavLink>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSellProduct}
                className="px-5 py-2.5 rounded-xl font-semibold text-white shadow-lg shadow-yellow-500/20 text-sm"
                style={{ backgroundColor: ROYAL_GOLD }}
              >
                Sell Product
              </motion.button>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowNotifications}
                  className="p-2.5 rounded-full transition relative text-gray-700"
                >
                  <Bell className="w-6 h-6" strokeWidth={1.8} />
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-1.5 right-1.5 flex h-3 w-3"
                      >
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="fixed top-20 right-4 left-4 md:absolute md:top-full md:left-auto md:right-0 md:mt-3 md:w-[420px] bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] z-50 overflow-hidden ring-1 ring-black/5"
                    >
                      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">You have {unreadCount} unread messages</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => fetchNotifications()}
                            className="p-2 hover:bg-gray-200/50 rounded-full transition text-gray-500 hover:text-blue-600"
                            title="Refresh"
                          >
                            <RefreshCw size={16} />
                          </button>
                          {notifications.length > 0 && (
                            <button
                              onClick={clearAllNotifications}
                              className="p-2 hover:bg-red-50 rounded-full transition text-gray-400 hover:text-red-500"
                              title="Clear all"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="max-h-[60vh] md:max-h-[450px] overflow-y-auto no-scrollbar">
                        {notifications.length === 0 && !loadingNotifs ? (
                          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                              <BellOff className="text-gray-300" size={32} />
                            </div>
                            <p className="text-gray-900 font-semibold">No notifications yet</p>
                            <p className="text-sm text-gray-500 mt-1 max-w-[200px]">When you get notifications, they'll show up here.</p>
                          </div>
                        ) : (
                          <div className="p-2 space-y-2">
                            {notifications.map((n) => {
                              const senderName = n.senderId?.split("@")[0];
                              const isRead = n.userEmail === currentUserEmail ? n.read : n.readBy?.includes(currentUserEmail || "");

                              return (
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  key={n._id}
                                  className={`group p-4 rounded-xl transition-all relative overflow-hidden border ${isRead
                                    ? "bg-white border-transparent hover:bg-gray-50"
                                    : "bg-blue-50/50 border-blue-100 hover:bg-blue-50"
                                    }`}
                                >
                                  {!isRead && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full ring-4 ring-blue-500/20"></div>
                                  )}

                                  <div className="flex gap-3.5">
                                    <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'
                                      }`}>
                                      <Info size={18} />
                                    </div>

                                    <div className="flex-1 pr-4">
                                      <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm font-bold ${isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                          {senderName ? `New message from ${senderName}` : n.title}
                                        </h4>
                                      </div>

                                      {n.productTitle && (
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium text-gray-600 mb-2">
                                          <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                          {n.productTitle}
                                        </div>
                                      )}

                                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                        {n.message || n.description || "No description available"}
                                      </p>

                                      {n.link && (
                                        <a
                                          href={n.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                        >
                                          View Details <ChevronRight size={12} />
                                        </a>
                                      )}

                                      <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                                        <span>{n.createdAt ? new Date(n.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Just now"}</span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Avatar Dropdown */}
              <div className="relative" ref={dropdownRef}>
                {user.user ? (
                  <div onClick={() => setOpen((o) => !o)} className="cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="h-9 w-9 md:h-10 md:w-10 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md ring-2 ring-white"
                      style={{ background: `linear-gradient(135deg, ${EMPIRE_BLUE} 0%, ${ROYAL_GOLD} 100%)` }}
                    >
                      {loginUser?.name ? loginUser.name[0].toUpperCase() : "A"}
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex gap-2.5 md:gap-4 md:ml-6">
                    <Link to="/login">
                      <Button
                        variant="contained"
                        sx={{
                          px: { xs: 2.5, md: 4 },
                          py: 1,
                          borderRadius: "12px",
                          textTransform: "none",
                          fontWeight: 700,
                          backgroundColor: ROYAL_GOLD,
                          boxShadow: "0 4px 14px 0 rgba(212, 166, 67, 0.39)",
                          '&:hover': { backgroundColor: "#c59a3e", boxShadow: "0 6px 20px rgba(212, 166, 67, 0.23)" }
                        }}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button
                        variant="outlined"
                        sx={{
                          px: { xs: 2.5, md: 4 },
                          py: 1,
                          borderRadius: "12px",
                          textTransform: "none",
                          fontWeight: 700,
                          borderWidth: "2px",
                          borderColor: "#E5E7EB",
                          color: EMPIRE_BLUE,
                          '&:hover': { borderColor: EMPIRE_BLUE, backgroundColor: "transparent" }
                        }}
                      >
                        Register
                      </Button>
                    </Link>
                  </div>
                )}

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="fixed left-4 right-4 top-20 md:absolute md:right-0 md:top-full md:left-auto md:mt-3 md:w-80 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden z-50 ring-1 ring-black/5"
                    >
                      <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg" style={{ background: `linear-gradient(135deg, ${EMPIRE_BLUE} 0%, ${ROYAL_GOLD} 100%)` }}>
                            {loginUser?.name ? loginUser.name[0].toUpperCase() : "A"}
                          </div>
                          <div>
                            <div className="font-bold text-lg text-gray-900 leading-tight">{loginUser?.name}</div>
                            <div className="text-xs text-gray-500 font-medium truncate max-w-[180px]">{loginUser?.email}</div>
                          </div>
                        </div>

                        <div className="rounded-xl p-4 text-white relative overflow-hidden shadow-lg group" style={{ background: `linear-gradient(135deg, ${EMPIRE_BLUE} 0%, #1a3a6e 100%)` }}>
                          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                          <div className="relative z-10">
                            <div className="text-xs font-medium text-blue-200 uppercase tracking-wider mb-1">Total Balance</div>
                            <div className="text-3xl font-bold tracking-tight">${loginUserData.data?.balance?.toFixed(2) || "0.00"}</div>
                          </div>
                          <Link to="/wallet" onClick={() => setOpen(false)} className="absolute bottom-3 right-3 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition backdrop-blur-sm">
                            <ChevronRight size={16} className="text-white" />
                          </Link>
                        </div>
                      </div>

                      <div className="p-2 space-y-1">
                        {loginUser?.role === "admin" && (
                          <Link to="/admin-dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 hover:text-gray-900">
                            <LayoutDashboard size={18} className="text-gray-400" />
                            <span className="text-sm font-semibold">Admin Dashboard</span>
                          </Link>
                        )}
                        {loginUser?.role === "seller" && (
                          <Link to="/seller-dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 hover:text-gray-900">
                            <LayoutDashboard size={18} className="text-gray-400" />
                            <span className="text-sm font-semibold">Seller Dashboard</span>
                          </Link>
                        )}
                        {(loginUser?.role === "seller" || loginUser?.role === "admin") && (
                          <Link to="/referral" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 hover:text-gray-900">
                            <Users size={18} className="text-gray-400" />
                            <span className="text-sm font-semibold">Referral</span>
                          </Link>
                        )}
                        <Link to="/plans" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 hover:text-gray-900">
                          <CreditCard size={18} className="text-gray-400" />
                          <span className="text-sm font-semibold">Plans</span>
                        </Link>
                        {(loginUser?.role === "seller" || loginUser?.role === "admin") && (
                          <Link to="/seller-guide" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 hover:text-gray-900">
                            <BookOpen size={18} className="text-gray-400" />
                            <span className="text-sm font-semibold">Seller Guide</span>
                          </Link>
                        )}
                        {(loginUser?.role === "buyer" || loginUser?.role === "admin") && (
                          <Link to="/buyer-guide" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 hover:text-gray-900">
                            <BookOpen size={18} className="text-gray-400" />
                            <span className="text-sm font-semibold">Buyer Guide</span>
                          </Link>
                        )}
                        <Link to="/purchases" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 hover:text-gray-900">
                          <ShoppingBag size={18} className="text-gray-400" />
                          <span className="text-sm font-semibold">My Purchases</span>
                        </Link>
                        <Link to="/account-settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 hover:text-gray-900">
                          <Settings size={18} className="text-gray-400" />
                          <span className="text-sm font-semibold">Account Settings</span>
                        </Link>
                        <Link to="/reports" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 hover:text-gray-900">
                          <FileText size={18} className="text-gray-400" />
                          <span className="text-sm font-semibold">Reports</span>
                        </Link>
                        {(loginUser?.role === "seller" || loginUser?.role === "buyer") && (
                          <Link to="/seller-chat" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition text-gray-700 hover:text-gray-900">
                            <Headphones size={18} className="text-gray-400" />
                            <div className="flex-1">
                              <span className="text-sm font-semibold">Admin Support</span>
                              <p className="text-[10px] text-gray-400">Chat with support</p>
                            </div>
                          </Link>
                        )}
                      </div>

                      <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                        <button onClick={handelLougt} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition font-semibold text-sm">
                          <LogOut size={16} />
                          Log out
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

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200 lg:hidden pb-safe">
        <div className="flex items-end justify-between h-[84px] px-2 pb-5">

          <NavLink to="/marketplace" className="flex flex-col items-center justify-center flex-1 h-full gap-1 pt-3" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : "#9CA3AF" })}>
            {({ isActive }) => (
              <>
                <motion.div whileTap={{ scale: 0.8 }} animate={{ scale: isActive ? 1.1 : 1 }}>
                  <ShoppingBag size={22} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <span className="text-[10px] font-medium">Market</span>
              </>
            )}
          </NavLink>

          <NavLink to="/purchases" className="flex flex-col items-center justify-center flex-1 h-full gap-1 pt-3" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : "#9CA3AF" })}>
            {({ isActive }) => (
              <>
                <motion.div whileTap={{ scale: 0.8 }} animate={{ scale: isActive ? 1.1 : 1 }}>
                  <ShoppingCart size={22} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <span className="text-[10px] font-medium">Purchases</span>
              </>
            )}
          </NavLink>

          <button
            onClick={handleSellProduct}
            className="flex flex-col items-center justify-end flex-1 h-full -mt-8"
          >
            <div className="h-14 w-14 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 text-white mb-1 transition-transform active:scale-95" style={{ backgroundColor: ROYAL_GOLD }}>
              <Plus size={28} strokeWidth={3} />
            </div>
            <span className="text-[10px] font-medium text-gray-500">Sell</span>
          </button>

          {(loginUser?.role === "seller" || loginUser?.role === "admin") && (
            <NavLink to="/orders" className="flex flex-col items-center justify-center flex-1 h-full gap-1 pt-3" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : "#9CA3AF" })}>
              {({ isActive }) => (
                <>
                  <motion.div whileTap={{ scale: 0.8 }} animate={{ scale: isActive ? 1.1 : 1 }}>
                    <ListCheck size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>
                  <span className="text-[10px] font-medium">Orders</span>
                </>
              )}
            </NavLink>
          )}

          {loginUser && (
            <NavLink to="/wallet" className="flex flex-col items-center justify-center flex-1 h-full gap-1 pt-3" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : "#9CA3AF" })}>
              {({ isActive }) => (
                <>
                  <motion.div whileTap={{ scale: 0.8 }} animate={{ scale: isActive ? 1.1 : 1 }}>
                    <WalletMinimal size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>
                  <span className="text-[10px] font-medium">Wallet</span>
                </>
              )}
            </NavLink>
          )}

          {(loginUser?.role === "seller" || loginUser?.role === "buyer") && (
            <NavLink to="/seller-chat" className="flex flex-col items-center justify-center flex-1 h-full gap-1 pt-3" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : "#9CA3AF" })}>
              {({ isActive }) => (
                <>
                  <motion.div whileTap={{ scale: 0.8 }} animate={{ scale: isActive ? 1.1 : 1 }}>
                    <Headphones size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>
                  <span className="text-[10px] font-medium">Support</span>
                </>
              )}
            </NavLink>
          )}

        </div>
      </nav>
    </>
  );
}