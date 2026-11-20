import Button from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center"
    >
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-rose-100 text-xl font-bold text-rose-600">
        !
      </div>
      <h2 className="mt-4 text-lg font-semibold text-rose-900">{title}</h2>
      <p className="mx-auto mt-1 max-w-lg text-sm text-rose-800">{message}</p>

      {onRetry !== undefined && (
        <Button variant="secondary" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
