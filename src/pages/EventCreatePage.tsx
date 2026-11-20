import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage } from '../services/api';
import { createEvent } from '../services/eventsService';
import type { EventFormValues } from '../types/form';
import { createEmptyEventFormValues, formValuesToEventInput } from '../utils/eventForm';

export default function EventCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: EventFormValues) {
    setIsSubmitting(true);

    try {
      const createdEvent = await createEvent(formValuesToEventInput(values));
      showToast(`Đã tạo sự kiện "${createdEvent.name}".`);
      navigate(`/events/${createdEvent.id}`, { replace: true });
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Không thể tạo sự kiện. Vui lòng thử lại.'), 'error');
      // The page stays open, so the user can fix the problem and try again.
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Thêm sự kiện mới
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Điền thông tin bên dưới. Các ô có dấu * là bắt buộc.
        </p>
      </header>

      <EventForm
        mode="create"
        initialValues={createEmptyEventFormValues()}
        submitLabel="Tạo sự kiện"
        isSubmitting={isSubmitting}
        cancelTo="/events"
        onSubmit={(values) => {
          void handleSubmit(values);
        }}
      />
    </div>
  );
}
