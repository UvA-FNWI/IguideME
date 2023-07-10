import React, { Component } from "react";
import Admin from "../../index";
import { Divider } from "antd";
import ExternalDataTiles from "../../../../components/ExternalDataTiles";
import {IProps, IState} from "./types";
import TileController from "../../../../api/controllers/tile";
import {Tile} from "../../../../models/app/Tile";
import Loading from "../../../../components/utils/Loading";

export default class DataWizard extends Component<IProps, IState> {

  state = { loaded: false, tiles: [], tileGroups: [] }

  componentDidMount(): void {
    TileController.getTileGroups().then(tileGroups => {
      TileController.getTiles().then(tiles => {
        this.setState({ tiles, tileGroups, loaded: true });
      });
    });
  }

  render(): React.ReactNode {
    const { loaded, tiles, tileGroups } = this.state;

    return (
      <Admin menuKey={"dataWizard"}>
        <h1>Data Wizard</h1>
        <Divider />

        { loaded ?
          <ExternalDataTiles tiles={tiles.filter((t: Tile) => t.type === "EXTERNAL_DATA")}
                             tileGroups={tileGroups}
          /> :
          <Loading small={true} />
        }
      </Admin>
    )
  }
}