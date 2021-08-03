import {DashboardColumn} from "../../../models/app/Layout";
import {TileGroup} from "../../../models/app/Tile";

export interface IProps {
  number: number;
  column: DashboardColumn;
  tileGroups: TileGroup[];
  allTileGroups: TileGroup[];
  removeColumn: (column: DashboardColumn) => any;
  updateGroup: (tileGroup: TileGroup) => any;
  update: (column: DashboardColumn, tileGroups: TileGroup[]) => any;
}
