import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import AuthFormCard from "../components/AuthFormCard";

const FormInput = ({ label, type = "text", placeholder, value, onChange, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 + delay, duration: 0.5 }}
  >
    {label && (
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
    )}
    <motion.input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      whileFocus={{
        scale: 1.01,
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
      }}
      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800/60 border border-slate-300 dark:border-slate-600/50 rounded-lg focus:outline-none focus:border-blue-600 dark:focus:border-cyan-500 focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 text-sm transition-all"
      required
    />
  </motion.div>
);

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || "";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      navigate("/create-site", {
        state: {
          email: email,
          fullName: fullName,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join us and start managing tasks effectively"
    >
      <AuthFormCard onSubmit={handleSubmit} submitText={isLoading ? "Creating..." : "Continue"}>
        {/* Email Input */}
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          delay={0}
        />

        {/* Full Name Input */}
        <FormInput
          label="Full Name"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          delay={0.05}
        />

        {/* Terms & Privacy */}
        <motion.p
          className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          By creating an account, you agree to our{" "}
          <a
            href="#"
            className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-medium transition-colors"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-medium transition-colors"
          >
            Privacy Policy
          </a>
          .
        </motion.p>

        {/* Sign in link */}
        <motion.p
          className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-semibold transition-colors"
          >
            Sign in
          </Link>
        </motion.p>
      </AuthFormCard>
    </AuthLayout>
  );
}
