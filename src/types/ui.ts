export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

/** One option of the reusable radio group (used for the event format). */
export interface RadioOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}
