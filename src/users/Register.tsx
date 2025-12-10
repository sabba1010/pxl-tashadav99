import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

// Country list with real flag emojis
const countries = [
  { code: "+234", flag: "NG", label: "Nigeria" },
  { code: "+1", flag: "US", label: "United States" },
  { code: "+44", flag: "GB", label: "United Kingdom" },
  { code: "+91", flag: "IN", label: "India" },
  { code: "+254", flag: "KE", label: "Kenya" },
  { code: "+233", flag: "GH", label: "Ghana" },
  { code: "+27", flag: "ZA", label: "South Africa" },
  { code: "+234", flag: "NG", label: "Nigeria (Default)" },
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (
        form.elements.namedItem("email") as HTMLInputElement
      ).value.trim(),
      phone: (
        form.elements.namedItem("phone") as HTMLInputElement
      ).value.trim(),
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      countryCode: selectedCountry.code,
      role: "buyer",
      accountCreationDate: new Date(),
      referralCode: Math.random().toString(36).substring(2, 10),
    };

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      toast.error("Please fill out all fields!");
      return;
    }

    if (formData.password.length < 8 || formData.password.length > 30) {
      toast.error("Password must be between 8 and 30 characters.");
      return;
    }

    try {
      const res = await axios.post<{ insertedId: string }>(
        "http://localhost:3200/api/user/register",
        formData
      );
      if (res?.data?.insertedId) {
        toast.success("🎉 User registered successfully!");
        navigate("/login");
      }

      form.reset();
    } catch (err: any) {
      if (err.response) {
        toast.error("Error: " + err.response.data.error);
      } else {
        toast.error("❌ Something went wrong! Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#111827] relative overflow-hidden">
      {/* Animated Background Network */}
      <div className="fixed inset-0 -z-10 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 800">
          <motion.line
            x1="100"
            y1="200"
            x2="500"
            y2="600"
            stroke="#f97316"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.line
            x1="800"
            y1="100"
            x2="300"
            y2="500"
            stroke="#ec4899"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
          {[...Array(8)].map((_, i) => (
            <motion.circle
              key={i}
              cx={100 + i * 140}
              cy={200 + (i % 3) * 150}
              r="4"
              fill="#f97316"
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      </div>

      <div className="flex max-w-7xl mx-auto px-6 min-h-screen items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-20 items-center w-full">
          {/* Left Hero */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 mb-12"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/50">
                  <Sparkles className="w-9 h-9 text-white" />
                </div>
                <span className="text-5xl font-black text-white">
                  Acctempire
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-7xl font-black leading-tight text-white"
              >
                Connect. Trade.
                <br />
                <span className="text-orange-500">Transform</span>
                <br />
                Your Influence
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8 text-xl text-gray-400"
              >
                Join the future of creator commerce. Trade your social reach
                like never before.
              </motion.p>
            </div>
          </motion.div>

          {/* Register Form */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="w-full max-w-lg mx-auto"
          >
            <div className="bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-10 shadow-2xl">
              {/* Mobile Logo */}
              <div className="flex lg:hidden justify-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-white">
                    Acctempire
                  </span>
                </div>
              </div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black text-center text-white mb-2 flex items-center justify-center gap-3"
              >
                Welcome to Acctempire
                <motion.span
                  animate={{ rotate: [0, 20, -10, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl"
                ></motion.span>
              </motion.h2>

              <p className="text-center text-gray-400 mb-8">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-orange-500 font-semibold hover:text-orange-400"
                >
                  Login
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Full Name
                  </label>
                  <div className="relative mt-2">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input
                      type="text"
                      required
                      name="name"
                      className="w-full pl-14 pr-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Email address
                  </label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input
                      type="email"
                      required
                      name="email"
                      className="w-full pl-14 pr-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Phone Number with Real Flag Dropdown */}
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Phone Number
                  </label>
                  <div className="relative mt-2">
                    {/* Country Selector Button */}
                    <button
                      type="button"
                      onClick={() => setIsCountryOpen(!isCountryOpen)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2 bg-gray-900/80 px-3 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      <span className="text-2xl">{selectedCountry.flag}</span>
                      <span className="text-sm text-gray-300">
                        {selectedCountry.code}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition ${
                          isCountryOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown */}
                    {isCountryOpen && (
                      <div className="absolute left-0 top-full mt-2 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-20 max-h-64 overflow-y-auto">
                        {countries.map((country) => (
                          <div
                            key={country.code}
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsCountryOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer transition"
                          >
                            <span className="text-2xl">{country.flag}</span>
                            <span className="text-gray-300 text-sm">
                              {country.label}
                            </span>
                            <span className="ml-auto text-gray-500 text-sm">
                              {country.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Phone Icon */}
                    <Phone className="absolute left-40 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 z-10" />

                    {/* Phone Input */}
                    <input
                      type="tel"
                      required
                      name="phone"
                      className="w-full pl-52 pr-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition"
                      placeholder="801 234 5678"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      name="password"
                      className="w-full pl-14 pr-14 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Minimum length of 8-30 characters
                    <br />
                    Only lowercase, numeric and symbols allowed
                  </p>
                </div>

                {/* Terms Checkbox */}
                {/* <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500 bg-gray-800 border-gray-600"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-400">
                    By clicking on this, I give consent to Acctempire Privacy
                    Policy and Terms of Use
                  </label>
                </div> */}

                {/* Sign Up Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold text-lg py-5 rounded-2xl shadow-xl shadow-orange-500/30 transition-all mt-8"
                >
                  Sign up
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
