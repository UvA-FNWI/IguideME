import {Tile} from "../../../models/app/Tile"
import { PeerGrades, TilesGradeSummary } from "../types";
import { CanvasDiscussion } from "../../../models/canvas/Discussion";
import { LearningOutcome } from "../../../models/app/LearningGoal";
import { CanvasStudent } from "../../../models/canvas/Student";

export interface Data {
    title: string,
    grade: any,
    peergrade: any,
    max: any,
    tile: Tile
};

export interface IProps {
    tiles: Tile[],
    tilesGradeSummary: TilesGradeSummary[],
    peerGrades: PeerGrades[],
    discussions: CanvasDiscussion[],
    learningOutcomes: LearningOutcome[],
    student: CanvasStudent
}