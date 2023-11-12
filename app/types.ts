export interface IRoutine {
  name: string;
  startTime: number;
  endTime: number;
}

export interface ITemplate {
  id: string;
  name: string;
  routines: IRoutine[];
}
