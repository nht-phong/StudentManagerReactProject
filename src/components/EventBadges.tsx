import type { EventFormat, EventStatus } from '../types/event';

export function StatusBadge({ status }: { status: EventStatus }) {
  const classes =
    status === 'upcoming'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : 'bg-slate-100 text-slate-600 ring-slate-200';

  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${classes}`}>
      {status === 'upcoming' ? 'Sắp diễn ra' : 'Đã diễn ra'}
    </span>
  );
}

export function FormatBadge({ format }: { format: EventFormat }) {
  const classes =
    format === 'offline'
      ? 'bg-indigo-50 text-indigo-700 ring-indigo-200'
      : 'bg-sky-50 text-sky-700 ring-sky-200';

  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ${classes}`}>
      {format === 'offline' ? 'Trực tiếp' : 'Trực tuyến'}
    </span>
  );
}
