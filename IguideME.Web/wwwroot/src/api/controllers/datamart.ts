import Controller from "../controller";
import { debug } from "../../config/config";
import { delay } from "../../utils/mockRequest";
import {
  MOCK_DATAMART_STATUS_EMPTY,
  MOCK_DATAMART_STATUS_BUSY,
  MOCK_DATAMART_SYNCHRONIZATIONS
} from "../../mocks/app/datamart";
import { Synchronization } from "../../models/app/SyncProvider";
import { PredictedGrade, PredictiveModel } from "../../models/app/PredictiveModel";

// TODO: ?
// eslint-disable-next-line
import { NotificationStatus, PerformanceNotification } from "../../models/app/Notification";
import { AppAcceptList } from "../../models/app/AcceptList";
import { GradePredictionModel } from "../../common/Admin/sections/grades/GradePredictor/ModelConfigurator/interfaces";

export default class DataMartController extends Controller {

  static startNewSync() {
    // when in debug mode always accept the handshake
    if (debug()) {
      window.localStorage.setItem("debugHandshake", '1');
      return delay(true);
    }

    return this.client.post(
      `datamart/start-sync`, {}
    ).then(_ => true).catch(() => false);
  }

  static getStatus(): Promise<{ [key: string]: any }> {
    if (debug()) {
      // if handshake was made pretend it's busy making the synchronization
      return delay(
        localStorage.getItem('debugHandshake') === '1' ?
          MOCK_DATAMART_STATUS_BUSY : MOCK_DATAMART_STATUS_EMPTY);
    }

    return this.client.get(
      `datamart/status`
    ).then(response => response.data);
  }

  static getSynchronizations(): Promise<Synchronization[]> {
    if (debug()) {
      return delay(MOCK_DATAMART_SYNCHRONIZATIONS, 1000);
    }

    return this.client.get(
      `datamart/synchronizations`
    ).then(response => response.data);
  }

  static uploadModel(model: GradePredictionModel): Promise<GradePredictionModel> {
    if (debug()) {
      return delay(model, 1000);
    }

    return this.client.post(
      `models/upload`, model
    ).then(response => response.data);
  }

  static getModels(): Promise<PredictiveModel[]> {
    if (debug()) {
      return delay([], 1000);
    }

    return this.client.get(
      `models`
    ).then(response => response.data);
  }

  static deleteModels(): Promise<void> {
    if (debug()) {
      return delay(() => { }, 1000);
    }

    return this.client.delete(
      `models`
    ).then(response => response.data);
  }

  static getPredictions(userLoginID: string): Promise<PredictedGrade[]> {
    if (debug()) return delay([
      { graded_components: 1, grade: 5 } as PredictedGrade,
      { graded_components: 3, grade: 7 } as PredictedGrade,
      { graded_components: 2, grade: 7.6 } as PredictedGrade,
      { graded_components: 1, grade: 6.6 } as PredictedGrade,
      { graded_components: 2, grade: 8.2 } as PredictedGrade,
      { graded_components: 1, grade: 8.5 } as PredictedGrade,
      { graded_components: 2, grade: 7.8 } as PredictedGrade,
    ]);

    return this.client.get(
      `/datamart/predictions/${userLoginID}`
    ).then(response => response.data);
  }

  static getNotifications(userLoginID: string): Promise<PerformanceNotification[]> {
    if (debug()) return delay([
      { user_login_id: userLoginID, tile_id: 2, status: "outperforming peers" },
      { user_login_id: userLoginID, tile_id: 4, status: "closing the gap" }
    ]);

    return this.client.get(
      `/datamart/notifications/${userLoginID}`
    ).then(response => response.data);
  }

  static getAllNotifications(): Promise<PerformanceNotification[]> {
    if (debug()) return delay([
      { user_login_id: "28332183", tile_id: 2, status: "outperforming peers" },
      { user_login_id: "95366984", tile_id: 4, status: "closing the gap" }
    ])

    return this.client.get(
      `/datamart/notifications`
    ).then(response => response.data);
  }

  static getAcceptList(): Promise<AppAcceptList[]> {
    if (debug()) return delay([]);

    return this.client.get(
      `/datamart/accept-list`
    ).then(response => response.data);
  }

  static createAcceptList(list: AppAcceptList[]): Promise<AppAcceptList[]> {
    if (debug()) return delay([]);

    return this.client.post(
      `/datamart/accept-list`, list
    ).then(response => response.data);
  }
}
