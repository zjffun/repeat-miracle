export interface IRoutine {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
}

export interface ITemplate {
  id: string;
  name: string;
  routines: IRoutine[];
}
