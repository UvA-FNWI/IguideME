import HamburgerIcon from './HamburgerIcon/HamburgerIcon';
import NotificationPanel from '@/components/atoms/notification-panel/notification-panel';
import Selector from '../Selector';
import { adminPanelMenuItems } from '../../admin-panel/admin-panel';
import { Collapse, Divider } from 'antd';
import { Dispatch, FC, memo, ReactElement, SetStateAction, useState } from 'react';
import { ThemeSwitcherSwitch } from '../../ThemeSwitcher/ThemeSwitcher';
import { useLocation } from 'react-router-dom';
import { User, UserRoles } from '@/types/user';
import { UserOutlined } from '@ant-design/icons';

const MenuItem: FC<{ item: (typeof adminPanelMenuItems)[0] }> = ({ item }): ReactElement => {
  const currentRoute = useLocation().pathname;

  return (
    <li
      className={`w-full min-h-12 text-sm flex gap-2 ${currentRoute === item.route ? 'font-semibold' : 'font-normal'}`}
    >
      <span className='grid place-content-center'>{item.icon}</span>
      <a className='w-full h-12 flex items-center' href={item.route}>
        {item.label}
      </a>
    </li>
  );
};

type MobileHeaderProps = {
  self: User;
  selectedStudent?: User;
  setSelectedStudent: Dispatch<SetStateAction<User | undefined>>;
};

const MobileHeader: FC<MobileHeaderProps> = memo(({ self, selectedStudent, setSelectedStudent }): ReactElement => {
  const currentRoute = useLocation().pathname;
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div className='grid place-content-center'>
        <HamburgerIcon open={open} setOpen={setOpen} />
      </div>
      {open && (
        <div className='fixed z-10 left-0 bottom-0 w-screen mt-header h-[calc(100vh-70px)] backdrop-blur-sm bg-black/30' />
      )}
      <div
        className={`bottom-0 right-0 mt-header w-[min(100vw,400px)] h-[calc(100vh-70px)] fixed bg-white text-black ${open ? 'translate-x-0' : 'translate-x-full'} z-50 transition-all duration-200 ease-in`}
      >
        <div className='px-8 py-6 flex flex-col justify-between gap-8 h-full overflow-y-auto'>
          <div>
            <ul className='flex flex-col gap-2'>
              <li className='w-full min-h-12 text-base'>
                <a
                  className={`w-full h-12 flex items-center ${currentRoute === '/' ? 'font-semibold' : 'font-normal'}`}
                  href='/'
                >
                  Home
                </a>
              </li>
              <li>
                <Divider className='m-0 p-0' />
              </li>
              <li
                className={`w-full min-h-12 [&_span]:!text-base [&_span]:!text-black ${currentRoute.startsWith('/admin') ? '[&_span]:!font-semibold' : '[&_span]:!font-normal'}`}
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
                <Divider className='m-0 p-0' />
              </li>
              {self.role === UserRoles.instructor && (
                <li className='w-full min-h-12'>
                  <Selector
                    placeholder='Open a student profile'
                    onSelect={() => setOpen(false)}
                    selectClasses={`h-12 [&>div]:!bg-primary-white [&>div>span]:!text-black [&_span_*]:!text-black [&>div]:!border-none [&_span]:!text-base ${/^\/\d+$/.test(currentRoute) ? '[&_span]:!font-semibold' : '[&_span]:!font-normal'}`}
                    selectedStudent={selectedStudent}
                    setSelectedStudent={setSelectedStudent}
                  />
                </li>
              )}
              <li>
                <Divider className='m-0 p-0' />
              </li>
            </ul>
            <div className='w-full flex justify-between mt-6 gap-2'>
              <div className='bg-slate-50 rounded-md flex-grow basis-0'>
                <ThemeSwitcherSwitch />
              </div>
              <div className='bg-slate-50 rounded-md h-12 flex-grow basis-0'>
                <NotificationPanel
                  buttonClasses='text-black w-full h-full border-none m-0 p-0 grid place-content-center'
                  placement='bottomRight'
                  user={selectedStudent ?? self}
                />
              </div>
            </div>
          </div>
          <div className='bg-white'>
            <div className='flex content-center flex-col justify-center bg-white p-4 h-header'>
              <h3 className='text-lg'>{self?.name}</h3>
              <strong>
                <UserOutlined /> Instructor
              </strong>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default MobileHeader;
