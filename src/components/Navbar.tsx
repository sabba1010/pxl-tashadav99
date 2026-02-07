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
import {
  ListCheck,
  ShoppingBag,
  ShoppingCart,
  WalletMinimal,
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
        className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm py-2"
        style={{ backgroundColor: CLEAN_WHITE }}
      >
        <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen((s) => !s)}
                className="hidden p-2 rounded-md hover:bg-gray-100 transition"
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
                  className="h-16 sm:h-18 md:h-20 lg:h-24 w-auto object-contain"
                /* h-16 (64px) for mobile - "a little big"
                   h-24 (96px) for desktop - "large/medium"
                */
                />
              </NavLink>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              <NavLink to="/marketplace" className="font-medium" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>Marketplace</NavLink>
              <NavLink to="/purchases" className="font-medium" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>Mypurchase</NavLink>
              {(loginUserData.data?.role === "seller" || loginUserData.data?.role === "admin") && (
                <NavLink to="/orders" className="font-medium" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>Orders</NavLink>
              )}
              {loginUser && (
                <NavLink to="/wallet" className="font-medium" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>Wallet</NavLink>
              )}
              {(loginUser?.role === "seller" || loginUser?.role === "admin") && (
                <NavLink to="/myproducts" className="font-medium" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>My Ads</NavLink>
              )}
              {(loginUser?.role === "seller" || loginUser?.role === "admin") && (
                <NavLink to="/seller-guide" className="font-medium" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>Seller Guide</NavLink>
              )}
              {(loginUser?.role === "buyer" || loginUser?.role === "admin") && (
                <NavLink to="/buyer-guide" className="font-medium" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}>Buyer Guide</NavLink>
              )}
              <button onClick={handleSellProduct} className="px-6 py-2.5 rounded-lg font-medium text-white shadow-sm" style={{ backgroundColor: ROYAL_GOLD }}>Sell Product</button>
            </div>

            <div className="flex items-center gap-1">
              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={handleShowNotifications}
                  className="p-2 rounded-md hover:bg-gray-100 transition relative"
                >
                  <svg className="w-6 h-6" fill="none" stroke={EMPIRE_BLUE} viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full shadow-sm border border-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div
                    className="fixed top-14 left-4 right-4 md:absolute md:top-full md:left-auto md:right-0 md:mt-2 md:w-96 bg-white border rounded-xl shadow-2xl z-50 overflow-hidden"
                    style={{ backgroundColor: CLEAN_WHITE }}
                  >
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                      <div className="font-bold text-gray-900">Notifications</div>
                      <div className="text-xs font-semibold text-gray-600">
                        {loadingNotifs ? "Loading..." : `${notifications.length} total`}
                      </div>
                    </div>

                    <div className="max-h-[60vh] md:max-h-80 overflow-y-auto divide-y">
                      {notifications.length === 0 && !loadingNotifs && (
                        <div className="p-4 text-center text-sm text-gray-500">
                          No notifications found for <br />
                          <span className="font-semibold">{currentUserEmail}</span>
                        </div>
                      )}

                      {notifications.map((n) => {
                        const senderName = n.senderId?.split("@")[0];
                        const isRead = n.userEmail === currentUserEmail ? n.read : n.readBy?.includes(currentUserEmail || "");

                        return (
                          <div
                            key={n._id}
                            className={`p-3 hover:bg-gray-50 transition-colors ${isRead
                              ? "bg-white"
                              : "bg-blue-50 border-l-4 border-blue-600"
                              }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="text-sm font-bold text-black">
                                  {senderName ? `New message from ${senderName}` : n.title}
                                </div>

                                {n.productTitle && (
                                  <div className="text-[11px] text-blue-700 font-bold mt-0.5">
                                    Regarding: {n.productTitle}
                                  </div>
                                )}

                                <div className="text-xs text-gray-800 font-medium mt-1 line-clamp-2 leading-relaxed">
                                  {n.message || n.description || "No description"}
                                </div>

                                {n.link && (
                                  <a
                                    href={n.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-blue-600 font-bold mt-2 inline-flex items-center gap-1 hover:underline bg-blue-50 px-2 py-1 rounded"
                                  >
                                    Action Link:{" "}
                                    {n.link.length > 30
                                      ? n.link.substring(0, 30) + "..."
                                      : n.link}
                                  </a>
                                )}

                                <div className="text-[10px] text-gray-600 font-semibold mt-1">
                                  {n.createdAt
                                    ? new Date(n.createdAt).toLocaleString()
                                    : ""}

                                </div>
                              </div>

                              {!isRead && (
                                <div className="ml-2 w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shadow-sm" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-red-600 hover:text-red-800 hover:underline font-bold flex items-center gap-1"
                        disabled={notifications.length === 0}
                      >
                        <FaTrashIcon /> Clear All
                      </button>

                      <button
                        onClick={() => fetchNotifications()}
                        className="text-xs text-blue-700 hover:underline font-bold"
                      >
                        Refresh List
                      </button>
                    </div>
                  </div>
                )}
              </div>


              {/* Avatar Dropdown */}
              <div className="relative" ref={dropdownRef}>
                {user.user ? (
                  <button onClick={() => setOpen((o) => !o)} className="flex items-center p-1 rounded-full hover:bg-gray-100 transition">
                    <div className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(90deg, ${EMPIRE_BLUE} 0%, ${ROYAL_GOLD} 100%)` }}>
                      {loginUser?.name ? loginUser.name[0].toUpperCase() : "A"}
                    </div>
                  </button>
                ) : (
                  <div className="flex gap-1.5 md:gap-4 md:ml-6">
                    <Link to="/login"><Button variant="contained" sx={{ px: { xs: 1.5, md: 4 }, py: { xs: 0.3, md: "auto" }, borderRadius: "6px", textTransform: "none", fontWeight: 600, backgroundColor: ROYAL_GOLD, fontSize: { xs: "0.65rem", md: "1rem" }, height: { xs: "28px", md: "auto" } }}>Login</Button></Link>
                    <Link to="/register"><Button variant="outlined" sx={{ px: { xs: 1.5, md: 4 }, py: { xs: 0.3, md: "auto" }, borderRadius: "6px", textTransform: "none", fontWeight: 600, borderWidth: "2px", fontSize: { xs: "0.65rem", md: "1rem" }, height: { xs: "28px", md: "auto" } }}>Register</Button></Link>
                  </div>
                )}

                {open && (
                  <div className="fixed left-4 right-4 top-20 md:absolute md:right-0 md:top-full md:left-auto md:mt-2 md:w-80 rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-[70vh] flex flex-col" style={{ backgroundColor: CLEAN_WHITE }}>
                    <div className="px-4 md:px-6 py-3 md:py-5 border-b flex-shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
                      <div className="font-bold text-base md:text-lg" style={{ color: EMPIRE_BLUE }}>{loginUser?.name}</div>
                      <div className="text-xs md:text-sm text-gray-500 truncate">{loginUser?.email}</div>
                    </div>
                    <div className="px-4 md:px-6 py-3 md:py-4 border-b flex-shrink-0">
                      <div className="rounded-xl p-3 md:p-5 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${EMPIRE_BLUE} 0%, #1a3a6e 100%)` }}>
                        <div className="relative z-10">
                          <div className="text-xs md:text-sm opacity-90">Your Balance</div>
                          <div className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">${loginUserData.data?.balance?.toFixed(2) || "0.00"}</div>
                        </div>
                        <NavLink to="/wallet" onClick={() => setOpen(false)} className="absolute bottom-2 md:bottom-4 right-2 md:right-4 text-xs md:text-sm underline opacity-90">View Wallet →</NavLink>
                      </div>
                    </div>
                    <div className="overflow-y-auto flex-1 py-2">
                      {loginUser?.role === "admin" && (
                        <NavLink to="/admin-dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 hover:bg-gray-50 transition"><span className="text-xs md:text-sm font-medium">My Account Dashboard</span></NavLink>
                      )}
                      {loginUser?.role === "seller" && (
                        <NavLink to="/seller-dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 hover:bg-gray-50 transition"><span className="text-xs md:text-sm font-medium">My Dashboard</span></NavLink>
                      )}
                      {(loginUser?.role === "seller" || loginUser?.role === "admin") && (
                        <NavLink to="/referral" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 hover:bg-gray-50 transition"><span className="text-xs md:text-sm font-medium">Referral</span></NavLink>
                      )}
                      {/* <NavLink to="/referral" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 hover:bg-gray-50 transition"><span className="text-xs md:text-sm font-medium">Referral</span></NavLink> */}
                      <NavLink to="/plans" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 hover:bg-gray-50 transition"><span className="text-xs md:text-sm font-medium">Plans</span></NavLink>
                      {(loginUser?.role === "seller" || loginUser?.role === "admin") && (
                        <NavLink to="/seller-guide" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 hover:bg-gray-50 transition"><span className="text-xs md:text-sm font-medium">Seller Guide</span></NavLink>
                      )}
                      {(loginUser?.role === "buyer" || loginUser?.role === "admin") && (
                        <NavLink to="/buyer-guide" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 hover:bg-gray-50 transition"><span className="text-xs md:text-sm font-medium">Buyer Guide</span></NavLink>
                      )}
                      <NavLink to="/purchases" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 hover:bg-gray-50 transition"><span className="text-xs md:text-sm font-medium">My Purchases</span></NavLink>
                      <NavLink to="/account-settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 hover:bg-gray-50 transition"><span className="text-xs md:text-sm font-medium">Account Settings</span></NavLink>
                      <NavLink to="/reports" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 hover:bg-gray-50 transition"><span className="text-xs md:text-sm font-medium">Reports</span></NavLink>
                      {(loginUser?.role === "seller" || loginUser?.role === "buyer") && (
                        <NavLink to="/seller-chat" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 hover:bg-gray-50 transition"><span className="text-xs md:text-sm font-medium">Admin Support</span></NavLink>
                      )}
                    </div>

                    <button onClick={handelLougt} className="w-full flex items-center gap-3 px-4 md:px-6 py-2.5 md:py-3 hover:bg-yellow-50 transition text-left flex-shrink-0 border-t" style={{ color: "#B45309" }}><span className="text-xs md:text-sm font-medium">Log out</span></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
        <div className="flex items-end justify-between h-20 px-4 overflow-x-auto">
          <NavLink to="/marketplace" className="flex flex-col items-center justify-center flex-1 pb-5" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}><ShoppingBag /><span className="text-xs">Marketplace</span></NavLink>
          <NavLink to="/purchases" className="flex flex-col items-center justify-center flex-1 pb-5" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}><ShoppingCart /><span className="text-xs">Purchases</span></NavLink>
          <button onClick={handleSellProduct} className="flex flex-col items-center justify-center flex-1 pb-5 bg-transparent border-0" style={{ color: CHARCOAL, cursor: "pointer" }}><FaBreadSliceIcon className="w-5 h-5 mb-1" /><span className="text-xs">Sell</span></button>
          {(loginUser?.role === "seller" || loginUser?.role === "admin") && (
            <NavLink to="/orders" className="flex flex-col items-center justify-center flex-1 pb-5" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}><ListCheck /><span className="text-xs">Orders</span></NavLink>
          )}
          {loginUser && (
            <NavLink to="/wallet" className="flex flex-col items-center justify-center flex-1 pb-5" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}><WalletMinimal /><span className="text-xs">Wallet</span></NavLink>
          )}
          {(loginUser?.role === "seller" || loginUser?.role === "buyer") && (
            <NavLink to="/seller-chat" className="flex flex-col items-center justify-center flex-1 pb-5" style={({ isActive }) => ({ color: isActive ? ROYAL_GOLD : CHARCOAL })}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg><span className="text-xs">Support</span></NavLink>
          )}
        </div>
      </nav>
    </>
  );
}