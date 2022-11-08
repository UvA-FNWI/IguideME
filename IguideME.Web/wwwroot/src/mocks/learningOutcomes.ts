import {LearningOutcome} from "../models/app/LearningGoal";
import {editState} from "../models/app/Tile";

export const MOCK_LEARNING_OUTCOMES: LearningOutcome[] = [
    {success: false, goal: {id: 1, state: editState.new, tile_id: 1, title: "test", requirements: []}}
]
