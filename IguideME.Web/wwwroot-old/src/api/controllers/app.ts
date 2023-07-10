import { debug } from "../../config/config";
import Controller from "../controller";
import {CanvasStudent} from "../../models/canvas/Student";
import {MOCK_STUDENTS} from "../../mocks/students";
import {delay} from "../../utils/mockRequest";
import {Course} from "../../models/app/Course";
import {standardConsent} from "../../components/settings/RequireConsent/ConsentEditor/template";

export default class AppController extends Controller {

  static getCourse(): Promise<Course> {
    if (debug()) return delay({ course_name: "Testcourse IguideME", require_consent: true, text: standardConsent });

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

  static updateAcceptList(enabled: boolean): Promise<boolean> {
    if (debug()) return delay(enabled);

    return this.client.patch(
      `datamart/accept-list`, { enabled }
    ).then(response => response.data);
  }

  static getUser(): Promise<CanvasStudent> {
    if (debug()) return delay(MOCK_STUDENTS[0]);

    return this.client.get(
      `app/self`
    ).then(response => response.data);
  }

  static getNotificationEnable(userID?: string): Promise<boolean> {
    if (debug()) return Promise.resolve(true);

    return this.client.get(
      userID ?
      `app/notification/${userID}` :
      `app/notification`
    ).then(response => response.data);
  }

  static setNotificationEnable(enable: boolean): Promise<boolean> {
    if (debug()) return Promise.resolve(enable);

    return this.client.post(
      `app/notification`, { enable: enable }
    ).then(response => response.data);
  }

  static setNotificationDates(dates: string): Promise<void> {
    if (debug()) return Promise.resolve();

    return this.client.post(
      'app/notifications', { dates: dates }
    )
  }

  static getNotificationDates(): Promise<string[]> {
    if (debug()) return Promise.resolve([]);

    return this.client.get(
      'app/notifications'
    ).then(response => response.data);
  }

  static trackAction(action: string): Promise<void>{
    if (debug()) return Promise.resolve();

    return this.client.post(
      'app/track', {action: action}
    )
  }

  static getGoalGrade(userID?: string): Promise<number> {
    if (debug()) return Promise.resolve(8);

    return this.client.get(
      userID ?
      `goal-grade/${userID}` :
      `goal-grade`
    ).then(response => response.data);
  }

  static setGoalGrade(goalGrade: number): Promise<number> {
    if (debug()) return Promise.resolve(goalGrade);

    return this.client.post(
      `goal-grade`, { goal_grade: goalGrade }
    ).then(response => response.data);
  }
}
