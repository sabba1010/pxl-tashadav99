import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Mail, Lock, Sparkles } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <div className="min-h-screen w-full bg-[#111827] relative overflow-hidden">
      {/* Animated Gradient Orbs – tuned for #111827 */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          animate={{
            x: [0, 120, 0],
            y: [0, -120, 0],
            scale: [1, 1.35, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-orange-500/30 to-pink-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 140, 0],
            scale: [1, 1.4, 1],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tr from-purple-600/20 to-orange-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="flex max-w-7xl mx-auto px-6 min-h-screen items-center justify-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full">

          {/* Hero – Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-5 mb-12"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/50">
                    <Sparkles className="w-9 h-9 text-white" />
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-3 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl blur-2xl opacity-40 -z-10"
                  />
                </div>
                <span className="text-5xl font-black bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent">
                  Acctempire
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-7xl font-black leading-tight"
              >
                <span className="bg-gradient-to-r from-white via-orange-200 to-pink-300 bg-clip-text text-transparent">
                  Trade Your
                </span>
                <br />
                <span className="text-6xl bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                  Influence Live
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-8 text-xl text-gray-400 max-w-lg"
              >
                The first real-time creator commerce marketplace. Turn your audience into tradable assets.
              </motion.p>
            </div>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="w-full max-w-lg mx-auto"
          >
            <div className="relative bg-black/40 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-10 shadow-2xl">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/10 via-transparent to-pink-600/10 -z-10" />

              {/* Mobile Logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex lg:hidden justify-center mb-10"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/60">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl blur-xl opacity-50 -z-10"
                    />
                  </div>
                  <span className="text-3xl font-bold text-white">Acctempire</span>
                </div>
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-black text-center bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent"
              >
                Welcome Back
              </motion.h2>

              <p className="text-center text-gray-500 mt-3 mb-10">
                No account?{' '}
                <Link to="/register" className="font-semibold text-orange-400 hover:text-orange-300 transition">
                  Sign up free
                </Link>
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Email */}
                <motion.div
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-14 pr-5 py-5 bg-gray-900/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ x: -40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <a href="#" className="text-sm text-orange-400 hover:text-orange-300">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-14 pr-14 py-5 bg-gray-900/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  type="submit"
                  className="w-full relative overflow-hidden bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white font-bold text-lg py-5 rounded-2xl shadow-2xl shadow-orange-500/40 transition-all group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <LogIn className="w-5 h-5" />
                    Enter Dashboard
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.7 }}
                  />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;