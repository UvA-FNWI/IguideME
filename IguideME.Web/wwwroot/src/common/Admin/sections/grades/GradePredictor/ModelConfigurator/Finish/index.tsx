import React, { Component } from "react"
import { Result } from "antd";
import DataMartController from "../../../../../../../api/controllers/datamart";

import { GradePredictionModel, IStep } from "../interfaces";

interface IProps {
    model: GradePredictionModel,
}

interface IState {
}

export default class Finish extends Component<IProps, IState> implements IStep {

    state = {
    }

    async componentDidMount() {

        const newModels = await DataMartController.getModels();
        console.log(newModels)
        this.uploadModel()
    }

    async uploadModel() {
        const { model }: IProps = this.props

        await DataMartController.uploadModel(model)
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
