import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 pointer-events-none px-4 w-auto max-w-[94vw] sm:max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-2 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full shadow-2xl backdrop-blur-2xl border text-xs font-semibold animate-slide-down transition-all ${
            toast.type === 'success'
              ? 'bg-slate-950/95 dark:bg-black/95 text-white border-emerald-500/40 shadow-[0_8px_24px_-4px_rgba(0,200,83,0.35)]'
              : toast.type === 'error'
              ? 'bg-slate-950/95 dark:bg-black/95 text-white border-rose-500/40 shadow-[0_8px_24px_-4px_rgba(244,63,94,0.35)]'
              : 'bg-slate-950/95 dark:bg-black/95 text-white border-white/20 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.6)]'
          }`}
        >
          <div className="shrink-0 flex items-center">
            {toast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-400" />}
          </div>
          <span className="truncate max-w-[230px] sm:max-w-xs font-medium tracking-tight">
            {toast.message}
          </span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="p-0.5 text-slate-400 hover:text-white rounded-full transition-colors ml-0.5 shrink-0"
            title="Dismiss notification"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
