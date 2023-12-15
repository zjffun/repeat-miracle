export enum RoutineState {
  Done = "done",
  BeDoing = "beDoing",
  Todo = "todo",
}

export interface IRoutine {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  progress?: number;
  firstBeDoing?: boolean;
}

export interface ITemplate {
  id: string;
  name: string;
  routines: IRoutine[];
  daysOfWeek: boolean[];
}

export interface ITodayInfo {
  date?: string;
  templateId?: string;
}
