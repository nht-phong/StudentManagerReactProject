import { createContext, useContext } from 'react';
import type { ToastType } from '../types/ui';

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

/** Small hook so components only need `useToast()` to show a message. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (context === null) {
    throw new Error('useToast must be used inside a ToastProvider.');
  }

  return context;
}
