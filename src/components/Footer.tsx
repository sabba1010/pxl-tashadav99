import React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-8 mt-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">CCTBazaar</h2>
            <p className="text-sm text-gray-400">
              Your trusted marketplace for CCTV cameras, NVRs, DVRs & security solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-md font-semibold text-white mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><NavLink to="/" className="hover:text-orange-400">Home</NavLink></li>
              <li><NavLink to="/marketplace" className="hover:text-orange-400">Marketplace</NavLink></li>
              <li><NavLink to="/purchases" className="hover:text-orange-400">My Purchase</NavLink></li>
              <li><NavLink to="/wallet" className="hover:text-orange-400">Wallet</NavLink></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-md font-semibold text-white mb-2">Contact</h3>
            <ul className="text-sm space-y-1 text-gray-400">
              <li>Email: support@cctbazaar.com</li>
              <li>Phone: +880 1234-567890</li>
              <li>Address: Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-800">
          © {new Date().getFullYear()} CCTBazaar — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
