import {PerformanceNotification} from "../../../../models/app/Notification";
import { Tile } from "../../../../models/app/Tile";
import {CanvasStudent} from "../../../../models/canvas/Student";

export interface IState {
  students: CanvasStudent[]
  notifications: PerformanceNotification[]
  tiles: Tile[]
  dates: Date[]
  rangeBool: boolean
}