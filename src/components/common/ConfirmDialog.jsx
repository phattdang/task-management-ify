import ReactDOM from "react-dom";

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmText = "Yes, delete it",
}) {
  if (!isOpen) return null;

  const content = (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/60 z-[120] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 border border-slate-200 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/80 dark:backdrop-blur-xl dark:shadow-[0_25px_50px_rgba(6,182,212,0.12)]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-all focus:outline-none focus:ring-2 focus:ring-red-500/50 ${
              isLoading
                ? "bg-red-500/50 cursor-not-allowed opacity-70"
                : "bg-red-600 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-500 shadow-md dark:shadow-red-500/20"
            }`}
          >
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}
