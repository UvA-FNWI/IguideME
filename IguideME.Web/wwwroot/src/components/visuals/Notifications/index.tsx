import React, {Component} from "react";
import {TrophyOutlined, RiseOutlined, WarningOutlined} from "@ant-design/icons";
import { IProps } from "./types";


export default class PerformanceNotifications extends Component<IProps> {

    _getTileTitle = (tileID: number): string => {
        return this.props.tiles.find(t => t.id === tileID)?.title ?? "";
    }

    render(): React.ReactNode {

        let {outperforming, closing, moreEffort} = this.props

        return (
        <div className="Notifications">
            { outperforming.length > 0 &&
            <div>
                <TrophyOutlined />
                {' '}
                You are outperforming your peers in:
                <ul style={{boxSizing: 'border-box', paddingLeft: 30}}>
                { outperforming.map((n, i) => <li key={i}>{this._getTileTitle(n.tile_id)}</li>)}
                </ul>
            </div> }

            { closing.length > 0 &&
            <div>
                <RiseOutlined />
                {' '}
                You are closing the gap to your peers in:
                <ul style={{boxSizing: 'border-box', paddingLeft: 30}}>
                { closing.map((n, i) => <li key={i}>{this._getTileTitle(n.tile_id)}</li>)}
                </ul>
            </div> }

            { moreEffort.length > 0 &&
            <div>
                <WarningOutlined />
                {' '}
                You have to put more effort in:
                <ul style={{boxSizing: 'border-box', paddingLeft: 30}}>
                { moreEffort.map(n => <li>{this._getTileTitle(n.tile_id)}</li>)}
                </ul>
            </div> }
        </div>
        );
    }
}