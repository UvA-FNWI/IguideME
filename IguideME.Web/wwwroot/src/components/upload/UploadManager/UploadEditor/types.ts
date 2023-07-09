import { CanvasStudent } from "../../../../models/canvas/Student";

export interface IProps {
    students: CanvasStudent[];
    data: string[][];
    setData: (data: string[][]) => void;
    columns: {grade: number, id: number};
    collapsed: boolean;
}

export interface IState {
}
