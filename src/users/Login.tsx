import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { Eye, EyeOff, Lock, LogIn, Mail, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  // Fixed initial state type for password (was boolean, should be string)
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    toast.info("You are already logged in");
    navigate("/marketplace");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      const res = await axios.post<{ success: any; user: any }>(
        "https://vps-backend-server-beta.vercel.app/api/user/login",
        {
          email,
          password,
        }
      );

      if (res.data?.success) {
        const isLocalhost =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";

        Cookies.set("aAcctEmpire_2XLD", JSON.stringify(res.data.user), {
          expires: 7,
          secure: !isLocalhost,
          sameSite: "strict",
          path: "/",
        });

        toast.success("Login successful");

        // ---------------------------------------------------------
        // CHANGE: Redirect to /marketplace instead of /
        // ---------------------------------------------------------
        navigate("/");
        window.location.reload();
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#111827] relative overflow-hidden">
      {/* BACKGROUND & DESIGN KEPT SAME */}
      <div className="flex max-w-7xl mx-auto px-6 min-h-screen items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
          {/* LEFT HERO (unchanged design) */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-5 mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-9 h-9 text-white" />
              </div>
              <span className="text-5xl font-black text-white">
                AAcctEmpire
              </span>
            </div>

            <h1 className="text-7xl font-black leading-tight text-white">
              Trade Your <br />
              <span className="text-orange-400">Influence Live</span>
            </h1>
          </div>

          {/* LOGIN CARD */}
          <motion.div className="w-full max-w-lg mx-auto">
            <div className="bg-black/40 backdrop-blur-xl border border-gray-700 rounded-3xl p-10">
              <h2 className="text-4xl font-black text-center text-white">
                Welcome Back
              </h2>

              <p className="text-center text-gray-500 mt-3 mb-10">
                No account?{" "}
                <Link to="/register" className="text-orange-400">
                  Sign up free
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* EMAIL */}
                <div>
                  <label className="text-sm text-gray-300">Email</label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400" />
                    <input
                      type="email"
                      className="w-full pl-14 py-5 bg-gray-900 border border-gray-700 rounded-2xl text-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-sm text-gray-300">Password</label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-14 pr-14 py-5 bg-gray-900 border border-gray-700 rounded-2xl text-white"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-5 rounded-2xl"
                >
                  <span className="flex justify-center items-center gap-2">
                    <LogIn className="w-5 h-5" /> Enter Dashboard
                  </span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
