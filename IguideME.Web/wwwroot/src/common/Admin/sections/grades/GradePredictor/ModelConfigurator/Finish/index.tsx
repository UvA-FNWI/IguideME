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

    state = {
    }

    componentDidMount() {
    }

    validate(): boolean {
        return true
    }

    isStepCompleted: () => boolean = this.validate;

    render(): React.ReactNode {
        return (
            <div>
                Finish
            </div>
        )
    }
}
