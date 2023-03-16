import React, { Component } from "react";
import {PredictedGrade} from "../../../../models/app/PredictiveModel";
import {Bar} from "react-chartjs-2";
import {TileEntry} from "../../../../models/app/Tile";
import "./style.scss";
import {store} from "../../../../utils/configureStore";

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
        // id: 'x',
        type: 'category'
      },
      y: {
        // id: 'y',
        type: 'linear',
        beginAtZero: true,
        min: 0,
        max: 10,
        position: "left"
        // ticks: {
        // }
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
      // const ctx = canvas.getContext("2d")
      // const gradient1 = ctx.createLinearGradient(0,0,0,350);
      // gradient1.addColorStop(0, "#FFF");
      // gradient1.addColorStop(1, "rgb(90, 50, 255)");

      // const gradient2 = ctx.createLinearGradient(0,0,0,350);
      // gradient2.addColorStop(1, "#FFF");
      // gradient2.addColorStop(0, "rgb(90, 50, 255)");

      // return {
        labels: predictions.map((pg) => pg.date),
        datasets: [
          {
            label: "Predicted grade",
            // type: "line",
            backgroundColor: "rgb(90, 50, 255)",
            borderColor: "rgb(90, 50, 255)",
            hoverBorderColor: "rgb(90, 50, 255)",
            fill: false,
            tension: 0,
            data: predictions.map(sp => round(sp.grade)),
            // yAxisID: 'y',
            // xAxisID: 'x'
          },
          {
            label: "UpperConfidence",
            // type: "line",
            // backgroundColor: gradient1,
            borderColor: "transparent",
            pointRadius: 0,
            fill: 0,
            tension: 0,
            data: predictions.map((sp, i) => sp.grade + errors[i + 3]),
            // yAxisID: 'y',
            // xAxisID: 'x'
          },
          {
            label: "LowerConfidence",
            // type: "line",
            // backgroundColor: gradient2,
            borderColor: "transparent",
            pointRadius: 0,
            fill: 0,
            tension: 0,
            data: predictions.map((sp, i) => sp.grade - errors[i + 3]),
            // yAxisID: 'y',
            // xAxisID: 'x'
          }
        ]
      // }
    };

    return (
      <div id={"gradePrediction"}>
        <h3>Your predicted grade is a <strong>{round(predictions[predictions.length - 1].grade)}</strong></h3>

        <Bar 
              // options={this.options}
              width={500}
              data={data} />

        <p>Grade predictions will grow more accurate as the course progresses.</p>
      </div>
    );
  }
}