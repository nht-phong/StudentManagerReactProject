interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-slate-500"
    >
      <span
        className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600"
        aria-hidden="true"
      />
      <p className="text-sm">{message}</p>
    </div>
  );
}
