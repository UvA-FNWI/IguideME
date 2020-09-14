import Controller from "./controller";
import {IBackendResponse} from "../models/IBackendResponse";

export default class TileController extends Controller {

  static fetchDiscussions(): IBackendResponse {
    return this.client.get(
      `discussions`,
      //tokenHeader()
    );
  }

  static fetchQuizzes(): IBackendResponse {
    return this.client.get(
      `quizzes`,
      //tokenHeader()
    );
  }

  static fetchSubmissions(): IBackendResponse {
    return this.client.get(
      `submissions`
    )
  }

  static fetchPerusall(): IBackendResponse {
    return this.client.get(
      `perusall`,
    );
  }

  static fetchAttendance(): IBackendResponse {
    return this.client.get(
      `attendance`,
    );
  }

  static fetchPracticeSessions(): IBackendResponse {
    return this.client.get(
      `practice-sessions`,
    );
  }
}