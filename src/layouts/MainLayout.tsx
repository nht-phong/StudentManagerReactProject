import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const navItemBase =
  'rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500';

function navItemClass(isActive: boolean): string {
  return isActive
    ? `${navItemBase} bg-indigo-50 text-indigo-700`
    : `${navItemBase} text-slate-600 hover:bg-slate-100 hover:text-slate-900`;
}

/** Header + page content + footer, shared by every page of the app. */
export default function MainLayout() {
  const { pathname } = useLocation();

  // Every navigation starts at the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const isEventsActive = pathname.startsWith('/events') && pathname !== '/events/new';
  const isNewEventActive = pathname === '/events/new';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3 sm:px-6">
          <Link
            to="/events"
            className="flex items-center gap-2.5 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
              CE
            </span>
            <span className="text-base font-semibold tracking-tight">Club Event Manager</span>
          </Link>

          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <Link
              to="/events"
              className={navItemClass(isEventsActive)}
              aria-current={isEventsActive ? 'page' : undefined}
            >
              Events
            </Link>
            <Link
              to="/events/new"
              className={navItemClass(isNewEventActive)}
              aria-current={isNewEventActive ? 'page' : undefined}
            >
              New event
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-5xl px-4 py-5 text-sm text-slate-500 sm:px-6">
          <p>Club Event Manager — a React + TypeScript practice project.</p>
        </div>
      </footer>
    </div>
  );
}
