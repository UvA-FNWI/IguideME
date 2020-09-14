import Controller from "./controller";
import {IBackendResponse} from "../models/IBackendResponse";

export default class PerusallController extends Controller {

  static uploadData(key: string, payload: any): IBackendResponse {
    return this.client.post(
      `Admin-perusall`,
      { key, payload }
    );
  }

  static getAll(): IBackendResponse {
    return this.client.get(
      `Admin-perusall`
    );
  }
}