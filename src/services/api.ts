import axios from 'axios';

const DEFAULT_BASE_URL = 'http://localhost:4000';

/**
 * The one axios instance used by the whole app.
 * Components never import axios directly, they use the functions in
 * `services/eventsService.ts`, which use this instance.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/** Turns an unknown error (axios, network, ...) into a message we can show. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Cannot reach the API server. Make sure json-server is running with "npm run api", then try again.';
    }

    if (error.response.status === 404) {
      return 'The requested event could not be found. It may have been deleted.';
    }

    return `The API returned an error (status ${error.response.status}). Please try again.`;
  }

  return fallback;
}

/** json-server answers with a 404 when the id does not exist. */
export function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
