import { useState } from 'react';
import type { ClubEvent } from '../types/event';
import { deleteEvent } from '../services/eventsService';
import { getApiErrorMessage } from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from './Button';
import ConfirmDialog from './ConfirmDialog';

interface DeleteEventButtonProps {
  event: ClubEvent;
  onDeleted: () => void;
  variant?: 'danger-ghost' | 'danger';
  className?: string;
}

/**
 * Delete action with its own confirmation dialog, loading state and toast.
 * Used from the list page and from the detail page.
 */
export default function DeleteEventButton({
  event,
  onDeleted,
  variant = 'danger-ghost',
  className = '',
}: DeleteEventButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  async function handleConfirm() {
    setIsDeleting(true);

    try {
      await deleteEvent(event.id);
      setIsDialogOpen(false);
      showToast(`"${event.name}" was deleted.`);
      onDeleted();
    } catch (error) {
      setIsDialogOpen(false);
      showToast(getApiErrorMessage(error, 'Could not delete this event. Please try again.'), 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button
        variant={variant}
        className={className}
        onClick={() => {
          setIsDialogOpen(true);
        }}
      >
        Delete
      </Button>

      <ConfirmDialog
        open={isDialogOpen}
        title="Delete event?"
        isConfirming={isDeleting}
        onConfirm={() => {
          void handleConfirm();
        }}
        onCancel={() => {
          setIsDialogOpen(false);
        }}
      >
        <p>
          Do you really want to delete <span className="font-semibold text-slate-900">{event.name}</span>?
          This action cannot be undone.
        </p>
      </ConfirmDialog>
    </>
  );
}
