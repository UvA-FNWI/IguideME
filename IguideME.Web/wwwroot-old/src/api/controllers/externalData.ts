import Controller from "../controller";
import { studentIdStrings } from "../../common/Admin/helpers"

export default class ExternalDataController extends Controller {

  static validateData(data: any[]): boolean {
    if ( !("grade" in data[0]) )
    return false;

    for (let i = 0; i < studentIdStrings.length; i++) {
      if (studentIdStrings[i] in data[0]) {
        return true;
      }
    }

    return false;
  }
}