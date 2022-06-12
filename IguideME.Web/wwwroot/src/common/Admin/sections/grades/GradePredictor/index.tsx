import React, { Component } from "react"
import { Button } from "antd"
import Admin from "../../../index"
import Loading from "../../../../../components/utils/Loading"
import { filenameForFile, headerForCsvFile, rowsForCsvFile } from "ztypescript"
import MLR from "ml-regression-multivariate-linear"

import ModelConfigurator from "./ModelConfigurator"

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

    _mock = true
    _mockGradesDatasets = true
    _mockFinalGradesDatasetName = true
    _mockModel = true
    _mockModelColumns = true

    state = {
        loaded: false,
        gradesDatasets: {},
        finalGradesDatasetName: "",
        model: "",
        modelColumns: [],
    }

    componentDidMount(): void {
        if (this._mock) {
            if (this._mockGradesDatasets)
                this.setState({ gradesDatasets: this._gradesDatasetsMock })
            if (this._mockFinalGradesDatasetName)
                this.setState({ finalGradesDatasetName: this._finalGradesDatasetNameMock })
            if (this._mockModel)
                this.setState({ model: this._modelMock })
            if (this._mockModelColumns)
                this.setState({ modelColumns: this._modelColumnsMock })
        }

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
        // housekeeping on the datasets to ensure clean data
        this.ensureFinalGradeExists()
        this.ensureGradeDatasetsAreComplete()
        this.enforceMinimumMaximumGrade()

        const gradesDatasets = this.state.gradesDatasets as { [name: string]: StudentGrades }

        // wOutputs :: [[sID, finalGrade]] (per student)
        const wOutputs = Object.keys(gradesDatasets[this.state.finalGradesDatasetName])
            .map(sID => parseInt(sID))
            .map(sID => [sID, gradesDatasets[this.state.finalGradesDatasetName][sID]])

        // dsNames :: ["quizA", "quizB", ..., "quizN"]
        let dsNames = Object.keys(gradesDatasets)
            .filter(dsName => dsName !== this.state.finalGradesDatasetName)

        // wInputs :: [[sID, quizAGrade, quizBGrade, ..., quizNGrade]] (per student)
        const wInputs = Object.values(wOutputs)
            .map(wOutput => wOutput[0])
            .map(sID => [sID, ...Object.values(dsNames)
                .map(dsName => gradesDatasets[dsName][sID])])

        // outputs :: [finalGrade] (per student)
        // outputs is sorted by studentID
        const outputs = wOutputs
            .sort((a, b) => a[0] - b[0]) // sort by sID (first element)
            .map(r => r.slice(1)) // drop sID

        // inputs :: [[quizAGrade, quizBGrade, ..., quizNGrade]] (per student)
        // inputs is sorted by studentID
        const inputs = wInputs
            .sort((a, b) => a[0] - b[0]) // sort by sID (first element)
            .map(r => r.slice(1)) // drop sID

        // use inputs to predict outputs (quiz grades -> final grade)
        // each student is a datapoint
        const mlr = new MLR(inputs, outputs, { intercept: false })

        this.setState({
            model: JSON.stringify(mlr),
            modelColumns: dsNames
        })

        console.log(mlr.predict([5, 7, 8, 9]))
        console.log(mlr.predict([9, 8, 7, 5]))
        console.log(mlr.predict([9, 9, 9, 9]))
        console.log(mlr.predict([10, 10, 10, 10]))
        console.log(mlr.predict([1, 1, 1, 1]))
        console.log(dsNames)
    }

    render(): React.ReactNode {
        const { loaded } = this.state;

        if (!loaded)
            return <Loading small={false} />;

        return <Admin menuKey={"gradePredictor"}>
            <h1>Grade Predictor</h1>

            <ModelConfigurator />
        </Admin>
        // <input type="file"
        //     accept=".csv"
        //     onChange={this.csvFilesChosen.bind(this)}
        //     required
        //     multiple />

        // <select onChange={this.finalGradesDatasetChosen.bind(this)}>
        //     {Object.keys(this.state.gradesDatasets).map(datasetName =>
        //         <option key={datasetName} value={datasetName}>{datasetName}</option>
        //     )}
        // </select>

        // <Button type={"primary"}
        //     size={"large"}
        //     onClick={() => this.trainModels()}>
        //     Train models
        // </Button>

    }

    _gradesDatasetsMock = JSON.parse('{"presentatie":{"1":7.9,"2":8.1,"3":8.3,"4":7,"5":7,"6":7,"7":8.3,"8":8.3,"9":9.3,"10":8.1,"11":8.9,"12":8.3,"13":9.3,"14":8.3,"15":8.9,"16":1,"17":9.6,"18":8.5,"19":8.3,"20":8.7,"21":9.3,"22":9.3,"23":8.3,"24":7.9,"25":6.6,"26":8.7,"27":8.9,"28":8.7,"29":7.6,"30":8.3,"31":8.3,"32":8.3,"33":8.9,"34":9.3,"35":8.9,"36":7.4,"37":7.4,"38":8.1,"39":8.3,"40":1,"41":9.3,"42":8.1,"43":9.6,"44":8.9,"45":1,"46":7.2,"47":9.3,"48":8.3,"49":7.4,"50":7.8,"51":9.3,"52":9.3,"53":8.3,"54":9.3,"55":7.6,"56":9.3,"57":8.3,"58":9.3,"59":8.3},"eindcijfer":{"1":1,"2":1,"3":7.2,"4":6.5,"5":6.1,"6":1,"7":1,"8":7.1,"9":7,"10":7.5,"11":8,"12":7.1,"13":7.2,"14":6,"15":8.8,"16":1,"17":7.1,"18":8.2,"19":7.7,"20":7.5,"21":7.9,"22":8.5,"23":6.3,"24":6.9,"25":5.3,"26":7.2,"27":6.7,"28":8.3,"29":6.1,"30":1,"31":7.9,"32":6.5,"33":7.1,"34":7.3,"35":7.3,"36":7.2,"37":7.5,"38":7.1,"39":6.3,"40":1,"41":8.7,"42":6.5,"43":7.1,"44":6.8,"45":1,"46":1,"47":7.8,"48":6.5,"49":6.9,"50":1,"51":7.6,"52":8,"53":6.3,"54":7.1,"55":5.7,"56":8.7,"57":8.8,"58":8.7,"59":6.4},"deeltoets3":{"1":3.1,"2":7.2,"3":6.7,"4":6.9,"5":5.3,"6":1,"7":5.7,"8":7,"9":6.7,"10":6.7,"11":7.3,"12":6,"13":7.3,"14":5.2,"15":8.8,"16":1,"17":7.3,"18":7.1,"19":7.2,"20":7.1,"21":7.6,"22":7.9,"23":6.7,"24":7.7,"25":5.8,"26":7.6,"27":6,"28":7.5,"29":6.4,"30":8.2,"31":8.3,"32":6.8,"33":6.6,"34":8.1,"35":6.2,"36":7.6,"37":6.7,"38":6.5,"39":6.6,"40":1,"41":8.3,"42":5.8,"43":8,"44":6.5,"45":1,"46":3.5,"47":7.1,"48":6.6,"49":6.5,"50":3.5,"51":7.2,"52":7.1,"53":6.3,"54":6.7,"55":6.8,"56":8.5,"57":8,"58":8.8,"59":6.4},"deeltoets2":{"1":1,"2":1,"3":7,"4":5.4,"5":6.1,"6":4.7,"7":1,"8":5.5,"9":5.9,"10":7.1,"11":8,"12":8,"13":6.6,"14":5.1,"15":8.3,"16":4.5,"17":6.9,"18":9.1,"19":7.2,"20":7.5,"21":7,"22":8,"23":6.5,"24":5.5,"25":5.3,"26":6.5,"27":7.3,"28":8.2,"29":5.5,"30":1,"31":7.3,"32":6.5,"33":6.5,"34":5.8,"35":7.4,"36":6.8,"37":8.1,"38":6.6,"39":6,"40":1,"41":8.6,"42":5.1,"43":5.8,"44":4.9,"45":4.1,"46":4.7,"47":7.5,"48":5.3,"49":6.8,"50":1,"51":7.3,"52":7.5,"53":5.8,"54":6.6,"55":4.9,"56":8.9,"57":9.1,"58":7.8,"59":5},"deeltoets1":{"1":1,"2":6.3,"3":6.9,"4":7.5,"5":7.2,"6":1,"7":4.7,"8":9.4,"9":8.1,"10":9.4,"11":8.8,"12":6.6,"13":6.6,"14":7.5,"15":9.4,"16":6.6,"17":5.9,"18":8.1,"19":9.1,"20":7.5,"21":9.1,"22":10,"23":4.7,"24":7.8,"25":4.1,"26":7.5,"27":5.9,"28":9.4,"29":5.6,"30":9.7,"31":8.1,"32":5,"33":7.8,"34":7.2,"35":8.1,"36":7.2,"37":8.4,"38":8.4,"39":5.3,"40":6.3,"41":9.1,"42":9.4,"43":6.6,"44":9.1,"45":5.6,"46":4.7,"47":8.8,"48":7.2,"49":7.8,"50":7.5,"51":7.8,"52":9.7,"53":5.9,"54":7.2,"55":4.1,"56":8.4,"57":9.7,"58":9.7,"59":7.8}}') as { [name: string]: StudentGrades }
    _finalGradesDatasetNameMock = "eindcijfer"
    _modelMock = '{"name":"multivariateLinearRegression","weights":[[0.46045442274553317],[0.4882285163688076],[-0.2559600662572352],[0.1751183665805982]],"inputs":4,"outputs":1,"intercept":false,"summary":{"regressionStatistics":{"standardError":0.855187963304052,"observations":1},"variables":[{"label":"X Variable 1","coefficients":[0.46045442274553317],"standardError":0.055076797726381625,"tStat":8.360225026753449},{"label":"X Variable 2","coefficients":[0.4882285163688076],"standardError":0.10429805313454364,"tStat":4.681089451775258},{"label":"X Variable 3","coefficients":[-0.2559600662572352],"standardError":0.10391033518157615,"tStat":-2.4632782274252376},{"label":"Intercept","coefficients":[0.1751183665805982],"standardError":0.05923477130241055,"tStat":2.9563440987484966}]}}'
    _modelColumnsMock = ["presentatie", "eindcijfer", "deeltoets2", "deeltoets1"]
}
