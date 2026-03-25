import React, { useState } from "react";
import axios from "axios";
import { Mail, ArrowLeft, Loader2, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config";
import headerlogo from "../assets/headerlogo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post<{ success: boolean; message: string }>(`${API_BASE_URL}/user/forgot-password`, { email });
      if (res.data.success) {
        setSubmitted(true);
        toast.success("Reset link sent successfully!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen w-full bg-[#111827] flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/40 backdrop-blur-xl border border-gray-700 rounded-3xl p-10 max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Check Your Email</h2>
          <p className="text-gray-400 mb-8">
            We've sent a password reset link to <span className="text-white font-semibold">{email}</span>. 
            Please check your inbox and follow the instructions.
          </p>
          <Link to="/login" className="inline-block w-full bg-orange-500 text-white font-bold py-4 rounded-2xl transition hover:bg-orange-600">
            Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#111827] relative overflow-hidden flex items-center justify-center px-6">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img src={headerlogo} alt="Logo" className="h-16 w-auto" />
          </div>
          <h2 className="text-4xl font-black text-white">Reset Password</h2>
          <p className="text-gray-400 mt-3">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-gray-700 rounded-3xl p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-gray-300 ml-1">Email Address</label>
              <div className="relative mt-2">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400" />
                <input
                  type="email"
                  className="w-full pl-14 pr-5 py-5 bg-gray-900 border border-gray-700 rounded-2xl text-white outline-none focus:border-orange-500 transition"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-5 rounded-2xl active:scale-95 transition flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Send Reset Link
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="text-gray-400 hover:text-white transition flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
