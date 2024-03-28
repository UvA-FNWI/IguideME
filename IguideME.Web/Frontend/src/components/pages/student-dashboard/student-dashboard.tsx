import GradeDisplay from '@/components/atoms/grade-display/grade-display';
import StudentInfo from '@/components/atoms/student-info/student-info';
import { AppstoreOutlined, BarChartOutlined } from '@ant-design/icons';
import { Col, Radio, Row } from 'antd';
import { getSelf, getStudent } from '@/api/users';
import { Outlet, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { type User, UserRoles } from '@/types/user';
import { useState, type FC, type ReactElement } from 'react';
import { tileViewContext, type viewType } from './context';

const StudentDashboard: FC = (): ReactElement => {
  const { id } = useParams();
  const { data: self } = useQuery('self', getSelf);

  if (self?.role === UserRoles.student) return <Dashboard self={self} />;
  else if (id === undefined) return <p>Something went wrong, could not load user</p>;

  const { data: student } = useQuery('student' + id, async () => await getStudent(id));

  if (student !== undefined) return <Dashboard self={student} />;
  else return <p>Something went wrong, could not load user</p>;
};

interface Props {
  self: User;
}

const Dashboard: FC<Props> = ({ self }): ReactElement => {
  const [viewType, setViewType] = useState<viewType>('graph');
  const context = {
    user: self,
    viewType,
  };

  return (
    <tileViewContext.Provider value={context}>
      <div className="w-screen flex justify-center items-center">
        <div className="px-3 w-fit">
          <Row className="relative flex items-center justify-between content-start py-3">
            <Col>
              <StudentInfo self={self} />
            </Col>
            <Col className="absolute left-0 right-0 top-3 bottom-0 m-auto h-full flex justify-center items-center">
              <GradeDisplay self={self} />
            </Col>
            <Col>
              <Radio.Group
                value={context.viewType}
                buttonStyle="solid"
                onChange={(e) => {
                  setViewType(e.target.value);
                }}
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
          <Outlet />
        </div>
      </div>
    </tileViewContext.Provider>
  );
};

export default StudentDashboard;
