export const CIGARETTE_TIME_ZONE = "America/Toronto";

const WEEKDAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: CIGARETTE_TIME_ZONE,
  weekday: "short",
});
const CLOCK = new Intl.DateTimeFormat("en-CA", {
  timeZone: CIGARETTE_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Owner-approved window: Mon-Thu 8pm-8am; Fri 5pm continuously through Mon 8am. */
export function isCigaretteScheduleActive(now = new Date()): boolean {
  const day = WEEKDAY.format(now);
  const parts = CLOCK.formatToParts(now);
  const minutes = Number(parts.find((part) => part.type === "hour")?.value) * 60
    + Number(parts.find((part) => part.type === "minute")?.value);
  if (day === "Sat" || day === "Sun") return true;
  if (day === "Fri") return minutes < 480 || minutes >= 1020;
  return minutes < 480 || minutes >= 1200;
}
