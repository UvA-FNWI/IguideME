import { GradePredictorWeight } from "../../models/app/GradePredictor";
import Controller from "../controller";
import {debug} from "../../config/config";
import axios from "axios";
import {PredictiveModel} from "../../models/app/PredictiveModel";

export default class GradePredictorController extends Controller {

  public static getModels(): Promise<PredictiveModel[]> {
    if (debug()) return Promise.resolve([]);

    return this.client.get(
      `app/grade-predictor`
    ).then(response => response.data);
  }
}