import { cn } from '@/utils/cn';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useTheme } from 'next-themes';
import { Button, Dropdown, type MenuProps, Switch } from 'antd';
import { type FC, memo, type ReactElement, useMemo } from 'react';

const ThemeSwitcherSwitch: FC = (): ReactElement => {
  const { theme, setTheme } = useTheme();

  return (
    <div className='w-full min-h-12 rounded-md flex items-center p-3 justify-between'>
      <span className='text-sm'>Theme</span>
      <Switch
        checkedChildren={<MoonOutlined />}
        unCheckedChildren={<SunOutlined />}
        checked={theme === 'dark'}
        onChange={() => {
          setTheme(theme === 'light' ? 'dark' : 'light');
        }}
      />
    </div>
  );
};

interface ThemeSwitcherDropdownProps {
  buttonClasses?: string;
}

const ThemeSwitcherDropdown: FC<ThemeSwitcherDropdownProps> = memo(({ buttonClasses }): ReactElement => {
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
          'flex flex-col justify-center items-center h-10 border border-solid border-white align-middle text-white w-10 p-0 hover:!bg-dialogBackground [&>span]:!text-white',
          buttonClasses,
        )}
        type='link'
      >
        {theme === 'light' ?
          <SunOutlined className='[&>svg]:w-4 [&>svg]:h-4' />
        : <MoonOutlined className='[&>svg]:w-4 [&>svg]:h-4' />}
      </Button>
    </Dropdown>
  );
});
ThemeSwitcherDropdown.displayName = 'ThemeSwitcherDropdown';
export { ThemeSwitcherDropdown, ThemeSwitcherSwitch };
