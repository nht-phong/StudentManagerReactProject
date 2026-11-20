import type { RadioOption } from '../types/ui';

interface RadioGroupProps<T extends string> {
  name: string;
  legend: string;
  value: T;
  options: ReadonlyArray<RadioOption<T>>;
  onChange: (value: T) => void;
  error?: string;
}

/**
 * Reusable radio group (generic over the value type). Used for the event
 * format, but it would work for any small set of options.
 */
export default function RadioGroup<T extends string>({
  name,
  legend,
  value,
  options,
  onChange,
  error,
}: RadioGroupProps<T>) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-medium text-slate-700">{legend}</legend>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const inputId = `${name}-${option.value}`;
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500'
                  : 'border-slate-300 bg-white hover:border-slate-400'
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => {
                  onChange(option.value);
                }}
                className="mt-0.5 h-4 w-4 accent-indigo-600"
              />
              <span>
                <span className="block text-sm font-medium text-slate-900">{option.label}</span>
                {option.description !== undefined && (
                  <span className="mt-0.5 block text-xs text-slate-500">{option.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {error !== undefined && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
    </fieldset>
  );
}
