import moment from "moment";

export interface IProps {
  
}

export interface IState {
  loaded: boolean,
  start: moment.Moment | undefined,
  elapsedTime: string | undefined,
  datamartError: boolean,

  completedTasks: string[],
  currentTasks: string[]
}