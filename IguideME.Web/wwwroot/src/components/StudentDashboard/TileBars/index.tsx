import React, { Component } from "react";
// import {createBarData, getBarOptions} from "../helpers";
import {Bar} from "react-chartjs-2";
import {Tile} from "../../../models/app/Tile"
import { CanvasDiscussion, discussionType } from "../../../models/canvas/Discussion";
import { LearningOutcome } from "../../../models/app/LearningGoal";
import { PeerGrades, TilesGradeSummary } from "../types";
import {Data} from "./types"
import { IProps } from "./types";
import { CanvasStudent } from "../../../models/canvas/Student";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default class GradeBar extends Component<IProps> {

  bar_options = {
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    legend: {
      display: true
    },
    scales: {
      x: {
        border : {
          display : false
        },
        grid : {
          display : false
        },
        ticks: {
          display: false
        },
        stacked: false,
      },
      y: {
        barPercentage: .95,
        categoryPercentage: .95,
        border : {
          display : false,
        },
        grid : {
          display : false,
        },
        stacked: false
      }
    }
  }

  click = (evt: any, element: any, data: any) => {

    if (!element[0]) return;
    let tile = data.tiles[element[0].index]


    console.log("element", element);
    console.log("data", data);
    console.log("evt", evt);

    // chartref.current;

    window.dispatchEvent(new CustomEvent('selectTile', { detail: {tile} }))

  }

  createBarData(tiles: Tile[], tilesGradeSummary: TilesGradeSummary[] , peerGrades: PeerGrades[], discussions: CanvasDiscussion[], learningOutcomes: LearningOutcome[], student: CanvasStudent) {
    let datadict = new Map<number, Data>();

    for (let i = 0; i < tiles.length; i++) {
      let grade = 0
      if (tiles[i].content === "LEARNING_OUTCOMES") {
        grade = learningOutcomes.filter(lo => lo.success).length;
      } else if (tiles[i].type === "DISCUSSIONS") {
        discussions.forEach(discussion => {
          if (discussion.type === discussionType.topic ){
            if (discussion.posted_by === student.name)
              grade++;
          } else {
            grade++;
          }
        })
      }

      datadict.set(tiles[i].id, {title: tiles[i].title, grade: grade, peergrade: 0, max: 10, tile: tiles[i]});
    }

    for (let i = 0; i < tilesGradeSummary.length; i++) {
      let grade = tilesGradeSummary[i].average
      let entry = datadict.get(tilesGradeSummary[i].tile.id)!;
      if (tilesGradeSummary[i].tile.content === "BINARY"){
        entry.max = 100
        grade = grade * 100
      }

      entry.grade = grade * 10 / entry.max;

    }

    for (let i = 0; i < peerGrades.length; i++) {
      console.log("peergrades", peerGrades);
      let pgrade = peerGrades[i].avg;
      let entry = datadict.get(peerGrades[i].tileID)!;
      console.log("pgrade", pgrade);
      console.log("entry", entry);

      if (entry !== undefined) {
        entry.peergrade = pgrade * 10/ entry.max;
      }
    }

    let data_tiles: Tile[] = [];
    let titles: string[] = [];
    let grades: any[] = [];
    let peergrades: any[] = [];

    datadict.forEach((value) => {
      if (value.grade === 0 && value.peergrade === 0) return;

      data_tiles.push(value.tile);
      titles.push(value.title);
      grades.push(value.grade);
      peergrades.push(value.peergrade);
    });

    return {
      tiles: data_tiles,
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
    const { tiles, tilesGradeSummary, peerGrades, discussions, learningOutcomes, student} = this.props;
    let data = this.createBarData(tiles, tilesGradeSummary, peerGrades, discussions, learningOutcomes, student)

    return (
      <div style={{ height: '100vh', width: '80vw', position: 'relative'}}>
        <Bar
                       height={100}
                       data={data}
                       options={{...this.bar_options, onClick: (evt: any, e: any) => this.click(evt, e, data) }}
                       />
      </div>
    );
  }
}
