import {CanvasStudent} from "../../../../models/canvas/Student";

export interface IProps {
  students: CanvasStudent[];
  checked: string[];
  query: string;
  setChecked: (checked: string[]) => any;
}