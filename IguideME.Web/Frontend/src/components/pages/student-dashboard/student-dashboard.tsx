import GradeDisplay from '@/components/atoms/grade-display/grade-display';
import StudentInfo from '@/components/atoms/student-info/student-info';
import { AppstoreOutlined, BarChartOutlined } from '@ant-design/icons';
import { Col, Radio, Row } from 'antd';
import { getSelf, getStudent } from '@/api/users';
import { Outlet, useParams } from 'react-router-dom';
import { TileViewStoreProvider, useTileViewStore } from './tileViewContext';
import { useQuery } from '@tanstack/react-query';
import { type User, UserRoles } from '@/types/user';
import { type FC, type ReactElement } from 'react';

const StudentDashboard: FC = (): ReactElement => {
  const { id } = useParams();
  const { data: self } = useQuery({
    queryKey: ['self'],
    queryFn: getSelf,
  });

  if (self?.role === UserRoles.student) return <DashboardWrapper self={self} />;
  else if (id === undefined) return <p>Something went wrong, could not load user</p>;

  const { data: student } = useQuery({
    queryKey: ['student', id],
    queryFn: async () => await getStudent(id),
  });

  if (student !== undefined) return <DashboardWrapper self={student} />;
  else return <p>Something went wrong, could not load user</p>;
};

interface Props {
  self: User;
}

const DashboardWrapper: FC<Props> = ({ self }): ReactElement => {
  return (
    <TileViewStoreProvider user={self}>
      <Dashboard />
    </TileViewStoreProvider>
  );
};

const Dashboard: FC = (): ReactElement => {
  const { user, viewType, setViewType } = useTileViewStore((state) => ({
    user: state.user,
    viewType: state.viewType,
    setViewType: state.setViewType,
  }));

  return (
    <div className="w-screen px-3">
      <Row className="w-full h-header flex justify-between">
        <Col className="w-32 h-full grid place-content-center">
          <StudentInfo self={user} />
        </Col>
        <Col className="w-[640px] h-full grid place-content-center">
          <GradeDisplay self={user} />
        </Col>
        <Col className="w-fit h-full grid place-content-center">
          <Radio.Group
            className=""
            value={viewType}
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
  );
};

export default StudentDashboard;
