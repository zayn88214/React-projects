/**
 * All formatting here takes an IANA timezone string and formats using that
 * zone explicitly, rather than the browser's local zone, so a searched
 * city's local time is always correct regardless of where the user is.
 */

export function formatLocalTime(isoOrDate: string | Date, timezone: string): string {
  const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(date);
}

export function formatLocalDateLong(isoOrDate: string | Date, timezone: string): string {
  const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  }).format(date);
}

export function formatHourLabel(iso: string, timezone: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    timeZone: timezone,
  }).format(date);
}

export function formatDayLabel(iso: string, timezone: string, index: number): string {
  if (index === 0) return 'Today';
  const date = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: timezone,
  }).format(date);
}

export function isCurrentlyDay(nowIso: string, sunriseIso: string, sunsetIso: string): boolean {
  const now = new Date(nowIso).getTime();
  const sunrise = new Date(sunriseIso).getTime();
  const sunset = new Date(sunsetIso).getTime();
  return now >= sunrise && now < sunset;
}

/** Fraction of daylight elapsed, clamped 0-1, for the sun-arc gauge. */
export function dayProgress(nowIso: string, sunriseIso: string, sunsetIso: string): number {
  const now = new Date(nowIso).getTime();
  const sunrise = new Date(sunriseIso).getTime();
  const sunset = new Date(sunsetIso).getTime();
  if (sunset <= sunrise) return 0;
  return Math.min(1, Math.max(0, (now - sunrise) / (sunset - sunrise)));
}
