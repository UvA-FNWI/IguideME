import React, { Component } from "react";
import CSVReader from "react-csv-reader";
import { Alert, Col, Divider, message, Row } from "antd";
import "./style.scss";
import { validateExternalUploadSchema } from "../../../../../../../../utils/validators";
import DemoAnimation from "./DemoAnimation";

type IProps = {
    /* a data row is (studentloginid, grade) */
    dataSourceUploadFinished: (rows: any[]) => any;
}

export default class DataSourceUpload extends Component<IProps> {
    render(): React.ReactNode {
        return (
            <div>
                <Row>
                    <Col xs={24} md={14}>
                        <h2>Step 1. Historic data</h2>
                        <Divider />
                        <p>To train the predictive models historic course data is required. If you do not have historic course data available you are unable to create a predictive model, be sure to save this year's data for next year! Please provide the data in a <strong>CSV</strong> format. The data must adhere to the simple principle that each column corresponds to a unique gradable component (i.e. a quiz or exam), and each row represents a student. There must be a column named <i>final_grade</i> specifying the final grade of the student for the course.</p>

                        <Alert message={"The models are trained on the data source from your local browser. This means that the data source will never be uploaded to our service. Only the computed model states will be stored by the application."} />

                        <div id={"dataSourceUpload"}>
                            <label style={{ height: 'fit-content' }}>
                                Upload data source
                              <CSVReader
                                    inputId={'CSVReader'}
                                    inputStyle={{ display: 'none' }}
                                    onFileLoaded={(records) => {
                                        if (!validateExternalUploadSchema(records))
                                            return message.error("Invalid data schema!");

                                        this.props.dataSourceUploadFinished(records);
                                    }}
                                    onError={() => message.error("Invalid data source!")}
                                    parserOptions={{
                                        header: true,
                                        dynamicTyping: true,
                                        skipEmptyLines: true,
                                        transformHeader: h => h.toLowerCase()
                                    }}
                                />
                            </label>
                        </div>
                    </Col>
                    <Col xs={0} md={10}>
                        <DemoAnimation />
                    </Col>
                </Row>
            </div>
        )
    }
}
