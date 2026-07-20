import React from "react";
import { motion } from "framer-motion";

export default function AnimatedIllustration() {
  // Character animation - typing motion
  const characterVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } },
  };

  // Floating animation for workspace elements
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  // Pulse animation for floating elements
  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.6, 1, 0.6],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  // Rotate animation for decorative elements
  const rotateVariants = {
    animate: {
      rotate: 360,
      transition: { duration: 20, repeat: Infinity, linear: true },
    },
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-500/20 to-purple-600/20 dark:from-blue-900/30 dark:via-cyan-900/30 dark:to-purple-900/30"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Floating orbs background */}
      <motion.div
        className="absolute top-10 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"
        animate={{ scale: [1.2, 0.8, 1.2], opacity: [0.4, 0.2, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main illustration content */}
      <div className="relative z-10 w-full max-w-md px-6">
        <svg
          viewBox="0 0 400 500"
          className="w-full h-auto drop-shadow-lg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Desk */}
          <motion.g variants={characterVariants} initial="initial" animate="animate">
            <rect x="50" y="320" width="300" height="20" fill="#94a3b8" rx="4" />
            {/* Desk shadow */}
            <ellipse cx="200" cy="345" rx="180" ry="15" fill="#000" opacity="0.1" />
          </motion.g>

          {/* Character sitting (simplified 2D style) */}
          <motion.g variants={characterVariants} initial="initial" animate="animate">
            {/* Chair */}
            <circle cx="200" cy="280" r="15" fill="#64748b" opacity="0.8" />
            <rect x="185" y="280" width="30" height="40" fill="#475569" rx="2" />

            {/* Body */}
            <ellipse cx="200" cy="230" rx="20" ry="35" fill="#3b82f6" />

            {/* Arms */}
            <motion.g animate={{ rotateZ: [0, -5, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <rect x="170" y="220" width="15" height="50" fill="#1e293b" rx="7" />
              <circle cx="177.5" cy="270" r="6" fill="#fcd34d" />
            </motion.g>

            {/* Right arm typing */}
            <motion.g animate={{ rotateZ: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <rect x="215" y="210" width="15" height="55" fill="#1e293b" rx="7" />
              <circle cx="222.5" cy="265" r="6" fill="#fcd34d" />
            </motion.g>

            {/* Head */}
            <circle cx="200" cy="190" r="18" fill="#d4a574" />

            {/* Eyes - looking at screen */}
            <circle cx="195" cy="185" r="2.5" fill="#1e293b" />
            <circle cx="205" cy="185" r="2.5" fill="#1e293b" />

            {/* Smile */}
            <path d="M 195 192 Q 200 195 205 192" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </motion.g>

          {/* Monitor */}
          <motion.g
            variants={characterVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
          >
            {/* Monitor frame */}
            <rect x="240" y="140" width="120" height="85" fill="#1e293b" rx="4" />

            {/* Monitor screen - animated content */}
            <motion.g animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 2, repeat: Infinity }}>
              <rect x="245" y="145" width="110" height="75" fill="#0f172a" rx="2" />

              {/* Animated lines on screen (data/content) */}
              <motion.rect
                x="250"
                y="150"
                width="100"
                height="8"
                fill="#06b6d4"
                rx="2"
                animate={{ width: [100, 95, 100] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <motion.rect
                x="250"
                y="165"
                width="85"
                height="6"
                fill="#0891b2"
                rx="2"
                animate={{ width: [85, 95, 80, 85] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.rect
                x="250"
                y="176"
                width="95"
                height="6"
                fill="#0891b2"
                rx="2"
                animate={{ width: [95, 85, 90, 95] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.rect
                x="250"
                y="187"
                width="75"
                height="6"
                fill="#06b6d4"
                rx="2"
                animate={{ width: [75, 100, 80, 75] }}
                transition={{ duration: 1.3, repeat: Infinity, delay: 0.1 }}
              />
            </motion.g>

            {/* Monitor stand */}
            <rect x="285" y="225" width="30" height="8" fill="#1e293b" rx="2" />
            <circle cx="300" cy="233" r="8" fill="#1e293b" opacity="0.6" />
          </motion.g>

          {/* Keyboard on desk - animated typing indicator */}
          <motion.g
            variants={characterVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <rect x="120" y="330" width="60" height="12" fill="#64748b" rx="2" />

            {/* Typing indicator dots */}
            <motion.circle
              cx="130"
              cy="336"
              r="1.5"
              fill="#fcd34d"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
            <motion.circle
              cx="140"
              cy="336"
              r="1.5"
              fill="#fcd34d"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
            />
            <motion.circle
              cx="150"
              cy="336"
              r="1.5"
              fill="#fcd34d"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
          </motion.g>

          {/* Floating task/productivity icons */}
          <motion.g variants={floatingVariants} animate="animate">
            <motion.g transform="translate(80, 100)">
              <rect width="40" height="40" fill="#06b6d4" rx="6" opacity="0.7" />
              <circle cx="12" cy="12" r="2" fill="#fff" />
              <circle cx="28" cy="12" r="2" fill="#fff" />
              <rect x="8" y="20" width="24" height="12" fill="#fff" opacity="0.6" rx="2" />
            </motion.g>
          </motion.g>

          {/* Floating checkmark icon */}
          <motion.g
            variants={pulseVariants}
            animate="animate"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.g transform="translate(320, 120)">
              <circle cx="0" cy="0" r="20" fill="#10b981" opacity="0.6" />
              <path
                d="M -8 0 L -2 6 L 10 -8"
                stroke="#fff"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
          </motion.g>

          {/* Floating star decoration */}
          <motion.g
            variants={rotateVariants}
            animate="animate"
            transform="translate(90, 280)"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
          >
            <polygon
              points="0,-12 3,-3 12,-1 6,5 8,14 0,10 -8,14 -6,5 -12,-1 -3,-3"
              fill="#f59e0b"
              opacity="0.6"
            />
          </motion.g>

          {/* Floating beam/efficiency icon */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ y: [0, -8, 0], opacity: 1 }}
            transition={{ delay: 0.7, duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            transform="translate(300, 280)"
          >
            <path
              d="M 0 -10 L 8 2 L -8 2 Z"
              fill="#ec4899"
              opacity="0.7"
            />
          </motion.g>
        </svg>
      </div>

      {/* Animated text below illustration */}
      <motion.div
        className="absolute bottom-8 text-center px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
          Manage tasks, <span className="text-blue-600 dark:text-cyan-400">boost productivity</span>
        </p>
      </motion.div>
    </div>
  );
}
