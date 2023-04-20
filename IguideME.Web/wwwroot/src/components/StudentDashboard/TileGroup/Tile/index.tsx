import React, { Component } from "react";
import { Progress, Space } from "antd";
import PeerComparison from "./PeerComparison";
import {IProps, IState} from "./types";
import {getAverageGrade} from "../../../../utils/grades";
import {getProgression} from "./helpers";
import GradeStatistic from "../../../../containers/GradeStatistic";
import "./style.scss";
import { discussionType } from "../../../../models/canvas/Discussion";

export default class Tile extends Component<IProps, IState> {

  state = { loaded: false }

  getHeader = () => {
    const { tile, tileEntries, submissions, userGrades, discussions, learningOutcomes, student } = this.props;
    const avg: number | null = getAverageGrade(userGrades);

    if (tile.type === "DISCUSSIONS") {
      let disc_grade = 0;
      discussions.forEach(discussion => {
        if (discussion.type === discussionType.topic ){
          if (discussion.posted_by === student.name)
            disc_grade++;
        } else {
          disc_grade++;
        }
      })
      return (
        <span style={{textAlign: 'center'}}>
          <strong>{ disc_grade }</strong> discussion{discussions.length !== 1 && "s"}
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
        return <GradeStatistic grade={avg !== null ? avg!.toString() : "-"} />;
      case "BINARY":
        return (
          <>
            { !!avg && <Progress percent={getProgression(tile, tileEntries, submissions)} /> }
            <GradeStatistic grade={avg !== null ? (avg * 10).toFixed(2) : "-"} />
          </>
        );
      case "ENTRIES":
        return (
          <>
            { !!avg && <Progress percent={getProgression(tile, tileEntries, submissions)} /> }
            <GradeStatistic grade={avg !== null ? avg!.toFixed(2) : "-"} />
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
