import React, { Component } from "react";
import { Button, Result } from "antd";
import { PredictiveModel } from "../../../../../../../../models/app/PredictiveModel";

type IProps = {
    models: PredictiveModel[];
    closePanel: () => any;
}

export default class UploadOverview extends Component<IProps> {
    render(): React.ReactNode {
        const { models, closePanel } = this.props;

        return (
            <div id={"uploadOverview"}>
                <Result
                    status="success"
                    title="Predictive models configured!"
                    subTitle={`In total ${models.length} models were trained, the equivalent of every possible submission combination with a minimum size of three. You can view a summary by closing this panel.`}
                    extra={
                        <Button onClick={closePanel}>
                            Close
                        </Button>
                    }
                />
            </div>
        );
    }
}
