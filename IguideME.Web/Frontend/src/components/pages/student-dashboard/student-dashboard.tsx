import GradeDisplay from '@/components/atoms/grade-display/grade-display';
import Loading from '@/components/particles/loading';
import StudentInfo from '@/components/atoms/student-info/student-info';
import { AppstoreOutlined, BarChartOutlined } from '@ant-design/icons';
import { Col, Radio, Row } from 'antd';
import { getSelf, getStudent } from '@/api/users';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { TileViewStoreProvider, useTileViewStore } from './tileViewContext';
import { useQuery } from '@tanstack/react-query';
import { type User, UserRoles } from '@/types/user';
import { useEffect, type FC, type ReactElement } from 'react';

const LoadingState: FC = () => (
  <div className='absolute inset-0 w-screen h-screen grid place-content-center'>
    <Loading />
  </div>
);

const ErrorMessage: FC = () => <p>Something went wrong, could not load user</p>;

const DashboardView: FC<{ user: User }> = ({ user }) => (
  <TileViewStoreProvider user={user}>
    <Dashboard self={user} />
  </TileViewStoreProvider>
);

const StudentDashboard: FC = (): ReactElement => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: self,
    isError: selfIsError,
    isLoading: selfIsLoading,
  } = useQuery({
    queryKey: ['self'],
    queryFn: getSelf,
  });

  if (selfIsLoading) return <LoadingState />;
  if (selfIsError || self === undefined || id === undefined) return <ErrorMessage />;

  if (self.role === UserRoles.student) return <DashboardView user={self} />;
  if (self.role === UserRoles.instructor && id === self.userID) navigate('/');

  const {
    data: student,
    isError: studentIsError,
    isLoading: studentIsLoading,
  } = useQuery({
    queryKey: ['student', id],
    queryFn: async () => await getStudent(id),
  });

  if (studentIsLoading) return <LoadingState />;
  if (studentIsError || student === undefined) return <ErrorMessage />;

  return <DashboardView user={student} />;
};

interface DashboardProps {
  self: User;
}

const Dashboard: FC<DashboardProps> = ({ self }): ReactElement => {
  const { setUser, viewType, setViewType } = useTileViewStore((state) => ({
    setUser: state.setUser,
    viewType: state.viewType,
    setViewType: state.setViewType,
  }));

  useEffect(() => {
    setUser(self);
  }, [self]);

  return (
    <div className='w-screen px-3'>
      <Row className='w-full h-header flex justify-between'>
        <Col className='h-full grid place-content-center'>
          <StudentInfo />
        </Col>
        <Col className='grid place-content-center'>
          <GradeDisplay />
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
