import React, { Component } from "react";
import { Progress, Space } from "antd";
import PeerComparison from "./PeerComparison";
import {IProps, IState} from "./types";
import {getAverageGrade} from "../../../../utils/grades";
import {getProgression} from "./helpers";
import GradeStatistic from "../../../../containers/GradeStatistic";
import "./style.scss";

export default class Tile extends Component<IProps, IState> {

  state = { loaded: false }

  render(): React.ReactNode {
    const { tile, tileEntries, peerGrades, submissions, userGrades } = this.props;

    const avg: number | null = getAverageGrade(userGrades);
    return (
      <div className={"tile"}
           onClick={() => {
             window.dispatchEvent(new CustomEvent("selectTile", { detail: { tile, userGrades } }))
           }}
      >
        <div className={"wrapper"}>
          <div className={"content"}>
            <h2>{ tile.title }</h2>
            <Space direction={"vertical"} style={{ width: '100%' }}>
              { (tile.content !== 'PREDICTION') &&
                <Progress percent={getProgression(tile, tileEntries, submissions)} />
              }
              { (tile.content !== 'BINARY') &&
                avg ? <GradeStatistic grade={avg!.toString()} /> : null
              }
            </Space>
          </div>

          <PeerComparison peerGrades={peerGrades.find(pg => pg.tileID === tile.id)} />
        </div>
      </div>
    )
  }
}