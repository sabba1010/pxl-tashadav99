// src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false); // Avatar dropdown
  const [dark, setDark] = useState(false); // Dark mode
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile menu

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close avatar dropdown when clicking outside
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

  // Optional: Apply dark mode to body (uncomment if you want global dark mode)
  // useEffect(() => {
  //   if (dark) document.documentElement.classList.add("dark");
  //   else document.documentElement.classList.remove("dark");
  // }, [dark]);

  // Brand colors
  const EMPIRE_BLUE = "#0A1A3A";
  const ROYAL_GOLD = "#D4A643";
  const CHARCOAL = "#111111";
  const EMERALD = "#1BC47D";
  const CLEAN_WHITE = "#FFFFFF";

  return (
    <header
      className={`w-full bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800`}
      style={{ backgroundColor: CLEAN_WHITE }}
    >
      <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-9 w-auto" />
              <span
                className="hidden sm:inline font-bold text-xl"
                style={{ color: EMPIRE_BLUE }}
              >
                Tashadav99
              </span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavLink
              to="/marketplace"
              className={({ isActive }) =>
                `font-medium transition ${
                  isActive
                    ? ""
                    : ""
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? ROYAL_GOLD : CHARCOAL,
              })}
            >
              Marketplace
            </NavLink>


           <NavLink
              to="/orders"
              className={({ isActive }) =>
                `font-medium transition ${
                  isActive
                    ? ""
                    : ""
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? ROYAL_GOLD : CHARCOAL,
              })}
            >
              Orders
            </NavLink>

          <NavLink
              to="/my-ads"
              className={({ isActive }) =>
                `font-medium transition ${
                  isActive
                    ? ""
                    : ""
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? ROYAL_GOLD : CHARCOAL,
              })}
            >
              My Ads
            </NavLink>


            <NavLink
              to="/purchases"
              className={({ isActive }) =>
                `font-medium transition ${
                  isActive
                    ? ""
                    : ""
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? ROYAL_GOLD : CHARCOAL,
              })}
            >
              My Purchases
            </NavLink>
            <NavLink
              to="/wallet"
              className={({ isActive }) =>
                `font-medium transition ${
                  isActive
                    ? ""
                    : ""
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? ROYAL_GOLD : CHARCOAL,
              })}
            >
              Wallet
            </NavLink>
            <NavLink
              to="/buyer-dashboard"
              className={({ isActive }) =>
                `font-medium transition hidden ${
                  isActive
                    ? ""
                    : ""
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? ROYAL_GOLD : CHARCOAL,
              })}
            >
              Buyer Dashboard
            </NavLink>
            <NavLink
              to="/add-product"
              className="px-6 py-2.5 rounded-lg font-medium transition shadow-sm"
              style={{
                backgroundColor: "#33ac6f",
                color: "white",
              }}
            >
              Sell Product
            </NavLink>
          </div>

          {/* Right Side: Icons + Avatar */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Notifications"
              title="Notifications"
              style={{ color: CHARCOAL }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: EMPIRE_BLUE }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z"
                />
              </svg>
            </button>

            {/* Cart */}
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Cart"
              title="Cart"
              style={{ color: CHARCOAL }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: EMPIRE_BLUE }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7.48 7h9.02l1.5 9H5.98l1.5-9zM7 13l-2 5h13l-2-5"
                />
              </svg>
            </button>

            {/* Avatar Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{
                    background: `linear-gradient(90deg, ${EMPIRE_BLUE} 0%, ${ROYAL_GOLD} 100%)`,
                    color: CLEAN_WHITE,
                  }}
                >
                  A
                </div>
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div
                  className="absolute right-0 mt-2 w-80 rounded-lg shadow-xl border border-gray-300 overflow-hidden z-50"
                  style={{ backgroundColor: CLEAN_WHITE }}
                >
                  {/* Header Section */}
                  <div className="px-6 py-5 border-b border-gray-200" style={{ backgroundColor: "#F9FAFB" }}>
                    <div className="font-semibold text-base" style={{ color: EMPIRE_BLUE }}>
                      Legityankeelogshub
                    </div>
                    <div className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
                      tajudeerrtoyeeb095@gmail.com
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="px-6 py-3 border-b border-gray-100">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded" 
                      style={{ backgroundColor: "#FEF3C7", color: "#E5BE68" }}>
                      Become Verified
                    </span>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <NavLink
                      to="/account"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition"
                      style={{ color: CHARCOAL }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">My Account Dashboard</span>
                    </NavLink>

                    <NavLink
                      to="/referral"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition"
                      style={{ color: CHARCOAL }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      <span className="text-sm font-medium">Referral</span>
                    </NavLink>

                    <NavLink
                      to="/plans"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition"
                      style={{ color: CHARCOAL }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">Plans</span>
                    </NavLink>

                    <NavLink
                      to="/purchases"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition"
                      style={{ color: CHARCOAL }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="text-sm font-medium">My Purchase</span>
                    </NavLink>

                    <NavLink
                      to="/account-settings"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition"
                      style={{ color: CHARCOAL }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-medium">Account settings</span>
                    </NavLink>

                    <button
                      className="w-full flex items-center gap-3 px-6 py-3 hover:bg-yellow-50 transition text-left"
                      style={{ color: "#E5BE68" }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-sm font-medium">Log out</span>
                    </button>
                  </div>

                  {/* Dark Mode Toggle */}
                  <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between" style={{ backgroundColor: "#F9FAFB" }}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 015.646 5.646 9.001 9.001 0 0120.354 15.354z" />
                      </svg>
                      <span className="text-sm font-medium" style={{ color: CHARCOAL }}>Dark Mode</span>
                    </label>
                    <input
                      type="checkbox"
                      checked={dark}
                      onChange={() => setDark(!dark)}
                      className="w-5 h-5 rounded cursor-pointer"
                      style={{ accentColor: ROYAL_GOLD }}
                    />
                  </div>

                  {/* Sell Product Button */}
                  <div className="px-6 py-3">
                    <button
                      className="w-full py-2.5 rounded-lg font-semibold text-center transition text-white"
                      style={{ backgroundColor: "#33ac6f" }}
                    >
                      Sell Product
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: EMPIRE_BLUE }}
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
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: EMPIRE_BLUE }}
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
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4" style={{ backgroundColor: CLEAN_WHITE }}>
            <div className="flex flex-col gap-2 px-4">
              <NavLink
                to="/marketplace"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-left"
                style={{ color: CHARCOAL }}
              >
                Marketplace
              </NavLink>
              <NavLink
                to="/purchases"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-left"
                style={{ color: CHARCOAL }}
              >
                My Purchases
              </NavLink>
              <NavLink
                to="/wallet"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-left"
                style={{ color: CHARCOAL }}
              >
                Wallet
              </NavLink>
              <NavLink
                to="/add-product"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 rounded-lg font-medium text-center transition "
                style={{ backgroundColor: "#33ac6f", color: CHARCOAL }}
              >
                Sell Product
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
