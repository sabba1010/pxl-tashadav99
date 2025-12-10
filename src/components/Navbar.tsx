// src/components/Navbar.tsx
import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false); // Avatar dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuth();
  const naviate = useNavigate();
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Brand Colors
  const EMPIRE_BLUE = "#0A1A3A";
  const ROYAL_GOLD = "#D4A643";
  const CHARCOAL = "#111111";
  const CLEAN_WHITE = "#FFFFFF";

  const handelLougt = () => {
    user.logout();
    toast.success("Logged out successfully");
    naviate("/");
  };

  return (
    <>
      {/* Top Navbar - Sticky */}
      <header
        className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm"
        style={{ backgroundColor: CLEAN_WHITE }}
      >
        <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hidden p-2 rounded-md hover:bg-gray-100 transition"
              >
                {mobileMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke={EMPIRE_BLUE}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke={EMPIRE_BLUE}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>

              <NavLink to="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="EmpireVault" className="h-9 w-auto" />
                <span
                  className="hidden sm:inline font-bold text-xl"
                  style={{ color: EMPIRE_BLUE }}
                >
                  EmpireVault
                </span>
              </NavLink>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8">
              <NavLink
                to="/marketplace"
                className="font-medium"
                style={({ isActive }) => ({
                  color: isActive ? ROYAL_GOLD : CHARCOAL,
                })}
              >
                Marketplace
              </NavLink>
              <NavLink
                to="/purchases"
                className="font-medium"
                style={({ isActive }) => ({
                  color: isActive ? ROYAL_GOLD : CHARCOAL,
                })}
              >
                Mypurchase
              </NavLink>
              <NavLink
                to="/orders"
                className="font-medium"
                style={({ isActive }) => ({
                  color: isActive ? ROYAL_GOLD : CHARCOAL,
                })}
              >
                Orders
              </NavLink>
              <NavLink
                to="/myproducts"
                className="font-medium"
                style={({ isActive }) => ({
                  color: isActive ? ROYAL_GOLD : CHARCOAL,
                })}
              >
                My products
              </NavLink>

              <NavLink
                to="/wallet"
                className="font-medium"
                style={({ isActive }) => ({
                  color: isActive ? ROYAL_GOLD : CHARCOAL,
                })}
              >
                Wallet
              </NavLink>
              <NavLink
                to="/add-product"
                className="px-6 py-2.5 rounded-lg font-medium text-white shadow-sm"
                style={{ backgroundColor: "#D4A643" }}
              >
                Sell Product
              </NavLink>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Avatar Dropdown */}
              <div className="relative" ref={dropdownRef}>
                {user.user ? (
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center p-1 rounded-full hover:bg-gray-100 transition"
                  >
                    <div
                      className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{
                        background: `linear-gradient(90deg, ${EMPIRE_BLUE} 0%, ${ROYAL_GOLD} 100%)`,
                      }}
                    >
                      A
                    </div>
                  </button>
                ) : (
                  <div className="md:flex hidden gap-2">
                    <Button
                      variant="contained"
                      sx={{
                        paddingX: 4,
                        paddingY: 0.4,
                        borderRadius: "10px",
                        textTransform: "none",
                        fontSize: "16px",
                        fontWeight: 600,
                        backgroundColor: ROYAL_GOLD,
                      }}
                    >
                      Login
                    </Button>

                    <Button
                      variant="outlined"
                      sx={{
                        paddingX: 4,
                        paddingY: 0.4,
                        borderRadius: "10px",
                        textTransform: "none",
                        fontSize: "16px",
                        fontWeight: 600,
                        borderWidth: "2px",
                        "&:hover": {
                          borderWidth: "2px",
                        },
                      }}
                    >
                      Register
                    </Button>
                  </div>
                )}

                {/* Dropdown Menu */}
                {open && (
                  <div
                    className="absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    style={{ backgroundColor: CLEAN_WHITE }}
                  >
                    {/* User Info */}
                    <div
                      className="px-6 py-5 border-b"
                      style={{ backgroundColor: "#F9FAFB" }}
                    >
                      <div
                        className="font-bold text-lg"
                        style={{ color: EMPIRE_BLUE }}
                      >
                        Legityankeelogshub
                      </div>
                      <div className="text-sm text-gray-500">
                        tajudeerrtoyeeb095@gmail.com
                      </div>
                    </div>

                    {/* Wallet Balance Card */}
                    <div className="px-6 py-4 border-b">
                      <div
                        className="rounded-xl p-5 text-white relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${EMPIRE_BLUE} 0%, #1a3a6e 100%)`,
                        }}
                      >
                        <div className="absolute inset-0 opacity-20">
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`,
                            }}
                          ></div>
                        </div>
                        <div className="relative z-10">
                          <div className="text-sm opacity-90">Your Balance</div>
                          <div className="text-3xl font-bold mt-2">$123.45</div>
                        </div>
                        <NavLink
                          to="/wallet"
                          onClick={() => setOpen(false)}
                          className="absolute bottom-4 right-4 text-sm underline opacity-90"
                        >
                          View Wallet →
                        </NavLink>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {[
                        {
                          to: "/admin-dashboard",
                          icon: "account",
                          label: "My Account Dashboard",
                        },
                        { to: "/referral", icon: "users", label: "Referral" },
                        { to: "/plans", icon: "star", label: "Plans" },
                        {
                          to: "/purchases",
                          icon: "bag",
                          label: "My Purchases",
                        },
                        {
                          to: "/account-settings",
                          icon: "settings",
                          label: "Account Settings",
                        },
                      ].map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition"
                          style={{ color: CHARCOAL }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            {item.icon === "account" && (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            )}
                            {item.icon === "users" && (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6 6 0 0112 0v-1M9 10h.01M15 10h.01"
                              />
                            )}
                            {item.icon === "star" && (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.884 5.794a1 1 0 00.951.69h6.083c.969 0 .689 1.24-.289 1.043l-4.923 3.578a1 1 0 00-.364 1.118l1.884 5.794c.3.921-.755.688-1.239.303L12 17.727l-4.923 3.578c-.484.385-1.539.618-1.239-.303l1.884-5.794a1 1 0 00-.364-1.118L2.435 10.454c-.978-.197-.258-1.437.711-1.043h6.083a1 1 0 00.951-.69l1.884-5.794z"
                              />
                            )}
                            {item.icon === "bag" && (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              />
                            )}
                            {item.icon === "settings" && (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            )}
                          </svg>
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </NavLink>
                      ))}

                      <button
                        onClick={handelLougt}
                        className="w-full flex items-center gap-4 px-6 py-3 hover:bg-yellow-50 transition text-left"
                        style={{ color: "#B45309" }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="text-sm font-medium">Log out</span>
                      </button>
                    </div>

                    {/* Sell Button */}
                    <div className="px-6 py-4">
                      <NavLink
                        to="/add-product"
                        onClick={() => setOpen(false)}
                        className="block w-full text-center py-3 rounded-lg font-semibold text-white"
                        style={{ backgroundColor: "#D4A643" }}
                      >
                        Sell Product
                      </NavLink>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Spacer for fixed bottom bar (removed to prevent white gap under header) */}

      {/* Mobile Bottom Navigation - Fixed */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
        <div className="relative max-w-screen-xl mx-auto">
          <div className="flex items-end justify-between h-20 px-4">
            {/* Market */}
            <NavLink
              to="/marketplace"
              className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
              style={({ isActive }) => ({
                color: isActive ? ROYAL_GOLD : CHARCOAL,
              })}
            >
              <svg
                className="w-5 h-5 mb-1 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M5.4 5h15.2l-1.5 9H7.9L6.4 5zM9 20.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM19 20.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
              </svg>
              <span className="text-xs">Market</span>
            </NavLink>

            {/* My Purchases */}
            <NavLink
              to="/purchases"
              className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
              style={({ isActive }) => ({
                color: isActive ? ROYAL_GOLD : CHARCOAL,
              })}
            >
              <svg
                className="w-5 h-5 mb-1 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="text-xs">Purchases</span>
            </NavLink>

            {/* Orders */}
            <NavLink
              to="/orders"
              className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
              style={({ isActive }) => ({
                color: isActive ? ROYAL_GOLD : CHARCOAL,
              })}
            >
              <svg
                className="w-5 h-5 mb-1 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="text-xs">Orders</span>
            </NavLink>

            {/* Floating + Button */}
            {/* <div className="absolute left-1/2 transform -translate-x-1/2 -top-7">
              <NavLink
                to="/add-product"
                className="flex items-center justify-center w-16 h-16 rounded-full shadow-2xl border-4 border-white"
                style={{ backgroundColor: ROYAL_GOLD }}
              >
                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
              </NavLink>
            </div> */}

            {/* My Ads */}
            <NavLink
              to="/myproducts"
              className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
              style={({ isActive }) => ({
                color: isActive ? ROYAL_GOLD : CHARCOAL,
              })}
            >
              <svg
                className="w-5 h-5 mb-1 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2"
                />
              </svg>
              <span className="text-xs">Ads</span>
            </NavLink>

            {/* Wallet */}
            <NavLink
              to="/wallet"
              className="flex flex-col items-center justify-center flex-1 pt-3 pb-5"
              style={({ isActive }) => ({
                color: isActive ? ROYAL_GOLD : CHARCOAL,
              })}
            >
              <svg
                className="w-5 h-5 mb-1 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3v-6a3 3 0 00-3-3H7a3 3 0 00-3 3v6a3 3 0 003 3z"
                />
              </svg>
              <span className="text-xs">Wallet</span>
            </NavLink>
          </div>
        </div>
      </nav>
    </>
  );
}
