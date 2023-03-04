import React, { Component } from "react";
import StudentController from "../../../../api/controllers/student";
import {Row} from "antd";
import Loading from "../../../utils/Loading";
import {IUploadProps} from "../types";
import "./style.scss";
import StudentEntry from "./StudentEntry";

export default class UploadEntriesData extends Component<IUploadProps> {
  state = {
    students: [], loaded: false
  }

  componentDidMount(): void {
    StudentController.getStudents().then(students =>
      this.setState({ students, loaded: true })
    );
  }

  updateStudent = (userID: string, record: any) => {
    this.props.setData(
      [...this.props.data.filter(d => d.userID !== userID), record]
    );
  }

  render(): React.ReactNode {
    const { loaded } = this.state;
    const { students, data } = this.props;

    if (!loaded) return <Loading small={true} />;

    return (
      <div id={"uploadEntriesData"}>
        <Row gutter={[10, 10]} style={{margin: '20px 0'}}>
         { students.map(s =>
           <StudentEntry key={s.userID}
                         student={s}
                         updateStudent={this.updateStudent}
                         studentRecord={data.find(d => d.userID === s.userID)}
           />) }
        </Row>
      </div>
    )
  }
}
