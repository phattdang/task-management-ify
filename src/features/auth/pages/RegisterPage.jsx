import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const navigate = useNavigate(); // Hook điều hướng
  const location = useLocation();
  const initialEmail = location.state?.email || "adef17540@gmail.com";

  const [fullName, setFullName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Chuyển hướng sang trang Create Site, mang theo dữ liệu cũ
    navigate("/create-site", {
      state: {
        email: initialEmail,
        fullName: fullName,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 font-sans relative overflow-hidden transition-colors duration-200">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      ></motion.div>
      <motion.div 
        className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/10 dark:bg-cyan-500/10 blur-3xl rounded-full opacity-40 dark:opacity-30"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>

      <motion.div 
        className="w-full max-w-[420px] px-6 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo & Title */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6 text-blue-600 dark:text-cyan-400 font-bold text-3xl"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span 
              className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-cyan-500 dark:to-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              T
            </motion.span>
            <span>TaskMgmt</span>
          </motion.div>
          <motion.h1 
            className="text-4xl font-bold text-slate-900 dark:text-slate-100"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Create Account
          </motion.h1>
          <motion.p 
            className="text-slate-500 dark:text-slate-400 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            Join us and manage tasks better
          </motion.p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 border border-slate-200 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/50 backdrop-blur-xl shadow-xl dark:shadow-[0_20px_50px_rgba(6,182,212,0.1)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Email Section (Read only) */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-500 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <motion.div 
              className="font-semibold text-base text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50"
              whileHover={{ scale: 1.01 }}
            >
              {initialEmail}
            </motion.div>
          </motion.div>

          {/* Full Name Input */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-500 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <motion.input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              whileFocus={{ scale: 1.01, boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 text-sm transition-all"
              autoFocus
            />
          </motion.div>

          {/* Terms */}
          <motion.p 
            className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            By creating an account, you agree to our{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and acknowledge our{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors"
            >
              Privacy Policy
            </a>
            .
          </motion.p>

          {/* Submit Button */}
          <motion.button
            type="submit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 mb-6 shadow-md dark:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500/50"
          >
            Continue
          </motion.button>

          {/* Footer Link */}
          <motion.div 
            className="text-center text-sm text-slate-600 dark:text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            <span>Already have an account? </span>
            <Link
              to="/login"
              className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}
