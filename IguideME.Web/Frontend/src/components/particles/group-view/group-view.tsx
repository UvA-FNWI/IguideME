import { Row } from 'antd';
import { type PropsWithChildren, type FC, type ReactElement } from 'react';

interface Props {
  title: string;
}
const GroupView: FC<PropsWithChildren<Props>> = ({ title, children }): ReactElement => {
  return (
    <div className="rounded-md bg-slate-50 border border-solid border-primary-gray min-h-[300px] h-full">
      <div className="m-3">
        <h2 className="text-center overflow-hidden text-ellipsis whitespace-nowrap">{title}</h2>
      </div>
      <Row className="justify-evenly my-[10px]" gutter={[10, 78]}>
        {children}
      </Row>
    </div>
  );
};

export default GroupView;
