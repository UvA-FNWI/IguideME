import { type FC, type ReactElement } from "react";
import { Popover, Button } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { type User } from "@/types/user";
import Notifications from "@/components/particles/notifications/notifications";
import Loading from "@/components/particles/loading";

interface Props {
  user: User | undefined;
}
const NotificationPanel: FC<Props> = ({ user }): ReactElement => {
  return (
    <div>
      <Popover
        content={
          user !== undefined ? <Notifications user={user} /> : <Loading />
        }
        title="Notifications"
        trigger="click"
        placement="leftTop"
      >
        <Button
          className="headerButton"
          type="link"
          style={{ borderRadius: 20, width: 38, padding: 0 }}
        >
          <h2 style={{ fontSize: 19 }}>
            <BellOutlined />{" "}
          </h2>
        </Button>
      </Popover>
    </div>
  );
};

export default NotificationPanel;
