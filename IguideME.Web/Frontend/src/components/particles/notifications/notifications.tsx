import Loading from '../loading';
import { getStudentNotifications } from '@/api/users';
import { RiseOutlined, TrophyOutlined, WarningOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { type FC, type ReactElement } from 'react';
import { type User } from '@/types/user';

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
        <>
          <div className="flex gap-1">
            <TrophyOutlined />
            <p className="text-base">You are outperforming your peers in:</p>
          </div>
          <ul className="list-disc pl-9 text-sm">
            {outperforming.map((notification) => (
              <li key={notification.tile_id}>{notification.tile_title}</li>
            ))}
          </ul>
        </>
      )}

      {closing.length > 0 && (
        <>
          <div className="flex gap-1">
            <RiseOutlined />
            <p className="text-base">You are closing the gap to your peers in:</p>
          </div>
          <ul className="list-disc pl-9 text-sm">
            {closing.map((notification) => (
              <li key={notification.tile_id}>{notification.tile_title}</li>
            ))}
          </ul>
        </>
      )}

      {falling.length > 0 && (
        <>
          <div className="flex gap-1">
            <WarningOutlined />
            <p className="text-base">You are falling behind in:</p>
          </div>
          <ul className="list-disc pl-9 text-sm">
            {falling.map((notification) => (
              <li key={notification.tile_id}>{notification.tile_title}</li>
            ))}
          </ul>
        </>
      )}
      {effort.length > 0 && (
        <>
          <div className="flex gap-1">
            <WarningOutlined />
            <p className="text-base">You have to put more effort in:</p>
          </div>
          <ul className="list-disc pl-9 text-sm">
            {effort.map((notification) => (
              <li key={notification.tile_id}>{notification.tile_title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Notifications;
