import React, { Component } from "react"
import { Button } from "antd";

type StudentGrades = { [studentID: number]: number }
type GradesDatasets = { [name: string]: StudentGrades }

interface IProps {
    gradesDatasets: GradesDatasets
}

interface IState {
}

export default class ModelConfigurator extends Component<IProps, IState> {

    state = {
    }

    componentDidMount() {
        console.log(this.props)
    }

    render(): React.ReactNode {
        return (
            <div>
                Link data
            </div>
        )
    }
}
