import HamburgerIcon from './HamburgerIcon/HamburgerIcon';
import NotificationPanel from '@/components/atoms/notification-panel/notification-panel';
import Selector from '../Selector';
import { adminPanelMenuItems } from '../../admin-panel/adminPanelMenuItems';
import { Collapse, Divider } from 'antd';
import { ThemeSwitcherSwitch } from '../../ThemeSwitcher/ThemeSwitcher';
import { useLocation } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import { type Dispatch, type FC, memo, type ReactElement, type SetStateAction, useState } from 'react';
import { type User, UserRoles } from '@/types/user';

const MenuItem: FC<{ item: (typeof adminPanelMenuItems)[0] }> = ({ item }): ReactElement => {
  const currentRoute = useLocation().pathname;

  return (
    <li
      className={`flex min-h-12 w-full gap-2 text-sm ${currentRoute === item.route ? 'font-semibold' : 'font-normal'}`}
    >
      <span className='grid place-content-center'>{item.icon}</span>
      <a className='flex h-12 w-full items-center' href={item.route}>
        {item.label}
      </a>
    </li>
  );
};

interface MobileHeaderProps {
  self: User;
  selectedStudent?: User;
  setSelectedStudent: Dispatch<SetStateAction<User | undefined>>;
}

const MobileHeader: FC<MobileHeaderProps> = memo(({ self, selectedStudent, setSelectedStudent }): ReactElement => {
  const currentRoute = useLocation().pathname;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className='grid place-content-center'>
        <HamburgerIcon open={open} setOpen={setOpen} />
      </div>
      {open && (
        <div className='fixed bottom-0 left-0 z-10 mt-header h-[calc(100vh-70px)] w-screen bg-text/30 backdrop-blur-sm' />
      )}
      <div
        className={`fixed bottom-0 right-0 mt-header h-[calc(100vh-70px)] w-[min(100vw,400px)] bg-crust text-text ${open ? 'translate-x-0' : 'translate-x-full'} z-50 transition-all duration-200 ease-in`}
      >
        <div className='flex h-full flex-col justify-between gap-8 overflow-y-auto px-8 py-6'>
          <div>
            <ul className='flex flex-col gap-2'>
              <li className='min-h-12 w-full text-text'>
                <a
                  className={`flex h-12 w-full items-center ${currentRoute === '/' ? 'font-semibold' : 'font-normal'}`}
                  href='/'
                >
                  Home
                </a>
              </li>
              <li>
                <Divider className='m-0 bg-text/50 p-0' />
              </li>
              {self.role === UserRoles.instructor ?
                <>
                  <li
                    className={`min-h-12 w-full [&_span]:!text-base [&_span]:!text-text ${currentRoute.startsWith('/admin') ? '[&_span]:!font-semibold' : '[&_span]:!font-normal'}`}
                  >
                    <Collapse
                      className='[&>div>div]:!px-0'
                      ghost
                      items={[
                        {
                          key: '1',
                          label: 'Admin Panel',
                          children: (
                            <ul>
                              {adminPanelMenuItems.map((item) => (
                                <MenuItem key={item.key} item={item} />
                              ))}
                            </ul>
                          ),
                        },
                      ]}
                    />
                  </li>
                  <li>
                    <Divider className='m-0 bg-text/50 p-0' />
                  </li>
                  <li className='min-h-12 w-full'>
                    <Selector
                      placeholder='Open a student profile'
                      onSelect={() => {
                        setOpen(false);
                      }}
                      selectClasses={`h-12 [&>div]:!bg-body [&>div>span]:!text-text [&_span_*]:!text-text [&>div]:!border-none [&_span]:!text-base ${/^\/\d+$/.test(currentRoute) ? '[&_span]:!font-semibold' : '[&_span]:!font-normal'}`}
                      selectedStudent={selectedStudent}
                      setSelectedStudent={setSelectedStudent}
                    />
                  </li>
                </>
              : <li className='min-h-12 w-full text-base'>
                  <a
                    className={`flex h-12 w-full items-center ${currentRoute === '/student-settings' ? 'font-semibold' : 'font-normal'}`}
                    href='/student-settings'
                  >
                    Settings
                  </a>
                </li>
              }
              <li>
                <Divider className='m-0 bg-text/50 p-0' />
              </li>
            </ul>
            <div className='mt-6 flex w-full justify-between gap-2'>
              <div className='bg-card flex-grow basis-0 rounded-md'>
                <ThemeSwitcherSwitch user={self} />
              </div>
              <div className='h-12 flex-grow basis-0 rounded-md bg-surface2'>
                <NotificationPanel
                  buttonClasses='text-text w-full h-full border-none m-0 p-0 grid place-content-center'
                  placement='bottomRight'
                  user={selectedStudent ?? self}
                />
              </div>
            </div>
          </div>
          <div className='bg-crust'>
            <div className='flex h-header flex-col content-center justify-center border-t border-text bg-crust p-4'>
              <h3 className='text-lg'>{self?.name}</h3>
              <strong className='text-text'>
                <UserOutlined /> Instructor
              </strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
MobileHeader.displayName = 'MobileHeader';
export default MobileHeader;
