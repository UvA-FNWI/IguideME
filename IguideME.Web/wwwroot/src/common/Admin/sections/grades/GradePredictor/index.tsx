import React, { Component } from "react";
import Admin from "../../../index";
import Loading from "../../../../../components/utils/Loading";

interface IProps {

}

interface IState {
    loaded: boolean;
}

export default class GradePredictor extends Component<IProps, IState> {

    state = {
        loaded: false,
    }

    componentDidMount(): void {
        this.setState({ loaded: true });
    }

    async csvFileChosen(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (!files)
            return

        // examResults :: [(examName, [(studentID, grade)])]
        let examResults: Array<[String, Array<[Number, Number]>]> = [];

        for (let i = 0; i < files.length; i++) {
            let rows = await this.rowsForFile(files[i]);

            let [colA, colB] = rows[0] as [String, String];
            colA = colA.toLowerCase();
            colB = colB.toLowerCase();

            if (colA !== "studentid" || colB !== "grade")
                continue

            let name = this.filenameForFile(files[i]);

            examResults.push([name, rows.slice(1) as Array<[Number, Number]>])
        }

        console.log(examResults);
    }

    rowsForFile(file: File): Promise<Array<[String, String] | [Number, Number]>> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                let content: string = e.target.result;
                const textRows = content.split(/\r\n|\n/);
                resolve(textRows.map(tr => {
                    let [rawStudentID, rawGrade] = tr.split(tr.includes(';') ? ';' : ',');

                    let studentID = Number(rawStudentID);
                    let grade = Number(rawGrade.replace(',', '.'));

                    if (isNaN(studentID) || isNaN(grade))
                        return [rawStudentID, rawGrade];
                    else
                        return [studentID, grade];
                }))
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    filenameForFile(file: File, stripExtension = true): String {
        if (stripExtension)
            return file.name.split('.').pop()!;
        else
            return file.name;
    }

    render(): React.ReactNode {
        const { loaded } = this.state;

        if (!loaded)
            return <Loading small={false} />;

        return <Admin menuKey={"gradePredictor"}>
            <h1>Grade Predictor</h1>
            <input id="csv_files_input"
                type="file"
                accept=".csv"
                onChange={this.csvFileChosen.bind(this)}
                required
                multiple />
        </Admin>
    }
}
