import React, { Component } from "react";
import { IProps, IState } from "./types";
import { Line } from "react-chartjs-2";
import 'chart.js/auto'

export default class TileHistoricGraph extends Component<IProps, IState> {

    render(): React.ReactNode {

        // Don't show a graph if the tile doesn't have historic grades.
        if (this.props.historicGrades === undefined) {
            return (<></>);
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
                <Line
                options= {{
                    scales: {
                        y: {
                          min: 0
                        }
                      }
                }}
                data={{
                    labels: dates,
                    datasets: [
                        {
                            label: "Your average",
                            data: user_avg,
                            fill: false,
                            borderWidth:3,
                            tension:0,
                            backgroundColor: "rgb(255, 50, 50, 0.5)",
                            borderColor:'rgb(255,50,50, 0.5)'
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
