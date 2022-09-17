import React, { Component } from "react";
import {IProps, IState} from "./types";
import {Table, Tooltip} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import StudentController from "../../api/controllers/student";
import {ConsentData} from "../../models/app/ConsentData";
import {GoalData} from "../../models/app/GoalData";
import { ColumnsType } from "antd/lib/table";

export default class StudentConsentTable extends Component<IProps, IState> {

    state = {
        consents: [],
        goals: []
    }

    componentDidMount(): void {
      StudentController.getConsents().then(async consents => {
        this.setState({consents: consents});
      });
      StudentController.getGoalgrades().then(async goals => {
        this.setState({goals: goals});
      });
    }

    render(): React.ReactNode {
      const { consents, goals } = this.state;

      console.log("CONSENTS:", consents);
      console.log("GOALS:", goals);

      return (
        <div id={"studentsConsentTable"} style={{position: 'relative', overflow: 'visible'}}>
          <Table columns={this.getColumns()}
                 dataSource={this.getData(consents, goals)}
                 scroll={{ x: 900 }}
                 bordered
                 sticky={true}
          />
        </div>
      );
    }

    getColumns(): any {
      const columns: ColumnsType<ConsentData & GoalData> = [{
        title: "Student",
        dataIndex: "userName",
        fixed: true,
        width: 80,
        sorter: (a, b) => a.userName.localeCompare(b.userName),
        render: (text: string, record: any) => {
          return (
            <span>{ text }<br /><small>{ record.consentData.userLoginID}</small></span>
          )
        }
      }, {
        title: "Consent",
        dataIndex: "granted",
        width: 150,
        sorter: (a, b) => b.granted - a.granted,
        filters: [
          {
            text: 'Consent given',
            value: 1
          },
          {
            text: 'Consent not given',
            value: 0
          },
          {
            text: 'No data',
            value: -1
          }
        ],
        onFilter: (value, record) => record.granted === value,
        render: (text: string, _: any) => {

          try {
            const consentval = parseInt(text);
            if (consentval === -1) return (
              <Tooltip title={"No consent data available"}>
                <EllipsisOutlined />
              </Tooltip>
            );
            if (consentval === 0) return <span className={"dangerText"}><b>{ "No consent given" }</b></span>;
            return <span className={"successText"}><b>{ "Consent given" }</b></span>;
          } catch {
            return text;
          }
        }
      }, {
        title: "Goal",
        dataIndex: "userName",
        fixed: true,
        width: 150,
        sorter: (a, b) => a.grade - b.grade,
        render: (text: string, record: any) => {
          return (
            <span>{ record.grade }<br /></span>
          )
        }
      }];
      return columns
    }

    getData(consents: ConsentData[], goals: GoalData[]): object[] {
      return consents.map(consentData => ({
        consentData,
        key: consentData.userID,
        userName: consentData.userName,
        granted: consentData.granted,
        grade: goals.find(s => s.courseID === consentData.courseID && s.userID === consentData.userID)?.grade
      }))
    }
}