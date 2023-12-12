import { getSelf, getStudent } from "@/api/users";
import GradeDisplay from "@/components/atoms/grade-display/grade-display";
import StudentInfo from "@/components/atoms/student-info/student-info";
import ViewLayout from "@/components/crystals/layout-view/layout-view";
import { User, UserRoles } from "@/types/user";
import { AppstoreOutlined, BarChartOutlined } from "@ant-design/icons";
import { Col, Radio, Row } from "antd";
import { useState, type FC, type ReactElement } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { contextType, tileViewContext } from "./context";

const StudentDashboard: FC = (): ReactElement => {
  const { id } = useParams();

  const { data: self } = useQuery("self", getSelf);

  if (self?.role === UserRoles.student) {
    return <Dashboard self={self} />;
  }

  if (id === undefined) return <>Something went wrong, could not load user</>;

  const { data: student } = useQuery("student", () => getStudent(id));

  if (student !== undefined) {
    return <Dashboard self={student} />;
  }

  return <>Something went wrong, could not load user</>;
};

interface Props {
  self: User;
}

const Dashboard: FC<Props> = ({ self }): ReactElement => {
  const [viewType, setViewType] = useState<contextType>("graph");
  return (
    <tileViewContext.Provider value={viewType}>
      <Row justify="space-between" align="top" style={{ padding: 12 }}>
        <Col>
          <StudentInfo self={self} />
        </Col>
        <Col span={14}>
          <GradeDisplay />
        </Col>
        <Col>
          <Radio.Group
            value={viewType}
            buttonStyle="solid"
            onChange={(e) => setViewType(e.target.value)}
          >
            <Radio.Button value="graph">
              <BarChartOutlined /> Graph
            </Radio.Button>
            <Radio.Button value="grid">
              <AppstoreOutlined /> Grid
            </Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      <ViewLayout />
    </tileViewContext.Provider>
  );
};

export default StudentDashboard;
