import React, { Component } from "react";
import Tile from "./Tile";
import { IProps } from "./types";
import "./style.scss";

export default class TileGroup extends Component<IProps> {

  render(): React.ReactNode {
    const {
      tileGroup,
      tileEntries,
      tiles,
      student,
      tilesGradeSummary,
      peerGrades,
      submissions,
      discussions,
      learningOutcomes
    } = this.props;

    return (
      <div className={`tileGroup`}>
        <h2>{ tileGroup.title }</h2>

        <div className={`tileWrapper`}>
          { tiles.sort((a, b) => a.position - b.position).map(t => {
            return (
              <Tile tile={t}
                    tileEntries={tileEntries.filter(e => e.tile_id === t.id)}
                    discussions={discussions}
                    student={student}
                    submissions={submissions.get(t.id)!}
                    userGrades={tilesGradeSummary.filter(tgs => tgs.tile.id === t.id)}
                    peerGrades={peerGrades.filter(pg => pg.tileID === t.id)}
                    learningOutcomes={learningOutcomes}
              key={t.id}/>
            );
          })}
        </div>
      </div>
    )
  }
}
