import React, { Component } from "react";
import {Tile, TileEntry, TileEntrySubmission} from "../../../models/app/Tile";
import BinaryGrades from "./BinaryGrades";
import {Button} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import EntriesList from "./EntriesList";
import GradePrediction from "./GradePrediction";
import {PredictedGrade} from "../../../models/app/PredictiveModel";
import DiscussionsList from "./DiscussionsList";
import {CanvasDiscussion} from "../../../models/canvas/Discussion";
import LearningOutcomes from "./LearningOutcomes";
import { LearningOutcome } from "../../../models/app/LearningGoal";
import { CanvasStudent } from "../../../models/canvas/Student";

export default class TileDetail extends Component<{
  tile: Tile,
  submissions: TileEntrySubmission[],
  discussions: CanvasDiscussion[],
  tileEntries: TileEntry[],
  predictions: PredictedGrade[],
  learningOutcomes: LearningOutcome[],
  student: CanvasStudent
}> {

  content = () => {
    const { tile, submissions, tileEntries, predictions, discussions, learningOutcomes, student } = this.props;

    switch(tile.content) {
      case "BINARY":
        return (
          <BinaryGrades submissions={submissions}
                        tileEntries={tileEntries.filter(e => e.tile_id === tile.id)}
          />
        );
      case "ENTRIES":
        switch (tile.type) {
          case "DISCUSSIONS":
            return (
              <DiscussionsList discussions={discussions}
                               tile={tile}
                               student={student} />
            );
          default:
            return (
              <EntriesList submissions={submissions}
                           tileEntries={tileEntries.filter(e => e.tile_id === tile.id)}
                           discussions={discussions}
                           tile={tile}
              />
            );
        }
      case "PREDICTION":
        return (
          <GradePrediction tileEntries={tileEntries}
                           predictions={predictions} />
        );
      case "LEARNING_OUTCOMES":
        return (
          <LearningOutcomes learningOutcomes={learningOutcomes} tileEntries={tileEntries} />
        );
      default:
        return null;
    }
  }

  render(): React.ReactNode {
    const { tile } = this.props;

    return (
      <div style={{padding: 20}}>
        <Button type={"ghost"}
                icon={<ArrowLeftOutlined />}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('selectTile', { detail: undefined }))
                }}
        >
          Return to dashboard
        </Button>

        <h1 style={{margin: '10px 0'}}>{ tile.title }</h1>
        { this.content() }
      </div>
    )
  }
}