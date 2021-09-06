import React, { Component } from "react";
import {TileEntry, TileEntrySubmission} from "../../../../models/app/Tile";
import {Badge, Card, Col, Row} from "antd";
import { CheckOutlined } from "@ant-design/icons";
import "./style.scss";
import {LearningOutcome} from "../../../../models/app/LearningGoal";

export default class LearningOutcomes extends Component<{
  learningOutcomes: LearningOutcome[],
  tileEntries: TileEntry[]
}> {
  render(): React.ReactNode {
    const { learningOutcomes, tileEntries } = this.props;

    const formatExpression = (exp: string | null) => {
      switch(exp) {
        case "lte": return "≤";
        case "gte": return "≥";
        default: return "=";
      }
    }

    return (
      <div id={"learningOutcomes"}>
        <div style={{margin: "0 auto", maxWidth: '400px', width: '100%'}}>
          { learningOutcomes.map(lo => {
            return (
              <div style={{margin: "5px 0"}}>
                <Badge.Ribbon text={lo.success ? "Completed" : "Not completed"} color={lo.success ? "green" : "red"}>
                  <Card title={lo.goal.title} size="small">
                    {lo.goal.requirements.map(r => {
                      const entry = tileEntries.find(e => e.id === r.entry_id);

                      return (
                        <span>{ entry ? entry.title : "???"} {formatExpression(r.expression)} { r.value}<br /></span>
                      )
                    })}
                  </Card>
                </Badge.Ribbon>
              </div>
            );
          })}
        </div>
      </div>
    )
  }
}