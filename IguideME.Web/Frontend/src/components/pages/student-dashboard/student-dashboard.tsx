import GradeDisplay from '@/components/atoms/grade-display/grade-display';
import Loading from '@/components/particles/loading';
import StudentInfo from '@/components/atoms/student-info/student-info';
import { AppstoreOutlined, BarChartOutlined } from '@ant-design/icons';
import { getSelf, getStudent } from '@/api/users';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Radio } from 'antd';
import { TileViewStoreProvider, useTileViewStore } from './tileViewContext';
import { useQuery } from '@tanstack/react-query';
import { UserRoles, type User } from '@/types/user';
import { useEffect, type FC, type ReactElement } from 'react';

const LoadingState: FC = () => (
  <div className='absolute inset-0 w-screen h-screen grid place-content-center'>
    <Loading />
  </div>
);

const ErrorMessage: FC = () => <p>Something went wrong, could not load user</p>;

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

const DashboardView: FC<{ user: User }> = ({ user }) => (
  <TileViewStoreProvider user={user}>
    <Dashboard self={user} />
  </TileViewStoreProvider>
);

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
    <>
    <div className='w-screen px-3'>
      <div className='flex flex-col gap-3 py-3 lg:py-1'>
        <div className='flex justify-between items-center'>
          <StudentInfo />
          <div className='hidden lg:block'>
            <GradeDisplay />
          </div>
          <div className='hidden lg:block'>
            <GradeDisplay />
          </div>
          <Radio.Group
            className=''
            value={viewType}
            buttonStyle='solid'
            onChange={(e) => {
              setViewType(e.target.value);
            }}
          >
            <Radio.Button value='graph'>
              <BarChartOutlined />
              <span> Graph</span>
            </Radio.Button>
            <Radio.Button value='grid'>
              <AppstoreOutlined />
              <span> Grid</span>
            </Radio.Button>
          </Radio.Group>
        </div>
        <div className='lg:hidden'>
          <GradeDisplay />
        </div>
      </div>
        </div>
        <div className='lg:hidden'>
          <GradeDisplay />
        </div>
      <Outlet />
  </>
  );
};

export default StudentDashboard;
