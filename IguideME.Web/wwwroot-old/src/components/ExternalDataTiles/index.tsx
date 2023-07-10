import React, { Component } from "react";
import {IProps} from "./types";
import ExternalTile from "./ExternalTile";

export default class ExternalDataTiles extends Component<IProps> {
  render() {
    const { tiles, tileGroups } = this.props;
    return (
      <div>
        { tiles.sort((a, b) => a.group_id * 100 + a.id - b.group_id * 100 - b.id).map((t, i) => (
          <div key={i}>
            <ExternalTile tile={t}
                          tileGroup={tileGroups.find(g => g.id === t.group_id)!} />
          </div>
        ))}
      </div>
    );
  }
}
