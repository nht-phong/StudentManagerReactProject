import { Link } from 'react-router-dom';
import type { ClubEvent } from '../types/event';
import { formatEventDate, formatTimeRange, getEventStatus } from '../utils/date';
import DeleteEventButton from './DeleteEventButton';
import { FormatBadge, StatusBadge } from './EventBadges';

interface EventCardProps {
  event: ClubEvent;
  onDeleted: () => void;
}

export default function EventCard({ event, onDeleted }: EventCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-slate-900">
          <Link to={`/events/${event.id}`} className="transition hover:text-indigo-700">
            {event.name}
          </Link>
        </h3>

        <StatusBadge status={getEventStatus(event.date)} />
      </div>

      <dl className="mt-3 space-y-1.5 text-sm text-slate-600">
        <div>
          <dt className="sr-only">Ngày và giờ</dt>
          <dd>
            {formatEventDate(event.date)} · {formatTimeRange(event.startTime, event.endTime)}
          </dd>
        </div>

        <div>
          <dt className="sr-only">Hình thức</dt>
          <dd>
            <FormatBadge format={event.format} />
          </dd>
        </div>

        <div className="flex gap-2">
          <dt className="sr-only">
            {event.format === 'offline' ? 'Địa điểm' : 'Đường dẫn tham gia'}
          </dt>
          <dd className="truncate">
            {event.format === 'offline' ? event.location : event.joinUrl}
          </dd>
        </div>

        <div>
          <dt className="sr-only">Số chỗ tối đa</dt>
          <dd>{event.capacity} chỗ</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-1 border-t border-slate-100 pt-4">
        <Link
          to={`/events/${event.id}`}
          className="rounded-lg px-2 py-1.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          Xem chi tiết
        </Link>
        <Link
          to={`/events/${event.id}/edit`}
          className="rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Sửa
        </Link>
        <DeleteEventButton event={event} onDeleted={onDeleted} className="ml-auto" />
      </div>
    </article>
  );
}
