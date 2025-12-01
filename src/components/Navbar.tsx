import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const [dark, setDark] = useState<boolean>(false);

  // typed ref so TypeScript knows .contains() exists
  const ddRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (ddRef.current && !ddRef.current.contains(target)) {
        setOpen(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <header
      className={`w-full bg-white ${dark ? "dark bg-gray-900" : ""} shadow-sm`}
    >
      <nav className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: logo */}
          <div className="flex items-center gap-4">
            <NavLink to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="logoa" className="h-8 w-auto" />
              <span className="hidden sm:inline font-semibold text-gray-800 dark:text-gray-100">
                Webite Name
              </span>
            </NavLink>
          </div>

          {/* Center: links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink
              to="/marketplace"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 font-medium"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              Marketplace
            </NavLink>

            <NavLink
              to="/purchases"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 font-medium"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              My Purchase
            </NavLink>

            <NavLink
              to="/wallet"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 font-medium"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              Wallet
            </NavLink>
            <NavLink
              to="/add-product"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 font-medium"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              Add Product
            </NavLink>
            <NavLink
              to="/buyer-dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-orange-500 font-medium"
                  : "text-gray-700 hover:text-gray-900"
              }
            >
              Buyer Dashboard
            </NavLink>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-block bg-orange-500 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:opacity-95">
              Sell Product
            </button>

            <button
              aria-label="notifications"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z"
                />
              </svg>
            </button>

            <button
              aria-label="cart"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600 dark:text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 5h13"
                />
              </svg>
            </button>

            {/* avatar + dropdown */}
            <div className="relative" ref={ddRef}>
              <button
                onClick={() => setOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={open}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-200">
                  A
                </div>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-3 z-50">
                  <div className="px-4 pb-2">
                    <div className="font-semibold text-gray-800 dark:text-gray-100">
                      User
                    </div>
                    <div className="text-xs text-gray-500">abc@gmail.com</div>
                  </div>

                  <hr className="my-2 border-gray-100 dark:border-gray-700" />

                  <ul className="flex flex-col gap-1 px-2">
                    <li>
                      <NavLink
                        to="/referral"
                        className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-600 dark:text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                          Referral
                        </span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/account"
                        className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-600 dark:text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3"
                          />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                          Account settings
                        </span>
                      </NavLink>
                    </li>

                    <li>
                      <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-600 dark:text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7"
                          />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                          Log out
                        </span>
                      </button>
                    </li>

                    <li className="px-3 py-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-gray-600 dark:text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 3v1m0 16v1m8.66-11H20M3.34 12H4m13.02 6.36l-.7.7M6.36 6.34l-.7.7m12.02 6.02l-.7-.7M6.36 17.66l-.7-.7"
                          />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                          Light Mode
                        </span>
                        <input
                          type="checkbox"
                          checked={!dark}
                          onChange={() => setDark((d) => !d)}
                          className="ml-auto"
                        />
                      </label>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
