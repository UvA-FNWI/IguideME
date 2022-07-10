import React, { Component } from "react"

import { GradesDatasets } from "../../types"
import { IStep } from "../interfaces"
import { Mock } from "../../../../../../../mock"

interface IProps {
    gradesDatasets: GradesDatasets,

}

interface IState {
}

export default class LinkLiveData extends Component<IProps, IState> implements IStep {
    mock = new LinkLiveDataMock(/* enable? */ true)

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
                Link data
            </div>
        )
    }
}

class LinkLiveDataMock extends Mock {
}
