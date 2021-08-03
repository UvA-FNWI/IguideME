import React, { Component } from "react";
import Tile from "./Tile";
import { IProps } from "./types";
import "./style.scss";

export default class TileGroup extends Component<IProps> {

  render(): React.ReactNode {
    const { tileGroup, tileEntries, tiles, student, tilesGradeSummary, peerGrades, submissions } = this.props;
    return (
      <div className={`tileGroup`}>
        <h2>{ tileGroup.title }</h2>

        <div className={`tileWrapper`}>
          { tiles.sort((a, b) => a.position - b.position).map(t => {
            return (
              <Tile tile={t}
                    tileEntries={tileEntries.filter(e => e.tile_id === t.id)}
                    student={student}
                    submissions={submissions.filter(
                      s => tileEntries.filter(e => e.tile_id === t.id).map(x => x.id)
                        .includes(s.entry_id))}
                    userGrades={tilesGradeSummary.filter(tgs => tgs.tile.id === t.id)}
                    peerGrades={peerGrades.filter(pg => pg.tileID === t.id)} />
            );
          })}
        </div>
      </div>
    )
  }
}