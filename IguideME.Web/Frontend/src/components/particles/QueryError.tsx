import { cn } from '@/utils/cn';
import { Result, type ResultProps } from 'antd';
import { type FC, type ReactElement } from 'react';

const QueryError: FC<ResultProps> = ({ className, title, ...props }): ReactElement => {
  return (
    <Result
      className={cn(
        'absolute inset-0 h-full w-full [&>div]:!m-0 [&>div]:!text-base [&>div]:!text-text [&_span]:!text-lg [&_span]:text-failure',
        className,
      )}
      status='error'
      title={title}
      {...props}
    />
  );
};

export default QueryError;
