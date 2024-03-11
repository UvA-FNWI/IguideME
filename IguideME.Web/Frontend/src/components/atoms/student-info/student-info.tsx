import type { User } from '@/types/user';
import { SmileTwoTone } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { type FC, type ReactElement } from 'react';

interface Props {
  self: User;
}

const StudentInfo: FC<Props> = ({ self }): ReactElement => {
  // TODO: need to fix align, fsr the height of the second column is wrong
  return (
    <div className="min-w-[250px] h-[50px]">
      <Row align="middle" gutter={35}>
        <Col span={4}>
          <SmileTwoTone twoToneColor="#00cc66" className="text-4xl" />
        </Col>
        <Col offset={2}>
          <div className="m-0 text-center">
            <h3>{self?.name}</h3>
            <p className="m-0">{self?.userID}</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default StudentInfo;
