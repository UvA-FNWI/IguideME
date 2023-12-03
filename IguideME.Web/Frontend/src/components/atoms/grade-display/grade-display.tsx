import { Space } from 'antd';
import { type FC, type ReactElement } from 'react';
import './style.scss'
const GradeDisplay: FC = (): ReactElement => {
  const goal = 8;
  const avg = 9;
  const pred = 7;

  return <Space size='large'>
    <div className='gradeView'>
      <p>Goal</p>
      <h2>{goal}</h2>
    </div>
    <div className='gradeView'>
      <p>Current</p>
      <h2>{avg}</h2>
    </div>
    <div className='gradeView'>
      <p>Predicted</p>
      <h2>{pred}</h2>
    </div>
  </Space>
}

export default GradeDisplay;
