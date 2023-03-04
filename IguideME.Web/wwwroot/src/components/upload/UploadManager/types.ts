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
  data: {[key: string]: any, grade: number, userID: string}[];
}

export interface IUploadProps {
  students: CanvasStudent[];
  data: {[key: string]: any, grade: number, userID: string}[];
  setData: (data: any) => any;
}
