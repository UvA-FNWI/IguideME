import React, { Component } from "react"

import { GradesDatasets } from "../../types"
import { IStep } from "../interfaces"

interface IProps {
    gradesDatasets: GradesDatasets,

}

interface IState {
}

export default class LinkLiveData extends Component<IProps, IState> implements IStep {
    mock = new Mock(/* enable? */ true)

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

class Mock {
    enabled = true

    constructor(enabled: boolean) {
        this.enabled = enabled
    }
}
