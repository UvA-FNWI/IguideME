import React, { PureComponent } from "react";
import {Line} from 'react-chartjs-2';

interface IProps {
  data: { y_hat: number, y_lower: number, y_upper: number }[];
  average: number | string;
}


export default class GraphView extends PureComponent<IProps> {

  render() {
    const { data } = this.props;

    if (!data || data.length === 0) {
      return (
        <h2>At the moment we have insufficient data to predict a grade!</h2>
      )
    }

    return (
      <React.Fragment>
        <h2>Your predicted grade is a <b>{ data[data.length - 1]['y_hat']}</b>.</h2>
        <Line
          data={{
            labels: Array.from(Array((data || []).length).keys()),
            datasets: [
              {
                label: "Lower boundary",
                backgroundColor: 'rgba(211, 211, 211,  0.6)',
                borderColor: 'rgba(188, 188, 188, 1.0)',
                fill: false,
                data: (data || []).map(x => x['y_lower'])
              },
              {
                label: "Upper boundary",
                backgroundColor: 'rgba(211, 211, 211, 0.6)',
                borderColor: 'rgba(188, 188, 188, 1.0)',
                fill: '-1',
                data: (data || []).map(x => x['y_upper'])
              },
              {
                label: "Predicted grade",
                backgroundColor: 'rgba(50, 145, 200, 0.6)',
                borderColor: 'rgba(50, 145, 200, 1.0)',
                fill: false,
                data: (data || []).map(x => x['y_hat'])
              }
            ],
          }}
          options={{
            legend: {
              display: false
            },
            maintainAspectRatio: false,
            spanGaps: false,
            elements: {
              line: {
                tension: 0.000001
              }
            },
            plugins: {
              filler: {
                propagate: false
              }
            },
            scales: {
              xAxes: [{
                ticks: {
                  autoSkip: false
                }
              }],
              yAxes: [{
                ticks: {
                  suggestedMin: 0,
                  suggestedMax: 10
                }
              }]
            }
          }}
        />
      </React.Fragment>
    )
  }
}