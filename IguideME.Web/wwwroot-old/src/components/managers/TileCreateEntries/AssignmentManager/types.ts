import {CanvasAssignment} from "../../../../models/canvas/Assignment";
import {TileEntry} from "../../../../models/app/Tile";

export interface IProps {
  graphView: boolean;
  setGraphView: (val: boolean) => any;
  activeAssignments: TileEntry[];
  canvasAssignments: CanvasAssignment[];
}

export interface IState {
  tutorialOpen?: boolean;
}
