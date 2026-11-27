import { legacyReasons } from "./legacy";

const formatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Africa/Cairo", year: "numeric", month: "2-digit", day: "2-digit",
});
export const cairoDay = (time = Date.now()) => formatter.format(time);

function startOfDay(date: string) {
  const utc = Date.parse(date);
  let low = utc - 43200000;
  let high = utc + 43200000;
  while (high - low > 1) {
    const mid = Math.floor((high + low) / 2);
    if (cairoDay(mid) < date) low = mid;
    else high = mid;
  }
  return new Date(high).toISOString();
}

export const schedule = legacyReasons.map((reason) => {
  const date = reason.unlockDate.slice(0, 10);
  return { ...reason, date, unlockDate: startOfDay(date),
    content: reason.content.trim() === "Type your reason here..." ? "" : reason.content };
});
