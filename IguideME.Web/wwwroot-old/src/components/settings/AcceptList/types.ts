import {CanvasStudent} from "../../../models/canvas/Student";

export interface IProps {

}

export interface IState {
  students: CanvasStudent[];
  enabled: boolean;
  accepted: string[];
  loaded: boolean;
}