import { type FC, type PropsWithChildren, type ReactElement } from 'react';

interface Props {
  title: string;
}
const GroupView: FC<PropsWithChildren<Props>> = ({ title, children }): ReactElement => {
  return (
    <div className='h-full min-h-[300px] w-full rounded-md border border-solid border-border0 bg-base py-3 pt-[1px]'>
      <div className='m-3'>
        <h2 className='overflow-hidden text-ellipsis whitespace-nowrap text-center text-lg font-bold'>{title}</h2>
      </div>
      <div className='flex flex-wrap justify-center gap-8'>{children}</div>
    </div>
  );
};

export default GroupView;
