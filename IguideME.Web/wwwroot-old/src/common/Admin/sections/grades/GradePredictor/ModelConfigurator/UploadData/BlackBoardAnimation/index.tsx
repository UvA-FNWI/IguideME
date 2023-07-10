import React, { Component } from "react";
import "./style.scss";

export default class BlackBoardAnimation extends Component {

    state = {
        offset: -2
    }

    componentDidMount(): void {
        setTimeout(() => {
            this.setState({ offset: 300 });
        }, 500)
    }

    render(): React.ReactNode {
        const { offset } = this.state;

        return (
            <div id={"demoAnimation"}>
                <div id={"spreadsheet"}>
                    <div id={"wallpaper"} />
                    <svg width={400} height={300}>
                        <rect x={0} y={0} width={400} height={300} fill={"transparent"} />
                        <rect x={0} y={offset} width={400} height={3} fill={'rgba(255, 0, 0, 0.75)'} />
                    </svg>
                </div>
            </div>
        )
    }
}
