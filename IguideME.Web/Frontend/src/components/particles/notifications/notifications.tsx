import { type FC, type ReactElement } from "react";
import {
  WarningOutlined,
  RiseOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { type User } from "@/types/user";
import { getStudentNotifications } from "@/api/users";
import { useQuery } from "react-query";
import Loading from "../loading";

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
      <div className="Notifications">
        {outperforming.length > 0 && (
          <div>
            <TrophyOutlined /> You are outperforming your peers in:
            <ul style={{ boxSizing: "border-box", paddingLeft: 30 }}>
              {outperforming.map((notification) => (
                <li key={notification.tile_id}>{notification.tile_title}</li>
              ))}
            </ul>
          </div>
        )}

        {closing.length > 0 && (
          <div>
            <RiseOutlined /> You are closing the gap to your peers in:
            <ul style={{ boxSizing: "border-box", paddingLeft: 30 }}>
              {closing.map((notification) => (
                <li key={notification.tile_id}>{notification.tile_title}</li>
              ))}
            </ul>
          </div>
        )}

        {falling.length > 0 && (
          <div>
            <WarningOutlined /> You are falling behind in:
            <ul style={{ boxSizing: "border-box", paddingLeft: 30 }}>
              {falling.map((notification) => (
                <li key={notification.tile_id}>{notification.tile_title}</li>
              ))}
            </ul>
          </div>
        )}
        {effort.length > 0 && (
          <div>
            <WarningOutlined /> You have to put more effort in:
            <ul style={{ boxSizing: "border-box", paddingLeft: 30 }}>
              {effort.map((notification) => (
                <li key={notification.tile_id}>{notification.tile_title}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
