import React, { Component } from "react";
import { IProps, IState } from "./types";
import { Line } from "react-chartjs-2";
// import { Chart, PointElement } from "chart.js";
// Chart.register(PointElement);
import 'chart.js/auto'
// import { borderRadius } from "react-select/src/theme";

export default class TileHistoricGraph extends Component<IProps, IState> {

    render(): React.ReactNode {

        // Don't show a graph if the tile doesn't have historic grades.
        if (this.props.historicGrades === undefined) {
            return (<div></div>);
        }

        const {
            dates,
            user_avg,
            peer_avg,
            peer_max,
            peer_min
        } =  this.props.historicGrades;

        return (

            <div>
                hello there
                <Line
                data={{
                    labels: dates,
                    datasets: [
                        {
                            label: "Your average",
                            data: user_avg,
                            fill: false,
                            borderWidth:3,
                            tension:0,
                            backgroundColor: "rgb(188,132,108)",
                            borderColor:'rgb(188,132,108)'
                            },
                        {
                            label: "Peer Group average",
                            data: peer_avg,
                            fill: false,
                            borderWidth:3,
                            tension:0,
                            backgroundColor: "rgb(101,154,176)",
                            borderColor:'rgb(101,154,176)'///68,93,118
                            },
                        {
                            label: "Peer Group maximum",
                            data: peer_max,
                            fill: 3,
                            borderWidth:3,
                            tension:0,
                            backgroundColor: "rgb(135,206,235,0.1)",
                            borderColor:'rgb(135,206,235)'
                            },
                        {
                            label: "Peer Group minimum",
                            data: peer_min,
                            fill: 2,
                            borderWidth:3,
                            tension:0,
                            backgroundColor: "rgb(135,206,235,0.1)",
                            borderColor:'rgb(135,206,235)'
                            }
                        ]
                    }}
                />
            </div>
        )
    }

}
