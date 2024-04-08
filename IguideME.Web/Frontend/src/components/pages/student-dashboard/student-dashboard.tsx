import GradeDisplay from '@/components/atoms/grade-display/grade-display';
import StudentInfo from '@/components/atoms/student-info/student-info';
import { AppstoreOutlined, BarChartOutlined } from '@ant-design/icons';
import { Col, Radio, Row } from 'antd';
import { getSelf, getStudent } from '@/api/users';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { TileViewStoreProvider, useTileViewStore } from './tileViewContext';
import { useQuery } from '@tanstack/react-query';
import { type User, UserRoles } from '@/types/user';
import { type FC, type ReactElement } from 'react';
import Loading from '@/components/particles/loading';

const StudentDashboard: FC = (): ReactElement => {
  const loadingState = (
    <div className='absolute inset-0 w-screen h-screen grid place-content-center'>
      <Loading />
    </div>
  );

  const errorMessage = <p>Something went wrong, could not load user</p>;

  const { id } = useParams();
  const {
    data: self,
    isError: selfIsError,
    isLoading: selfIsLoading,
  } = useQuery({
    queryKey: ['self'],
    queryFn: getSelf,
  });

  const navigate = useNavigate();
  if (selfIsLoading) {
    return loadingState;
  } else if (selfIsError || self === undefined || id === undefined) {
    return errorMessage;
  } else if (self.role === UserRoles.student) {
    return <DashboardWrapper self={self} />;
  } else if (self.role === UserRoles.instructor && id === self.userID) {
    navigate('/');
  }

  const {
    data: student,
    isError: studentIsError,
    isLoading: studentIsLoading,
  } = useQuery({
    queryKey: ['student', id],
    queryFn: async () => await getStudent(id),
  });

  if (studentIsLoading) {
    return loadingState;
  } else if (studentIsError || student === undefined) {
    return errorMessage;
  } else {
    return <DashboardWrapper self={student} />;
  }
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
    <div className='w-screen px-3'>
      <Row className='w-full h-header flex justify-between'>
        <Col className='h-full grid place-content-center'>
          <StudentInfo self={user} />
        </Col>
        <Col className='grid place-content-center'>
          <GradeDisplay self={user} />
        </Col>
        <Col className='h-full grid place-content-center'>
          <Radio.Group
            className=''
            value={viewType}
            buttonStyle='solid'
            onChange={(e) => {
              setViewType(e.target.value);
            }}
          >
            <Radio.Button value='graph'>
              <BarChartOutlined /> Graph
            </Radio.Button>
            <Radio.Button value='grid'>
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
