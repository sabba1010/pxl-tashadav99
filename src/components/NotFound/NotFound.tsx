import React from "react";
import { Link } from "react-router-dom";
import { Home, FileText, Cookie } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f8fafc] to-white py-12 px-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-[#e6c06c]/10 flex items-center justify-center text-[#e6c06c]">
            <span className="text-3xl font-extrabold">404</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#00183b]">Page Not Found</h1>
            <p className="mt-2 text-gray-600 max-w-xl">The page you are looking for doesn't exist. You can return home or visit our policy pages below.</p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link to="/" className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:shadow-md transition">
                <Home className="w-5 h-5 text-[#33ac6f]" />
                <div>
                  <div className="text-sm font-semibold">Go Home</div>
                  <div className="text-xs text-gray-500">Return to the homepage</div>
                </div>
              </Link>

              <Link to="/terms" className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:shadow-md transition">
                <FileText className="w-5 h-5 text-[#e6c06c]" />
                <div>
                  <div className="text-sm font-semibold">Terms of Service</div>
                  <div className="text-xs text-gray-500">Site terms and legal info</div>
                </div>
              </Link>

              <Link to="/cookie-policy" className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:shadow-md transition">
                <Cookie className="w-5 h-5 text-[#3b82f6]" />
                <div>
                  <div className="text-sm font-semibold">Cookie Policy</div>
                  <div className="text-xs text-gray-500">How we use cookies</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
