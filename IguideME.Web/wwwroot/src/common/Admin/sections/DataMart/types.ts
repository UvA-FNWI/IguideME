import {Synchronization} from "../../../../models/app/SyncProvider";

export interface IProps {
  
}

export interface IState {
  loaded: boolean,
  synchronizations: Synchronization[]
}