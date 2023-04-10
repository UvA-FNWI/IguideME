import React, { Component } from "react";
import {PredictedGrade} from "../../../../models/app/PredictiveModel";
import {Line} from "react-chartjs-2";
import {TileEntry} from "../../../../models/app/Tile";
import "./style.scss";
import {store} from "../../../../utils/configureStore";
import { ScriptableContext } from "chart.js";

export default class GradePrediction extends Component<{
  predictions: PredictedGrade[],
  tileEntries: TileEntry[]
}> {
  options = {
    legend: {
      display: true
    },
    scales: {
      x: {
      },
      y: {
        min: 0,
        max: 10,
      }
    }
  }

  render(): React.ReactNode {
    const { predictions, tileEntries } = this.props;
    const tiles = store.getState().tiles;
    let maxComponents = tiles.filter(t => t.content === "BINARY").length + 1;

    for (const entry of tileEntries) {
      const tile = tiles.find(t => t.id === entry.tile_id);
      if (!tile) continue;

      if (tile.content === "BINARY") continue;
      maxComponents += 1;
    }

    const round = (val: number) => Math.round(val * 100) / 100;

    const errors = Array.from(Array(maxComponents).keys()).map(i => 5 - ((4.5 / maxComponents) * i));
    if (predictions.length === 0) {
      return (
        <div id={"gradePrediction"}>
          <h2>No predictions available.</h2>
          <p>Try again later when more grades are available.</p>
        </div>
      );
    }

    const data = {
        labels: predictions.map((pg) => pg.date),
        datasets: [
          {
            label: "Predicted grade",
            backgroundColor: "rgb(90, 50, 255)",
            borderColor: "rgb(90, 50, 255)",
            hoverBorderColor: "rgb(90, 50, 255)",
            fill: false,
            tension: 0,
            data: predictions.map(sp => round(sp.grade)),
          },
          {
            label: "UpperConfidence",
            backgroundColor: (context: ScriptableContext<"line">) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0,0,0,350);
              gradient.addColorStop(0, "#FFF");
              gradient.addColorStop(1, "rgb(90, 50, 255)");
              return gradient;
            },
            borderColor: "transparent",
            pointRadius: 0,
            fill: 0,
            tension: 0,
            data: predictions.map((sp, i) => sp.grade + errors[i + 3]),
          },
          {
            label: "LowerConfidence",
            backgroundColor: (context: ScriptableContext<"line">) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0,0,0,350);
              gradient.addColorStop(1, "#FFF");
              gradient.addColorStop(0, "rgb(90, 50, 255)");
              return gradient;
            },
            borderColor: "transparent",
            pointRadius: 0,
            fill: 0,
            tension: 0,
            data: predictions.map((sp, i) => sp.grade - errors[i + 3]),
          }
        ]
      // }
    };

    return (
      <div id={"gradePrediction"}>
        <h3>Your predicted grade is a <strong>{round(predictions[predictions.length - 1].grade)}</strong></h3>

        <Line
              options={this.options}
              width={500}
              data={data} />

        <p>Grade predictions will grow more accurate as the course progresses.</p>
      </div>
    );
  }
}
