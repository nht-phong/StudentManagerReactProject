import { useEffect } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import Button from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * A small modal written by hand (no window.confirm) so the delete action can be
 * styled and tested like the rest of the app.
 */
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel = 'Xóa',
  cancelLabel = 'Hủy',
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Lock the page scroll while the dialog is open.
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && !isConfirming) {
      onCancel();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50"
        aria-hidden="true"
        onClick={() => {
          if (!isConfirming) {
            onCancel();
          }
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        onKeyDown={handleKeyDown}
        className="animate-fade-in relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        <div className="mt-2 text-sm text-slate-600">{children}</div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onCancel} disabled={isConfirming} autoFocus>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isConfirming}>
            {isConfirming ? 'Đang xóa...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
