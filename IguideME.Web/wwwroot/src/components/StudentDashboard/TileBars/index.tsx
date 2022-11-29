import React, { Component } from "react";
// import {createBarData, getBarOptions} from "../helpers";
import {HorizontalBar} from "react-chartjs-2";
import {Tile} from "../../../models/app/Tile"
import { CanvasDiscussion } from "../../../models/canvas/Discussion";
import { LearningOutcome } from "../../../models/app/LearningGoal";
import { PeerGrades, TilesGradeSummary } from "../types";
import {Data} from "./types"
import { IProps } from "./types";

export default class GradeBar extends Component<IProps> {

  bar_options = {
    maintainAspectRatio: true,
    legend: {
      display: true
    },
    scales: {
      xAxes: [{
        gridLines : {
          display : false
        },
        scaleLabel: {
          display: false
          // labelString: 'Grade'
        },
        ticks: {
          display: false
        },
        stacked: false,
      }],
      yAxes: [{
        barPercentage: .95,
        categoryPercentage: .95,
        gridLines : {
          display : false
        },
        scaleLabel: {
          display: false
          // labelString: '# of students'
        },
        stacked: false
      }]
    }
  }

  createBarData(tiles: Tile[], tilesGradeSummary: TilesGradeSummary[] , peerGrades: PeerGrades[], discussions: CanvasDiscussion[], learningOutcomes: LearningOutcome[]) {
    let datadict = new Map<number, Data>();

    for (let i = 0; i < tiles.length; i++) {
      // TODO: Very ugly but everything is hardcoded so that discussions and learning_outcomes are only on 1 tile.
      let grade = 0
      if (tiles[i].content === "LEARNING_OUTCOMES") {
        grade = learningOutcomes.filter(lo => lo.success).length;
      } else if (tiles[i].type === "DISCUSSIONS") {
        grade = discussions.length;
      }

      datadict.set(tiles[i].id, {title: tiles[i].title, grade: grade, peergrade: 0, max: 10});
    }

    for (let i = 0; i < tilesGradeSummary.length; i++) {
      let grade = tilesGradeSummary[i].average
      let entry = datadict.get(tilesGradeSummary[i].tile.id)!;
      if (tilesGradeSummary[i].tile.content === "BINARY"){
        entry.max = 100
      }

      // TODO:
      grade = grade * 10 / entry.max;

      entry.grade = grade;

    }

    for (let i = 0; i < peerGrades.length; i++) {
      let pgrade = peerGrades[i].avg;
      let entry = datadict.get(peerGrades[i].tileID)!;

      pgrade = pgrade * 10/ entry.max;

      entry.peergrade = pgrade;
    }

    let titles: any[] = [];
    let grades: any[] = [];
    let peergrades: any[] = [];

    datadict.forEach((value) => {
      titles.push(value.title);
      grades.push(value.grade);
      peergrades.push(value.peergrade);
    });

    return {
      labels: titles,
      datasets: [
        {
          label: "You",
          backgroundColor: "rgba(47,44,232, 0.5)",
          borderColor: "rgba(0,0,255, 1)",
          borderWidth: 2,
          data: grades,
          skipNull: true
        },
        {
          label: "Peers",
          backgroundColor: "rgba(255, 50, 50, .5)",
          borderColor: "rgba(255,0,0, 1)",
          borderWidth: 2,
          data: peergrades,
          skipNull: true
        }
      ]
    }
  }

  render(): React.ReactNode {
    const { tiles, tilesGradeSummary, peerGrades, discussions, learningOutcomes} = this.props;

    return (
      <div>
        <HorizontalBar height={300} data={this.createBarData(tiles, tilesGradeSummary, peerGrades, discussions, learningOutcomes)} options={this.bar_options} />
      </div>
    );
  }
}