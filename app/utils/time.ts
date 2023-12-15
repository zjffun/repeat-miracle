function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const daysOfWeekAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getDefaultDaysArray() {
  const arr = Array.from({
    length: 7,
  }).fill(false) as boolean[];

  arr[1] = true;

  return arr;
}

export function hhmmToMinutes(hhmm: string) {
  const [hh, mm] = hhmm.split(":").map((n: string) => parseInt(n, 10));
  return hh * 60 + mm;
}

export function minutesToHhmm(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function getMinutesFromRange(startMinutes: number, endMinutes: number) {
  return mod(endMinutes - startMinutes, 24 * 60);
}

export function minutesToReadable(startMinutes: number, endMinutes: number) {
  let minutes = getMinutesFromRange(startMinutes, endMinutes);

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${h} hours ${m} minutes`;
}

export function getSecondsToday() {
  const date = new Date();
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}
