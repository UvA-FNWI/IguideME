// /------------------------- Module imports -------------------------/
import { getStudents } from '@/api/users';
import NotificationPanel from '@/components/atoms/notification-panel/notification-panel';
import { useQuery } from '@tanstack/react-query';
import { Button, Select } from 'antd';
import { type Dispatch, type FC, type ReactElement, type SetStateAction, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// /-------------------------- Own imports ---------------------------/
import { type User, UserRoles } from '@/types/user';

type SelectorProps = {
  /** The currently selected student by the instructor. */
  selectedStudent: User | undefined;
  /** Function to set the selected student. */
  setSelectedStudent: Dispatch<SetStateAction<User | undefined>>;
};

/**
 * Helper function for the student selector component.
 * @returns {React.ReactElement} The student selector
 */
const Selector: FC<SelectorProps> = ({ selectedStudent, setSelectedStudent }): ReactElement => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      setSelectedStudent(data?.find((student) => student.userID === id));
    }
  }, [id, data]);

  const students = data
    ?.sort((a, b) => a.sortable_name.localeCompare(b.sortable_name))
    .filter((student) => student.userID !== selectedStudent?.userID);

  const changeStudent = (userID: string): void => {
    setSelectedStudent(students?.find((student) => student.userID === userID));
    navigate(userID ?? '/');
  };

  return (
    <Select
      allowClear={true}
      aria-disabled={isLoading || isError}
      className='w-full md:w-80 lg:w-[400px] h-[40px] [&>div]:!bg-primary-purple [&>div>span]:!text-white [&_span_*]:!text-white'
      disabled={isLoading || isError}
      placeholder={
        isLoading ? 'Loading students...'
        : isError ?
          'Error loading students'
        : 'Choose a student'
      }
      onChange={changeStudent}
      optionFilterProp='label'
      options={students?.map((student) => ({
        label: student.name,
        value: student.userID,
      }))}
      showSearch={true}
      value={selectedStudent ? selectedStudent.name : null}
    />
  );
};

interface HeaderProps {
  self: User;
}

const Header: FC<HeaderProps> = ({ self }): ReactElement => {
  const navigate = useNavigate();

  const [selectedStudent, setSelectedStudent] = useState<User | undefined>(undefined);
  const [inHome, setInHome] = useState<boolean>(true);

  const isAdmin: boolean = self?.role === UserRoles.instructor;

  const goHome = (): void => {
    setInHome(true);

    if (selectedStudent) setSelectedStudent(undefined);

    if (self.role === UserRoles.instructor && selectedStudent?.userID !== self.userID) {
      navigate('/');
    } else {
      // self is a student
      navigate('/' + self.userID);
    }
  };

  const toggleHome = (path: string): void => {
    setInHome(!inHome);
    navigate(path);
  };

  return (
    <header className='bg-primary-purple text-white'>
      <div className='px-3 py-3 flex flex-col gap-3'>
        <div className='flex justify-between items-center relative'>
          <Button className='p-0 m-0 border-0' onClick={goHome} type='link'>
            <h1 className='text-white align-middle font-semibold inline-block text-2xl'>IguideME</h1>
          </Button>
          {isAdmin && inHome && (
            <div className='hidden md:block absolute w-fit left-0 right-0 top-0 bottom-0 m-auto'>
              <Selector selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />
            </div>
          )}
          <div className='flex gap-2'>
            <NotificationPanel user={selectedStudent ?? self} />
            <Button
              className='flex flex-col justify-center items-center h-10 border border-solid border-white align-middle rounded-md w-32 p-2 text-white'
              type='link'
              onClick={() => {
                inHome ? toggleHome(isAdmin ? '/admin' : '/student-settings') : goHome();
              }}
            >
              <h3>
                {inHome ?
                  isAdmin ?
                    'Admin Panel'
                  : 'Settings'
                : 'Home'}
              </h3>
            </Button>
          </div>
        </div>
        {isAdmin && inHome && (
          <div className='md:hidden'>
            <Selector selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />
          </div>
        )}
      </div>
      {import.meta.env.MODE !== 'mock' && (
        <div className='w-full p-2 bg-primary-orange text-center text-black'>
          Application is running in <strong>demo</strong> mode. Changes will not be saved!
        </div>
      )}{' '}
    </header>
  );
};

export default Header;
