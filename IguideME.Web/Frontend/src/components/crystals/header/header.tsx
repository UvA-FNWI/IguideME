// /------------------------- Module imports -------------------------/
import NotificationPanel from '@/components/atoms/notification-panel/notification-panel';
import { Button, Col, Row, Select, Space } from 'antd';
import { getSelf, getStudents } from '@/api/users';
import { useQuery } from 'react-query';
import { type NavigateFunction, useNavigate } from 'react-router-dom';
import { type Dispatch, type FC, type ReactElement, type SetStateAction, useState } from 'react';

// /-------------------------- Own imports ---------------------------/
import { type User, UserRoles } from '@/types/user';

/**
 * Helper function for the student selector component.
 * @param isAdmin - Boolean describing the admin status of the user
 * @param currentUser - The current user selected in the selector
 * @param setCurrentUser - Setter function to update the current user in the state
 * @returns {React.ReactElement} The student selector
 */
const selector = (
  isAdmin: boolean,
  currentUser: User | undefined,
  setCurrentUser: Dispatch<SetStateAction<User | undefined>>,
  navigate: NavigateFunction,
): ReactElement => {
  const { data } = useQuery('students', getStudents, { enabled: isAdmin });

  const students = data
    ?.sort((a, b) => a.sortable_name.localeCompare(b.sortable_name))
    .filter((student) => student.userID !== currentUser?.userID);

  const changeStudent = (userID: string): void => {
    setCurrentUser(students?.find((student) => student.userID === userID));
    navigate(userID ?? '/');
  };

  // Don't show the selector to students.
  if (!isAdmin) {
    return <></>;
  }

  return (
    <Select
      placeholder={'Choose a student'}
      value={currentUser?.name}
      onChange={changeStudent}
      showSearch={true}
      optionFilterProp="label"
      options={students?.map((student) => ({
        label: student.name,
        value: student.userID,
      }))}
      allowClear={true}
      className="w-[40vw] max-w-[400px] [&>div]:!bg-primary-purple [&>div>span]:!text-white [&_span_*]:!text-white"
    />
  );
};

/**
 * Header component.
 * @returns {React.ReactElement} The header
 */
const Header: FC = (): ReactElement => {
  // Set up the navigator, used to change the route.
  const navigate = useNavigate();

  // Get the current user from the backend and updates the route if the user is a student.
  const { data: self } = useQuery('self', getSelf, {
    onSuccess: (data) => {
      if (data === null) {
        // navigate(errorpage) TODO:
        return;
      }
      if (data.role === UserRoles.student) {
        navigate(data.userID ?? '/');
      }
    },
  });

  const [currentUser, setCurrentUser] = useState<User | undefined>(self);
  const [inHome, setInHome] = useState<boolean>(true);

  const isAdmin: boolean = self?.role === UserRoles.instructor;

  const goHome = (): void => {
    setCurrentUser(undefined);
    setInHome(true);
    navigate('/');
  };

  const toggleAdmin = (path: string): void => {
    setInHome(!inHome);
    navigate(path);
  };

  return (
    <header className="bg-primary-purple table w-full align-middle text-white">
      <Row className="h-header px-4 justify-between content-center">
        <Col span={4}>
          <Button className="p-0 m-0" onClick={goHome} type="link">
            <h1 className="text-white align-middle font-semibold inline-block text-2xl  ">IguideME</h1>
          </Button>
        </Col>
        <Col>{selector(isAdmin && inHome, currentUser, setCurrentUser, navigate)}</Col>
        <Col span={4} className="flex justify-end">
          <Space>
            <div className="min-w-[30px]">
              <NotificationPanel user={currentUser} />
            </div>
            <div className="min-w-[100px]">
              {isAdmin && (
                <Button
                  className="flex flex-col justify-center items-center h-10 border border-solid border-white align-middle rounded-md w-32 p-2 text-white"
                  type="link"
                  onClick={() => {
                    inHome ? toggleAdmin('/admin') : goHome();
                  }}
                >
                  <h3>{inHome ? 'Admin Panel' : 'Home'}</h3>
                </Button>
              )}
            </div>
          </Space>
        </Col>
      </Row>
      {import.meta.env.MODE === 'mock' && (
        <Row>
          <div className="w-full p-2 bg-primary-orange text-center text-black">
            Application is running in <strong>demo</strong> mode. Changes will not be saved!
          </div>
        </Row>
      )}{' '}
    </header>
  );
};

export default Header;
