import { getStudentsByCourse } from '@/api/courses';
import Selector from '@/components/atoms/selector/Selector';
import { useGlobalContext } from '@/components/crystals/layout/GlobalStore/useGlobalStore';
import { UserRoles } from '@/types/user';
import { useRequiredParams } from '@/utils/params';
import { SmileOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Result } from 'antd';
import { memo, useEffect, type FC, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const Home: FC = (): ReactElement => {
  const { courseId } = useRequiredParams(['courseId']);
  const { self } = useGlobalContext(useShallow((state) => ({ self: state.self })));

  const navigate = useNavigate();
  useEffect(() => {
    if (self.role === UserRoles.student) navigate(`/${courseId}/${self.userID}`);
  }, []);

  return (
    <Result
      className='flex h-full w-full flex-col items-center justify-center'
      icon={<SmileOutlined className='!text-primary' />}
      title={
        <div>
          <h1 className='mb-8 inline-block p-0 text-[5vmax] font-bold tracking-tight text-text opacity-40 transition-all duration-300 ease-in-out hover:scale-110 hover:cursor-brand hover:text-primary hover:opacity-80'>
            IguideME
          </h1>

          <h2 className='mb-4 text-text'>Pick a student to start!</h2>

          <StudentSelector courseId={courseId} />
        </div>
      }
    />
  );
};
Home.displayName = 'Home';
export default Home;

interface StudentSelectorProps {
  courseId: string;
}

const StudentSelector: FC<StudentSelectorProps> = memo(({ courseId }): ReactElement => {
  const navigate = useNavigate();

  const { self } = useGlobalContext(useShallow((state) => ({ self: state.self })));
  const { data, isLoading, isError } = useQuery({
    queryKey: ['students', courseId],
    queryFn: async () => await getStudentsByCourse(courseId),
    enabled: self.role === UserRoles.instructor,
  });

  return (
    <Selector
      isLoading={isLoading}
      isError={isError}
      customPlaceholder={{
        loading: 'Loading students...',
        error: 'Failed to load students',
        message: 'Select a student',
      }}
      onSelect={(value) => {
        navigate(`/${courseId}/${value}`);
      }}
      options={data?.map((student) => {
        return { label: student.name, value: student.userID };
      })}
    />
  );
});
StudentSelector.displayName = 'StudentSelector';
