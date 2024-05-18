// /------------------------- Module imports -------------------------/
import NotificationPanel from '@/components/atoms/notification-panel/notification-panel';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useCallback, useState, type FC, type ReactElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeSwitcherDropdown } from '../ThemeSwitcher/ThemeSwitcher';
import MobileHeader from './MobileHeader/MobileHeader';
import Selector from './Selector';

// /-------------------------- Own imports ---------------------------/
import { UserRoles, type User } from '@/types/user';

interface HeaderProps {
  self: User;
}

const Header: FC<HeaderProps> = ({ self }): ReactElement => {
  const location = useLocation();
  const inHome: boolean =
    (self.role === UserRoles.instructor && !location.pathname.startsWith('/admin')) ||
    (self.role === UserRoles.student && location.pathname !== '/student-settings');

  const [selectedStudent, setSelectedStudent] = useState<User | undefined>(undefined);
  const navigate = useNavigate();

  const switchPage = useCallback(() => {
    if (selectedStudent) setSelectedStudent(undefined);

    if (self.role === UserRoles.instructor && selectedStudent?.userID !== self.userID) {
      if (inHome) navigate('/admin');
      else navigate('/');
    } else {
      // self is a student
      if (inHome) navigate('/student-settings');
      else navigate('/' + self.userID);
    }
  }, [inHome, selectedStudent, self]);

  return (
    <header className='relative flex min-h-header w-screen items-center justify-between overflow-x-hidden bg-navbar p-3'>
      <a className='inline-block align-middle text-2xl font-semibold text-white' href='/'>
        IguideME
      </a>
      <div className='md:hidden'>
        <MobileHeader self={self} selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />
      </div>
      {self.role === UserRoles.instructor && (
        <div className='absolute bottom-0 left-0 right-0 top-0 m-auto hidden w-fit place-content-center md:grid'>
          <Selector selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />
        </div>
      )}
      <div className='hidden gap-2 rounded-full border border-white px-1 md:flex lg:border-none'>
        <div className='flex outline-offset-[-1px] outline-white lg:rounded-md lg:outline lg:outline-1'>
          <ThemeSwitcherDropdown buttonClasses='border-none' user={self} />
          <NotificationPanel buttonClasses='border-none' placement='bottomLeft' user={selectedStudent ?? self} />
        </div>
        <Button
          className='flex h-10 w-10 flex-col items-center justify-center rounded-r-full border border-none border-white p-2 align-middle text-white hover:!bg-navbar-light hover:!text-white lg:w-32 lg:rounded-md lg:border-solid'
          onClick={switchPage}
          type='link'
        >
          <span className='!hidden lg:!inline-block'>
            {!inHome ?
              'Home'
            : self.role === UserRoles.instructor ?
              'Admin Panel'
            : 'Settings'}
          </span>
          {!inHome ?
            <HomeOutlined className='!m-0 lg:!hidden [&>svg]:h-4 [&>svg]:w-4' />
          : <SettingOutlined className='!m-0 lg:!hidden [&>svg]:h-4 [&>svg]:w-4' />}
        </Button>
      </div>
    </header>
  );
};

export default Header;
