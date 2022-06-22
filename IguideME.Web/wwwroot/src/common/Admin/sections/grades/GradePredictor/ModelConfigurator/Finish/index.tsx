import React, { Component } from "react"
import { Button } from "antd";

interface IProps {
    model: string,
}

interface IState {
}

export default class Finish extends Component<IProps, IState> {

    state = {
    }

    componentDidMount() {
    }

    render(): React.ReactNode {
        return (
            <div>
                Finish
            </div>
        )
    }
}
