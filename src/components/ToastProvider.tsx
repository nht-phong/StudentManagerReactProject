import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ToastContext } from '../context/ToastContext';
import type { ToastMessage, ToastType } from '../types/ui';

const TOAST_DURATION_MS = 4000;

const accentClasses: Record<ToastType, string> = {
  success: 'border-l-emerald-500',
  error: 'border-l-rose-500',
  info: 'border-l-sky-500',
};

const iconClasses: Record<ToastType, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  error: 'bg-rose-100 text-rose-700',
  info: 'bg-sky-100 text-sky-700',
};

const iconSymbols: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'i',
};

interface ToastItemProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  // Each toast closes itself, and clears its timer when it is removed.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onDismiss(toast.id);
    }, TOAST_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toast.id, onDismiss]);

  return (
    <div
      role="status"
      className={`animate-toast-in flex w-full max-w-sm items-start gap-3 rounded-xl border border-slate-200 border-l-4 bg-white p-3.5 shadow-lg ${accentClasses[toast.type]}`}
    >
      <span
        className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${iconClasses[toast.type]}`}
        aria-hidden="true"
      >
        {iconSymbols[toast.type]}
      </span>

      <p className="flex-1 text-sm leading-snug text-slate-700">{toast.message}</p>

      <button
        type="button"
        onClick={() => {
          onDismiss(toast.id);
        }}
        className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        aria-label="Đóng thông báo"
      >
        ✕
      </button>
    </div>
  );
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextIdRef = useRef(1);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = nextIdRef.current;
    nextIdRef.current += 1;

    setToasts((current) => [...current, { id, message, type }]);
  }, []);

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto w-full sm:w-auto">
            <ToastItem toast={toast} onDismiss={dismissToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
