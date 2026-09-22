import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div id="toast-container" className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          id={`toast-${t.id}`}
          className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur text-sm text-slate-100 transition-all duration-200"
        >
          <div className="flex items-center gap-2.5">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}
            <span className="font-medium text-xs sm:text-sm">{t.message}</span>
          </div>
          <button
            id={`btn-dismiss-toast-${t.id}`}
            onClick={() => onDismiss(t.id)}
            className="text-slate-400 hover:text-white p-1 rounded transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
