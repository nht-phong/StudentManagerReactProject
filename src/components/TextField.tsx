import type { InputHTMLAttributes } from 'react';

type TextFieldType = 'text' | 'date' | 'time' | 'url' | 'number';

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onBlur' | 'value' | 'type'> {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  /** When set, the input is highlighted and the message is shown below it. */
  error?: string;
  hint?: string;
  type?: TextFieldType;
}

/**
 * One reusable input used by every text/date/time/number field of the form.
 * It is a controlled component: the parent owns the value.
 */
export default function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  type = 'text',
  required = false,
  className = '',
  ...rest
}: TextFieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter((idValue): idValue is string => idValue !== null)
    .join(' ');

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span className="ml-0.5 text-rose-600" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={id}
        type={type}
        value={value}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy.length > 0 ? describedBy : undefined}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onBlur={onBlur}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-2 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
        }`}
        {...rest}
      />

      {hint !== undefined && error === undefined && (
        <p id={hintId} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      )}

      {error !== undefined && (
        <p id={errorId} className="mt-1 text-xs font-medium text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
