import { type User, UserRoles } from '@/types/user';
import { ActionTypes, trackEvent } from '@/utils/analytics';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Switch, Tooltip } from 'antd';
import { useTheme } from 'next-themes';
import { type FC, memo, type ReactElement } from 'react';

interface ThemeSwitcherProps {
  user: User;
  variant: 'full' | 'compact';
}

const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ user, variant }): ReactElement => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`flex min-h-11 ${variant === 'full' && 'w-full p-3'} items-center justify-between rounded-md`}>
      {variant === 'full' && <span className='text-sm'>Theme</span>}
      <Tooltip title='Toggle Theme'>
        <Switch
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
};
ThemeSwitcher.displayName = 'ThemeSwitcher';
export default memo(ThemeSwitcher);
