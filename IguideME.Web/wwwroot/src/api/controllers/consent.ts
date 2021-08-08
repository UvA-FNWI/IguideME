import {AxiosResponse} from "axios";
import { debug } from "../../config/config";
import Controller from "../controller";
import {delay} from "../../utils/mockRequest";

export default class ConsentController extends Controller {

  static fetchConsent(): Promise<1 | 0 | -1> {
    if (debug()) return Promise.resolve(1);

    return this.client.get(
      `datamart/consent`
    ).then(response => response.data);
  }

  static setConsent(granted: boolean | null): Promise<AxiosResponse<boolean>> {
    if (debug()) return delay(granted);

    return this.client.post(
      `datamart/consent`,
      { granted: granted === null ? -1 : (granted ? 1 : 0) }
    );
  }
}