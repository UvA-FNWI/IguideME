import {Tile} from "../../../models/app/Tile";
import {CanvasStudent} from "../../../models/canvas/Student";

export interface IProps {
  tile: Tile;
  reload: () => any;
  closeUploadMenu: () => any;
}

export interface IState {
  loaded: boolean;
  title: string;
  uploading: boolean;
  students: CanvasStudent[];
  data: any[];
  id_column: number;
  grade_column: number;
}

export interface IUploadProps {
  students: CanvasStudent[];
  data: any[];
  setData: (data: any) => any;
}
