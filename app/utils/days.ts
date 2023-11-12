import { IRoutine } from "../types";

// TODO: use indexedDB instead of localStorage

export function getDays(): { date: string; routines: IRoutine[] }[] {
  try {
    return JSON.parse(localStorage.getItem("repeat-miracle-days") || "[]");
  } catch (error) {
    return [];
  }
}

export function getDay(date: string) {
  const days = getDays();
  return days.find((day) => day.date === date);
}

export function setDay({
  date,
  routines,
}: {
  date: string;
  routines: IRoutine[];
}) {
  const days = getDays();
  const newDays = days.map((day) => {
    if (day.date === date) {
      return { date, routines };
    }
    return day;
  });

  localStorage.setItem("repeat-miracle-days", JSON.stringify(newDays));
}
