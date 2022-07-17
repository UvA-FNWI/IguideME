import React, { Component } from "react"

import { IStep } from "../interfaces";

interface IProps {
    model: any, // TODO type
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
            <div>
                Finish
            </div>
        )
    }
}
