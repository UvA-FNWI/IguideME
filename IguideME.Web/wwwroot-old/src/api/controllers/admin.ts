import { debug } from "../../config/config";
import Controller from "../controller";

export default class AdminController extends Controller {

  static isAdmin(): Promise<boolean> {
    if (debug()) return Promise.resolve(true);

    return this.client.get(
      `is-admin`
    ).then(response => response.data);
  }
}