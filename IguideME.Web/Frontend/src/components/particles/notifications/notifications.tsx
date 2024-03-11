import { type FC, type ReactElement } from 'react';
import { WarningOutlined, RiseOutlined, TrophyOutlined } from '@ant-design/icons';
import { type User } from '@/types/user';
import { getStudentNotifications } from '@/api/users';
import { useQuery } from 'react-query';
import Loading from '../loading';

interface Props {
  user: User;
}

const Notifications: FC<Props> = ({ user }): ReactElement => {
  const { data: notifications } = useQuery(
    `notifications/${user.userID}`,
    async () => await getStudentNotifications(user.userID),
  );

  if (notifications === undefined) {
    return <Loading />;
  }

  const { outperforming, closing, falling, effort } = notifications;

  return (
    <div>
      {outperforming.length > 0 && (
        <div>
          <TrophyOutlined /> You are outperforming your peers in:
          <ul className="box-border pl-[30px]">
            {outperforming.map((notification) => (
              <li key={notification.tile_id}>{notification.tile_title}</li>
            ))}
          </ul>
        </div>
      )}

      {closing.length > 0 && (
        <div>
          <RiseOutlined /> You are closing the gap to your peers in:
          <ul className="box-border pl-[30px]">
            {closing.map((notification) => (
              <li key={notification.tile_id}>{notification.tile_title}</li>
            ))}
          </ul>
        </div>
      )}

      {falling.length > 0 && (
        <div>
          <WarningOutlined /> You are falling behind in:
          <ul className="box-border pl-[30px]">
            {falling.map((notification) => (
              <li key={notification.tile_id}>{notification.tile_title}</li>
            ))}
          </ul>
        </div>
      )}
      {effort.length > 0 && (
        <div>
          <WarningOutlined /> You have to put more effort in:
          <ul className="box-border pl-[30px]">
            {effort.map((notification) => (
              <li key={notification.tile_id}>{notification.tile_title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notifications;
