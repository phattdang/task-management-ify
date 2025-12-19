import ReactDOM from "react-dom"; // Thêm import này

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const content = (
    <div
      className="fixed inset-0 bg-black/60 z-[120] flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()} // Ngăn click vào backdrop làm ảnh hưởng bên ngoài
    >
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl animate-in fade-in">
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

  return ReactDOM.createPortal(content, document.body); // Đưa Dialog ra ngoài body
}
