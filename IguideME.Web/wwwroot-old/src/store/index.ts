import {AnyAction, CombinedState, combineReducers, Reducer} from "redux";
import {routerReducer, RouterState} from 'react-router-redux';
import defaultReducer from "./default/reducers";
import {Course} from "../models/app/Course";
import {CanvasStudent} from "../models/canvas/Student";
import {Tile, TileEntry, AssignmentSubmission, TileGroup} from "../models/app/Tile";
import PeerComparison from "../components/StudentDashboard/TileGroup/Tile/PeerComparison";
import {CanvasAssignment} from "../models/canvas/Assignment";
import {CanvasDiscussion} from "../models/canvas/Discussion";
import {LearningGoal} from "../models/app/LearningGoal";
import {PredictedGrade} from "../models/app/PredictiveModel";
import {DashboardColumn} from "../models/app/Layout";

type ExpectedState = {
  routing: RouterState,
  course: Course | null,
  assignments: CanvasAssignment[];
  discussions: CanvasDiscussion[];
  user: CanvasStudent | null,
  dashboardColumns: DashboardColumn[],
  tiles: Tile[],
  tileGroups: TileGroup[],
  tileEntries: TileEntry[],
  submissions: AssignmentSubmission[],
  peerComparisons: PeerComparison[],
  tileGoals: LearningGoal[],
  predictions: PredictedGrade[]
}

const rootReducer:  Reducer<CombinedState<ExpectedState>, AnyAction> = combineReducers<ExpectedState>({
  // react
  routing: routerReducer,
  // app
  course: defaultReducer<Course>('COURSE', null),
  assignments: defaultReducer<CanvasAssignment[]>('ASSIGNMENTS', []),
  discussions: defaultReducer<CanvasDiscussion[]>('DISCUSSIONS', []),
  user: defaultReducer<CanvasStudent>('USER', null),
  dashboardColumns: defaultReducer<DashboardColumn[]>('DASHBOARD_COLUMNS', []),
  tiles: defaultReducer<Tile[]>('TILES', []),
  tileGroups: defaultReducer<TileGroup[]>('TILE_GROUPS', []),
  tileEntries: defaultReducer<TileEntry[]>('TILE_ENTRIES', []),
  submissions: defaultReducer<AssignmentSubmission[]>('SUBMISSIONS', []),
  peerComparisons: defaultReducer<PeerComparison[]>('PEER_COMPARISONS', []),
  tileGoals: defaultReducer<LearningGoal[]>('GOALS', []),
  predictions: defaultReducer<PredictedGrade[]>('PREDICTIONS', [])
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
