import axios from "axios";
import Controller from "./controller";
import {IBackendResponse} from "../models/IBackendResponse";

export default class ConsentController extends Controller {

  static fetchConsent(): IBackendResponse {
    return this.client.get(
      `consent`
    );
  }

  static setConsent(granted: boolean | null): IBackendResponse {
    return this.client.post(
      `consent`,
      { granted: granted === null ? -1 : (granted ? 1 : 0) }
    );
  }
}