// components/LoadingPulse.jsx
export default function LoadingPulse({ message = "Loading tasks..." }) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        {/* Bạn có thể thêm một cái icon xoay ở đây cho đẹp */}
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-gray-500 font-medium animate-pulse">{message}</div>
      </div>
    </div>
  );
}
