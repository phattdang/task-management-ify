// components/LoadingPulse.jsx
export default function LoadingPulse({ message = "Loading tasks...", variant = "spinner" }) {
  if (variant === "skeleton") {
    return (
      <div className="space-y-3 w-full max-w-sm">
        <div className="h-12 bg-slate-800/50 rounded-lg animate-pulse border border-slate-700/30"></div>
        <div className="h-20 bg-slate-800/50 rounded-lg animate-pulse border border-slate-700/30"></div>
        <div className="h-12 bg-slate-800/50 rounded-lg animate-pulse border border-slate-700/30"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
        <div className="text-slate-400 font-medium animate-pulse">{message}</div>
      </div>
    </div>
  );
}
