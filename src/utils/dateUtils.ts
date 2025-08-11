import { Timestamp } from 'firebase/firestore';

export function toDate(dateValue: Timestamp | Date | null | undefined): Date | null {
  if (!dateValue) return null;
  return dateValue instanceof Timestamp ? dateValue.toDate() : new Date(dateValue);
}

export function formatDate(dateValue: Timestamp | Date | null | undefined, locale: string = 'id-ID'): string {
  const date = toDate(dateValue);
  return date ? date.toLocaleString(locale) : '-';
}

export function formatTime(dateValue: Timestamp | Date | null | undefined, locale: string = 'id-ID'): string {
  const date = toDate(dateValue);
  return date ? date.toLocaleTimeString(locale) : '-';
}

export function formatDateTime(dateValue: Timestamp | Date | null | undefined, locale: string = 'id-ID'): string {
  const date = toDate(dateValue);
  return date ? date.toLocaleString(locale) : '-';
}
