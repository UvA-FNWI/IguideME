import {TileEntry} from "../../../../models/app/Tile";
import {CanvasDiscussion} from "../../../../models/canvas/Discussion";

export interface IProps {
  activeDiscussions: TileEntry[];
  canvasDiscussions: CanvasDiscussion[];
  wildcard: boolean;
  setWildcard: (val: boolean) => any;
}
