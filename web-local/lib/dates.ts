const DAY_ABBR = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface CalendarDay {
  date: string; // yyyy-mm-dd
  day: number; // 1-31
  weekday: string; // "Wed"
}

export interface CalendarWeek {
  label: string; // "WEEK 1"
  days: CalendarDay[];
}

/** Splits the month into 7-day chunks starting on day 1, mirroring the
 *  sheet's "WEEK 1 / WEEK 2 / ..." grouping (each block is 7 consecutive
 *  calendar days, not necessarily Mon-Sun). */
export function buildCalendarWeeks(year: number, month: number): CalendarWeek[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const weeks: CalendarWeek[] = [];

  for (let i = 0; i < daysInMonth; i += 7) {
    const days: CalendarDay[] = [];
    for (let d = i + 1; d <= Math.min(i + 7, daysInMonth); d++) {
      const dateObj = new Date(year, month - 1, d);
      days.push({
        date: toISODate(dateObj),
        day: d,
        weekday: DAY_ABBR[dateObj.getDay()],
      });
    }
    weeks.push({ label: `WEEK ${weeks.length + 1}`, days });
  }
  return weeks;
}

export function toISODate(d: Date): string {
  // Format the LOCAL date parts directly. toISOString() converts through UTC first,
  // which silently shifts the date back a day for any timezone ahead of UTC
  // (e.g. IST, UTC+5:30) — local midnight becomes 18:30 the previous day in UTC.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
