import { getStudent } from '@/api/users';
import GradeDisplay from '@/components/atoms/grade-display/grade-display';
import StudentInfo from '@/components/atoms/student-info/student-info';
import { useGlobalContext } from '@/components/crystals/layout/GlobalStore/useGlobalStore';
import Loading from '@/components/particles/loading';
import { type ViewType } from '@/types/tile';
import { UserRoles, type User } from '@/types/user';
import { ActionTypes, trackEvent } from '@/utils/analytics';
import { useRequiredParams } from '@/utils/params';
import { AppstoreOutlined, BarChartOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Radio } from 'antd';
import { useEffect, type FC, type ReactElement } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { TileViewStoreProvider, useTileViewStore } from './tileViewContext';

const LoadingState: FC = () => (
  <div className='absolute inset-0 grid h-screen w-screen place-content-center'>
    <Loading />
  </div>
);

const ErrorMessage: FC = () => <p>Something went wrong, could not load user</p>;

const StudentDashboard: FC = (): ReactElement => {
  const { studentId } = useRequiredParams(['studentId']);
  const { self } = useGlobalContext(
    useShallow((state) => ({
      self: state.self,
    })),
  );

  useEffect(() => {
    if (self.role === UserRoles.student) {
      trackEvent({
        userID: self.userID,
        action: ActionTypes.page,
        actionDetail: 'Student Dashboard',
        courseID: self.course_id,
      }).catch(() => {
        // Silently fail, since this is not critical
      });
    }
  }, []);

  const navigate = useNavigate();
  if (self.role === UserRoles.student) return <DashboardView user={self} />;
  if (self.role === UserRoles.instructor && studentId === self.userID) navigate('/');

  const {
    data: student,
    isError: studentIsError,
    isLoading: studentIsLoading,
  } = useQuery({
    queryKey: ['student', studentId],
    queryFn: async () => await getStudent(studentId),
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
      <div className='w-full px-3'>
        <div className='flex min-h-header flex-col justify-center gap-3 py-3 lg:py-0'>
          <div className='relative flex items-center justify-between'>
            <StudentInfo />
            <div className='absolute bottom-0 left-0 right-0 top-0 m-auto hidden h-header w-[400px] place-content-center md:grid'>
              <GradeDisplay />
            </div>
            <Radio.Group
              value={viewType}
              buttonStyle='solid'
              onChange={(e) => {
                setViewType(self, e.target.value as ViewType);
              }}
            >
              <Radio.Button disabled={viewType === 'graph'} value='graph'>
                <BarChartOutlined />
                <span> Graph</span>
              </Radio.Button>
              <Radio.Button disabled={viewType === 'grid'} value='grid'>
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
