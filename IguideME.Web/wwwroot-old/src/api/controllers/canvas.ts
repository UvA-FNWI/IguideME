import Controller from "../controller";
import {debug} from "../../config/config";
import {CanvasAssignment} from "../../models/canvas/Assignment";
import {MOCK_CANVAS_ASSIGNMENTS} from "../../mocks/canvas/assignment";
import {CanvasDiscussion} from "../../models/canvas/Discussion";
import {delay} from "../../utils/mockRequest";
import {MOCK_CANVAS_DISCUSSION} from "../../mocks/canvas/discussion";

export default class CanvasController extends Controller {

  static getAssignments(): Promise<CanvasAssignment[]> {
    if (debug()) return delay(MOCK_CANVAS_ASSIGNMENTS);

    return this.client.get(
      `datamart/canvas/assignments`
    ).then(response => response.data);
  }

  // TODO: I think that the idea was that discussions with the tile -1 were directly what was on canvas and then have separate entries for specific tiles.
  // Now it's updating the database entries to point at specific tiles, which means that no two tiles can have the same discussion entry.
  // Probably should change back having separate entries in the database, or maybe add a list of tiles to the database.
  static getDiscussions(): Promise<CanvasDiscussion[]> {
    if (debug()) return delay(MOCK_CANVAS_DISCUSSION);

    return this.client.get(
      `datamart/canvas/discussions`
    ).then(response => response.data);
  }
}