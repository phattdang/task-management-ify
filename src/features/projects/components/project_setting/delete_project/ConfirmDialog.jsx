import ReactDOM from "react-dom"; // Thêm import này

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen) return null;

  const content = (
    <div
      className="fixed inset-0 bg-black/60 z-[120] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className="rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 border"
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(16px)',
          borderColor: 'rgba(71, 85, 105, 0.3)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        }}
      >
        <h3 className="text-lg font-bold text-slate-100 mb-2">{title}</h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/40 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-all ${
              isLoading
                ? "bg-red-600/50 cursor-not-allowed opacity-70"
                : "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/30"
            }`}
          >
            {isLoading ? "Deleting..." : "Yes, delete it"}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}
