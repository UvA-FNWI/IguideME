import CanvasController from "../../api/controllers/canvas";
import DataMartController from "../../api/controllers/datamart";

export class DataMartActions {

  static SET_ASSIGNMENTS_SUCCESS = "SET_ASSIGNMENTS_SUCCESS";
  static SET_ASSIGNMENTS_ERROR = "SET_ASSIGNMENTS_ERROR";

  static SET_DISCUSSIONS_SUCCESS = "SET_DISCUSSIONS_SUCCESS";
  static SET_DISCUSSIONS_ERROR = "SET_DISCUSSIONS_ERROR";

  static SET_PREDICTIONS_SUCCESS = "SET_PREDICTIONS_SUCCESS";
  static SET_PREDICTIONS_ERROR = "SET_PREDICTIONS_ERROR";

  static loadAssignments = async () => {
    const course = await CanvasController.getAssignments();
    if (course){
      return {
        type: DataMartActions.SET_ASSIGNMENTS_SUCCESS,
        payload: course
      }
    }
    return {
      type: DataMartActions.SET_ASSIGNMENTS_ERROR,
    }
  }

  static loadDiscussions = async () => {
    const discussions = await CanvasController.getDiscussions();
    if (discussions)
      return {
        type: DataMartActions.SET_DISCUSSIONS_SUCCESS,
        payload: discussions
      }

    return {
      type: DataMartActions.SET_DISCUSSIONS_ERROR,
    }
  }

  static loadPredictions = async (user: string = 'self') => {
    const predictions = await DataMartController.getPredictions(user);

    return {
      type: DataMartActions.SET_PREDICTIONS_SUCCESS,
      payload: predictions
    }
  }
}
