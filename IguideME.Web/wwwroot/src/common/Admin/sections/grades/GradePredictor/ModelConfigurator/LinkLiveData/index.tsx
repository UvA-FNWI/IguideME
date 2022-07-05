import React, { Component } from "react"
import { Button } from "antd";

import { GradesDatasets } from "../../types"
import { IStep } from "../interfaces"

interface IProps {
    gradesDatasets: GradesDatasets,

    parentSetFinalGradesDatasetName: Function,
}

interface IState {
    finalGradesDatasetName: string,
}

export default class LinkLiveData extends Component<IProps, IState> implements IStep {

    _mock = true
    _mockFinalGradesDatasetName = true

    _finalGradesDatasetNameMock = "eindcijfer"

    state = {
        finalGradesDatasetName: (this._mock && this._mockFinalGradesDatasetName) ? this._finalGradesDatasetNameMock : ""
    }

    componentDidMount() {
        if (this._mock) {
            if (this._mockFinalGradesDatasetName)
                this.onFinalGradesDatasetNameChosen()
        }
    }

    onFinalGradesDatasetNameChosen() {
        const { finalGradesDatasetName } = this.state
        this.props.parentSetFinalGradesDatasetName(finalGradesDatasetName)
    }

    validate(): boolean {
        return true
    }

    isStepCompleted: () => boolean = this.validate;

    render(): React.ReactNode {
        return (
            <div>
                Link data
            </div>
        )
    }
}
