import React, { createContext, useContext, useState, useCallback, useRef } from "react";

const ToastContext = createContext(null);

let toastId = 0;

/**
 * Toast types: "success" | "error" | "warning" | "info"
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const addToast = useCallback(
    ({ type = "info", title, message, duration = 4000 }) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, title, message }]);

      if (duration > 0) {
        timersRef.current[id] = setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  // Shorthand helpers
  const toast = useCallback(
    {
      success: (message, title) =>
        addToast({ type: "success", title: title || "Thành công", message }),
      error: (message, title) =>
        addToast({ type: "error", title: title || "Lỗi", message }),
      warning: (message, title) =>
        addToast({ type: "warning", title: title || "Cảnh báo", message }),
      info: (message, title) =>
        addToast({ type: "info", title: title || "Thông báo", message }),
    },
    [addToast]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/* ── Icons ─────────────────────────────────────────────── */
const icons = {
  success: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15" />
      <path d="M6 10.5L8.5 13L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15" />
      <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15" />
      <path d="M10 6V11M10 13.5V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.15" />
      <path d="M10 9V14M10 6.5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const colorMap = {
  success: {
    border: "border-emerald-400 dark:border-emerald-500/50",
    bg: "bg-emerald-50 dark:bg-emerald-950/60",
    icon: "text-emerald-600 dark:text-emerald-400",
    title: "text-emerald-800 dark:text-emerald-300",
    bar: "bg-emerald-500 dark:bg-emerald-400",
  },
  error: {
    border: "border-red-400 dark:border-red-500/50",
    bg: "bg-red-50 dark:bg-red-950/60",
    icon: "text-red-600 dark:text-red-400",
    title: "text-red-800 dark:text-red-300",
    bar: "bg-red-500 dark:bg-red-400",
  },
  warning: {
    border: "border-amber-400 dark:border-amber-500/50",
    bg: "bg-amber-50 dark:bg-amber-950/60",
    icon: "text-amber-600 dark:text-amber-400",
    title: "text-amber-800 dark:text-amber-300",
    bar: "bg-amber-500 dark:bg-amber-400",
  },
  info: {
    border: "border-blue-400 dark:border-blue-500/50",
    bg: "bg-blue-50 dark:bg-blue-950/60",
    icon: "text-blue-600 dark:text-blue-400",
    title: "text-blue-800 dark:text-blue-300",
    bar: "bg-blue-500 dark:bg-blue-400",
  },
};

/* ── Container ─────────────────────────────────────────── */
function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

/* ── Single Toast ──────────────────────────────────────── */
function ToastItem({ toast, onRemove }) {
  const c = colorMap[toast.type] || colorMap.info;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${c.border} ${c.bg} backdrop-blur-xl shadow-lg animate-slideIn relative overflow-hidden`}
      role="alert"
    >
      {/* Colored accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${c.bar}`} />

      {/* Icon */}
      <div className={`shrink-0 mt-0.5 ${c.icon}`}>{icons[toast.type]}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={`text-sm font-bold ${c.title}`}>{toast.title}</p>
        )}
        {toast.message && (
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5 break-words">
            {toast.message}
          </p>
        )}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-0.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
