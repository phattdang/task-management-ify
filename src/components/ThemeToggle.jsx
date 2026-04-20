import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 group"
      style={{
        backgroundColor: theme === 'dark' 
          ? 'rgba(15, 23, 42, 0.4)'
          : 'rgba(255, 255, 255, 0.4)',
        borderColor: theme === 'dark'
          ? 'rgba(71, 85, 105, 0.3)'
          : 'rgba(229, 231, 235, 0.5)',
      }}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon - shows in light mode */}
        <svg
          className={`absolute w-5 h-5 transition-all duration-300 transform ${
            theme === 'light'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-0'
          }`}
          style={{
            color: theme === 'light' ? '#f59e0b' : 'currentColor'
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>

        {/* Moon Icon - shows in dark mode */}
        <svg
          className={`absolute w-5 h-5 transition-all duration-300 transform ${
            theme === 'dark'
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 rotate-90 scale-0'
          }`}
          style={{
            color: theme === 'dark' ? '#06b6d4' : 'currentColor'
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>

      {/* Hover glow effect */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{
          backgroundColor: theme === 'dark'
            ? 'rgba(6, 182, 212, 0.1)'
            : 'rgba(59, 130, 246, 0.1)',
          border: `1px solid ${theme === 'dark' ? 'rgba(6, 182, 212, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`,
        }}
      />
    </button>
  );
}
