import { type User, UserRoles } from '@/types/user';
import { ActionTypes, trackEvent } from '@/utils/analytics';
import { cn } from '@/utils/cn';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Switch, Tooltip } from 'antd';
import { useTheme } from 'next-themes';
import { type FC, type HTMLAttributes, memo, type ReactElement } from 'react';

interface ThemeSwitcherProps extends HTMLAttributes<HTMLDivElement> {
  isSidebarClosed: boolean;
  user: User;
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = memo(({ className, isSidebarClosed, user, ...props }): ReactElement => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn(`flex min-h-11 items-center justify-between gap-4 rounded-md`, className)} {...props}>
      <p>Toggle theme</p>
      <Tooltip title='Toggle Theme' open={isSidebarClosed ? undefined : false} placement='right'>
        <Switch
          className='[&_span]:!bg-surface2'
          checkedChildren={<MoonOutlined className='text-text' />}
          unCheckedChildren={<SunOutlined className='text-text' />}
          checked={theme === 'dark'}
          onChange={() => {
            if (user.role === UserRoles.student) {
              trackEvent({
                userID: user.userID,
                action: ActionTypes.theme,
                actionDetail: theme === 'dark' ? 'Switched Theme to Light' : 'Switched Theme to Dark',
                courseID: user.course_id,
              }).catch(() => {
                // Silently fail, since this is not critical
              });
            }
            setTheme(theme === 'light' ? 'dark' : 'light');
          }}
        />
      </Tooltip>
    </div>
  );
});
ThemeSwitcher.displayName = 'ThemeSwitcher';
export default ThemeSwitcher;
