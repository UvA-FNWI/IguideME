import React, { Component } from "react";
import { IProps, IState } from "./types";
import { Line } from "react-chartjs-2";
import { borderRadius } from "react-select/src/theme";
import getHistory from "../../../api/controllers/tile";

export default class TileHistoricGraph extends Component<IProps, IState> {

    render(): React.ReactNode {
        
        let a = 5;

        const dates = ["1","2","3","4","5","6","7"];
        const user_avg =      [6,5,7,8,6,7,7];
        const peergroup_avg = [5.5,6.3,7,8,6,5,5];
        const peergroup_max = [8,9,8,9,7,8,9];
        const peergroup_min = [3,1,4,5,3,4,3];


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
                        backgroundColor: "rgb(188,132,108)",
                        borderColor:'rgb(188,132,108)',
                        responsive:true
                        },
                    {
                        label: "Peer Group average",
                        data: peergroup_avg,
                        fill: false,
                        borderWidth:3,
                        backgroundColor: "rgb(101,154,176)",
                        borderColor:'rgb(101,154,176)',///68,93,118
                        responsive:true
                        },
                    {
                        label: "Peer Group maximum",
                        data: peergroup_max,
                        fill: 3,
                        borderWidth:3,
                        backgroundColor: "rgb(135,206,235,0.1)",
                        borderColor:'rgb(135,206,235)',
                        },
                    {
                        label: "Peer Group minimum",
                        data: peergroup_min,
                        fill: 2,
                        borderWidth:3,
                        backgroundColor: "rgb(135,206,235,0.1)",
                        borderColor:'rgb(135,206,235)'
                        }
                    ],
                    }}
                />
            </div>
        )
    }

}