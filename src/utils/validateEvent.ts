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
 * The messages are in Vietnamese because that is the language of the users of
 * the app; the rest of the source code stays in English.
 *
 * The only rule that depends on the screen is the date rule: an event created
 * today may not be in the past, but old events must stay editable.
 */
export function validateEvent(values: EventFormValues, mode: EventFormMode): EventFormErrors {
  const errors: EventFormErrors = {};

  const name = values.name.trim();
  if (name.length === 0) {
    errors.name = 'Tên sự kiện là bắt buộc.';
  } else if (name.length < NAME_MIN_LENGTH || name.length > NAME_MAX_LENGTH) {
    errors.name = `Tên sự kiện phải có từ ${NAME_MIN_LENGTH} đến ${NAME_MAX_LENGTH} ký tự.`;
  }

  if (values.date.length === 0) {
    errors.date = 'Ngày tổ chức là bắt buộc.';
  } else if (!isValidISODate(values.date)) {
    errors.date = 'Ngày tổ chức không hợp lệ.';
  } else if (mode === 'create' && isDateInThePast(values.date)) {
    errors.date = 'Ngày tổ chức không được là ngày trong quá khứ.';
  }

  if (values.startTime.length === 0) {
    errors.startTime = 'Giờ bắt đầu là bắt buộc.';
  } else if (!TIME_PATTERN.test(values.startTime)) {
    errors.startTime = 'Giờ bắt đầu không hợp lệ (định dạng HH:mm).';
  }

  if (values.endTime.length === 0) {
    errors.endTime = 'Giờ kết thúc là bắt buộc.';
  } else if (!TIME_PATTERN.test(values.endTime)) {
    errors.endTime = 'Giờ kết thúc không hợp lệ (định dạng HH:mm).';
  } else if (TIME_PATTERN.test(values.startTime) && values.endTime <= values.startTime) {
    // Times use the HH:mm format, so comparing them as text works.
    errors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu.';
  }

  if (values.format === 'offline') {
    if (values.location.trim().length === 0) {
      errors.location = 'Địa điểm là bắt buộc khi hình thức là Trực tiếp.';
    }
  } else {
    const joinUrl = values.joinUrl.trim();
    if (joinUrl.length === 0) {
      errors.joinUrl = 'Đường dẫn tham gia là bắt buộc khi hình thức là Trực tuyến.';
    } else if (!isValidHttpUrl(joinUrl)) {
      errors.joinUrl =
        'Đường dẫn tham gia phải là URL hợp lệ (ví dụ https://meet.example.com/abc).';
    }
  }

  const capacity = values.capacity.trim();
  if (capacity.length === 0) {
    errors.capacity = 'Số chỗ tối đa là bắt buộc.';
  } else if (!/^\d+$/.test(capacity)) {
    errors.capacity = 'Số chỗ tối đa phải là số nguyên.';
  } else {
    const capacityNumber = Number(capacity);
    if (capacityNumber < CAPACITY_MIN || capacityNumber > CAPACITY_MAX) {
      errors.capacity = `Số chỗ tối đa phải từ ${CAPACITY_MIN} đến ${CAPACITY_MAX}.`;
    }
  }

  return errors;
}
