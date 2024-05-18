import { Row } from 'antd';
import { type FC, type PropsWithChildren, type ReactElement } from 'react';

interface Props {
  title: string;
}
const GroupView: FC<PropsWithChildren<Props>> = ({ title, children }): ReactElement => {
  return (
    <div className='w-full pt-[1px] rounded-md border border-solid border-border0 bg-base min-h-[300px] h-full'>
      <div className='m-3'>
        <h2 className='text-center overflow-hidden text-ellipsis whitespace-nowrap text-xl'>{title}</h2>
      </div>
      <Row className='justify-evenly my-[10px' gutter={[10, 78]}>
        {children}
      </Row>
    </div>
  );
};

export default GroupView;
