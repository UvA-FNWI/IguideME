import { debug } from "../../config/config";
import Controller from "../controller";
import {CanvasStudent} from "../../models/canvas/Student";
import {ConsentData} from "../../models/app/ConsentData";
import {MOCK_STUDENTS, MOCK_CONSENTS} from "../../mocks/students";
import {delay} from "../../utils/mockRequest";

export default class StudentController extends Controller {

  static getStudents(): Promise<CanvasStudent[]> {
    if (debug()) return delay(MOCK_STUDENTS);

    return this.client.get(
      `students`
    ).then(response => response.data);
  }

  static getConsents(): Promise<ConsentData[]> {
    if (debug()) return delay(MOCK_CONSENTS);

    return this.client.get(
      `consents`
    ).then(response => response.data);
  }
}