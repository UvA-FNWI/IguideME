import Controller from "../controller";
import { debug } from "../../config/config";
import { Tile, TileEntry, TileEntrySubmission, TileGroup } from "../../models/app/Tile";
import { MOCK_SUBMISSIONS } from "../../mocks/submissions";
import { MOCK_GRADE_HISTORY } from "../../mocks/historicGrades";
import { MOCK_LEARNING_OUTCOMES } from "../../mocks/learningOutcomes";
import { MOCK_CANVAS_DISCUSSION } from "../../mocks/canvas/discussion";
import { MOCK_TILES } from "../../mocks/tile/tile";
import { MOCK_TILE_GROUPS } from "../../mocks/tile/tileGroup";
import { MOCK_TILE_ENTRIES } from "../../mocks/tile/tileEntry";
import { delay } from "../../utils/mockRequest";
import { LearningGoal, LearningOutcome } from "../../models/app/LearningGoal";
import { CanvasDiscussion } from "../../models/canvas/Discussion";
import { HistoricTileGrades } from "../../components/StudentDashboard/TileHistoricGraph/types";


export default class TileController extends Controller {

  static getAllSubmissions() {
    if (debug()) return Promise.resolve(MOCK_SUBMISSIONS);

    return this.client.get(
      `submissions`
    ).then(response => response.data);
  }

  static getDiscussions(tileId: number, userID: string): Promise<CanvasDiscussion[]> {
    if (debug()) {
      return Promise.resolve(MOCK_CANVAS_DISCUSSION);
    }

    return this.client.get(
      `tiles/${tileId}/discussions/${userID}`
    ).then(response => response.data).catch(_ => []);
  }

  static getUserGoals(tileId: number, userID: string): Promise<LearningOutcome[]> {
    if (debug()) {
      return Promise.resolve(MOCK_LEARNING_OUTCOMES);
    }

    return this.client.get(
      `tiles/${tileId}/learning-outcomes/${userID}`
    ).then(response => response.data);
  }

  static getSubmissions(userID: string): Promise<TileEntrySubmission[]> {
    if (debug()) {
        return Promise.resolve(MOCK_SUBMISSIONS.filter(x => {
          return (x.userID === userID)
        })).then(x => x.flat());
    }

    return this.client.get(
      `tiles/grade-summary/${userID}`
    ).then(response => response.data);
  }

  static getHistory(userID: string): Promise<Map<number,HistoricTileGrades>|any> {
    if (debug()) {
        return Promise.resolve(MOCK_GRADE_HISTORY);
    }

    return this.client.get(
      `tiles/grade-history/${userID}`
    ).then(response => {

      let returnValue: Map<number,HistoricTileGrades>;
      returnValue = new Map();

      let mappedHistoricGrades: Map<string,HistoricTileGrades>;
      mappedHistoricGrades = new Map(Object.entries(response.data));
      console.log(mappedHistoricGrades);

      if(mappedHistoricGrades != null)
      {
        mappedHistoricGrades.forEach((value, key) => {
          var tileHistory: HistoricTileGrades;
          if (value !== undefined && value !== null)
          {
            tileHistory = {
              dates: Object.values(value)[0] as Array<string>,
              user_avg: Object.values(value)[1] as Array<number>,
              peer_avg: Object.values(value)[2] as Array<number>,
              peer_max: Object.values(value)[3] as Array<number>,
              peer_min: Object.values(value)[4] as Array<number>
            };
            returnValue.set(parseInt(key),tileHistory);}
        });
      }

      console.log(returnValue);

      return returnValue!;
    });
  }

  static getTileSubmissions(tileId: number, userID?: string): Promise<TileEntrySubmission[]> {
    if (debug()) {
      return this.getTileEntries(tileId).then(entries => {
        const entryIds = entries.map(e => e.id);
        return Promise.resolve(MOCK_SUBMISSIONS.filter(x =>
          entryIds.includes(x.entry_id) && (x.userID === userID)
        ));
      });
    }

    return this.client.get(
      userID? `tiles/${tileId}/submissions/${userID}` :
      `tiles/${tileId}/submissions`
    ).then(response => response.data);
  }

  static getTileGroups(): Promise<TileGroup[]> {
    if (debug()) return Promise.resolve(MOCK_TILE_GROUPS);

    return this.client.get(
      `tiles/groups`
    ).then(response => response.data);
  }

  static createTileGroup(title: string, position: number): Promise<TileGroup[]> {
    if (debug()) return Promise.resolve(MOCK_TILE_GROUPS);

    return this.client.post(
      `tiles/groups`, { title, position }
    ).then(response => response.data);
  }

  static deleteTileGroup(id: number): Promise<void> {
    if (debug()) return delay(Promise.resolve());

    return this.client.delete(
      `tiles/groups/${id}`
    ).then(_ => { });
  }

  static getTiles(): Promise<Tile[]> {
    if (debug()) return Promise.resolve(MOCK_TILES);

    return this.client.get(
      `tiles`
    ).then(response => response.data);
  }

  static createTile(tile: Tile): Promise<Tile> {
    if (debug()) {
      tile.id = new Date().getTime();
      return delay(tile);
    }

    return this.client.post(
      `/tiles`, tile
    ).then(response => response.data);
  }

