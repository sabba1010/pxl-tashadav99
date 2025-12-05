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
                backgroundColor: ROYAL_GOLD,
                color: CHARCOAL,
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
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  style={{ backgroundColor: CLEAN_WHITE, color: CHARCOAL }}
                >
                  <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="font-bold" style={{ color: EMPIRE_BLUE }}>
                      John Doe
                    </div>
                    <div className="text-sm" style={{ color: "#6B7280" }}>
                      john@example.com
                    </div>
                  </div>

                  <div className="py-2">
                    <NavLink
                      to="/account"
                      onClick={() => setOpen(false)}
                      className="block px-5 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      style={{ color: CHARCOAL }}
                    >
                      Account Settings
                    </NavLink>
                    <NavLink
                      to="/referral"
                      onClick={() => setOpen(false)}
                      className="block px-5 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                      style={{ color: CHARCOAL }}
                    >
                      Referral Program
                    </NavLink>
                    <button
                      className="w-full text-left px-5 py-3 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      style={{ color: "#DC2626" }}
                    >
                      Log out
                    </button>
                  </div>

                  <ul className="flex flex-col gap-1 px-2">
                    <li>
                      <NavLink
                        to="/referral"
                        className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                        style={{ color: CHARCOAL }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ color: EMPIRE_BLUE }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        <span className="text-sm">Referral</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/account"
                        className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                        style={{ color: CHARCOAL }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ color: EMPIRE_BLUE }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3"
                          />
                        </svg>
                        <span className="text-sm">Account settings</span>
                      </NavLink>
                    </li>

                    <li>
                      <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700" style={{ color: CHARCOAL }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ color: EMPIRE_BLUE }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7"
                          />
                        </svg>
                        <span className="text-sm">Log out</span>
                      </button>
                    </li>

                    {/* <li className="px-3 py-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ color: EMPIRE_BLUE }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m8.66-11H20M3.34 12H4m13.02 6.36l-.7.7M6.36 6.34l-.7.7m12.02 6.02l-.7-.7M6.36 17.66l-.7-.7"
                          />
                        </svg>
                        <span className="text-sm">Light Mode</span>
                        <input
                          type="checkbox"
                          checked={!dark}
                          onChange={() => setDark((d) => !d)}
                          className="ml-auto"
                          style={{ accentColor: ROYAL_GOLD }}
                        />
                      </label>
                    </li> */}
                    {/* <li>
                      <NavLink
                        className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                        to={"/admin-dashboard"}
                        style={{ color: CHARCOAL }}
                      >
                        Admin Dashboard
                      </NavLink>
                    </li> */}
                  </ul>
                  <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700">
                    <label className="flex items-center justify-between cursor-pointer">
                      {/* <span className="text-sm font-medium" style={{ color: CHARCOAL }}>
                        Dark Mode
                      </span> */}
                      <input
                        type="checkbox"
                        checked={dark}
                        onChange={() => setDark(!dark)}
                        className="w-5 h-5 rounded focus:ring cursor-pointer"
                        style={{ accentColor: ROYAL_GOLD }}
                      />
                    </label>
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
                className="py-3 px-4 rounded-lg font-medium text-center transition"
                style={{ backgroundColor: ROYAL_GOLD, color: CHARCOAL }}
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
