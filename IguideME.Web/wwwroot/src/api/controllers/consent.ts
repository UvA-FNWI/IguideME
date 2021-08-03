import {AxiosResponse} from "axios";
import { debug } from "../../config/config";
import Controller from "../controller";

export default class ConsentController extends Controller {

  static fetchConsent(): Promise<1 | 0 | -1> {
    if (debug()) return Promise.resolve(1);

    return this.client.get(
      `datamart/consent`
    ).then(response => response.data);
  }

  static setConsent(granted: boolean | null): Promise<AxiosResponse<boolean>> {
    return this.client.post(
      `datamart/consent`,
      { granted: granted === null ? -1 : (granted ? 1 : 0) }
    );
  }
}