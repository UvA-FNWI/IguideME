import "./style.scss"

import React, { Component } from "react"
import { Alert, Col, Divider, Row, Button, Select } from "antd";
import { filenameForFile, headerForCsvFile, rowsForCsvFile } from "ztypescript"
import BlackBoardAnimation from "./BlackBoardAnimation";

import { StudentGrades, GradesDatasets } from "../../types"
import { IStep } from "../interfaces"
import { UploadDataMock } from "../mocking";
import  { studentIdStrings } from "../../../../../helpers"

const { Option } = Select;

interface IProps {
    parentSetGradesDatasets: Function
    parentSetFinalGradesDatasetName: Function,
}

interface IState {
    gradesDatasets: GradesDatasets,
    finalGradesDatasetName: string,
    inputErrorFinalGradesDatasetName: boolean,
}

export default class UploadData extends Component<IProps, IState> implements IStep {
    mock = new UploadDataMock(/* enable? */ true)

    state = {
        gradesDatasets: this.mock.gradesDatasets,
        finalGradesDatasetName: this.mock.finalGradesDatasetName,
        inputErrorFinalGradesDatasetName: false,
    }

    componentDidMount() {
        if (this.mock.enabled) {
            if (this.mock.mockGradesDatasets)
                this.onGradesDatasetsLoaded()
            if (this.mock.mockFinalGradesDatasetName)
                this.onFinalGradesDatasetNameChosen()
        }
    }

    onGradesDatasetsLoaded() {
        const { parentSetGradesDatasets } = this.props
        const { gradesDatasets } = this.state

        this.ensureGradeDatasetsAreComplete()
        this.enforceMinimumMaximumGrade()

        parentSetGradesDatasets(gradesDatasets)
    }

    // FIXME remove optional parameter v, it is used as a hack
    // because setState does not actually set the state on time
    // (see the onSelect usage of this method)
    onFinalGradesDatasetNameChosen(v: string | null = null) {
        const { finalGradesDatasetName } = this.state;
        this.props.parentSetFinalGradesDatasetName(v ? v : finalGradesDatasetName);
    }

    async csvFilesChosen(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files
        if (!files)
        return

        let gradesDatasets: GradesDatasets = {}

        for (let i = 0; i < files.length; i++) {
            let header = await headerForCsvFile(files[i])

            if (!header)
                continue

            let [colA, colB] = header
            // TODO: add option for: studentid, exersizename1, exercisename2, ...
            if (!studentIdStrings.includes(colA.toLowerCase()) || colB.toLowerCase() !== "grade"){
                continue
            }
            let datesetName = filenameForFile(files[i])
            // TODO: I don't think that the async is doing anything?
            let studentGrade = await this.readStudentGradesFromFile(files[i])
            gradesDatasets[datesetName] = studentGrade
        }

        this.setState({ gradesDatasets })

        this.onGradesDatasetsLoaded()
    }

    async readStudentGradesFromFile(file: File): Promise<StudentGrades> {
        const rows: Array<Array<string>> = await rowsForCsvFile(file)

        let studentGrades: StudentGrades = {}
        rows.forEach(row => {
            let [studentID, grade] = row.map(c => Number(c.replace(',', '.')))
            studentGrades[studentID] = grade
        })
        // TODO: Should probably change StudentGrades to a Map type as the 0 key is being set to NaN automatically.
        if (!studentGrades[0]) {
            delete studentGrades[0]
        }
        return studentGrades
    }

    ensureGradeDatasetsAreComplete() {
        const { gradesDatasets } = this.state

        let studentIDs = Object.values(gradesDatasets)
        .flatMap(Object.keys) // get all student IDs
        .map(x => parseInt(x))
        .slice(0) // deduplicate

        Object.keys(gradesDatasets)
            .forEach(k => {
                studentIDs
                .filter(sID => !(sID in gradesDatasets[k]))
                .forEach(sID => gradesDatasets[k][sID] = 1)
            })

            console.log("after", JSON.parse(JSON.stringify(gradesDatasets)));

        this.setState({ gradesDatasets: gradesDatasets })
    }

