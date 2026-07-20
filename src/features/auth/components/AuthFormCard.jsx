import React from "react";
import { motion } from "framer-motion";

export default function AuthFormCard({ children, onSubmit, submitText = "Continue" }) {
  return (
    <motion.form
      onSubmit={onSubmit}
      className="space-y-5 bg-white dark:bg-slate-900/70 p-6 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-lg backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {children}

      {/* Submit button */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-md dark:shadow-cyan-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-cyan-500/50 mt-6"
      >
        {submitText}
      </motion.button>
    </motion.form>
  );
}
