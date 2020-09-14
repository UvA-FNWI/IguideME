import Controller from "./controller";
import {IBackendResponse} from "../models/IBackendResponse";

export default class AdminController extends Controller {

  static fetchIsAdmin(): IBackendResponse {
    return this.client.get(
      `is-admin`
    );
  }
}