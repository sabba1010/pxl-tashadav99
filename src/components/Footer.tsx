// src/components/Footer.tsx
import { NavLink } from "react-router-dom";
import headerlogo from "../assets/headerlogo.png";
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

  // Replace these with your actual social media URLs
  const socialLinks = [
    { Icon: Facebook, url: "https://facebook.com/yourpage", label: "Facebook" },
    { Icon: Youtube, url: "https://youtube.com/yourchannel", label: "YouTube" },
    { Icon: Twitter, url: "https://twitter.com/yourhandle", label: "Twitter" },
    { Icon: Instagram, url: "https://instagram.com/yourprofile", label: "Instagram" },
  ];

  return (
    <footer className={`w-full ${isDark ? "bg-gray-950 text-gray-300" : "bg-gray-50 text-gray-700"} border-t ${isDark ? "border-gray-800" : "border-gray-200"}`}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <NavLink to="/" aria-label="Home">
                <img src={headerlogo} alt="AcctEmpire" className="h-20 md:h-24 lg:h-28 w-auto" />
              </NavLink>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Buy and sell verified social media and digital accounts securely — fast delivery, escrow protection, and dedicated support.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4 pt-4">
              {socialLinks.map(({ Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
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
                <li key={link.to} className="group">
                  <NavLink
                    to={link.to}
                    className={`${linkHoverClass} ${isDark ? "text-gray-400" : "text-gray-600"} block`}
                  >
                    {link.label}
                  </NavLink>
                  <div className="h-px bg-gradient-to-r from-[#33ac6f]/20 to-transparent w-0 group-hover:w-full transition-all duration-500 mt-1" />
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
                <a 
                  href="mailto:support@acctempire.com" 
                  className={`hover:text-[#33ac6f] ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  tajudeentoyeeb095@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#33ac6f] mt-0.5 flex-shrink-0" />
                <a 
                  href="tel:+8801234567890" 
                  className={`hover:text-[#33ac6f] ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  +1234567890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#33ac6f] mt-0.5 flex-shrink-0" />
                <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                  your location here
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={sectionTitleClass}>Stay Updated</h3>
            <p className={`mt-4 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Get the latest deals and security tips straight to your inbox.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              {/* <input
                type="email"
                placeholder="Your email"
                className={`px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#33ac6f] focus:ring-offset-2 ${
                  isDark 
                    ? "bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-offset-gray-950" 
                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              /> */}
              <button className="px-6 py-3 bg-[#33ac6f] hover:bg-[#2a9a5f] text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-12 pt-8 border-t ${isDark ? "border-gray-800" : "border-gray-200"} flex flex-col sm:flex-row justify-between items-center gap-4 text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}>
          <p>© {currentYear} AcctEmpire. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/terms" className={linkHoverClass} target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>
            <NavLink to="/privacy" className={linkHoverClass}>
              Privacy Policy
            </NavLink>
            <a href="/cookies" className={linkHoverClass} target="_blank" rel="noopener noreferrer">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}