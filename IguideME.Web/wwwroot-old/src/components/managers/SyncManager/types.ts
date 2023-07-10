import moment from "moment";

export interface IProps {
  prevsuccess: boolean,
}

export interface IState {
  loaded: boolean,
  start: moment.Moment | undefined,
  elapsedTime: string | undefined,
  datamartError: boolean,
  currentTask: string | null,

  completedTasks: string[],
  currentTasks: string[]
}
