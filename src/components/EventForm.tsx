import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { EventFormat } from '../types/event';
import type {
  EventFormField,
  EventFormMode,
  EventFormTouched,
  EventFormValues,
} from '../types/form';
import type { RadioOption } from '../types/ui';
import { getTodayISO } from '../utils/date';
import { validateEvent } from '../utils/validateEvent';
import Button from './Button';
import RadioGroup from './RadioGroup';
import TextField from './TextField';

const formatOptions: ReadonlyArray<RadioOption<EventFormat>> = [
  {
    value: 'offline',
    label: 'In person',
    description: 'Guests meet at a physical venue.',
  },
  {
    value: 'online',
    label: 'Online',
    description: 'Guests join through a meeting link.',
  },
];

interface EventFormProps {
  mode: EventFormMode;
  initialValues: EventFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  /** Where the Cancel button goes (the list page for create, detail for edit). */
  cancelTo: string;
  onSubmit: (values: EventFormValues) => void;
}

/**
 * The same component is used by the "create" and the "edit" page.
 * The difference is `mode` (date rule) and `initialValues` (filled form on edit).
 */
export default function EventForm({
  mode,
  initialValues,
  submitLabel,
  isSubmitting,
  cancelTo,
  onSubmit,
}: EventFormProps) {
  const [values, setValues] = useState<EventFormValues>(initialValues);
  const [touched, setTouched] = useState<EventFormTouched>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // All rules live in one function, so the errors are always up to date.
  const errors = validateEvent(values, mode);
  const hasErrors = Object.keys(errors).length > 0;

  /** A message is only shown after the field was visited or the form was sent. */
  function visibleError(field: EventFormField): string | undefined {
    if (!hasSubmitted && touched[field] !== true) {
      return undefined;
    }

    return errors[field];
  }

  function handleChange(field: EventFormField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleFormatChange(format: EventFormat) {
    setValues((current) => ({
      ...current,
      format,
      // Keep the field of the chosen format, clear the other one.
      location: format === 'offline' ? current.location : '',
      joinUrl: format === 'online' ? current.joinUrl : '',
    }));
  }

  function handleBlur(field: EventFormField) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    if (hasErrors) {
      return;
    }

    onSubmit(values);
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {hasSubmitted && hasErrors && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          Please fix the highlighted fields before saving.
        </div>
      )}

      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <TextField
          id="event-name"
          label="Event name"
          value={values.name}
          onChange={(value) => {
            handleChange('name', value);
          }}
          onBlur={() => {
            handleBlur('name');
          }}
          error={visibleError('name')}
          hint="Between 5 and 100 characters."
          placeholder="e.g. UI/UX Design Workshop"
          required
          autoComplete="off"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="event-date"
            label="Event date"
            type="date"
            value={values.date}
            onChange={(value) => {
              handleChange('date', value);
            }}
            onBlur={() => {
              handleBlur('date');
            }}
            error={visibleError('date')}
            hint={mode === 'create' ? 'The date cannot be in the past.' : undefined}
            min={mode === 'create' ? getTodayISO() : undefined}
            required
          />

          <TextField
            id="event-capacity"
            label="Maximum capacity"
            type="number"
            value={values.capacity}
            onChange={(value) => {
              handleChange('capacity', value);
            }}
            onBlur={() => {
              handleBlur('capacity');
            }}
            error={visibleError('capacity')}
            hint="A whole number from 1 to 500."
            min={1}
            max={500}
            step={1}
            inputMode="numeric"
            required
          />

          <TextField
            id="event-start-time"
            label="Start time"
            type="time"
            value={values.startTime}
            onChange={(value) => {
              handleChange('startTime', value);
            }}
            onBlur={() => {
              handleBlur('startTime');
            }}
            error={visibleError('startTime')}
            required
          />

          <TextField
            id="event-end-time"
            label="End time"
            type="time"
            value={values.endTime}
            onChange={(value) => {
              handleChange('endTime', value);
            }}
            onBlur={() => {
              handleBlur('endTime');
            }}
            error={visibleError('endTime')}
            hint="The end time must be after the start time."
            required
          />
        </div>

        <RadioGroup
          name="event-format"
          legend="Format"
          value={values.format}
          options={formatOptions}
          onChange={handleFormatChange}
        />

        {values.format === 'offline' ? (
          <TextField
            id="event-location"
            label="Location"
            value={values.location}
            onChange={(value) => {
              handleChange('location', value);
            }}
            onBlur={() => {
              handleBlur('location');
            }}
            error={visibleError('location')}
            placeholder="e.g. Lab 204 - Building B"
            hint="Required because this event is in person."
            required
            autoComplete="off"
          />
        ) : (
          <TextField
            id="event-join-url"
            label="Join link"
            type="url"
            value={values.joinUrl}
            onChange={(value) => {
              handleChange('joinUrl', value);
            }}
            onBlur={() => {
              handleBlur('joinUrl');
            }}
            error={visibleError('joinUrl')}
            placeholder="https://meet.example.com/abc"
            hint="A full URL starting with http:// or https://."
            required
            autoComplete="off"
          />
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Link
          to={cancelTo}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Cancel
        </Link>

        <Button type="submit" isLoading={isSubmitting} className="sm:min-w-44">
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
