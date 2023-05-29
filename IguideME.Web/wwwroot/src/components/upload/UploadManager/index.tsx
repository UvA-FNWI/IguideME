import React, { Component } from "react";
import {IProps, IState} from "./types";
// import UploadBinaryData from "./UploadBinaryData";
// import UploadEntriesData from "./UploadEntriesData";
import UploadEditor from "./UploadEditor";
import {Button, Col, Input, InputNumber, message, Row, Tooltip} from "antd";
import { QuestionCircleOutlined, DownOutlined, RightOutlined } from "@ant-design/icons"
import CSVReader, { IFileInfo } from "react-csv-reader";
// import ExternalDataController from "../../../api/controllers/externalData"; TODO: move communication with backend to this controller or remove it.
import StudentController from "../../../api/controllers/student";
import TileController from "../../../api/controllers/tile";
import "./style.scss";
import { editState } from "../../../models/app/Tile";
import { CanvasStudent } from "../../../models/canvas/Student";

// TODO: couldn't seem to figure out how to do this systematically with css or something.
const tooltip_bg = "rgb(255,255,255)";
const tooltip_fg = {color: "black"};

export default class UploadManager extends Component<IProps, IState> {

  state = {
    loaded: false,
    uploading: false,
    students: [],
    data: [],
    title: "",
    id_column: 0,
    grade_column: 1,
    editor_collapsed: false
  }

  componentDidMount(): void {
    StudentController.getStudents().then(students =>
      this.setState({
        students: students.sort((a, b) => a.name.localeCompare(b.name)),
        loaded: true })
    );
  }

  handleCSVUpload = (data: string[][], title: string) => {
    if (this.state.title.length < 1)
      this.setState({ data, title });
    else
      this.setState({ data })
  }

  filterStudents = () => {
    let { data: d } = this.state;
    const {students, id_column} = this.state;

    let data = d as string[][]

    const headers = data[0];
    data = data.filter((row: string[]) => (students as CanvasStudent[]).some(student => student.userID.toString() === row[id_column]));

    return [headers, ...data];
  }

  addMissing = () => {
    let { data: d } = this.state;
    const {students, id_column} = this.state;

    let data = d as string[][]
    (students as CanvasStudent[]).forEach(student => {
      for (let i = 1; i < data.length; i++) {
        if (data[i][id_column] === student.userID.toString()) return;
      }
      let new_row: string[] = Array(data[0].length).fill("");
      new_row[id_column] = student.userID.toString();
      data.push(new_row);
    })
    this.setState({ data });
  }

  changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    this.setState({title});
  }

  changeIDColumn = (nr: number | null) => {
    this.setState({id_column: nr ? nr : 0});
  }

  changeGradeColumn = (nr: number | null) => {
    this.setState({grade_column: nr ? nr : 0});
  }

  validate = (data: string[][]) => {
    const { title} = this.state;
    return title.length > 0 && data.length > 1;
  }

  upload = () => {
    const { tile } = this.props;
    const { title, id_column, grade_column } = this.state;

    const data = this.filterStudents();

    console.log(data);
    console.log(this.validate(data));

    if (!this.validate(data))
      return this.setState({ data });

    this.setState({ uploading: true }, () => {
      TileController.createTileEntry({
        id: -1,
        state: editState.new,
        tile_id: tile.id,
        title,
        type: "ASSIGNMENT"
      }).then(entry => {
        TileController.uploadData(entry.id, id_column, grade_column, data).then(() => {
          setTimeout(() => {
            message.success("Data uploaded!");
            this.props.closeUploadMenu();
            this.props.reload();
          }, 200)
        });
      });
    });
  }

  render(): React.ReactNode {
    // const { tile } = this.props; TODO: Validate that grades are binary for binary tiles somewhere. Or just remove tile from props
    const { students, data, title, uploading, id_column, grade_column, editor_collapsed} = this.state;

    return (
      <div id={"uploadManager"}>
        <Row gutter={[10, 10]} style={{ marginBottom: 8 }}>
          <Col flex={"0 0 130px"}>
            <label> Data Source </label>
            <Tooltip title={<span style={tooltip_fg}>You can upload a CSV column containing at least a column with student id's and a column with their grades. Any remaining columns will be saved as metadata.</span>} color={tooltip_bg}>
              <QuestionCircleOutlined />
            </Tooltip>
            <label className={"uploadSource"}> Upload CSV
              <CSVReader onFileLoaded={(data: string[][], fileinfo: IFileInfo) => this.handleCSVUpload(data, fileinfo.name)}
                        inputStyle={{ display: 'none' }}
                        onError={() => alert("error")}
                        parserOptions={{
                          header: false,
                          dynamicTyping: false,
                          skipEmptyLines: true,
                          transformHeader: (header: any) =>
                            header
                              .toLowerCase()
                              .replace(/\W/g, '_')
                            }}
                            />
            </label>
          </Col>
          <Col flex={"1 1 200px"}>
            <label> Entry title </label>
            <Tooltip title={<span style={tooltip_fg}>Upon upload, the data will be saved as a tile entry, similarly to canvas assignments.</span>} color={tooltip_bg}>
              <QuestionCircleOutlined />
            </Tooltip>
            <Input placeholder={"Title"} value={title} onChange={this.changeTitle} />
          </Col>
          <Col flex={" 0 0 120px"}>
            <label> ID column </label>
            <Tooltip title={<span style={tooltip_fg}>This indicates the column containing the student id's, which will be highlighted in <em style={{color: "rgb(255, 130, 0)"}}>orange</em> bellow.</span>} color={tooltip_bg}>
              <QuestionCircleOutlined />
            </Tooltip>
            <InputNumber style={{width: "120px"}} min={0} value={id_column} onChange={this.changeIDColumn}/>
          </Col>
          <Col flex={"0 0 120px"}>
            <label> Grade column </label>
            <Tooltip title={<span style={tooltip_fg}>This indicates the column containing the grades, which will be highlighted in <em style={{color: "rgb(0, 80, 255)"}}>blue</em> bellow.</span>} color={tooltip_bg}>
              <QuestionCircleOutlined />
            </Tooltip>
            <InputNumber style={{width: "120px"}} min={0} value={grade_column} onChange={this.changeGradeColumn}/>
          </Col>
        </Row>

        {
          data.length > 0 ?
          <>
            <Row gutter={[10, 10]} style={{ marginBottom: 8 }}>
              <Col>
              <Button shape="circle" icon={editor_collapsed ? (<RightOutlined />) : (<DownOutlined />)} onClick={() => this.setState({editor_collapsed: !editor_collapsed})}></Button>
              </Col>
              <Col>
                <Tooltip color={tooltip_bg} title={<span style={tooltip_fg}>Add students from the course that are not in the data.</span>}>
                <Button onClick={this.addMissing}>Add Missing Students</Button>
                </Tooltip>
              </Col>
              <Col>
              <Tooltip color={tooltip_bg} title={<span style={tooltip_fg}>Filter out any student that is not part of the course.</span>}>
                <Button onClick={() => this.setState({data: this.filterStudents()})}>Filter Students</Button>
              </Tooltip>
              </Col>
            </Row>
            { !editor_collapsed &&
            <>
            <Row style={{ marginBottom: 8 }}>
              <UploadEditor data={data}
                            setData={data => this.setState({data})}
                            students={students}
                            columns={{grade: grade_column, id: id_column}}/>
            </Row>

            </>
            }
          </>
          :
          <Row style={{ marginBottom: 8 }}>
            <Button style={{width: "120px"}} onClick={() => {this.setState({data: [["id", "grade"], ["", ""]]})}}>Manual Entry</Button>
          </Row>
        }

        <Row gutter={[10,10]} style={{ marginBottom: 8 }}>
          <Col>
            <Button onClick={this.props.closeUploadMenu}
                    className={"dangerButtonStyle"}
                    >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button className={"successButton"}
                    onClick={this.upload}
                    loading={uploading}
                    disabled={!this.validate(data) }>
              Upload
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}
