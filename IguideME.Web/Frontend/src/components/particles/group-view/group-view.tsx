import { Row } from "antd";
import { type PropsWithChildren, type FC, type ReactElement } from "react";
import "./syle.scss";

interface Props {
  title: string;
}
const GroupView: FC<PropsWithChildren<Props>> = ({
  title,
  children,
}): ReactElement => {
  return (
    <div className="groupView">
      <div style={{ margin: 12 }}>
        <h2>{title}</h2>
      </div>
      <Row
        justify="space-evenly"
        gutter={[10, 78]}
        style={{ marginTop: "10px", marginBottom: "10px" }}
      >
        {children}
      </Row>
    </div>
  );
};

export default GroupView;
