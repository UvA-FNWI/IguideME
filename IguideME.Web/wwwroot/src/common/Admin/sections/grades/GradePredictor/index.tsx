import React, { Component } from "react"
import { Button } from "antd"
import Admin from "../../../index"
import Loading from "../../../../../components/utils/Loading"
import { filenameForFile, headerForCsvFile, rowsForCsvFile } from "ztypescript"
import MLR from "ml-regression-multivariate-linear"
import StudentGradesTable from "../../../../../components/StudentGradesTable"

type StudentGrades = { [studentID: number]: number }

interface IProps {

}

interface IState {
    loaded: boolean
    gradesDatasets: { [name: string]: StudentGrades }
    finalGradesDatasetName: string,
    model: string,
    modelColumns: Array<string>,
}

export default class GradePredictor extends Component<IProps, IState> {

    state = {
        loaded: false,
        gradesDatasets: {},
        finalGradesDatasetName: "",
        model: "",
        modelColumns: [],
    }

    componentDidMount(): void {
        this.setState({ loaded: true })
    }

    async csvFilesChosen(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files
        if (!files)
            return

        let gradesDatasets: { [name: string]: StudentGrades } = {}

        for (let i = 0; i < files.length; i++) {
            let header = await headerForCsvFile(files[i])
            if (!header)
                continue

            let [colA, colB] = header.map(c => c.toLowerCase())
            if (colA !== "studentloginid" || colB !== "grade")
                continue

            let datesetName = filenameForFile(files[i])
            let studentGrade = await this.readStudentGradesFromFile(files[i])
            gradesDatasets[datesetName] = studentGrade
        }

        this.setState({ gradesDatasets })
    }

    async readStudentGradesFromFile(file: File): Promise<StudentGrades> {
        const rows: Array<Array<string>> = await rowsForCsvFile(file)
        let studentGrades: StudentGrades = {}
        rows.forEach(row => {
            let [studentID, grade] = row.map(c => Number(c.replace(',', '.')))
            studentGrades[studentID] = grade
        })
        return studentGrades
    }

    ensureFinalGradeExists() {
        let fgStudentIDs = Object.entries(this.state.gradesDatasets)
            .filter(x => x[0] === this.state.finalGradesDatasetName) // select students with final grade
            .map(x => x[1] as StudentGrades)
            .flatMap(Object.keys) // get all student IDs
            .map(x => parseInt(x))
            .slice(0) // deduplicate

        let wGradesDatasets = this.state.gradesDatasets as { [name: string]: StudentGrades }

        Object.keys(wGradesDatasets).forEach(k => {
            Object.keys(wGradesDatasets[k])
                .map(x => parseInt(x))
                .filter(sID => !(sID in fgStudentIDs))
                .forEach(sID => {
                    delete wGradesDatasets[k][sID]
                })
        })

        this.setState({ gradesDatasets: wGradesDatasets })
    }

    ensureGradeDatasetsAreComplete() {
        let studentIDs = Object.entries(this.state.gradesDatasets)
            .map(x => x[1] as StudentGrades)
            .flatMap(Object.keys) // get all student IDs
            .map(x => parseInt(x))
            .slice(0) // deduplicate

        let wGradesDatasets = this.state.gradesDatasets as { [name: string]: StudentGrades }

        Object.keys(wGradesDatasets)
            .forEach(k => {
                studentIDs
                    .filter(sID => !(sID in wGradesDatasets[k]))
                    .forEach(sID => wGradesDatasets[k][sID] = 1)
            })

        this.setState({ gradesDatasets: wGradesDatasets })
    }

    enforceMinimumMaximumGrade() {
        let wGradesDatasets = this.state.gradesDatasets as { [name: string]: StudentGrades }

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

    finalGradesDatasetChosen(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ finalGradesDatasetName: event.target.value })
    }

    trainModels() {
        this.ensureFinalGradeExists()
        this.ensureGradeDatasetsAreComplete()
        this.enforceMinimumMaximumGrade()

        const gradesDatasets = this.state.gradesDatasets as { [name: string]: StudentGrades }

        let wOutputs = Object.keys(gradesDatasets[this.state.finalGradesDatasetName])
            .map(sID => parseInt(sID))
            .map(sID => [sID, gradesDatasets[this.state.finalGradesDatasetName][sID]])

        let dsNames = Object.keys(gradesDatasets)
            .filter(dsName => dsName !== this.state.finalGradesDatasetName)

        let wInputs: Array<Array<number>> = []
        for (let i = 0; i < wOutputs.length; i++) {
            let sID = wOutputs[i][0]

            let row = [sID]
            for (let j = 0; j < dsNames.length; j++) {
                row[j + 1] = gradesDatasets[dsNames[j]][sID]
            }

            wInputs.push(row)
        }

        wOutputs = wOutputs
            .sort((a, b) => a[0] - b[0])
            .map(r => r.slice(1))

        wInputs = wInputs
            .sort((a, b) => a[0] - b[0])
            .map(r => r.slice(1))

        const mlr = new MLR(wInputs, wOutputs, { intercept: false })

        this.setState({
            model: JSON.stringify(mlr),
            modelColumns: dsNames
        })

        console.log(mlr.predict([5, 7, 8]))
        console.log(mlr.predict([8, 7, 5]))
        console.log(mlr.predict([9, 9, 9]))
        console.log(mlr.predict([10, 10, 10]))
        console.log(mlr.predict([1, 1, 1]))
        console.log(dsNames)
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
                onClick={() => this.trainModels()}>
                Train models
            </Button>
        </Admin>
    }
}
