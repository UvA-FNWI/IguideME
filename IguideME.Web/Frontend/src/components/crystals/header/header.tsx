// /------------------------- Module imports -------------------------/
import NotificationPanel from '@/components/atoms/notification-panel/notification-panel';
import { Button, Col, Row, Select, Space } from 'antd';
import { getStudents } from '@/api/users';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { type Dispatch, type FC, type ReactElement, type SetStateAction, useState } from 'react';

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
  if (id) {
    setSelectedStudent(data?.find((student) => student.userID === id));
  }

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
      className='w-[40vw] max-w-[400px] [&>div]:!bg-primary-purple [&>div>span]:!text-white [&_span_*]:!text-white'
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
    setSelectedStudent(undefined);
    setInHome(true);
    navigate('/');
  };

  const toggleAdmin = (path: string): void => {
    setInHome(!inHome);
    navigate(path);
  };

  return (
    <header className='bg-primary-purple table w-full align-middle text-white'>
      <Row className='h-header px-4 justify-between content-center'>
        <Col span={4}>
          <Button className='p-0 m-0' onClick={goHome} type='link'>
            <h1 className='text-white align-middle font-semibold inline-block text-2xl  '>IguideME</h1>
          </Button>
        </Col>
        <Col>
          {isAdmin && inHome && <Selector selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />}
        </Col>
        <Col span={4} className='flex justify-end'>
          <Space>
            <div className='min-w-[30px]'>
              <NotificationPanel user={selectedStudent} />
            </div>
            {isAdmin && (
              <div className='min-w-[100px]'>
                <Button
                  className='flex flex-col justify-center items-center h-10 border border-solid border-white align-middle rounded-md w-32 p-2 text-white'
                  type='link'
                  onClick={() => {
                    inHome ? toggleAdmin('/admin') : goHome();
                  }}
                >
                  <h3>{inHome ? 'Admin Panel' : 'Home'}</h3>
                </Button>
              </div>
            )}
          </Space>
        </Col>
      </Row>
      {import.meta.env.MODE !== 'mock' && (
        <Row>
          <div className='w-full p-2 bg-primary-orange text-center text-black'>
            Application is running in <strong>demo</strong> mode. Changes will not be saved!
          </div>
        </Row>
      )}{' '}
    </header>
  );
};

export default Header;
