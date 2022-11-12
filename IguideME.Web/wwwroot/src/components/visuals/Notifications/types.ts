import { PerformanceNotification } from "../../../models/app/Notification";
import { Tile } from "../../../models/app/Tile";


export interface IProps {
    outperforming: PerformanceNotification[],
    closing: PerformanceNotification[],
    moreEffort: PerformanceNotification[],
    tiles: Tile[]
}