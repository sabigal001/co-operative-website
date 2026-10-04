import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-chowdeck-dark border transition-all duration-300 animate-slide-up ${
            toast.type === 'success'
              ? 'bg-black text-white border-brand-500/50 shadow-glow'
              : toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-500/40'
              : 'bg-white text-slate-800 border-slate-200'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-brand-400" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-brand-600" />}
          </div>
          <div className="flex-1 text-sm font-medium leading-relaxed">
            {toast.message}
          </div>
        </div>
      ))}
    </div>
  );
};
