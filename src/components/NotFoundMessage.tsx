import { Link } from 'react-router-dom';

interface NotFoundMessageProps {
  title: string;
  description: string;
}

/** Reused by the 404 page, the detail page and the edit page. */
export default function NotFoundMessage({ title, description }: NotFoundMessageProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
      <p className="text-5xl font-black tracking-tight text-indigo-200">404</p>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p>

      <Link
        to="/events"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        Back to the event list
      </Link>
    </div>
  );
}
