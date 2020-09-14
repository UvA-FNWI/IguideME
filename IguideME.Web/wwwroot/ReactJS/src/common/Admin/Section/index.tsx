import React, { PureComponent } from "react";
import {Button, Divider, Input, message, Modal} from "antd";
import CSVReader from "react-csv-reader";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import "./style.scss";
import ReactJson from "react-json-view";
import {IBackendResponse} from "../../../models/IBackendResponse";

interface IProps {
  id: string;
  title: string;
  required_fields: string[];
  doUpload: (key: string, data: any) => IBackendResponse;
  doFetch: () => IBackendResponse;
}

export default class Section extends PureComponent<IProps> {

  state = {
    collection: ''
  }

  render(): React.ReactNode {
    const papaparseOptions = {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header: string) =>
        header
          .toLowerCase()
          .replace(/\W/g, '_')
    }

    const that = this;

    return (
      <div>
        <Divider orientation={"left"}>{ this.props.title }</Divider>

        <p>
          Per upload zijn de volgende velden vereist:
          <ul>
            { this.props.required_fields.map(f => <li>{f}</li>)}
          </ul>
        </p>

        <Input
          onChange={(e) => this.setState({collection: e.target.value})}
          placeholder={"collection"}
          style={{ width: 200 }}
        />

        <CSVReader
          cssClass="csv-reader-input"
          onFileLoaded={(data) => {

            if (data.length === 0) return;

            const sample = data[0];
            if (this.props.required_fields.map(f => Object.keys(sample).includes(f)).some(x => !x)) {
              Modal.error({
                title: 'Failed to upload data',
                content: `Not all required fields were included!`,
              });
              return;
            }

            this.props.doUpload( this.state.collection, data ).then(() => {
              Modal.success({
                title: 'Data uploaded successfully',
                content: `${data.length} records were added!`,
              });
            });
          }}
          onError={() => message.error('An error occurred loading the file')}
          parserOptions={papaparseOptions}
          inputId={this.props.id}
          disabled={this.state.collection.length < 1}
        />

        <Button type={"primary"} onClick={() => {

          this.props.doFetch().then((response: IBackendResponse) => {

            const groups = new Set(response.data.map((x: any) => x.groupID));

            let json = {};
            Array.from(groups).forEach((group: any) => {
              // @ts-ignore
              json[group] = response.data.filter((y: any) => y.groupID === group);
            });

            Modal.info({
              width: 800,
              title: `${this.props.title} data`,
              content: <div style={{maxHeight: '60vh', overflow: 'scroll'}}>
                <ReactJson
                  name={false}
                  collapsed={true}
                  enableClipboard={false}
                  displayObjectSize={false}
                  displayDataTypes={false}
                  src={json}
                />
              </div>,
            });
          });
        }}
        >
          View data
        </Button>
        &nbsp;
        <Button danger onClick={() => {
          Modal.confirm({
            title: `Do you really want to delete all ${this.props.title} data?`,
            icon: <ExclamationCircleOutlined />,
            content: 'This action can not be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
              that.props.doUpload('', {}).then(() =>
                message.success("Reset was successful!"))
            }
          });
        }}>Reset</Button>
      </div>
    )
  }
}