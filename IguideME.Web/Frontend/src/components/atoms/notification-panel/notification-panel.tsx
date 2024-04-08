import { type FC, type ReactElement } from 'react';
import { Popover, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { type User } from '@/types/user';
import Notifications from '@/components/particles/notifications/notifications';

interface Props {
  user: User | undefined;
}
const NotificationPanel: FC<Props> = ({ user }): ReactElement => {
  return (
    <div>
      <Popover
        content={
          user !== undefined ?
            <Notifications user={user} />
          : <div className='h-16 grid items-center'>
              <p>Please select a student</p>
            </div>
        }
        title='Notifications'
        trigger='click'
        placement='leftTop'
      >
        <Button
          className='flex flex-col justify-center items-center h-10 border border-solid border-white align-middle text-white rounded-3xl w-10 p-0'
          type='link'
        >
          <BellOutlined className='[&>svg]:w-4 [&>svg]:h-4' />
        </Button>
      </Popover>
    </div>
  );
};

export default NotificationPanel;