    enforceMinimumMaximumGrade() {
        const { gradesDatasets } = this.state

        let wGradesDatasets = gradesDatasets as GradesDatasets

        Object.keys(wGradesDatasets)
            .forEach(k => {
                Object.keys(wGradesDatasets[k])
                    .map(x => parseInt(x))
                    .forEach(sID => {
                        wGradesDatasets[k][sID] = Math.max(1, wGradesDatasets[k][sID])
                        wGradesDatasets[k][sID] = Math.min(10, wGradesDatasets[k][sID])
                    })
            })

        this.setState({ gradesDatasets: wGradesDatasets })
    }

    validate(): boolean {
        let { finalGradesDatasetName } = this.state

        let wValid = true
        if (finalGradesDatasetName === "") {
            wValid = false
            this.setState({ inputErrorFinalGradesDatasetName: true })
        }
        return wValid
    }

    isStepCompleted = this.validate

    render(): React.ReactNode {
        return (
            <div>
                <Row>
                    <Col xs={24} md={14}>
                        <Row>
                            <Col xs={24} md={24}>
                                <h2>Provide student grades from a past school year</h2>

                                <Divider />

                                <p>This configuration screen lets you train a model that once trained, will be able to roughly predict a student's final grade. The model should be trained on the results of a past academic year.
                    </p>
                                <p>Please provide this data through one .csv file per graded assignment (e.g. mini-test, quiz, etc.); The files must contain the following two columns: "studentID" and "grade". Furthermore, please take note of which file contains the final grades.</p>
                                <p>You can select multiple files at once.</p>

                                <Alert message="Student data is only ever kept on your local device, and never uploaded to IGuideME. Once the model is trained, all identifying information is erased." />

                            </Col>
                        </Row>

                        <Row>
                            <Col xs={24} md={12}>
                                <div id="filePickerInputContainer">
                                    <input id="filePickerInput"
                                        type="file"
                                        accept=".csv"
                                        multiple
                                        onChange={this.csvFilesChosen.bind(this)} />
                                </div>

                                <ul id="uploadedFilesUl">
                                    {Object.keys(this.state.gradesDatasets)
                                        .map(datasetName =>
                                            <li key={datasetName}>
                                                <Button
                                                    className="liDeleteBtn"
                                                    size="small"
                                                    onClick={() => {
                                                        const { gradesDatasets } = this.state
                                                        delete gradesDatasets[datasetName]
                                                        this.setState({
                                                            gradesDatasets: gradesDatasets
                                                        })
                                                    }}>
                                                    x
                                    </Button>
                                                {datasetName}
                                            </li>
                                        )}
                                </ul>

                                <Button id="uploadButton"
                                    type="primary"
                                    size="large"
                                    onClick={() =>
                                        document
                                            .getElementById("filePickerInput")
                                            ?.click()
                                    }>
                                    Upload Data
                            </Button>
                            </Col>

                            <Col xs={24} md={12}>
                                <Select
                                    className={"finalGradesDSSelect " + (this.state.inputErrorFinalGradesDatasetName && " error ")}
                                    size="large"
                                    onChange={(v: string) => {
                                        this.setState({
                                            finalGradesDatasetName: v,
                                            inputErrorFinalGradesDatasetName: false
                                        });
                                        // FIXME why does setState not set the state on time
                                        // (aka don't pass v explicitly)
                                        this.onFinalGradesDatasetNameChosen(v);
                                    }}
                                    placeholder="Dataset containing final grades...">
                                    {Object.keys(this.state.gradesDatasets)
                                        .map(datasetName =>
                                            <Option key={datasetName} value={datasetName}>
                                                {datasetName}
                                            </Option>
                                        )}
                                </Select>
                            </Col>
                        </Row>

                    </Col>
                    <Col xs={0} md={10}>
                        <BlackBoardAnimation />
                    </Col>
                </Row>
            </div>
        )
    }
}
