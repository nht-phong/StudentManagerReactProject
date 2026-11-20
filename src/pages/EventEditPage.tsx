import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState';
import EventForm from '../components/EventForm';
import LoadingState from '../components/LoadingState';
import NotFoundMessage from '../components/NotFoundMessage';
import { useToast } from '../context/ToastContext';
import { getApiErrorMessage, isNotFoundError } from '../services/api';
import { getEventById, updateEvent } from '../services/eventsService';
import type { ClubEvent } from '../types/event';
import type { EventFormValues } from '../types/form';
import { eventToFormValues, formValuesToEventInput } from '../utils/eventForm';

export default function EventEditPage() {
  const { id } = useParams<{ id: string }>();
  const eventId = id ?? '';
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [event, setEvent] = useState<ClubEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadEvent() {
      setIsLoading(true);
      setErrorMessage(null);
      setIsNotFound(false);

      try {
        // The edit form is filled with the record coming from the API.
        const result = await getEventById(eventId);

        if (!isCancelled) {
          setEvent(result);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setEvent(null);
        setIsNotFound(isNotFoundError(error));
        setErrorMessage(getApiErrorMessage(error, 'Could not load this event.'));
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadEvent();

    return () => {
      isCancelled = true;
    };
  }, [eventId, reloadKey]);

  async function handleSubmit(values: EventFormValues) {
    setIsSubmitting(true);

    try {
      const updatedEvent = await updateEvent(eventId, formValuesToEventInput(values));
      showToast(`"${updatedEvent.name}" was updated.`);
      navigate(`/events/${eventId}`, { replace: true });
    } catch (error) {
      showToast(getApiErrorMessage(error, 'Could not update the event. Please try again.'), 'error');
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading event..." />;
  }

  if (isNotFound) {
    return (
      <NotFoundMessage
        title="Event not found"
        description="This event does not exist or it was deleted, so it cannot be edited."
      />
    );
  }

  if (errorMessage !== null || event === null) {
    return (
      <ErrorState
        message={errorMessage ?? 'Could not load this event.'}
        onRetry={() => {
          setReloadKey((current) => current + 1);
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Edit event
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Change the details of <span className="font-medium text-slate-800">{event.name}</span> and
          save.
        </p>
      </header>

      <EventForm
        mode="edit"
        initialValues={eventToFormValues(event)}
        submitLabel="Save changes"
        isSubmitting={isSubmitting}
        cancelTo={`/events/${event.id}`}
        onSubmit={(values) => {
          void handleSubmit(values);
        }}
      />
    </div>
  );
}
