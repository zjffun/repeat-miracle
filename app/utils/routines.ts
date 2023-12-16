import { IRoutine } from "../types";

export function sortRoutines(routines: IRoutine[]) {
  return routines.sort((a, b) => {
    return a.startTime - b.startTime || a.endTime - b.endTime;
  });
}
