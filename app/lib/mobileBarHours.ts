/**
 * Live Hours label for the mobile bar.
 * Same America/Toronto clock and window as the homepage
 * `barHoursLabel()` in public/wp-content/themes/queensway/assets/app.js,
 * which reads window.QCD_HOURS. Queensway inlines { open: 0, close: 1440 }.
 */
export const QCD_HOURS = { open: 0, close: 24 * 60 } as const;

export type HoursWindow = { open: number; close: number };

export function formatHour(minutes: number): string {
  const hour = Math.floor(minutes / 60) % 24;
  const suffix = hour < 12 ? " AM" : " PM";
  const display = hour % 12 || 12;
  return display + suffix;
}

export function torontoMinutes(date = new Date()): number {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto",
      hourCycle: "h23",
      hour: "numeric",
      minute: "numeric",
    }).formatToParts(date);
    let hour = 0;
    let minute = 0;
    for (const part of parts) {
      if (part.type === "hour") hour = Number(part.value);
      if (part.type === "minute") minute = Number(part.value);
    }
    return hour * 60 + minute;
  } catch {
    return date.getHours() * 60 + date.getMinutes();
  }
}

export function isOpen24Hours(hours: HoursWindow = QCD_HOURS): boolean {
  return hours.open === 0 && hours.close === 24 * 60;
}

/** "Open 24 hours", "Open now · until X", or "Closed · opens X". */
export function barHoursLabel(nowMinutes: number, hours: HoursWindow = QCD_HOURS): string {
  if (isOpen24Hours(hours)) return "Open 24 hours";
  if (nowMinutes >= hours.open && nowMinutes < hours.close) {
    return `Open now · until ${formatHour(hours.close)}`;
  }
  return `Closed · opens ${formatHour(hours.open)}`;
}

export function barHoursOpen(nowMinutes: number, hours: HoursWindow = QCD_HOURS): boolean {
  if (isOpen24Hours(hours)) return true;
  return nowMinutes >= hours.open && nowMinutes < hours.close;
}
