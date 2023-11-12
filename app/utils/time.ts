export function hhmmToMinutes(hhmm: string) {
  const [hh, mm] = hhmm.split(":").map((n: string) => parseInt(n, 10));
  return hh * 60 + mm;
}

export function minutesToHhmm(minutes: number) {
  const hh = Math.floor(minutes / 60);
  const mm = minutes % 60;
  return `${hh}:${mm < 10 ? `0${mm}` : mm}`;
}
