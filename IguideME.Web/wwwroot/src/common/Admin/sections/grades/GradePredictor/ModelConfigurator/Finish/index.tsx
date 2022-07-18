import React, { Component } from "react"
import { Result } from "antd";

import { IStep } from "../interfaces";

interface IProps {
    model: { model: any, modelColumns: number[] };
}

interface IState {
}

export default class Finish extends Component<IProps, IState> implements IStep {

    state = {
    }

    componentDidMount() {
    }

    validate(): boolean {
        return true
    }

    isStepCompleted = this.validate

    render(): React.ReactNode {
        return (
            <div id={"uploadOverview"}>
                <Result
                    status="success"
                    title="The model is ready to use"
                />
            </div>
        )
    }
}
