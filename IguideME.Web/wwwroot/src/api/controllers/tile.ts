import Controller from "../controller";
import { debug } from "../../config/config";
import {Tile, TileEntry, TileEntrySubmission, TileGroup} from "../../models/app/Tile";
import { MOCK_SUBMISSIONS } from "../../mocks/submissions";
import {MOCK_TILES} from "../../mocks/tile/tile";
import {MOCK_TILE_GROUPS} from "../../mocks/tile/tileGroup";
import {MOCK_TILE_ENTRIES} from "../../mocks/tile/tileEntry";
import {delay} from "../../utils/mockRequest";
import {LearningGoal, LearningOutcome} from "../../models/app/LearningGoal";
import {CanvasDiscussion} from "../../models/canvas/Discussion";

export default class TileController extends Controller {

  static getAllSubmissions() {
    if (debug()) return Promise.resolve(MOCK_SUBMISSIONS);

    return this.client.get(
      `submissions`
    ).then(response => response.data);
  }

  static getDiscussions(tileId: number, studentLoginId: string): Promise<CanvasDiscussion[]> {
    if (debug()) {
        return Promise.resolve([]);
    }

    return this.client.get(
      `tiles/${tileId}/discussions/${studentLoginId}`
    ).then(response => response.data);
  }

  static getUserGoals(tileId: number, studentLoginId: string): Promise<LearningOutcome[]> {
    if (debug()) {
      return Promise.resolve([]);
    }

    return this.client.get(
      `tiles/${tileId}/learning-outcomes/${studentLoginId}`
    ).then(response => response.data);
  }

  static getSubmissions(studentLoginId: string): Promise<TileEntrySubmission[]> {
    if (debug()) {
      return this.getTiles().then(tiles => {
        return Promise.resolve(MOCK_SUBMISSIONS.filter(x => {
          return (x.user_login_id === studentLoginId)
        }));
      }).then(x => x.flat());
    }

    return this.client.get(
      `tiles/grade-summary/${studentLoginId}`
    ).then(response => response.data);
  }

  static getTileSubmissions(tileId: number, studentLoginId: string): Promise<TileEntrySubmission[]> {
    if (debug()) {
      return this.getTileEntries(tileId).then(entries => {
        const entryIds = entries.map(e => e.id);
        return Promise.resolve(MOCK_SUBMISSIONS.filter(x =>
          entryIds.includes(x.entry_id) && (x.user_login_id === studentLoginId)
        ));
      });
    }

    return this.client.get(
      `tiles/${tileId}/submissions/${studentLoginId}`
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
    ).then(_ => {});
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

  static uploadData(entryID: number, data: any[]): Promise<any[]> {
    if (debug()) return delay([], 2500);

    return this.client.post(
      `/entries/${entryID}/upload`,
      data.map(x => ({...x, entry_id: entryID }))).then(
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

  static deleteTileGoal(id: number): Promise<void> {
    if (debug()) {
      return delay(() => {});
    }

    return this.client.delete(
      `tiles/goals/${id}`
    ).then(response => response.data);
  }

  static getTileEntries(tileId: number): Promise<TileEntry[]> {
    if (debug()) {
      return Promise.resolve(MOCK_TILE_ENTRIES.filter(e => e.tile_id === tileId));
    }

    return this.client.get(
      `tiles/${tileId}/entries`
    ).then(response => response.data);
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
      return delay(() => {});
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

  static getPeerResults(studentLoginId: string): Promise<{ min: number, max: number, avg: number, tileID: number}[]> {
    if (debug()) {
      return this.getTiles().then(tiles => {
        return Promise.resolve(tiles.map(t =>
          t.content === "BINARY" ?
            ({min: 41, max: 100, avg: 78, tileID: t.id}) :
            ({min: 5, max: 9, avg: 6.8, tileID: t.id})));
      });
    }

    return this.client.get(
      `peer-comparisons/${studentLoginId}`
    ).then(response => response.data);
  }

  static getEntrySubmissions(entryId: number | string, studentLoginId?: string): Promise<TileEntrySubmission[]> {
    if (debug())
      return Promise.resolve(MOCK_SUBMISSIONS.filter(x =>
        x.entry_id.toString() === entryId.toString() && (studentLoginId ? x.user_login_id === studentLoginId : true)
      ));

    return this.client.get(
      studentLoginId ?
        `entries/${entryId}/submissions/${studentLoginId}` :
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