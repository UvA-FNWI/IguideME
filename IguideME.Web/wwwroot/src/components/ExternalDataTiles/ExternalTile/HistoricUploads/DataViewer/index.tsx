import React, { Component } from "react";
import {TileEntry, TileEntrySubmission} from "../../../../../models/app/Tile";
import {CanvasStudent} from "../../../../../models/canvas/Student";
import {Col, Input, Row, Table} from "antd";

export default class DataViewer extends Component<{
  tileEntry: TileEntry | undefined,
  submissions: TileEntrySubmission[],
  students: CanvasStudent[]
}, { query: string }> {

  state = { query: "" }

  render(): React.ReactNode {
    const { tileEntry, submissions, students } = this.props;
    const { query } = this.state;

    if (!tileEntry) return null;

    // console.log(students);
    // console.log("submissiions", submissions);
    // console.log("data", submissions.filter(
    //   s => {
    //     const student = students.find(st => s.user_login_id === st.login_id);
    //     return student ? (
    //       student.name.toLowerCase().includes(query.toLowerCase()) ||
    //       student.login_id.toLowerCase().includes(query.toLowerCase())
    //     ) : false
    //   }
    // ).sort(
    //   (a, b) => parseFloat(b.grade) - parseFloat(a.grade)
    // ).map((s, i) => {
    //   const student = students.find(st => s.user_login_id === st.login_id);
    //   return {
    //     key: i,
    //     student_name: student ? student.name : "???",
    //     student_id: student ? student.login_id : "???",
    //     grade: s.grade
    //   }
    // }));

    return (
      <div>
        <h1>{ tileEntry.title }</h1>

        <Row>
          <Col xs={24} md={12}>
            <h2>Student Grades</h2>

            <label>Find student by name</label>
            <Input size={"large"}
                   value={query}
                   placeholder={"Student name or login id"}
                   onChange={e => this.setState({ query: e.target.value })}
            />

            <Table columns={[
              { title: 'Name', dataIndex: 'student_name', key: 'student_name' },
              { title: 'Student ID', dataIndex: 'student_id', key: 'student_id' },
              { title: 'Grade', dataIndex: 'grade', key: 'grade' }
            ]}
                   dataSource={submissions.filter(
                     s => {
                       const student = students.find(st => s.user_login_id === st.login_id);
                       return student ? (
                         student.name.toLowerCase().includes(query.toLowerCase()) ||
                           student.login_id.toLowerCase().includes(query.toLowerCase())
                       ) : false
                     }
                   ).sort(
                     (a, b) => parseFloat(b.grade) - parseFloat(a.grade)
                   ).map((s, i) => {
                     const student = students.find(st => s.user_login_id === st.login_id);
                      return {
                        key: i,
                        student_name: student ? student.name : "???",
                        student_id: student ? student.login_id : "???",
                        grade: s.grade
                      }
                   })}
            />
          </Col>

          <Col xs={24} md={8}>

          </Col>
        </Row>
      </div>
    )
  }
}