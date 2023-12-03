function mod(n: number, m: number) {
  return ((n % m) + m) % m;
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

export function minutesToReadable(startMinutes: number, endMinutes: number) {
  let minutes = mod(endMinutes - startMinutes, 24 * 60);

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${h} hours ${m} minutes`;
}
