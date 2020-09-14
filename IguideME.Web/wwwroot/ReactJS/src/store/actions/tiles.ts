import {ITile} from "../../models/ITile";
import TileController from "../../api/tile";
import {
  constructAttendanceTile,
  constructDiscussionTile,
  constructGradesTile,
  constructLearningOutcomeTile,
  constructPerusallTile,
  constructPracticeSessionsTile, constructPredictionTile,
  constructQuizzesTile
} from "./helpers/tile";
import {store} from "../../utils/configureStore";
import PredictionController from "../../api/prediction";

export const fetchTiles = async () => {
  const response: ITile[] = [];

  store.dispatch({
    type: `SET_TILES_SUCCESS`,
    payload: null
  });

  response.push(constructQuizzesTile(await TileController.fetchQuizzes()));
  response.push(constructDiscussionTile(await TileController.fetchDiscussions()));
  response.push(constructPerusallTile(await TileController.fetchPerusall()));
  response.push(constructPracticeSessionsTile(await TileController.fetchPracticeSessions()));
  response.push(constructAttendanceTile(await TileController.fetchAttendance()));
  response.push(constructGradesTile(await TileController.fetchSubmissions()));
  response.push(constructLearningOutcomeTile());
  response.push(constructPredictionTile(await PredictionController.predict(response)));

  return {
    type: `SET_TILES_SUCCESS`,
    payload: response
  }
};
