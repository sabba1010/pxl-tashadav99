import React, { useState, useEffect } from "react";
import axios from "axios";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../config";
import headerlogo from "../assets/headerlogo.png";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.get<{ success: boolean; message: string }>(`${API_BASE_URL}/user/verify-reset-token/${token}`);
        if (res.data.success) {
          setValidToken(true);
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Invalid or expired reset link");
        setValidToken(false);
      } finally {
        setVerifying(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post<{ success: boolean; message: string }>(`${API_BASE_URL}/user/reset-password`, {
        token,
        newPassword: password,
      });
      if (res.data.success) {
        toast.success("Password reset successful! Please login.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen w-full bg-[#111827] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen w-full bg-[#111827] flex items-center justify-center px-6">
        <div className="bg-black/40 backdrop-blur-xl border border-gray-700 rounded-3xl p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Invalid Link</h2>
          <p className="text-gray-400 mb-8">This password reset link is invalid or has already expired.</p>
          <Link to="/forgot-password" title="Go to Forgot Password" data-testid="forgot-password-link" className="inline-block w-full bg-orange-500 text-white font-bold py-4 rounded-2xl transition">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#111827] relative overflow-hidden flex items-center justify-center px-6">
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
          <h2 className="text-4xl font-black text-white">Create New Password</h2>
          <p className="text-gray-400 mt-3">Enter your new secure password below.</p>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-gray-700 rounded-3xl p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-gray-300 ml-1">New Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-14 pr-14 py-5 bg-gray-900 border border-gray-700 rounded-2xl text-white outline-none focus:border-orange-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-300 ml-1">Confirm New Password</label>
              <div className="relative mt-2">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-orange-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-14 py-5 bg-gray-900 border border-gray-700 rounded-2xl text-white outline-none focus:border-orange-500 transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  <CheckCircle className="w-5 h-5" /> Reset Password
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