  static deleteTile(id: number): Promise<void> {
    if (debug()) return delay(Promise.resolve());

    return this.client.delete(
      `tiles/${id}`
    ).then(response => response.data );
  }

  static uploadData(entryID: number, id_column: number, grade_column: number, data: any[]): Promise<any[]> {
    if (debug()) return delay([], 2500);

    return this.client.post(
      `/entries/${entryID}/upload`, {id_column: id_column, grade_column: grade_column, data: data}
      ).then(
        response => response.data
      );
  }

  static getEntries(): Promise<TileEntry[]> {
    if (debug()) return Promise.resolve(MOCK_TILE_ENTRIES);

    return this.client.get(
      `tiles/entries`
    ).then(response => response.data);
  }

  static getGoals(): Promise<LearningGoal[]> {
    if (debug()) return delay([]);

    return this.client.get(
      `tiles/goals`
    ).then(response => response.data);
  }

  static getTileGoals(tileId: number): Promise<LearningGoal[]> {
    if (debug()) {
      return Promise.resolve([]);
    }

    return this.client.get(
      `tiles/${tileId}/goals`
    ).then(response => response.data);
  }

  static createTileGoal(goal: LearningGoal): Promise<LearningGoal> {
    if (debug()) {
      return delay(goal);
    }

    return this.client.post(
      `tiles/goals`, goal
    ).then(response => response.data);
  }

  static updateTileGoal(goal: LearningGoal): Promise<LearningGoal> {
    if (debug()) {
      return delay(goal);
    }

    return this.client.patch(
      `tiles/goals/${goal.id}`, goal
    ).then(response => response.data);
  }

  static deleteTileGoal(id: number): Promise<void> {
    if (debug()) {
      return delay(() => { });
    }

    return this.client.delete(
      `tiles/goals/${id}`
    ).then(response => response.data);
  }

  static getTileEntries(tileId: number): Promise<TileEntry[]> {
    if (debug()) {
      return Promise.resolve(MOCK_TILE_ENTRIES.filter(e => e.tile_id === tileId));
    }

    let result = this.client.get(
      `tiles/${tileId}/entries`
    ).then(response => response.data);

    return result;
  }

  static createTileEntry(entry: TileEntry): Promise<TileEntry> {
    if (debug()) {
      return delay(entry);
    }
    return this.client.post(
      `/entries`, entry
    ).then(response => response.data);
  }

  static deleteTileEntry(id: number): Promise<void> {
    if (debug()) {
      return delay(() => { });
    }

    return this.client.delete(
      `/entries/${id}`
    ).then(() => Promise.resolve());
  }

  static getTileEntriesMetaKeys(entryId: number): Promise<string[]> {
    if (debug()) {
      return delay(["reading_time", "active_reading_time"], 2000);
    }

    return this.client.get(
      `tiles/entries/${entryId}/meta-keys`
    ).then(response => response.data);
  }

  // TODO: wth is going on with case 3 (and 9)?
  static getPeerResults(userID: string): Promise<{ min: number, max: number, avg: number, tileID: number }[]> {
    if (debug()) {
      return this.getTiles().then(tiles => {
        return Promise.resolve(tiles.map(t => {
          switch (t.id) {
            default:
            case 1:
              return ({ min: 6.5, max: 8.1, avg: 6.6, tileID: t.id });
            case 2:
              return ({ min: 4.2, max: 9.0, avg: 5.9, tileID: t.id });
            case 9:
              return ({ min: 5.1, max: 9.8, avg: 7.3, tileID: t.id });
            case 4:
              return ({ min: 4.2, max: 8.2, avg: 6.3, tileID: t.id });
            case 5:
              return ({ min: 5.8, max: 8.9, avg: 7.2, tileID: t.id });
            case 6:
              return ({ min: 2.1, max: 9.1, avg: 6.4, tileID: t.id });
            case 7:
              return ({ min: 5.4, max: 8.6, avg: 5.9, tileID: t.id });
            case 8:
              return ({ min: 5.0, max: 8.7, avg: 6.1, tileID: t.id });
            case 3:
              return ({ min: 41, max: 100, avg: 78, tileID: t.id });
          }
        }))
      });
    }

    return this.client.get(
      `peer-comparison/${userID}`
    ).then(response => response.data);
  }

  static getEntrySubmissions(entryId: number | string, userID?: string): Promise<TileEntrySubmission[]> {
    if (debug())
      return Promise.resolve(MOCK_SUBMISSIONS.filter(x =>
        x.entry_id.toString() === entryId.toString() && (userID ? x.userID === userID : true)
      ));

    return this.client.get(
      userID ?
        `entries/${entryId}/submissions/${userID}` :
        `entries/${entryId}/submissions`
    ).then(response => response.data);
  }

  static updateTile(tile: Tile): Promise<Tile> {
    if (debug()) {
      let _t = MOCK_TILES.find(t => t.id === tile.id)!;
      return delay(_t);
    }

    return this.client.patch(
      `tiles/${tile.id}`, tile
    ).then(response => response.data);
  }

  static updateTileGroup(tileGroup: TileGroup): Promise<TileGroup> {
    if (debug()) {
      return delay(tileGroup);
    }

    return this.client.patch(
      `tiles/groups/${tileGroup.id}`, tileGroup
    ).then(response => response.data);
  }
}
