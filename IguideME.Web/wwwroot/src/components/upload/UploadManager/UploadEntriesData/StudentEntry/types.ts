import {CanvasStudent} from "../../../../../models/canvas/Student";

export interface IProps {
  student: CanvasStudent;
  updateStudent: (id: string, r: any) => any;
  studentRecord: any;
}