import { cn } from '@/utils/cn';
import { Select } from 'antd';
import { SelectProps as AntSelectProps } from 'antd/lib';
import { FC, ReactElement } from 'react';

type SelectProps = {
  className?: string;
  isLoading: boolean;
  isError: boolean;
  customPlaceholder: {
    loading?: string;
    error?: string;
    message: string;
  };
} & AntSelectProps;

const Selector: FC<SelectProps> = ({ className, isLoading, isError, customPlaceholder, ...props }): ReactElement => {
  return (
    <Select
      allowClear
      aria-disabled={isLoading || isError}
      className={cn(
        'h-[40px] w-full md:w-80 lg:w-[400px] [&>div>span]:!text-textAlt [&>div]:!border-textAlt [&>div]:!bg-surface0 [&_span_*]:!text-textAlt',
        className,
      )}
      popupClassName='!bg-surface1 [&>div>div>div>div>div>div>div]:!text-text selectBackgroundHover'
      disabled={isLoading || isError}
      loading={isLoading}
      placeholder={
        isLoading ? customPlaceholder.loading
        : isError ?
          customPlaceholder.error
        : customPlaceholder.message
      }
      optionFilterProp='label'
      showSearch
      {...props}
    />
  );
};
Selector.displayName = 'Selector';
export default Selector;
