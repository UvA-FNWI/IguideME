// /------------------------- Module imports -------------------------/
import MobileHeader from './MobileHeader/MobileHeader';
import NotificationPanel from '@/components/atoms/notification-panel/notification-panel';
import Selector from './Selector';
import { Button } from 'antd';
import { HomeOutlined, SettingOutlined } from '@ant-design/icons';
import { ThemeSwitcherDropdown } from '../ThemeSwitcher/ThemeSwitcher';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useState, type FC, type ReactElement } from 'react';

// /-------------------------- Own imports ---------------------------/
import { UserRoles, type User } from '@/types/user';

interface HeaderProps {
  self: User;
}

const Header: FC<HeaderProps> = ({ self }): ReactElement => {
  const inHome: boolean = useLocation().pathname === '/';
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
    <header className='bg-navbarBackground w-screen min-h-header flex justify-between items-center p-3 relative overflow-x-hidden'>
      <a className='align-middle text-white font-semibold inline-block text-2xl' href='/'>
        IguideME
      </a>
      <div className='md:hidden'>
        <MobileHeader self={self} selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />
      </div>
      <div className='hidden absolute w-fit left-0 right-0 top-0 bottom-0 m-auto md:grid place-content-center'>
        <Selector selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} />
      </div>
      <div className='hidden md:flex gap-2 border lg:border-none border-white rounded-3xl px-1'>
        <div className='flex lg:outline lg:outline-1 outline-white outline-offset-[-1px] lg:rounded-md'>
          <ThemeSwitcherDropdown buttonClasses='border-none' />
          <NotificationPanel buttonClasses='border-none' placement='bottomLeft' user={selectedStudent ?? self} />
        </div>
        <Button
          className='flex flex-col justify-center items-center h-10 border-none border lg:border-solid border-white align-middle rounded-3xl lg:rounded-md w-10 lg:w-32 p-2 text-white hover:!text-white hover:!bg-dialogBackground'
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
            <HomeOutlined className='lg:!hidden !m-0 [&>svg]:w-4 [&>svg]:h-4' />
          : <SettingOutlined className='lg:!hidden !m-0 [&>svg]:w-4 [&>svg]:h-4' />}
        </Button>
      </div>
    </header>
  );
};

export default Header;
