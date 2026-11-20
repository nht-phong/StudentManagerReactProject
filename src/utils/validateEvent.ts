import type { EventFormErrors, EventFormMode, EventFormValues } from '../types/form';
import { isDateInThePast, isValidISODate } from './date';

const NAME_MIN_LENGTH = 5;
const NAME_MAX_LENGTH = 100;
const CAPACITY_MIN = 1;
const CAPACITY_MAX = 500;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * The single source of truth for the form rules of the event form.
 * It receives the current form values and returns an object with one message
 * per invalid field. An empty object means the form can be submitted.
 *
 * The only rule that depends on the screen is the date rule: an event created
 * today may not be in the past, but old events must stay editable.
 */
export function validateEvent(values: EventFormValues, mode: EventFormMode): EventFormErrors {
  const errors: EventFormErrors = {};

  const name = values.name.trim();
  if (name.length === 0) {
    errors.name = 'Event name is required.';
  } else if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    errors.name = `Event name must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters.`;
  }

  if (values.date.length === 0) {
    errors.date = 'Event date is required.';
  } else if (!isValidISODate(values.date)) {
    errors.date = 'Event date is not a valid date.';
  } else if (mode === 'create' && isDateInThePast(values.date)) {
    errors.date = 'Event date cannot be in the past.';
  }

  if (values.startTime.length === 0) {
    errors.startTime = 'Start time is required.';
  } else if (!TIME_PATTERN.test(values.startTime)) {
    errors.startTime = 'Start time must be a valid time (HH:mm).';
  }

  if (values.endTime.length === 0) {
    errors.endTime = 'End time is required.';
  } else if (!TIME_PATTERN.test(values.endTime)) {
    errors.endTime = 'End time must be a valid time (HH:mm).';
  } else if (
    TIME_PATTERN.test(values.startTime) &&
    values.endTime <= values.startTime
  ) {
    // Times use the HH:mm format, so comparing them as text works.
    errors.endTime = 'End time must be after the start time.';
  }

  if (values.format === 'offline') {
    if (values.location.trim().length === 0) {
      errors.location = 'Location is required for an in-person event.';
    }
  } else {
    const joinUrl = values.joinUrl.trim();
    if (joinUrl.length === 0) {
      errors.joinUrl = 'Join link is required for an online event.';
    } else if (!isValidHttpUrl(joinUrl)) {
      errors.joinUrl = 'Join link must be a valid URL (for example https://meet.example.com/abc).';
    }
  }

  const capacity = values.capacity.trim();
  if (capacity.length === 0) {
    errors.capacity = 'Maximum capacity is required.';
  } else if (!/^\d+$/.test(capacity)) {
    errors.capacity = 'Maximum capacity must be a whole number.';
  } else {
    const capacityNumber = Number(capacity);
    if (capacityNumber < CAPACITY_MIN || capacityNumber > CAPACITY_MAX) {
      errors.capacity = `Maximum capacity must be between ${CAPACITY_MIN} and ${CAPACITY_MAX}.`;
    }
  }

  return errors;
}
