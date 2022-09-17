import { debug } from "../../config/config";
import Controller from "../controller";
import {CanvasStudent} from "../../models/canvas/Student";
import {ConsentData} from "../../models/app/ConsentData";
import {GoalData} from "../../models/app/GoalData";
import {MOCK_STUDENTS, MOCK_CONSENTS, MOCK_GOALS} from "../../mocks/students";
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
  static getGoalgrades(): Promise<GoalData[]> {
    if (debug()) return delay(MOCK_GOALS);

    return this.client.get(
      `goal-grades`
    ).then(response => response.data);
  }
}