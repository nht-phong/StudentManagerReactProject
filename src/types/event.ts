export type EventFormat = 'offline' | 'online';

export type EventStatus = 'upcoming' | 'past';

/**
 * A club event as it is stored by json-server.
 * `date` uses the `YYYY-MM-DD` format, `startTime` and `endTime` use `HH:mm`.
 */
export interface ClubEvent {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  format: EventFormat;
  location: string;
  joinUrl: string;
  capacity: number;
}

/** The body we send to the API when creating or updating an event (no id yet). */
export type EventInput = Omit<ClubEvent, 'id'>;
