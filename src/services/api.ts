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
      return 'Không kết nối được tới API. Hãy chạy json-server bằng lệnh "npm run api" rồi thử lại.';
    }

    if (error.response.status === 404) {
      return 'Không tìm thấy sự kiện. Có thể sự kiện đã bị xóa.';
    }

    return `API trả về lỗi (mã ${error.response.status}). Vui lòng thử lại.`;
  }

  return fallback;
}

/** json-server answers with a 404 when the id does not exist. */
export function isNotFoundError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
