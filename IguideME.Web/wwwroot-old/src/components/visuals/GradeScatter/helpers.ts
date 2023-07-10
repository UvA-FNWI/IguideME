import { TileEntry } from "../../../models/app/Tile";
import {MergedData} from "./types";
import { ChartData } from "chart.js";

export const createScatterData = (mergedData: MergedData[]) => {
  return {
    datasets: [
      {
        label: 'Quiz 1 vs. Quiz 2',
        fill: true,
        backgroundColor: 'rgba(90, 50, 255, 0.4)',
        pointBorderColor: 'rgb(90, 50, 255)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgb(90, 50, 255)',
        pointHoverBorderColor: 'rgba(90, 50, 255, 0.8)',
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 7,
        data: mergedData.map((p: any) => ({ x: p.grade1, y: p.grade2, name: p.userID })),
        borderWidth: 4
      }
    ]
  }
}

export const getScatterOptions = (entryOne: TileEntry, entryTwo: TileEntry, mergedData: MergedData[]) => {
  return {
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    tooltips: {
      callbacks: {
        label: (tooltipItem: any, data: ChartData<any>) => {
          return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].name;
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: entryOne.title
        },
        suggestedMin: Math.min(...mergedData.map((p: any) => p.grade1)),
        suggestedMax: Math.max(...mergedData.map((p: any) => p.grade1)),
      },
      x: {
        title: {
          display: true,
          text: entryTwo.title
        },
        suggestedMin: Math.min(...mergedData.map((p: any) => p.grade2)),
        suggestedMax: Math.max(...mergedData.map((p: any) => p.grade2)),
      }
    }
  }
}
