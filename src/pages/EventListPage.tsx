import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import EventCard from '../components/EventCard';
import LoadingState from '../components/LoadingState';
import Pagination from '../components/Pagination';
import SearchBar from '../components/SearchBar';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { getApiErrorMessage } from '../services/api';
import { getEvents } from '../services/eventsService';
import type { ClubEvent } from '../types/event';
import { getEventStatus } from '../utils/date';

const EVENTS_PER_PAGE = 6;

interface EventGroupProps {
  title: string;
  description: string;
  events: ClubEvent[];
  emptyMessage: string;
  onDeleted: () => void;
}

function EventGroup({ title, description, events, emptyMessage, onDeleted }: EventGroupProps) {
  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">
          {title}{' '}
          <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600">
            {events.length}
          </span>
        </h2>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      {events.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onDeleted={onDeleted} />
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
          {emptyMessage}
        </p>
      )}
    </section>
  );
}

export default function EventListPage() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const debouncedSearch = useDebouncedValue(search.trim(), 350);

  useEffect(() => {
    let isCancelled = false;

    async function loadEvents() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const result = await getEvents({
          page,
          perPage: EVENTS_PER_PAGE,
          search: debouncedSearch,
        });

        if (isCancelled) {
          return;
        }

        setEvents(result.events);
        setPages(result.pages);
        setTotal(result.total);

        // If the last item of the last page was deleted, that page no longer
        // exists. Go back to the first page instead of showing an empty list.
        if (result.events.length === 0 && result.total > 0 && page > 1) {
          setPage(1);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setEvents([]);
        setPages(1);
        setTotal(0);
        setErrorMessage(getApiErrorMessage(error, 'Could not load the event list.'));
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadEvents();

    // If the component unmounts (or the values change) we ignore the old response.
    return () => {
      isCancelled = true;
    };
  }, [page, debouncedSearch, reloadKey]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function reloadEvents() {
    setReloadKey((current) => current + 1);
  }

  const upcomingEvents = events
    .filter((event) => getEventStatus(event.date) === 'upcoming')
    .sort((first, second) => first.date.localeCompare(second.date));

  const pastEvents = events
    .filter((event) => getEventStatus(event.date) === 'past')
    .sort((first, second) => second.date.localeCompare(first.date));

  const isSearching = debouncedSearch.length > 0;
  const hasEvents = events.length > 0;
  const isFirstLoad = isLoading && !hasEvents;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Club events
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-600">
            Browse every event of the club, open its details, or add a new one.
          </p>
        </div>

        <Link
          to="/events/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 sm:self-auto"
        >
          <span aria-hidden="true">+</span> New event
        </Link>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar value={search} onChange={handleSearchChange} />

        {!isFirstLoad && errorMessage === null && (
          <p className="text-sm text-slate-500" role="status">
            {total} {total === 1 ? 'event' : 'events'}
            {isSearching ? ` matching "${debouncedSearch}"` : ''}
          </p>
        )}
      </div>

      {isFirstLoad && <LoadingState message="Loading events..." />}

      {!isFirstLoad && errorMessage !== null && (
        <ErrorState message={errorMessage} onRetry={reloadEvents} />
      )}

      {!isFirstLoad && errorMessage === null && !hasEvents && (
        <>
          {isSearching ? (
            <EmptyState
              title="No matching events"
              description={`No event matches "${debouncedSearch}". Try another keyword.`}
              action={
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleSearchChange('');
                  }}
                >
                  Clear search
                </Button>
              }
            />
          ) : (
            <EmptyState
              title="No events yet"
              description="Create the first event of the club and it will show up here."
              action={
                <Link
                  to="/events/new"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Create an event
                </Link>
              }
            />
          )}
        </>
      )}

      {errorMessage === null && hasEvents && (
        <div className="space-y-8">
          {isLoading && (
            <p className="text-sm text-slate-500" role="status">
              Updating results...
            </p>
          )}

          <EventGroup
            title="Upcoming"
            description="Events that take place today or later."
            events={upcomingEvents}
            emptyMessage="No upcoming events on this page."
            onDeleted={reloadEvents}
          />

          <EventGroup
            title="Past"
            description="Events that already took place."
            events={pastEvents}
            emptyMessage="No past events on this page."
            onDeleted={reloadEvents}
          />

          <Pagination
            page={page}
            pages={pages}
            total={total}
            isDisabled={isLoading}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
