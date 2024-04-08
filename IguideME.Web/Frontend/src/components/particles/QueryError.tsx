import { cn } from '@/utils/cn';
import { Result, type ResultProps } from 'antd';
import { FC, ReactElement } from 'react';

const QueryError: FC<ResultProps> = ({ className, title, ...props }): ReactElement => {
  return (
    <Result
      className={cn('w-full h-full absolute inset-0 [&>div]:!text-base [&_span]:!text-lg [&>div]:!m-0', className)}
      status='error'
      title={title}
      {...props}
    />
  );
};

export default QueryError;
