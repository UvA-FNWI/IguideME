import React, { Component } from "react"
import { Button } from "antd";

import { StudentGrades, GradesDatasets } from "../../types"
import { IStep } from "../interfaces";

interface IProps {
    model: string,
}

interface IState {
}

export default class Finish extends Component<IProps, IState> implements IStep {

    validate(): boolean {
        return true
    }

    isStepCompleted: () => boolean = this.validate;

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
