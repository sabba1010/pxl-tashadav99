import React from "react";
import { Link } from "react-router-dom";
import { Home, FileText, Cookie, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  const quickLinks = [
    { to: "/", icon: Home, label: "Home", description: "Back to safety" },
    { to: "/terms", icon: FileText, label: "Terms", description: "Legal stuff" },
    { to: "/cookie-policy", icon: Cookie, label: "Cookies", description: "We respect your data" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl"
      >
        <div className="text-center">
          {/* Big Creative 404 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <h1 className="text-8xl md:text-9xl lg:text-[10rem] font-black tracking-tighter">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                4
              </span>
              <span className="text-gray-800">0</span>
              <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                4
              </span>
            </h1>
            <p className="text-2xl md:text-4xl font-bold text-gray-700 mt-4">
              Oops! Page not found
            </p>
            <p className="text-lg md:text-xl text-gray-600 mt-3 max-w-2xl mx-auto">
              Looks like you've ventured into the digital wilderness. Don't worry — let's get you back on track.
            </p>
          </motion.div>

          {/* Action Buttons - Big & Modern */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/"
              className="group inline-flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all duration-300"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              Return Home
            </Link>

            <div className="flex gap-3">
              {quickLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className="flex flex-col items-center gap-2 p-5 bg-white/80 backdrop-blur-lg rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 min-w-32"
                  >
                    <link.icon className="w-8 h-8 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-800">{link.label}</span>
                    <span className="text-xs text-gray-500">{link.description}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Fun footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 text-sm text-gray-500"
          >
            If you think this is a mistake, feel free to contact support.
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;