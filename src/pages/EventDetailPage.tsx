import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import DeleteEventButton from '../components/DeleteEventButton';
import ErrorState from '../components/ErrorState';
import { FormatBadge, StatusBadge } from '../components/EventBadges';
import LoadingState from '../components/LoadingState';
import NotFoundMessage from '../components/NotFoundMessage';
import { getApiErrorMessage, isNotFoundError } from '../services/api';
import { getEventById } from '../services/eventsService';
import type { ClubEvent } from '../types/event';
import { formatEventDate, formatTimeRange, getEventStatus } from '../utils/date';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventId = id ?? '';

  const [event, setEvent] = useState<ClubEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadEvent() {
      setIsLoading(true);
      setErrorMessage(null);
      setIsNotFound(false);

      try {
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

  if (isLoading) {
    return <LoadingState message="Loading event..." />;
  }

  if (isNotFound) {
    return (
      <NotFoundMessage
        title="Event not found"
        description="This event does not exist or it was deleted. Please go back to the list and pick another one."
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

  const status = getEventStatus(event.date);

  return (
    <div className="space-y-5">
      <Link
        to="/events"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 transition hover:text-indigo-700"
      >
        <span aria-hidden="true">←</span> All events
      </Link>

      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-white px-5 py-6 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={status} />
            <FormatBadge format={event.format} />
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {event.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {formatEventDate(event.date)} · {formatTimeRange(event.startTime, event.endTime)}
          </p>
        </div>

        <dl className="grid gap-x-8 gap-y-5 px-5 py-6 sm:grid-cols-2 sm:px-8">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date</dt>
            <dd className="mt-1 text-sm text-slate-900">{formatEventDate(event.date)}</dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Time</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {formatTimeRange(event.startTime, event.endTime)}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Format</dt>
            <dd className="mt-1 text-sm text-slate-900">
              {event.format === 'offline' ? 'In person' : 'Online'}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Maximum capacity
            </dt>
            <dd className="mt-1 text-sm text-slate-900">{event.capacity} seats</dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {event.format === 'offline' ? 'Location' : 'Join link'}
            </dt>
            <dd className="mt-1 text-sm text-slate-900">
              {event.format === 'offline' ? (
                event.location
              ) : (
                <a
                  href={event.joinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="break-all font-medium text-indigo-600 underline-offset-4 hover:underline"
                >
                  {event.joinUrl}
                </a>
              )}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:px-8">
          <Link
            to={`/events/${event.id}/edit`}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Edit event
          </Link>

          <DeleteEventButton
            event={event}
            onDeleted={() => {
              navigate('/events', { replace: true });
            }}
          />

          <Link
            to="/events"
            className="ml-auto inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Back to list
          </Link>
        </div>
      </article>
    </div>
  );
}
