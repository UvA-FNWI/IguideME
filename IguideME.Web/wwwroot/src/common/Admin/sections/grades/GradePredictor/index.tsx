import React, { Component } from "react"
import Admin from "../../../index"
import Loading from "../../../../../components/utils/Loading"
import { filenameForFile, headerForCsvFile, rowsForCsvFile } from "ztypescript"
import { Button } from "antd"

type StudentGradePair = [Number, Number]

interface IProps {

}

interface IState {
    loaded: boolean
    gradesDatasets: { [name: string]: Array<StudentGradePair> }
    finalGradesDatasetName: string
}

export default class GradePredictor extends Component<IProps, IState> {

    state = {
        loaded: false,
        gradesDatasets: {},
        finalGradesDatasetName: ""
    }

    componentDidMount(): void {
        this.setState({ loaded: true })
    }

    async csvFilesChosen(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files
        if (!files)
            return

        let gradesDatasets: { [name: string]: Array<StudentGradePair> } = {}

        for (let i = 0; i < files.length; i++) {
            let header = await headerForCsvFile(files[i])
            if (!header)
                continue

            let [colA, colB] = header.map(c => c.toLowerCase())
            if (colA !== "studentloginid" || colB !== "grade")
                continue

            let datesetName = filenameForFile(files[i]);
            let studentGradePairs = await this.readStudentGradePairsFromFile(files[i]);
            gradesDatasets[datesetName] = studentGradePairs;
        }

        this.setState({ gradesDatasets })
    }

    async readStudentGradePairsFromFile(file: File): Promise<Array<StudentGradePair>> {
        const rows = await rowsForCsvFile(file);
        return rows.map(r => {
            let [studentID, grade] = r.map(c => Number(c.replace(',', '.')));
            return [studentID, grade];
        })
    }

    finalGradesDatasetChosen(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ finalGradesDatasetName: event.target.value })
    }

    trainModels() {

    }

    render(): React.ReactNode {
        const { loaded } = this.state;

        if (!loaded)
            return <Loading small={false} />;

        return <Admin menuKey={"gradePredictor"}>
            <h1>Grade Predictor</h1>

            <input type="file"
                accept=".csv"
                onChange={this.csvFilesChosen.bind(this)}
                required
                multiple />

            <select onChange={this.finalGradesDatasetChosen.bind(this)}>
                {Object.keys(this.state.gradesDatasets).map(datasetName =>
                    <option key={datasetName} value={datasetName}>{datasetName}</option>
                )}
            </select>

            <Button type={"primary"}
                size={"large"}
                onClick={this.trainModels}>
                Train models
        </Button>
        </Admin>
    }
}
