import { getSelf, getStudent } from '@/api/users';
import GradeDisplay from '@/components/atoms/grade-display/grade-display';
import StudentInfo from '@/components/atoms/student-info/student-info';
import Loading from '@/components/particles/loading';
import { type ViewType } from '@/types/tile';
import { UserRoles, type User } from '@/types/user';
import { AppstoreOutlined, BarChartOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Radio } from 'antd';
import { useEffect, type FC, type ReactElement } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { TileViewStoreProvider, useTileViewStore } from './tileViewContext';

const LoadingState: FC = () => (
  <div className='absolute inset-0 grid h-screen w-screen place-content-center'>
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
        <div className='flex min-h-header flex-col justify-center gap-3 py-3 lg:py-0'>
          <div className='relative flex items-center justify-between'>
            <StudentInfo />
            <div className='absolute bottom-0 left-0 right-0 top-0 m-auto hidden h-full w-[400px] md:block'>
              <GradeDisplay />
            </div>
            <Radio.Group
              value={viewType}
              buttonStyle='solid'
              onChange={(e) => {
                setViewType(e.target.value as ViewType);
              }}
            >
              <Radio.Button
                className={`!border-primary ${viewType === 'graph' ? '!bg-primary !text-white' : '!bg-dropdownBackground text-text hover:!bg-primary-light hover:!text-white'}`}
                disabled={viewType === 'graph'}
                value='graph'
              >
                <BarChartOutlined />
                <span> Graph</span>
              </Radio.Button>
              <Radio.Button
                className={`!border-primary ${viewType === 'grid' ? '!bg-primary !text-white' : '!bg-dropdownBackground text-text hover:!bg-primary-light hover:!text-white'}`}
                disabled={viewType === 'grid'}
                value='grid'
              >
                <AppstoreOutlined />
                <span> Grid</span>
              </Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div className='mb-3 grid h-[40px] w-[330px] place-content-center md:hidden'>
          <GradeDisplay />
        </div>
        <Outlet />
      </div>
    </>
  );
};

export default StudentDashboard;
