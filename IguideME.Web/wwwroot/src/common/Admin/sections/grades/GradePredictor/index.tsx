import React, { Component } from "react";
import Admin from "../../../index";
import { Divider } from "antd";
import { IProps, IState } from "./types";
import ConfigureModel from "./ConfigureModel";
import Loading from "../../../../../components/utils/Loading";
import ModelResults from "./ModelResults";
import { ParentSize } from '@visx/responsive';
import DataMartController from "../../../../../api/controllers/datamart";

export default class GradePredictor extends Component<IProps, IState> {

  state = {
    loaded: false,
    models: []
  }

  componentDidMount(): void {
    DataMartController.getModels().then(models => {
      this.setState({ models, loaded: true });
    });
  }

  render(): React.ReactNode {
    const { models, loaded } = this.state;

    if (!loaded) return <Loading small={false} />;

    return (
      <Admin menuKey={"gradePredictor"}>
        <h1>Grade Predictor</h1>
        <span>Configure a predictive model</span>
        <Divider />

        { models.length > 0 ?
          <ParentSize>
            { parent => (
              <ModelResults models={models} width={parent.width} height={500} />
            )}
          </ParentSize> :
          <ConfigureModel setModels={(models) => this.setState({ models })} />
        }
      </Admin>
    )
  }
}