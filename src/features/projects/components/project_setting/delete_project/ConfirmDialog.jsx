// components/ConfirmDialog.jsx
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[120] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl animate-in fade-in slide-in-from-bottom-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded shadow-sm"
          >
            Yes, delete it
          </button>
        </div>
      </div>
    </div>
  );
}
