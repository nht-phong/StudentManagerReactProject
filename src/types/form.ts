import type { EventFormat } from './event';

/**
 * The form keeps every value as a string because that is what an <input>
 * gives us. The numbers are converted only when we send data to the API.
 */
export interface EventFormValues {
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  format: EventFormat;
  location: string;
  joinUrl: string;
  capacity: string;
}

export type EventFormField = keyof EventFormValues;

/** One message per invalid field. An empty object means the form is valid. */
export type EventFormErrors = Partial<Record<EventFormField, string>>;

/** Remembers which fields the user already visited (to show errors on blur). */
export type EventFormTouched = Partial<Record<EventFormField, boolean>>;

/** The same form is used for both screens; only the date rule differs. */
export type EventFormMode = 'create' | 'edit';
