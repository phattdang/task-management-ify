import React from "react";
import { motion } from "framer-motion";
import AnimatedIllustration from "./AnimatedIllustration";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans transition-colors duration-200">
      {/* Split layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Left side - Form */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col items-center justify-center px-4 py-8 md:py-0 md:px-8 bg-slate-50 dark:bg-slate-950/50 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full max-w-sm">
            {/* Header */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {title}
              </h1>
              {subtitle && (
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* Form content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {children}
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Animated illustration (hidden on mobile) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-600/5 dark:from-blue-600/20 dark:via-transparent dark:to-cyan-600/20"
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />

          {/* Illustration */}
          <AnimatedIllustration />
        </div>
      </div>
    </div>
  );
}
