import { debug } from "../../config/config";
import Controller from "../controller";
import {CanvasStudent} from "../../models/canvas/Student";
import {MOCK_STUDENTS} from "../../mocks/students";
import {delay} from "../../utils/mockRequest";

export default class StudentController extends Controller {

  static getStudents(): Promise<CanvasStudent[]> {
    if (debug()) return delay(MOCK_STUDENTS);

    return this.client.get(
      `students`
    ).then(response => response.data);
  }
}