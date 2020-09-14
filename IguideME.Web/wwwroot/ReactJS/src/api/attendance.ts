import Controller from "./controller";
import {IBackendResponse} from "../models/IBackendResponse";

export default class AttendanceController extends Controller {

  static uploadData(key: string, payload: any): IBackendResponse {
    return this.client.post(
      `Admin-attendance`,
      { key, payload }
    );
  }

  static getAll(): IBackendResponse {
    return this.client.get(
      `Admin-attendance`
    );
  }
}