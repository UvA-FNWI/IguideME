import TileController from "../../api/controllers/tile";
import {Tile} from "../../models/app/Tile";
import {store} from "../../utils/configureStore";

export class TileActions {

  static SET_TILES_SUCCESS = "SET_TILES_SUCCESS";
  static SET_TILES_ERROR = "SET_TILES_ERROR";

  static SET_TILE_GROUPS_SUCCESS = "SET_TILE_GROUPS_SUCCESS";
  static SET_TILE_GROUPS_ERROR = "SET_TILE_GROUPS_ERROR";

  static SET_TILE_ENTRIES_SUCCESS = "SET_TILE_ENTRIES_SUCCESS";
  static SET_TILE_ENTRIES_ERROR = "SET_TILE_ENTRIES_ERROR";

  static SET_TILE_GOALS_SUCCESS = "SET_TILE_GOALS_SUCCESS";
  static SET_TILE_GOALS_ERROR = "SET_TILE_GOALS_ERROR";

  static loadTiles = async () => {
    const tiles = await TileController.getTiles();

    if (tiles)
      return {
        type: TileActions.SET_TILES_SUCCESS,
        payload: tiles
      }

    return {
      type: TileActions.SET_TILES_ERROR,
    }
  }

  static updateTiles = async (newTiles: Tile[]) => {
    /**
     * Overrides the old tile instance from the store with the newly provided instance. Tile instances are linked
     * using their id.
     */
    const tiles: Tile[] = store.getState().tiles;

    if (tiles)
      return {
        type: TileActions.SET_TILES_SUCCESS,
        payload: [...tiles.filter(t => !newTiles.map(_t => _t.id).includes(t.id)), ...newTiles]
      }

    return {
      type: TileActions.SET_TILES_SUCCESS,
      payload: [newTiles]
    }
  }

  static updateTile = async (newTile: Tile) => {
    /**
     * Overrides the old tile instance from the store with the newly provided instance. Tile instances are linked
     * using their id.
     */
    const tiles: Tile[] = store.getState().tiles;

    if (tiles)
      return {
        type: TileActions.SET_TILES_SUCCESS,
        payload: [...tiles.filter(t => t.id !== newTile.id), newTile]
      }

    return {
      type: TileActions.SET_TILES_SUCCESS,
      payload: [newTile]
    }
  }

  static loadGroups = async () => {
    const groups = await TileController.getTileGroups();

    if (groups)
      return {
        type: TileActions.SET_TILE_GROUPS_SUCCESS,
        payload: groups
      }

    return {
      type: TileActions.SET_TILE_GROUPS_ERROR,
    }
  }

  static loadTileEntries = async () => {
    const groups = await TileController.getEntries();
    console.log("loadTileEntries: ", groups);

    if (groups)
      return {
        type: TileActions.SET_TILE_ENTRIES_SUCCESS,
        payload: groups
      }

    return {
      type: TileActions.SET_TILE_ENTRIES_ERROR,
    }
  }

  static loadTileGoals = async () => {
    const groups = await TileController.getGoals();

    if (groups)
      return {
        type: TileActions.SET_TILE_GOALS_SUCCESS,
        payload: groups
      }

    return {
      type: TileActions.SET_TILE_GOALS_ERROR,
    }
  }
}