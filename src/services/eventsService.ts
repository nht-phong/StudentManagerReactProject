import { api } from './api';
import type { PaginatedResponse } from '../types/api';
import type { ClubEvent, EventInput } from '../types/event';

export interface EventListParams {
  page: number;
  perPage: number;
  /** Sent to json-server as `name:contains`, so the API does the filtering. */
  search?: string;
}

export interface EventListResult {
  events: ClubEvent[];
  page: number;
  pages: number;
  total: number;
}

/** GET /events?_page=1&_per_page=6&_sort=-date,-startTime */
export async function getEvents({
  page,
  perPage,
  search = '',
}: EventListParams): Promise<EventListResult> {
  const keyword = search.trim();

  const { data } = await api.get<PaginatedResponse<ClubEvent>>('/events', {
    params: {
      _page: page,
      _per_page: perPage,
      // json-server reads "-" as "descending" and accepts several fields.
      _sort: '-date,-startTime',
      ...(keyword.length > 0 ? { 'name:contains': keyword } : {}),
    },
  });

  return {
    events: data.data,
    page,
    pages: Math.max(data.pages, 1),
    total: data.items,
  };
}

/** GET /events/:id */
export async function getEventById(id: string): Promise<ClubEvent> {
  const { data } = await api.get<ClubEvent>(`/events/${id}`);
  return data;
}

/** POST /events */
export async function createEvent(input: EventInput): Promise<ClubEvent> {
  const { data } = await api.post<ClubEvent>('/events', input);
  return data;
}

/** PUT /events/:id */
export async function updateEvent(id: string, input: EventInput): Promise<ClubEvent> {
  const { data } = await api.put<ClubEvent>(`/events/${id}`, input);
  return data;
}

/** DELETE /events/:id */
export async function deleteEvent(id: string): Promise<void> {
  await api.delete(`/events/${id}`);
}
