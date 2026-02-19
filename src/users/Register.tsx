
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   Eye,
//   EyeOff,
//   Mail,
//   Lock,
//   User,
//   Phone,
//   Sparkles,
//   ChevronDown,
// } from "lucide-react";
// import axios from "axios";
// import { toast } from "sonner";
// import Cookies from "js-cookie";
// import { useAuth } from "../context/AuthContext";

// // --- TypeScript টাইপ ঠিক করার জন্য ইন্টারফেস ---
// interface RegisterResponse {
//   insertedId: string;
// }

// const countries = [
//   { code: "+234", flag: "NG", label: "Nigeria" },
//   { code: "+1", flag: "US", label: "United States" },
//   { code: "+44", flag: "GB", label: "United Kingdom" },
//   { code: "+91", flag: "IN", label: "India" },
//   { code: "+254", flag: "KE", label: "Kenya" },
//   { code: "+233", flag: "GH", label: "Ghana" },
//   { code: "+27", flag: "ZA", label: "South Africa" },
//   { code: "+880", flag: "BD", label: "Bangladesh" },
// ];

// const Register = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [isCountryOpen, setIsCountryOpen] = useState(false);
//   const [selectedCountry, setSelectedCountry] = useState(countries[0]);
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   // URL থেকে রেফার কোড ধরা
//   const urlParams = new URLSearchParams(window.location.search);
//   const refFromUrl = urlParams.get("ref");

//   if (user) {
//     navigate("/marketplace");
//   }

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     toast.dismiss();

//     const form = e.currentTarget;

//     const formData = {
//       name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
//       email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
//       phone: (form.elements.namedItem("phone") as HTMLInputElement).value.trim(),
//       password: (form.elements.namedItem("password") as HTMLInputElement).value,
//       countryCode: selectedCountry.code,
//       role: "buyer",
//       accountCreationDate: new Date(),
//       // ইউজারের নিজস্ব ইউনিক রেফারাল কোড (প্রতিটি ইউজারের আলাদা হবে)
//       referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
//       referredBy: refFromUrl || null,
//       balance: 0,
//       salesCredit: 10,
//       subscribedPlan: "free",
//     };

//     try {
//       // <RegisterResponse> দিয়ে TypeScript এরর ফিক্স করা হয়েছে
//       const res = await axios.post<RegisterResponse>(
//         "https://tasha-vps-backend-2.onrender.com/api/user/register",
//         formData
//       );

//       if (res.data && res.data.insertedId) {
//         toast.success("🎉 Account created successfully!");

//         const savedUser = {
//           _id: res.data.insertedId,
//           name: formData.name,
//           email: formData.email,
//           role: formData.role,
//         };

//         Cookies.set("aAcctEmpire_2XLD", JSON.stringify(savedUser), {
//           expires: 7,
//           secure: true,
//           sameSite: "strict",
//         });

//         form.reset();
//         navigate("/marketplace");
//         window.location.reload();
//       }
//     } catch (err: any) {
//       toast.error("Registration failed. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#111827] relative overflow-hidden">
//       {/* Background Animation - আগের ডিজাইন অনুযায়ী */}
//       <div className="fixed inset-0 -z-10 opacity-10 pointer-events-none">
//         <svg className="w-full h-full" viewBox="0 0 1200 800">
//           <motion.line
//             x1="100" y1="200" x2="500" y2="600"
//             stroke="#f97316" strokeWidth="1.5"
//             initial={{ pathLength: 0 }}
//             animate={{ pathLength: 1, opacity: [0.3, 0.8, 0.3] }}
//             transition={{ duration: 8, repeat: Infinity }}
//           />
//           <motion.line
//             x1="800" y1="100" x2="300" y2="500"
//             stroke="#ec4899" strokeWidth="1.5"
//             initial={{ pathLength: 0 }}
//             animate={{ pathLength: 1, opacity: [0.3, 0.7, 0.3] }}
//             transition={{ duration: 10, repeat: Infinity, delay: 1 }}
//           />
//         </svg>
//       </div>

//       <div className="flex max-w-7xl mx-auto px-6 min-h-screen items-center justify-center">
//         <div className="grid lg:grid-cols-2 gap-20 items-center w-full">
//           {/* Left Side Content */}
//           <motion.div initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
//             <div className="relative">
//               <div className="flex items-center gap-4 mb-12">
//                 <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
//                   <Sparkles className="w-9 h-9 text-white" />
//                 </div>
//                 <span className="text-5xl font-black text-white">AAcctEmpire</span>
//               </div>
//               <h1 className="text-7xl font-black leading-tight text-white">
//                 Connect. Trade. <br /> <span className="text-orange-500">Transform</span> <br /> Your Influence
//               </h1>
//             </div>
//           </motion.div>

