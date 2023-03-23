import React, { Component } from "react";
import {Tile, TileEntry, TileEntrySubmission} from "../../../models/app/Tile";
import BinaryGrades from "./BinaryGrades";
import {Button, Col, Radio, Row} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import EntriesList from "./EntriesList";
import GradePrediction from "./GradePrediction";
import {PredictedGrade} from "../../../models/app/PredictiveModel";
import DiscussionsList from "./DiscussionsList";
import {CanvasDiscussion} from "../../../models/canvas/Discussion";
import LearningOutcomes from "./LearningOutcomes";
import { LearningOutcome } from "../../../models/app/LearningGoal";
import { CanvasStudent } from "../../../models/canvas/Student";
import AppController from "../../../api/controllers/app";
import TileHistoricGraph from "../TileHistoricGraph"
import { HistoricTileGrades } from "../TileHistoricGraph/types";
import { AppstoreOutlined, BarChartOutlined } from "@ant-design/icons";


export type ViewTypes = "grid" | "graph";


export default class TileDetail extends Component<{
  tile: Tile,
  submissions: TileEntrySubmission[],
  discussions: CanvasDiscussion[],
  tileEntries: TileEntry[],
  predictions: PredictedGrade[],
  learningOutcomes: LearningOutcome[],
  student: CanvasStudent,
  historicGrades: HistoricTileGrades | undefined
}, {
  viewType: ViewTypes;
}> {

  state = {
    viewType: "grid" as ViewTypes
  }

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

  leave = (): void => {
    AppController.trackAction("Close tile");
    window.dispatchEvent(new CustomEvent('selectTile', { detail: undefined }))
  }

  keyHandler(event: KeyboardEvent): void {
    if (event.key === "Escape") {
        this.leave();
    }
  }

  setTileView = (view: any) => {
    AppController.trackAction(`Change tile view to ${view}`)
    this.setState({ viewType: view })
  }

  componentDidMount(): void {
    window.addEventListener("keydown", this.keyHandler.bind(this), false);
    AppController.trackAction(`Load tile: ${this.props.tile.title}`)
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.keyHandler.bind(this), false);
  }

  render(): React.ReactNode {
    const { tile } = this.props;

    const { viewType } = this.state;

    return (
      <div style={{padding: 20}}>
        <Row justify={"space-between"}>
          <Col span={3}>
            <Button type={"ghost"}
                    icon={<ArrowLeftOutlined />}
                    onClick={() => {
                      this.leave()
                    }}
                    >
              Return to dashboard
            </Button>
          </Col>
          <Col span={10} >
            <div style={{float: "right"}}>
              <Radio.Group value={viewType}
                        buttonStyle="solid"
                        onChange={e => this.setTileView(e.target.value)}
                        >
                <Radio.Button value="grid"><AppstoreOutlined /> Grid</Radio.Button>
                <Radio.Button value="graph"><BarChartOutlined /> Graph</Radio.Button>
              </Radio.Group>
            </div>
          </Col>
        </Row>

        <h1 style={{margin: '10px 0'}}>{ tile.title }</h1>

        { viewType === "grid" ?

          this.content() :

          <TileHistoricGraph
            historicGrades={this.props.historicGrades}
            />
        }

      </div>
    )
  }
}
