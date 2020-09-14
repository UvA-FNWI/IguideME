import Controller from "./controller";
import {IBackendResponse} from "../models/IBackendResponse";

export default class PracticeSessionsController extends Controller {

  static uploadData(key: string, payload: any): IBackendResponse {
    return this.client.post(
      `Admin-practice-sessions`,
      { key, payload }
    );
  }

  static getAll(): IBackendResponse {
    return this.client.get(
      `Admin-practice-sessions`
    );
  }
}