//           {/* Registration Form */}
//           <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mx-auto bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-10 shadow-2xl">
//             <h2 className="text-4xl font-black text-center text-white mb-2">Welcome</h2>
//             <p className="text-center text-gray-400 mb-8">
//               Already have an account? <Link to="/login" className="text-orange-500 font-semibold">Login</Link>
//             </p>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <label className="text-sm font-medium text-gray-300">Full Name</label>
//                 <div className="relative mt-2">
//                   <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
//                   <input type="text" name="name" required className="w-full pl-14 pr-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white outline-none focus:border-orange-500 transition" />
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-300">Email address</label>
//                 <div className="relative mt-2">
//                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
//                   <input type="email" name="email" required className="w-full pl-14 pr-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white outline-none focus:border-orange-500 transition" />
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-300">Phone Number</label>
//                 <div className="relative mt-2 flex gap-2">
//                   <button type="button" onClick={() => setIsCountryOpen(!isCountryOpen)} className="bg-gray-800 px-4 rounded-xl text-white flex items-center gap-2">
//                     {selectedCountry.code} <ChevronDown className="w-4 h-4" />
//                   </button>
//                   <div className="relative flex-1">
//                     <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
//                     <input type="tel" name="phone" required className="w-full pl-14 pr-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white outline-none" />
//                   </div>
//                   {isCountryOpen && (
//                     <div className="absolute top-full left-0 w-full mt-2 bg-gray-900 text-white border border-gray-700 rounded-xl z-50 max-h-40 overflow-y-auto">
//                       {countries.map((c) => (
//                         <div key={c.code} onClick={() => { setSelectedCountry(c); setIsCountryOpen(false); }} className="p-3 hover:bg-gray-800 cursor-pointer">{c.label} ({c.code})</div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-medium text-gray-300">Password</label>
//                 <div className="relative mt-2">
//                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
//                   <input type={showPassword ? "text" : "password"} name="password" required className="w-full pl-14 pr-14 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white outline-none focus:border-orange-500" />
//                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//               </div>

//               <button type="submit" className="w-full bg-orange-500 text-white font-bold text-lg py-5 rounded-2xl shadow-xl hover:bg-orange-600 transition-all mt-4">
//                 Sign Up
//               </button>
//             </form>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;


import React, { useState, useMemo } from "react";
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
import countryCodes from "../assets/Country/CountryCodes.json";
import countryFlags from "../assets/Country/country-flag.json";

// --- TypeScript টাইপ ---
interface RegisterResponse {
  insertedId: string;
}

interface Country {
  code: string;
  dial_code: string;
  name: string;
}

interface CountryFlag {
  flag: string;
  country: string;
  code: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [manualRefCode, setManualRefCode] = useState(""); // ম্যানুয়াল ইনপুটের জন্য

  const navigate = useNavigate();
  const { user } = useAuth();

  // URL থেকে রেফার কোড ধরা
  const urlParams = new URLSearchParams(window.location.search);
  const refFromUrl = urlParams.get("ref");

