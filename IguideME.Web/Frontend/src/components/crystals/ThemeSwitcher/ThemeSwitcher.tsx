import { User, UserRoles } from '@/types/user';
import { ActionTypes, Analytics } from '@/utils/analytics';
import { cn } from '@/utils/cn';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button, Dropdown, type MenuProps, Switch } from 'antd';
import { useTheme } from 'next-themes';
import { type FC, memo, type ReactElement, useMemo } from 'react';

interface ThemeSwitcherSwitchProps {
  user: User;
}

const ThemeSwitcherSwitch: FC<ThemeSwitcherSwitchProps> = ({ user }): ReactElement => {
  const { theme, setTheme } = useTheme();

  return (
    <div className='flex min-h-12 w-full items-center justify-between rounded-md p-3'>
      <span className='text-sm'>Theme</span>
      <Switch
        checkedChildren={<MoonOutlined />}
        unCheckedChildren={<SunOutlined />}
        checked={theme === 'dark'}
        onChange={() => {
          if (user.role === UserRoles.student) {
            Analytics.trackEvent({
              userID: user.userID,
              action: ActionTypes.theme,
              actionDetail: theme === 'light' ? 'dark' : 'light',
              courseID: user.course_id,
            });
          }
          setTheme(theme === 'light' ? 'dark' : 'light');
        }}
      />
    </div>
  );
};

interface ThemeSwitcherDropdownProps {
  buttonClasses?: string;
  user: User;
}

const ThemeSwitcherDropdown: FC<ThemeSwitcherDropdownProps> = memo(({ buttonClasses, user }): ReactElement => {
  const items = useMemo(
    () => [
      {
        key: '1',
        icon: <SunOutlined />,
        label: 'Light Mode',
      },
      {
        key: '2',
        icon: <MoonOutlined />,
        label: 'Dark Mode',
      },
    ],
    [],
  );

  const { theme, setTheme } = useTheme();

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (user.role === UserRoles.student) {
      Analytics.trackEvent({
        userID: user.userID,
        action: ActionTypes.theme,
        actionDetail: key === '1' ? 'light' : 'dark',
        courseID: user.course_id,
      });
    }
    setTheme(key === '1' ? 'light' : 'dark');
  };

  return (
    <Dropdown
      overlayClassName='[&>ul]:!bg-dropdownBackground [&>ul>li]:!text-text'
      menu={{ items, onClick }}
      trigger={['click']}
    >
      <Button
        className={cn(
          'flex h-10 w-10 flex-col items-center justify-center rounded-l-full border border-solid border-white p-0 align-middle text-white hover:!bg-navbar-light lg:rounded-md [&>span]:!text-white',
          buttonClasses,
        )}
        type='link'
      >
        {theme === 'light' ?
          <SunOutlined className='[&>svg]:h-4 [&>svg]:w-4' />
        : <MoonOutlined className='[&>svg]:h-4 [&>svg]:w-4' />}
      </Button>
    </Dropdown>
  );
});
ThemeSwitcherDropdown.displayName = 'ThemeSwitcherDropdown';
export { ThemeSwitcherDropdown, ThemeSwitcherSwitch };
