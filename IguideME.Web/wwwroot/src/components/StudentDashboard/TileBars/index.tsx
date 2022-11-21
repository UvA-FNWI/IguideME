import React, { Component } from "react";
// import {createBarData, getBarOptions} from "../helpers";
import {HorizontalBar} from "react-chartjs-2";
import {Tile} from "../../../models/app/Tile"
import {Data} from "./types"

export default class GradeBar extends Component<{
  tiles: Tile[],
  tilesGradeSummary: any,
  peerGrades: any,
}> {

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

  createBarData(tiles: Tile[], tilesGradeSummary: {tile: Tile, average: any}[] , peerGrades: { min: number, max: number, avg: number, tileID: number}[]) {
    let datadict = new Map<number, Data>();

    for (var i = 0; i < tiles.length; i++) {
      datadict.set(tiles[i].id, {title: tiles[i].title, grade: 0, peergrade: 0, max: 10});
    }

    for (var i = 0; i < tilesGradeSummary.length; i++) {
      let grade = tilesGradeSummary[i].average
      let entry = datadict.get(tilesGradeSummary[i].tile.id)!;
      if (tilesGradeSummary[i].tile.content === "BINARY"){
        entry.max = 100
      }
      // TODO:
      grade = grade * 10 / entry.max;

      entry.grade = grade;

    }

    for (var i = 0; i < peerGrades.length; i++) {
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
          data: grades
        },
        {
          label: "Peers",
          backgroundColor: "rgba(255, 50, 50, .5)",
          borderColor: "rgba(255,0,0, 1)",
          borderWidth: 2,
          data: peergrades
        }
      ]
    }
  }

  render(): React.ReactNode {
    const { tiles, tilesGradeSummary, peerGrades} = this.props;

    return (
      <div>
        <HorizontalBar height={300} data={this.createBarData(tiles, tilesGradeSummary, peerGrades)} options={this.bar_options} />
      </div>
    );
  }
}