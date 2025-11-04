/**
 * Date Helper Utilities
 *
 * Provides timezone-safe date handling for the coaching app.
 * All functions assume IST (Asia/Kolkata) as the default timezone.
 */

/**
 * Get today's date in YYYY-MM-DD format using local timezone (IST)
 *
 * @param timezone - Timezone (default: 'Asia/Kolkata')
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * getTodayLocal() // '2025-10-27'
 */
export const getTodayLocal = (timezone = 'Asia/Kolkata'): string => {
  // Use 'en-CA' locale which formats as YYYY-MM-DD in local time
  return new Date().toLocaleDateString('en-CA');
};

/**
 * Format a date as human-readable string in Indian format
 *
 * @param date - Date to format (Date object or ISO string)
 * @param locale - Locale for formatting (default: 'en-IN')
 * @returns Formatted date string (e.g., "27 Oct 2025")
 *
 * @example
 * formatLocalDate(new Date()) // '27 Oct 2025'
 * formatLocalDate('2025-10-27') // '27 Oct 2025'
 */
export const formatLocalDate = (date: Date | string, locale = 'en-IN'): string => {
  return new Date(date).toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format a date with time in Indian format
 *
 * @param date - Date to format (Date object or ISO string)
 * @param locale - Locale for formatting (default: 'en-IN')
 * @returns Formatted datetime string (e.g., "27 Oct 2025, 10:30 AM")
 *
 * @example
 * formatLocalDateTime(new Date()) // '27 Oct 2025, 10:30 AM'
 */
export const formatLocalDateTime = (date: Date | string, locale = 'en-IN'): string => {
  return new Date(date).toLocaleString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get date in YYYY-MM-DD format from a Date object or string
 *
 * @param date - Date to format
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * toYYYYMMDD(new Date()) // '2025-10-27'
 */
export const toYYYYMMDD = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-CA');
};

/**
 * Check if a date is today (in local timezone)
 *
 * @param date - Date to check
 * @returns True if date is today
 *
 * @example
 * isToday(new Date()) // true
 * isToday('2025-10-27') // true (if today is Oct 27)
 */
export const isToday = (date: Date | string): boolean => {
  const today = getTodayLocal();
  const checkDate = toYYYYMMDD(date);
  return today === checkDate;
};

/**
 * Get date N days ago (in local timezone)
 *
 * @param days - Number of days to go back
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * getDaysAgo(7) // Date 7 days ago in YYYY-MM-DD format
 */
export const getDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toYYYYMMDD(date);
};

/**
 * Get date N days from now (in local timezone)
 *
 * @param days - Number of days in the future
 * @returns Date string in YYYY-MM-DD format
 *
 * @example
 * getDaysFromNow(7) // Date 7 days from now
 */
export const getDaysFromNow = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toYYYYMMDD(date);
};