  // Merge country codes and flags
  const mergedCountries = useMemo(() => {
    if (!countryCodes || !Array.isArray(countryCodes)) return [];
    return (countryCodes as Country[])
      .filter((country) => country?.code && country?.dial_code && country?.name)
      .map((country) => {
        const flagData = (countryFlags as CountryFlag[]).find(
          (flag) => flag?.code?.toLowerCase() === country.code.toLowerCase()
        );
        return {
          code: country.code,
          dial_code: country.dial_code,
          label: country.name,
          flag: flagData?.flag || "🌍",
        };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const [selectedCountry, setSelectedCountry] = useState(
    mergedCountries.length > 0 ? mergedCountries[0] : {
      code: "US",
      dial_code: "+1",
      label: "United States",
      flag: "🌍",
    }
  );

  if (user) { navigate("/marketplace"); }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.dismiss();

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (!name || !email || !phone || !password) {
      toast.error("❌ All fields are required!");
      return;
    }

    if (password.length < 3 || password.length > 30) {
      toast.error("❌ Password must be between 3 and 30 characters.");
      return;
    }

    const formData = {
      name,
      email,
      phone,
      password,
      countryCode: selectedCountry.code,
      dialCode: selectedCountry.dial_code,
      role: "buyer",
      accountCreationDate: new Date(),
      referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      // URL এর কোড থাকলে সেটা নেবে, না থাকলে ম্যানুয়াল ইনপুট নেবে
      referredBy: refFromUrl || manualRefCode || null,
      balance: 0,
      // Backend controls salesCredit and subscribedPlan
    };

    try {
      const res = await axios.post<RegisterResponse>(
        "https://tasha-vps-backend-2.onrender.com/api/user/register",
        formData
      );

      if (res.data && res.data.insertedId) {
        toast.success("🎉 Account created successfully!");
        const savedUser = {
          _id: res.data.insertedId,
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };

        const isLocalhost =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";

        Cookies.set("aAcctEmpire_2XLD", JSON.stringify(savedUser), {
          expires: 7,
          secure: !isLocalhost,
          sameSite: "strict",
          path: "/",
        });
        form.reset();
        navigate("/marketplace");
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#111827] relative overflow-hidden font-sans">
      <div className="flex max-w-7xl mx-auto px-6 min-h-screen items-center justify-center py-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center w-full">

          {/* Left Side Content */}
          <motion.div initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
            <div className="relative">
              <div className="flex items-center gap-4 mb-12">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-9 h-9 text-white" />
                </div>
                <span className="text-5xl font-black text-white">AAcctEmpire</span>
              </div>
              <h1 className="text-7xl font-black leading-tight text-white">
                Connect. Trade. <br /> <span className="text-orange-500">Transform</span> <br /> Your Influence
              </h1>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mx-auto bg-black/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-10 shadow-2xl">
            <h2 className="text-4xl font-black text-center text-white mb-2">Welcome</h2>
            <p className="text-center text-gray-400 mb-8">
              Already have an account? <Link to="/login" className="text-orange-500 font-semibold">Login</Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <div className="relative mt-2">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                  <input type="text" name="name" required className="w-full pl-14 pr-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white outline-none focus:border-orange-500 transition" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">Email address</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                  <input type="email" name="email" required className="w-full pl-14 pr-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white outline-none focus:border-orange-500 transition" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">WhatsApp Number</label>
                <div className="relative mt-2 flex gap-2">
                  <button type="button" onClick={() => setIsCountryOpen(!isCountryOpen)} className="bg-gray-800 px-3 py-2 rounded-xl text-white flex items-center gap-2 text-sm">
                    <img src={selectedCountry.flag} alt="flag" className="w-5 h-5 rounded-sm" />
                    <span>{selectedCountry.dial_code}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="relative flex-1">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input type="tel" name="phone" required className="w-full pl-14 pr-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white outline-none focus:border-orange-500" />
                  </div>
                  {isCountryOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-gray-900 text-white border border-gray-700 rounded-xl z-50 max-h-60 overflow-y-auto shadow-2xl">
                      {mergedCountries.map((country) => (
                        <div key={country.code} onClick={() => { setSelectedCountry(country); setIsCountryOpen(false); }} className="flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-700 last:border-0 transition">
                          <img src={country.flag} alt="flag" className="w-6 h-4" />
                          <span className="text-sm flex-1">{country.label}</span>
                          <span className="text-xs text-gray-500">{country.dial_code}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative mt-2">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                  <input type={showPassword ? "text" : "password"} name="password" required className="w-full pl-14 pr-14 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white outline-none focus:border-orange-500" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Referral Code Field - Lowercase allowed */}
              <div>
                <label className="text-sm font-medium text-gray-300">Referral Code (Optional)</label>
                <div className="relative mt-2">
                  <Sparkles className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                  <input
                    type="text"
                    value={refFromUrl || manualRefCode}
                    onChange={(e) => setManualRefCode(e.target.value)} // .toUpperCase() সরানো হয়েছে
                    disabled={!!refFromUrl}
                    placeholder="e.g. 5w4p6nr5"
                    className="w-full pl-14 pr-5 py-4 bg-gray-900/60 border border-gray-700 rounded-xl text-white outline-none focus:border-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-orange-500 text-white font-bold text-lg py-5 rounded-2xl shadow-xl hover:bg-orange-600 transition-all mt-4 active:scale-95">
                Sign Up
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;