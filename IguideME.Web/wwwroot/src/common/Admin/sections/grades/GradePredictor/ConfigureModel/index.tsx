import React, { Component } from "react";
import DataSourceUpload from "./steps/DataSourceUpload";
import {Alert, Button, message, Steps} from "antd";
import {steps} from "./helpers";
import Relationships from "./steps/Relationships";
import TrainModels from "./steps/TrainModels";
import UploadOverview from "./steps/UploadOverview";
import {PredictiveModel} from "../../../../../../models/app/PredictiveModel";
import "./style.scss";
import DataMartController from "../../../../../../api/controllers/datamart";
import Loading from "../../../../../../components/utils/Loading";

export default class ConfigureModel extends Component<{ setModels: (models: PredictiveModel[]) => any }> {

  state = {
    current: 0,
    data: [],
    registry: [],
    models: [],
    loaded: false
  };

  componentDidMount(): void {
    DataMartController.getModels().then(models => {
      this.setState({ models, loaded: true });
    });
  }

  setData = (data: any[]) => {
    this.setState({ data, current: 1 });
  }

  setModels = (models: PredictiveModel[]) => {
    let modelsCopy = JSON.parse(JSON.stringify(models));
    DataMartController.deleteModels().then(async () => {
      while(modelsCopy.length > 0) {
        message.loading({
          content: `Upload progression: ${Math.round(((models.length - modelsCopy.length) / models.length) * 100)}%`,
          key: 'uploadProgress'
        });
        const batch = modelsCopy.splice(0,50);
        await DataMartController.uploadModels(batch);
      }

      const newModels = await DataMartController.getModels();
      message.success({ content: 'Upload complete!', key: 'uploadProgress', duration: 2 });
      this.setState({ current: 3, models: newModels });
    });
  }

  renderStep = () => {
    const { current, data, registry, models } = this.state;
    switch (current) {
      case 0:
        return <DataSourceUpload setData={this.setData} />;
      case 1:
        return <Relationships setRegistry={registry => {
                                // TODO: remove
                                //localStorage.setItem("data", JSON.stringify(data));
                                //localStorage.setItem("registry", JSON.stringify(registry));
                                this.setState({ registry })
                              }}
                              registry={registry}
                              data={data}
                              nextStep={() => this.setState({ current: current + 1})}/>;
      case 2:
        return <TrainModels data={data} registry={registry} setModels={this.setModels} />;
      case 3:
        return <UploadOverview models={models} closePanel={() => this.props.setModels(models)} />;
      default:
        return null;
    }
  }

  render(): React.ReactNode {
    const { current, loaded } = this.state;

    if (!loaded) return <Loading small={true} />

    return (
      <div id={"configureModel"}>
        <Alert
          message="Notice"
          description="Do not close this view whilst configuring or training models!"
          type="warning"
          showIcon
          closable
          style={{marginBottom: 10}}
        />

        <Steps current={current}>
          {steps.map(item => (
            <Steps.Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="stepsContent">
          {this.renderStep()}
        </div>
        <div className="stepsAction">
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => this.setState({ current: current + 1})}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => message.success('Processing complete!')}>
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => this.setState({ current: current - 1})}>
              Previous
            </Button>
          )}
        </div>
      </div>
    )
  }
}