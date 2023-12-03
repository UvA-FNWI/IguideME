import { User } from '@/types/user';
import { SmileTwoTone } from '@ant-design/icons';
import { Col, Row } from 'antd';
import { type FC, type ReactElement } from 'react';
import './style.scss'

interface Props {
  self: User;
}

const StudentInfo: FC<Props> = ({ self }): ReactElement => {

  // TODO: need to fix align, fsr the height of the second column is wrong
  return <div className='studentInfo'>
    <Row align='middle' gutter={35}>
      <Col span={4}>
        <SmileTwoTone twoToneColor='#00cc66' style={{ fontSize: 38 }} />
      </Col>
      <Col offset={2}>
        <div className='details'>
          <h3>{self?.name}</h3>
          <p style={{ margin: 0 }}>{self?.userID}</p>
        </div>
      </Col>
    </Row>
  </div >
}

export default StudentInfo;
