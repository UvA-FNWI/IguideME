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

  getHeader = () => {
    const { tile, tileEntries, submissions, userGrades, discussions, learningOutcomes } = this.props;
    const avg: number | null = getAverageGrade(userGrades);

    switch (tile.type) {
      case "DISCUSSIONS":
      return (
        <span style={{textAlign: 'center'}}>
          <strong>{ discussions.length }</strong> discussion{discussions.length !== 1 && "s"}
        </span>
      );
    }

    switch (tile.content){
        case "LEARNING_OUTCOMES":
      const success = learningOutcomes.filter(lo => lo.success).length;
      return (
        <span style={{textAlign: 'center'}}>
          <strong>{ success }<small>/{ learningOutcomes.length }</small></strong> completed
        </span>
      );
        case "PREDICTION":
      return <GradeStatistic grade={avg ? avg!.toString() : "-"} />;
        case "BINARY":
        case "ENTRIES":
      return (
        <>
          { !!avg && <Progress percent={getProgression(tile, tileEntries, submissions)} /> }
          <GradeStatistic grade={avg ? avg!.toString() : "-"} />
        </>
      );
        default:
        return null;
    }
  }

  render(): React.ReactNode {
    const { tile, peerGrades, userGrades } = this.props;
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
              { this.getHeader() }
            </Space>
          </div>

          <PeerComparison peerGrades={peerGrades.find(pg => pg.tileID === tile.id)} />
        </div>
      </div>
    )
  }
}
