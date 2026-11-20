import Button from './Button';

interface PaginationProps {
  page: number;
  pages: number;
  total: number;
  isDisabled?: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  pages,
  total,
  isDisabled = false,
  onPageChange,
}: PaginationProps) {
  if (pages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row"
    >
      <p className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-700">{page}</span> of {pages} · {total}{' '}
        {total === 1 ? 'event' : 'events'}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            onPageChange(page - 1);
          }}
          disabled={isDisabled || page <= 1}
        >
          Previous
        </Button>

        <Button
          variant="secondary"
          onClick={() => {
            onPageChange(page + 1);
          }}
          disabled={isDisabled || page >= pages}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
