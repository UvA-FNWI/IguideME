import { type Course, getCoursesByUser, WorkflowStates } from '@/api/courses';
import { useGlobalContext } from '@/components/crystals/layout/GlobalStore/useGlobalStore';
import QueryError from '@/components/particles/QueryError';
import { UserRoles } from '@/types/user';
import { AppstoreOutlined, CheckOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Card, Skeleton, Tabs } from 'antd';
import { type FC, memo, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const CourseSelection: FC = (): ReactElement => {
  const { self } = useGlobalContext(
    useShallow((state) => ({
      self: state.self,
    })),
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: [self.userID, 'courses'],
    queryFn: async () => await getCoursesByUser(self.userID),
  });

  const loadingCard = (
    <Card className='w-[240px]' hoverable>
      <Skeleton loading active>
        <Card.Meta title='Card title' description='This is the description' />
      </Skeleton>
    </Card>
  );

  if (isError) return <QueryError title='Failed to load courses' />;

  return (
    <Tabs
      className='course-selection-tabs w-full px-8'
      defaultActiveKey='0'
      items={[
        {
          key: '0',
          label: 'All',
          icon: <AppstoreOutlined />,
          children: (
            <div className='flex w-full flex-wrap gap-8'>
              {isLoading || !data ?
                Array.from({ length: 6 }).map(() => loadingCard)
              : data.length > 0 ?
                data.map((course) => <CourseCard course={course} key={course.id} />)
              : <div>No courses found</div>}
            </div>
          ),
        },
        ...(self.role === UserRoles.instructor ?
          [
            {
              key: '1',
              label: 'Unpublished',
              icon: <EyeInvisibleOutlined />,
              children: (
                <div className='flex w-full flex-wrap gap-8'>
                  {isLoading || !data ?
                    Array.from({ length: 6 }).map(() => loadingCard)
                  : data.length > 0 ?
                    data
                      .filter((course) => course.workflowState === WorkflowStates.UNPUBLISHED)
                      .map((course) => <CourseCard course={course} key={course.id} />)
                  : <div>No unpublished courses found</div>}
                </div>
              ),
            },
            {
              key: '2',
              label: 'Published',
              icon: <EyeOutlined />,
              children: (
                <div className='flex w-full flex-wrap gap-8'>
                  {isLoading || !data ?
                    Array.from({ length: 6 }).map(() => loadingCard)
                  : data.length > 0 ?
                    data
                      .filter((course) => course.workflowState === WorkflowStates.AVAILABLE)
                      .map((course) => <CourseCard course={course} key={course.id} />)
                  : <div>No published courses found</div>}
                </div>
              ),
            },
          ]
        : []),
        {
          key: '3',
          label: 'Completed',
          icon: <CheckOutlined />,
          children: (
            <div className='flex w-full flex-wrap gap-8'>
              {isLoading || !data ?
                Array.from({ length: 6 }).map(() => loadingCard)
              : data.length > 0 ?
                data
                  .filter((course) => course.workflowState === WorkflowStates.COMPLETED)
                  .map((course) => <CourseCard course={course} key={course.id} />)
              : <div>No completed courses found</div>}
            </div>
          ),
        },
      ]}
    />
  );
};
CourseSelection.displayName = 'CourseSelection';
export default CourseSelection;

const CourseCard: FC<{ course: Course }> = memo(({ course }): ReactElement => {
  const navigate = useNavigate();

  return (
    <Card
      key={course.id}
      className='custom-card !bg-surface2 w-[240px]'
      hoverable
      cover={<img alt={`${course.name}'s cover image`} src={course.courseImage} />}
      onClick={() => {
        navigate(`/${course.id}`);
      }}
    >
      <Card.Meta title={course.name} description={course.courseCode} />
    </Card>
  );
});
CourseCard.displayName = 'CourseCard';
