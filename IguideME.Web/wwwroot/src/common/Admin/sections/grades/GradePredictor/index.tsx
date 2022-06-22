import React, { Component } from "react"
import { Divider } from "antd"
import Admin from "../../../index"
import Loading from "../../../../../components/utils/Loading"

import ModelConfigurator from "./ModelConfigurator"

interface IProps {

}

interface IState {
    loaded: boolean
}

export default class GradePredictor extends Component<IProps, IState> {

    state = {
        loaded: false,
    }

    componentDidMount(): void {
        this.setState({ loaded: true })
    }

    render(): React.ReactNode {
        const { loaded } = this.state;

        if (!loaded)
            return <Loading small={false} />;

        return <Admin menuKey={"gradePredictor"}>
            <h1>Grade Predictor</h1>

            <Divider />

            <ModelConfigurator />
        </Admin>
    }
}
