import {CanvasStudent} from "../../models/canvas/Student";

export interface IProps {
  setStudent?: (student: CanvasStudent | null) => any;
  studentPickView?: boolean;
}

export interface IState {
  loaded: boolean;
  students: CanvasStudent[];
}