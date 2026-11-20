import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-lg text-slate-400">
        ✦
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{description}</p>
      {action !== undefined && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
