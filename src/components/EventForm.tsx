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
    label: 'Trực tiếp',
    description: 'Người tham dự có mặt tại địa điểm tổ chức.',
  },
  {
    value: 'online',
    label: 'Trực tuyến',
    description: 'Người tham dự vào bằng đường dẫn trực tuyến.',
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
          Vui lòng sửa các ô được đánh dấu trước khi lưu.
        </div>
      )}

      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <TextField
          id="event-name"
          label="Tên sự kiện"
          value={values.name}
          onChange={(value) => {
            handleChange('name', value);
          }}
          onBlur={() => {
            handleBlur('name');
          }}
          error={visibleError('name')}
          hint="Từ 5 đến 100 ký tự."
          placeholder="VD: Workshop thiết kế UI/UX"
          required
          autoComplete="off"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="event-date"
            label="Ngày tổ chức"
            type="date"
            value={values.date}
            onChange={(value) => {
              handleChange('date', value);
            }}
            onBlur={() => {
              handleBlur('date');
            }}
            error={visibleError('date')}
            hint={mode === 'create' ? 'Ngày tổ chức không được ở quá khứ.' : undefined}
            min={mode === 'create' ? getTodayISO() : undefined}
            required
          />

          <TextField
            id="event-capacity"
            label="Số chỗ tối đa"
            type="number"
            value={values.capacity}
            onChange={(value) => {
              handleChange('capacity', value);
            }}
            onBlur={() => {
              handleBlur('capacity');
            }}
            error={visibleError('capacity')}
            hint="Số nguyên từ 1 đến 500."
            min={1}
            max={500}
            step={1}
            inputMode="numeric"
            required
          />

          <TextField
            id="event-start-time"
            label="Giờ bắt đầu"
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
            label="Giờ kết thúc"
            type="time"
            value={values.endTime}
            onChange={(value) => {
              handleChange('endTime', value);
            }}
            onBlur={() => {
              handleBlur('endTime');
            }}
            error={visibleError('endTime')}
            hint="Giờ kết thúc phải sau giờ bắt đầu."
            required
          />
        </div>

        <RadioGroup
          name="event-format"
          legend="Hình thức"
          value={values.format}
          options={formatOptions}
          onChange={handleFormatChange}
        />

        {values.format === 'offline' ? (
          <TextField
            id="event-location"
            label="Địa điểm"
            value={values.location}
            onChange={(value) => {
              handleChange('location', value);
            }}
            onBlur={() => {
              handleBlur('location');
            }}
            error={visibleError('location')}
            placeholder="VD: Phòng Lab 204 - Tòa B"
            hint="Bắt buộc vì sự kiện tổ chức trực tiếp."
            required
            autoComplete="off"
          />
        ) : (
          <TextField
            id="event-join-url"
            label="Đường dẫn tham gia"
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
            hint="URL đầy đủ, bắt đầu bằng http:// hoặc https://."
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
          Hủy
        </Link>

        <Button type="submit" isLoading={isSubmitting} className="sm:min-w-44">
          {isSubmitting ? 'Đang lưu...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
