import React, { Component } from "react";
import {IProps} from "./types";
import ExternalTile from "./ExternalTile";

export default class ExternalDataTiles extends Component<IProps> {
  render() {
    const { tiles, tileGroups } = this.props;
    return (
      <div>
        { tiles.map(t => (
          <div>
            <ExternalTile tile={t}
                          tileGroup={tileGroups.find(g => g.id === t.group_id)!} />
          </div>
        ))}
      </div>
    );
  }
}