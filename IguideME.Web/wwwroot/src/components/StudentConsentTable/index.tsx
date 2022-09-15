import React, { Component } from "react";
import {IProps, IState} from "./types";
import {Table, Tooltip} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import StudentController from "../../api/controllers/student";
import {ConsentData} from "../../models/app/ConsentData";
import { ColumnsType } from "antd/lib/table";

export default class StudentConsentTable extends Component<IProps, IState> {

    state = {
        consents: []
    }

    componentDidMount(): void {
      StudentController.getGrantedConsents().then(async consents => {
        this.setState({consents: consents});
      });
    }

    render(): React.ReactNode {
      const { consents} = this.state;

      console.log("consents:", consents);

      return (
        <div id={"studentsConsentTable"} style={{position: 'relative', overflow: 'visible'}}>
          <Table columns={this.getColumns()}
                 dataSource={this.getData(consents)}
                 scroll={{ x: 900 }}
                 bordered
                 sticky={true}
          />
        </div>
      );
    }

    getColumns(): any {
      const columns: ColumnsType<ConsentData> = [{
        title: "Student",
        dataIndex: "name",
        fixed: true,
        width: 22,
        sorter: (a, b) => a.userName.localeCompare(b.userName),
        render: (text: string, record: any) => {
          return (
            <span>{ text }<br /><small>{ record.consentData.loginID}</small></span>
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
      }];
      return columns
    }

    getData(consents: ConsentData[]): object[] {
      return consents.map(consentData => ({
        consentData,
        key: consentData.userID,
        name: consentData.userName,
        granted: consentData.granted
      }))
    }
}