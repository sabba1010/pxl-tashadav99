// src/components/Footer.tsx
import React from "react";
import { NavLink } from "react-router-dom";

type Props = {
  theme?: "dark" | "light";
};

export default function Footer({ theme = "dark" }: Props) {
  const isDark = theme === "dark";

  return (
    <footer
      className={`w-full ${isDark ? "bg-gray-900 text-gray-300 border-t border-gray-800" : "bg-white text-gray-800 border-t border-gray-200"} py-6`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        {/* Grid: 1 column on xs, 3 cols on sm+ but compact gaps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 items-start">
          {/* Brand */}
          <div>
            <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-1`}>CCTBazaar</h2>
            <p className="text-sm leading-tight">
              Your trusted marketplace for CCTV cameras, NVRs, DVRs & security solutions.
            </p>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-2`}>Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <NavLink to="/" className="hover:text-orange-400">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/marketplace" className="hover:text-orange-400">
                  Marketplace
                </NavLink>
              </li>
              <li>
                <NavLink to="/purchases" className="hover:text-orange-400">
                  My Purchase
                </NavLink>
              </li>
              <li>
                <NavLink to="/wallet" className="hover:text-orange-400">
                  Wallet
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"} mb-2`}>Contact</h3>
            <ul className="text-sm space-y-1">
              <li className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>Email: support@cctbazaar.com</li>
              <li className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>Phone: +880 1234-567890</li>
              <li className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>Address: Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        {/* Bottom row: compact, center on small screens */}
        <div className={`mt-5 pt-4 text-center text-xs ${isDark ? "text-gray-500" : "text-gray-500"} border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          © {new Date().getFullYear()} CCTBazaar — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
