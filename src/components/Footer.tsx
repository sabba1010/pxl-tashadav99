// src/components/Footer.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Youtube, 
  Twitter,
  Instagram 
} from "lucide-react";

type Props = {
  theme?: "dark" | "light";
};

export default function Footer({ theme = "dark" }: Props) {
  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();

  const linkHoverClass = "hover:text-[#33ac6f] transition-colors duration-300";
  const sectionTitleClass = `text-sm font-bold uppercase tracking-wider ${isDark ? "text-[#e6c06c]" : "text-[#e6c06c]"}`;

  return (
    <footer className={`w-full ${isDark ? "bg-gray-950 text-gray-300" : "bg-gray-50 text-gray-700"} border-t ${isDark ? "border-gray-800" : "border-gray-200"}`}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-5">
            <h2 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              AcctEmpire
            </h2>
            <p className="text-sm leading-relaxed max-w-xs">
              Your trusted marketplace for premium CCTV cameras, NVRs, DVRs, and complete security solutions in Bangladesh.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4 pt-4">
              {[Facebook, Youtube, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className={`p-2.5 rounded-lg ${isDark ? "bg-gray-800 hover:bg-[#33ac6f]/10" : "bg-white hover:bg-[#33ac6f]/8"} 
                  border ${isDark ? "border-gray-700" : "border-gray-300"} 
                  transition-all duration-300 group`}
                >
                  <Icon className={`w-5 h-5 ${isDark ? "text-gray-400 group-hover:text-[#33ac6f]" : "text-gray-600 group-hover:text-[#33ac6f]"} transition-colors`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={sectionTitleClass}>Quick Links</h3>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/marketplace", label: "Marketplace" },
                { to: "/purchases", label: "My Purchases" },
                { to: "/wallet", label: "Wallet" },
                { to: "/referral", label: "Referral Program" },
                { to: "/privacy", label: "Privacy Policy" },
              ].map((link) => (
                <li key={link.to}>
                  <NavLink
                      to={link.to}
                      className={`${linkHoverClass} ${isDark ? "text-gray-400" : "text-gray-600"} block`}
                    >
                    {link.label}
                  </NavLink>
                    <div className="h-px bg-gradient-to-r from-[#33ac6f]/20 to-transparent w-0 group-hover:w-full transition-all duration-500" />
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={sectionTitleClass}>Get in Touch</h3>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#33ac6f] mt-0.5 flex-shrink-0" />
                <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                  <a href="mailto:support@aAcctEmpire.com" className="hover:text-[#33ac6f]">support@aAcctEmpire.com</a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#33ac6f] mt-0.5 flex-shrink-0" />
                <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                  <a href="tel:+8801234567890" className="hover:text-[#33ac6f]">+880 1234-567890</a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#33ac6f] mt-0.5 flex-shrink-0" />
                <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                  Dhaka, Bangladesh
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter (Bonus Modern Touch) */}
          <div>
            <h3 className={sectionTitleClass}>Stay Updated</h3>
            <p className={`mt-4 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Get the latest deals and security tips straight to your inbox.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email"
                className={`px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#33ac6f] focus:ring-offset-2 ${
                  isDark 
                    ? "bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-offset-gray-950" 
                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />
              <button className="px-6 py-3 bg-[#33ac6f] hover:bg-[#2a9a5f] text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-12 pt-8 border-t ${isDark ? "border-gray-800" : "border-gray-200"} flex flex-col sm:flex-row justify-between items-center gap-4 text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>
          <p>© {currentYear} AAcctEmpire. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className={linkHoverClass}>Terms of Service</a>
            <a href="/privacy" className={linkHoverClass}>Privacy Policy</a>
            <a href="#" className={linkHoverClass}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}