import Controller from "../controller";
import {debug} from "../../config/config";
import axios from "axios";
import {delay} from "../../utils/mockRequest";
import {
  MOCK_DATAMART_STATUS_EMPTY,
  MOCK_DATAMART_STATUS_BUSY,
  MOCK_DATAMART_SYNCHRONIZATIONS
} from "../../mocks/app/datamart";
import {Synchronization} from "../../models/app/SyncProvider";
import {PredictedGrade, PredictiveModel} from "../../models/app/PredictiveModel";

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

  static getStatus() {
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

  static uploadModels(models: PredictiveModel[]): Promise<PredictiveModel[]> {
    if (debug()) {
      return delay(models, 1000);
    }

    return this.client.post(
      `models/upload`, models
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
      return delay(() => {}, 1000);
    }

    return this.client.delete(
      `models`
    ).then(response => response.data);
  }

  static getPredictions(userLoginID: string): Promise<PredictedGrade[]> {
    if (debug()) return delay([]);

    return this.client.get(
      `/datamart/predictions/${userLoginID}`
    ).then(response => response.data);
  }
}