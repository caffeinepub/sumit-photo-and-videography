import type { Time } from '../types/orders';

/**
 * Convert HTML date input string (YYYY-MM-DD) to backend Time (nanoseconds)
 */
export function dateToTime(dateString: string): Time {
  const date = new Date(dateString);
  // Convert milliseconds to nanoseconds
  return BigInt(date.getTime()) * BigInt(1_000_000);
}

/**
 * Convert backend Time (nanoseconds) to HTML date input string (YYYY-MM-DD)
 */
export function timeToDate(time: Time): string {
  // Convert nanoseconds to milliseconds
  const milliseconds = Number(time) / 1_000_000;
  const date = new Date(milliseconds);
  return date.toISOString().split('T')[0];
}

/**
 * Format backend Time to human-readable date string
 */
export function formatTime(time: Time): string {
  const milliseconds = Number(time) / 1_000_000;
  const date = new Date(milliseconds);
  return date.toLocaleDateString();
}

/**
 * Format backend Time to human-readable date and time string
 */
export function formatDateTime(time: Time): string {
  const milliseconds = Number(time) / 1_000_000;
  const date = new Date(milliseconds);
  return date.toLocaleString();
}
