import { type FC, type ReactElement } from "react";
import { Col, Row, Table, Tooltip } from "antd";
import { useQuery } from "react-query";
import { getStudentsWithSettings } from "@/api/users";
import Loading from "@/components/particles/loading";
import { type User } from "@/types/user";
import { type ColumnsType } from "antd/lib/table";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { getAllTileGrades, getTiles } from "@/api/tiles";

const GradesTable: FC = (): ReactElement => {
  // In principe zijn deze 2 routes voor nu genoeg denk ik
  const { data: tiles } = useQuery("tiles", getTiles);
  const { data: tileGrades } = useQuery("tilegrades", getAllTileGrades);
  console.log("tiles", tiles);
  console.log("tile_grades", tileGrades);

  // Deze hieronder laat ik staan zodat de voorbeeld tabel werkt, maar zal uiteindelijk niet nodig zijn vgm
  const { data: students } = useQuery(
    "students + settings",
    getStudentsWithSettings,
  );

  if (students === undefined) {
    return <Loading />;
  }

  return (
    <div
      id={"settingsTable"}
      style={{ position: "relative", overflow: "visible" }}
    >
      <Row
        justify={"space-between"}
        align={"bottom"}
        style={{ paddingBottom: "10px" }}
      >
        <Col>
          <h2>General Overview</h2>
        </Col>
        <Col>
          Consent Given: &ensp;{" "}
          {students.filter((student: User) => student.settings?.consent).length}
          /{students.length}
        </Col>
      </Row>

      <Table
        size="middle"
        columns={getColumns()}
        dataSource={getData(students)}
        scroll={{ x: 900, y: 600 }}
        pagination={{ pageSize: 50 }}
        bordered
        sticky={true}
      />
    </div>
  );
};

interface DataType {
  student: User;
  name: string;
  consent: boolean | undefined;
  total: number | undefined;
  predicted: number | undefined;
  goal: number | undefined;
  notifications: boolean | undefined;
}
function getData(students: User[]): DataType[] {
  return students.map((student) => ({
    student,
    key: student.userID,
    name: student.name,
    consent: student.settings?.consent,
    total: student.settings?.total_grade,
    predicted: student.settings?.predicted_grade,
    goal: student.settings?.goal_grade,
    notifications: student.settings?.notifications,
  }));
}

function getColumns(): any {
  const columns: ColumnsType<DataType> = [
    {
      title: "Student",
      dataIndex: "name",
      fixed: true,
      width: 80,
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: "ascend",
      render: (text: string, record: DataType) => {
        return (
          <span>
            {text}
            <br />
            <small>{record.student.userID}</small>
          </span>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      width: 50,
      sorter: (a, b) => (a.total ?? -1) - (b.total ?? -1),
      render: (text: string, record: DataType) => {
        if (Number(text) !== -1) {
          return (
            <span>
              {((record.total ?? 0) / 10).toFixed(1)}
              <br />
            </span>
          );
        }
      },
    },
    {
      title: "Predicted",
      dataIndex: "predicted",
      width: 50,
      sorter: (a, b) => (a.predicted ?? -1) - (b.predicted ?? -1),
      render: (text: string, _: any) => {
        if (Number(text) !== -1) {
          return (
            <span>
              {text}
              <br />
            </span>
          );
        }
      },
    },
    {
      title: "Goal",
      dataIndex: "goal",
      width: 50,
      sorter: (a, b) => (a.goal ?? -1) - (b.goal ?? -1),
      render: (text: string, _: any) => {
        if (Number(text) !== -1) {
          return (
            <span>
              {text}
              <br />
            </span>
          );
        }
      },
    },
    {
      title: "Consent",
      dataIndex: "consent",
      width: 50,
      sorter: (a, b) => {
        const consentA = a.consent === undefined ? 0 : +a.consent;
        const consentB = b.consent === undefined ? 0 : +b.consent;
        return consentB - consentA;
      },
      filters: [
        {
          text: "Consent given",
          value: true,
        },
        {
          text: "Consent not given",
          value: false,
        },
      ],
      onFilter: (value, record) => record.consent === value,
      render: (value: boolean) => {
        if (value) {
          return (
            <span className={"successText"}>
              <Tooltip title="Consent given">
                <CheckCircleOutlined />
              </Tooltip>
            </span>
          );
        } else {
          return (
            <span className={"dangerText"}>
              <Tooltip title="No consent given">
                <CloseCircleOutlined />
              </Tooltip>
            </span>
          );
        }
      },
    },
    {
      title: "Notifications",
      dataIndex: "notifications",
      width: 50,
      sorter: (a, b) => {
        const notificationsA =
          a.notifications === undefined ? 0 : +a.notifications;
        const notificationsB =
          b.notifications === undefined ? 0 : +b.notifications;
        return notificationsB - notificationsA;
      },
      filters: [
        {
          text: "On",
          value: true,
        },
        {
          text: "Off",
          value: false,
        },
      ],
      onFilter: (value, record) => record.notifications === value,
      render: (value: boolean) => {
        if (value) {
          return (
            <span className={"successText"}>
              <Tooltip title="Notifications turned on">
                <CheckCircleOutlined />
              </Tooltip>
            </span>
          );
        } else {
          return (
            <span className={"dangerText"}>
              <Tooltip title="Notifications turned off">
                <CloseCircleOutlined />
              </Tooltip>
            </span>
          );
        }
      },
    },
  ];
  return columns;
}

export default GradesTable;
