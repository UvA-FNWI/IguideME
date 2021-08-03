import React, { Component } from "react";
import {Tile, TileEntry, TileEntrySubmission} from "../../../models/app/Tile";
import BinaryGrades from "./BinaryGrades";
import {Button} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import EntriesList from "./EntriesList";
import GradePrediction from "./GradePrediction";
import {PredictedGrade} from "../../../models/app/PredictiveModel";

export default class TileDetail extends Component<{
  tile: Tile,
  submissions: TileEntrySubmission[],
  tileEntries: TileEntry[],
  predictions: PredictedGrade[]
}> {

  content = () => {
    const { tile, submissions, tileEntries, predictions } = this.props;

    switch(tile.content) {
      case "BINARY":
        return (
          <BinaryGrades submissions={submissions.filter(
            s => tileEntries.filter(e => e.tile_id === tile.id).map(x => x.id).includes(s.entry_id))}
                        tileEntries={tileEntries.filter(e => e.tile_id === tile.id)}
          />
        );
      case "ENTRIES":
        return (
          <EntriesList submissions={submissions.filter(
            s => tileEntries.filter(e => e.tile_id === tile.id).map(x => x.id).includes(s.entry_id))}
                       tileEntries={tileEntries.filter(e => e.tile_id === tile.id)}
                       tile={tile}
          />
        );
      case "PREDICTION":
        return (
          <GradePrediction tileEntries={tileEntries}
                           predictions={predictions} />
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