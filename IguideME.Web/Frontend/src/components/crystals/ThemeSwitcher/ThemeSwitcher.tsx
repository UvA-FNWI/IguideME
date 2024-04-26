import { Button, Dropdown, MenuProps, Switch } from 'antd';
import { cn } from '@/utils/cn';
import { FC, memo, ReactElement, useMemo } from 'react';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useTheme } from 'next-themes';

const ThemeSwitcherSwitch: FC = (): ReactElement => {
  const { theme, setTheme } = useTheme();

  return (
    <div className='w-full min-h-12 rounded-md flex items-center p-3 justify-between'>
      <span className='text-sm'>Theme</span>
      <Switch
        checkedChildren={<MoonOutlined />}
        unCheckedChildren={<SunOutlined />}
        checked={theme === 'dark'}
        onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
    </div>
  );
};

type ThemeSwitcherDropdownProps = {
  buttonClasses?: string;
};

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
    <Dropdown menu={{ items, onClick }} trigger={['click']}>
      <Button
        className={cn(
          'flex flex-col justify-center items-center h-10 border border-solid border-white align-middle text-white rounded-3xl w-10 p-0',
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

export { ThemeSwitcherDropdown, ThemeSwitcherSwitch };
