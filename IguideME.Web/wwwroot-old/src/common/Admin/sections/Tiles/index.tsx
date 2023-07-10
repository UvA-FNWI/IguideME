import React, { Component } from "react";
import Admin from "../../index";
import ManageTileGroups from "../../../../containers/ManageTileGroups";
import { Divider } from "antd";
import TileWrapper from "./TileWrapper";
import {Tile, TileGroup} from "../../../../models/app/Tile";
import "./style.scss";
import {RootState} from "../../../../store";
import {connect, ConnectedProps} from "react-redux";
import {TileActions} from "../../../../store/actions/tiles";
import {DataMartActions} from "../../../../store/actions/datamart";
import {getTilesInGroup} from "./TileWrapper/helpers";

const mapState = (state: RootState) => ({
  tiles: state.tiles,
  tileGroups: state.tileGroups,
});

const mapDispatch = {
  loadAssignments: () => DataMartActions.loadAssignments(),
  loadDiscussions: () => DataMartActions.loadDiscussions(),
  updateTiles: (tiles: Tile[]) => TileActions.updateTiles(tiles)
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>

class Tiles extends Component<PropsFromRedux> {

  componentDidMount(): void {
    this.props.loadDiscussions();
    this.props.loadAssignments();
  }

  render(): React.ReactNode {
    const { tiles, tileGroups } = this.props;

    return (
      <Admin menuKey={"tiles"}>
        <div id={"adminTiles"}>
          <ManageTileGroups />
          <h1>Tiles</h1>
          <p>The overview shows all groups with their respective tiles. Drag around tiles to re-arrange them or create new ones!</p>
          <Divider />

          { tileGroups.map((group: TileGroup) => (
            <TileWrapper group={group}
                         updateTiles={this.props.updateTiles}
                         tiles={getTilesInGroup(tiles, group.id)}
                         key={group.id}
            />
          ))}
        </div>
      </Admin>
    )
  }
}

export default connector(Tiles);