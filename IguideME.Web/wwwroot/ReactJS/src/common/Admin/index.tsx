import React, { PureComponent } from "react";
import Section from "./Section";
import PerusallController from "../../api/perusall";
import Controller from "../../api/controller";
import {IBackendResponse} from "../../models/IBackendResponse";
import PracticeSessionsController from "../../api/practiceSessions";
import AttendanceController from "../../api/attendance";

export default class Admin extends PureComponent {

  constructor(props: any) {
    super(props);

    Controller.setup();
  }

  handlePracticeSessionsUpload = (key: string, data: any): IBackendResponse => {
    return PracticeSessionsController.uploadData(key, data).then((response: IBackendResponse) => response.data);
  }

  handlePracticeSessionsFetch = (): IBackendResponse => {
    return PracticeSessionsController.getAll();
  }

  handlePerusallUpload = (key: string, data: any): IBackendResponse => {
    const entries = data.map((x: any) => {
      return {
        studentnaam: x['studentnaam'],
        grade: x['grade'],
        entry: JSON.stringify(x)
      }
    });
    return PerusallController.uploadData(key, entries).then((response: IBackendResponse) => response.data);
  }

  handlePerusallFetch = (): IBackendResponse => {
    return PerusallController.getAll();
  }

  handleAttendanceUpload = (key: string, data: any): IBackendResponse => {
    return AttendanceController.uploadData(key, data).then((response: IBackendResponse) => response.data);
  }

  handleAttendanceFetch = (): IBackendResponse => {
    return AttendanceController.getAll();
  }

  render(): React.ReactNode {
    Controller.setup();

    return (
      <div>
        <h1>IguideME administration</h1>
        <Section
          id={"practice"}
          title={"Practice Sessions"}
          required_fields={['studentnaam', 'grade']}
          doUpload={this.handlePracticeSessionsUpload}
          doFetch={this.handlePracticeSessionsFetch}
        />
        <Section
          id={"perusall"}
          title={"Perusall"}
          required_fields={['studentnaam', 'grade']}
          doUpload={this.handlePerusallUpload}
          doFetch={this.handlePerusallFetch}
        />
        <Section
          id={"attendance"}
          title={"Lecture Attendance"}
          required_fields={['studentnaam', 'aanwezig']}
          doUpload={this.handleAttendanceUpload}
          doFetch={this.handleAttendanceFetch}
        />
      </div>
    )
  }
}