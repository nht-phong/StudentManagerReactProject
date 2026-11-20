import type { EventStatus } from '../types/event';

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Returns today's date as `YYYY-MM-DD`, using the local time zone. */
export function getTodayISO(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/** Checks the format and also rejects impossible dates such as 2026-02-31. */
export function isValidISODate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  // If the day does not exist, JavaScript silently moves to the next month,
  // so comparing the round trip is an easy way to detect it.
  return getTodayISO(parsed) === value;
}

/** Example output: "Sat, 28 Nov 2026". */
export function formatEventDate(value: string): string {
  if (!isValidISODate(value)) {
    return value;
  }

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

export function formatTimeRange(startTime: string, endTime: string): string {
  return `${startTime} – ${endTime}`;
}

/** An event is "upcoming" from today (included) until the future. */
export function getEventStatus(date: string, today: string = getTodayISO()): EventStatus {
  return date >= today ? 'upcoming' : 'past';
}

export function isDateInThePast(date: string, today: string = getTodayISO()): boolean {
  return date < today;
}
