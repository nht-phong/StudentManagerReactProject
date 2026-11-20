import type { ClubEvent, EventInput } from '../types/event';
import type { EventFormValues } from '../types/form';

/** A new, empty form. Exported as a function so every page gets its own copy. */
export function createEmptyEventFormValues(): EventFormValues {
  return {
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    format: 'offline',
    location: '',
    joinUrl: '',
    capacity: '',
  };
}

/** Turns an event coming from the API into the values used by the form. */
export function eventToFormValues(event: ClubEvent): EventFormValues {
  return {
    name: event.name,
    date: event.date,
    startTime: event.startTime,
    endTime: event.endTime,
    format: event.format,
    location: event.location,
    joinUrl: event.joinUrl,
    capacity: String(event.capacity),
  };
}

/**
 * Converts the form values into the body sent to the API.
 * The field that does not belong to the chosen format is cleared, so the
 * database never keeps a stale location or join link.
 */
export function formValuesToEventInput(values: EventFormValues): EventInput {
  return {
    name: values.name.trim(),
    date: values.date,
    startTime: values.startTime,
    endTime: values.endTime,
    format: values.format,
    location: values.format === 'offline' ? values.location.trim() : '',
    joinUrl: values.format === 'online' ? values.joinUrl.trim() : '',
    capacity: Number(values.capacity),
  };
}
