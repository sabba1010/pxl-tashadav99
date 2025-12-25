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
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";

// TypeScript Interface for API Response
interface RegisterResponse {
  insertedId?: string;
  error?: string;
  message?: string;
}



interface UserFromDB {
  _id: string;
  email: string;
  name?: string;
}

interface RegisterResponse {
  insertedId?: string;
  message?: string;
  error?: string;
}

// Country list
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
  const { user } = useAuth();

  if (user) {
    toast.info("You are already logged in");
     navigate("/marketplace");
  }

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.dismiss(); // আগের সব টোস্ট ক্লিয়ার করা

    const form = e.currentTarget as HTMLFormElement;

    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value.trim(),
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
      countryCode: selectedCountry.code, // আপনার state থেকে আসছে
      role: "buyer",
      accountCreationDate: new Date(),
      referralCode: Math.random().toString(36).substring(2, 10),
      balance: 0,
    };

    // 2. সাধারণ ভ্যালিডেশন
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error("Please fill out all fields!");
      return;
    }

    if (formData.password.length < 8 || formData.password.length > 30) {
      toast.error("Password must be between 8 and 30 characters.");
      return;
    }

    try {
      // ---------------------------------------------------------
      // STEP 1: ইমেইল ডুপ্লিকেট চেক (GET Request)
      // ---------------------------------------------------------
      // এখানে <UserFromDB[]> ব্যবহার করায় TypeScript আর এরর দিবে না
      const checkRes = await axios.get<UserFromDB[]>(
        "https://vps-backend-server-beta.vercel.app/api/user/getall"
      );
      
      const allUsers = checkRes.data; 

      // চেক করা হচ্ছে ইমেইলটি ডাটাবেসে আছে কিনা
      const isDuplicate = allUsers.some((user) => user.email === formData.email);

      if (isDuplicate) {
        toast.error("⚠️ Email already exists! Please Login.");
        return; // ডুপ্লিকেট হলে এখানেই থেমে যাবে
      }

      // ---------------------------------------------------------
      // STEP 2: রেজিস্ট্রেশন (POST Request)
      // ---------------------------------------------------------
      const res = await axios.post<RegisterResponse>(
        "https://vps-backend-server-beta.vercel.app/api/user/register",
        formData
      );

      const data = res.data;

      // ব্যাকএন্ড যদি 200 দেয় কিন্তু মেসেজে exist থাকে (সেফটি চেক)
      if (
        data.error || 
        (data.message && data.message.toLowerCase().includes("exist"))
      ) {
        toast.error("⚠️ Email already exists! Please Login.");
        return;
      }

      // ---------------------------------------------------------
      // STEP 3: সফল হলে লগইন এবং রিডাইরেক্ট
      // ---------------------------------------------------------
      if (data.insertedId) {
        toast.success("🎉 Account created & Logged in!");
        
        const savedUser = {
          _id: data.insertedId,
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };

        // কুকি সেট (অটো লগইন - ৭ দিন মেয়াদ)
        Cookies.set("aAcctEmpire_2XLD", JSON.stringify(savedUser), {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        form.reset();
        
        // রিডাইরেক্ট
        navigate("/marketplace");
        window.location.reload(); 
      } else {
        toast.error("Registration failed. Try again.");
      }

    } catch (err: any) {
      console.error("Register Error:", err);

      // ---------------------------------------------------------
      // STEP 4: এরর হ্যান্ডলিং (নেটওয়ার্ক বা সার্ভার এরর)
      // ---------------------------------------------------------
      if (err.response) {
        const errorData = err.response.data as RegisterResponse;
        const msg = errorData?.error || errorData?.message || JSON.stringify(errorData);

        if (
          msg.toLowerCase().includes("exist") || 
          msg.toLowerCase().includes("duplicate") ||
          msg.toLowerCase().includes("email")
        ) {
           toast.error("⚠️ This email is already used! Please Login.");
        } else {
           toast.error(`Error: ${msg}`);
        }
      } else {
        toast.error("❌ Network Error! Please check your internet.");
      }
    }
  };
  return (
    <div className="min-h-screen w-full bg-[#111827] relative overflow-hidden">
      {/* Background Animation */}
      <div className="fixed inset-0 -z-10 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 1200 800">
          <motion.line
            x1="100" y1="200" x2="500" y2="600"
            stroke="#f97316" strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.line
            x1="800" y1="100" x2="300" y2="500"
            stroke="#ec4899" strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
          {[...Array(8)].map((_, i) => (
            <motion.circle
              key={i}
              cx={100 + i * 140} cy={200 + (i % 3) * 150} r="4"
              fill="#f97316"
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </svg>
      </div>

      <div className="flex max-w-7xl mx-auto px-6 min-h-screen items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-20 items-center w-full">
          {/* Left Side */}
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
                <span className="text-5xl font-black text-white">AAcctEmpire</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-7xl font-black leading-tight text-white"
              >
                Connect. Trade.<br />
                <span className="text-orange-500">Transform</span><br />
                Your Influence
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8 text-xl text-gray-400"
              >
                Join the future of creator commerce. Trade your social reach like never before.
              </motion.p>
            </div>
          </motion.div>

          {/* Right Side - Form */}
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
                  <span className="text-3xl font-bold text-white">AAcctEmpire</span>
                </div>
              </div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black text-center text-white mb-2 flex items-center justify-center gap-3"
              >
                Welcome to AAcctEmpire
                <motion.span
                  animate={{ rotate: [0, 20, -10, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl"
                ></motion.span>
              </motion.h2>

              <p className="text-center text-gray-400 mb-8">
                Already have an account?{" "}
                <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-400">
                  Login
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-gray-300">Full Name</label>
                  <div className="relative mt-2">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input type="text" required name="name" className="w-full pl-14 pr-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition" placeholder="John Doe" />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-300">Email address</label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input type="email" required name="email" className="w-full pl-14 pr-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition" placeholder="you@example.com" />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-gray-300">Phone Number</label>
                  <div className="relative mt-2">
                    <button type="button" onClick={() => setIsCountryOpen(!isCountryOpen)} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-2 bg-gray-900/80 px-3 py-2 rounded-lg hover:bg-gray-800 transition">
                      <span className="text-2xl">{selectedCountry.flag}</span>
                      <span className="text-sm text-gray-300">{selectedCountry.code}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition ${isCountryOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isCountryOpen && (
                      <div className="absolute left-0 top-full mt-2 w-full bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-20 max-h-64 overflow-y-auto">
                        {countries.map((country) => (
                          <div key={country.code} onClick={() => { setSelectedCountry(country); setIsCountryOpen(false); }} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 cursor-pointer transition">
                            <span className="text-2xl">{country.flag}</span>
                            <span className="text-gray-300 text-sm">{country.label}</span>
                            <span className="ml-auto text-gray-500 text-sm">{country.code}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <Phone className="absolute left-40 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400 z-10" />
                    <input type="tel" required name="phone" className="w-full pl-52 pr-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition" placeholder="801 234 5678" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input type={showPassword ? "text" : "password"} required name="password" className="w-full pl-14 pr-14 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition" placeholder="Create a strong password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Minimum length of 8-30 characters<br />Only lowercase, numeric and symbols allowed</p>
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold text-lg py-5 rounded-2xl shadow-xl shadow-orange-500/30 transition-all mt-8">
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