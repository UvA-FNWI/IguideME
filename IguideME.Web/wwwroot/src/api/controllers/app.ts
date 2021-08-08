import { debug } from "../../config/config";
import Controller from "../controller";
import {CanvasStudent} from "../../models/canvas/Student";
import {MOCK_STUDENTS} from "../../mocks/students";
import {delay} from "../../utils/mockRequest";
import {Course} from "../../models/app/Course";

export default class AppController extends Controller {

  static getCourse(): Promise<Course> {
    if (debug()) return delay({ course_name: "Testcourse IGuideME", require_consent: false, text: null });

    return this.client.get(
      `app/course`
    ).then(response => response.data);
  }

  static getCoursePeerGroups(): Promise<{min_size: number, personalized_peers: boolean}> {
    if (debug()) return delay({ min_size: 5, personalized_peers: true });

    return this.client.get(
      `app/peer-groups`
    ).then(response => response.data);
  }

  static updateCoursePeerGroup(min_size: number, personalized_peers: boolean): Promise<{min_size: number, personalized_peers: boolean}> {
    if (debug()) return delay({ min_size, personalized_peers });

    return this.client.patch(
      `app/peer-groups`, {
        min_size, personalized_peers
      }
    ).then(response => response.data);
  }

  static updateConsent(required: boolean, text: string | null): Promise<boolean> {
    if (debug()) return delay(true);

    return this.client.patch(
      `app/consent`, {
        require_consent: required,
        text
      }
    ).then(response => response.data);
  }

  static getUser(): Promise<CanvasStudent> {
    if (debug()) return delay(MOCK_STUDENTS[0]);

    return this.client.get(
      `app/self`
    ).then(response => response.data);
  }
}