import {CanvasStudent} from "../../../../../models/canvas/Student";

export interface IProps {
  query: string;
  student: CanvasStudent;
  updateStudent: (id: string, r: any) => any;
  studentRecord: any;
}