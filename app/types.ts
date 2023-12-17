export enum RoutineState {
  Done = "Done",
  BeDoing = "BeDoing",
  Todo = "Todo",
}

export enum SwipeType {
  Left = "Left",
  Right = "Right",
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
