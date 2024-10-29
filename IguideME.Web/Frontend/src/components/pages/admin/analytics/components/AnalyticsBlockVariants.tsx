import Decrease from '../assets/Decrease.svg';
import Increase from '../assets/Increase.svg';
import { cn } from '@/utils/cn';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip as AntToolTip } from 'antd';
import { type FC, type HTMLAttributes, type ReactElement, memo } from 'react';

interface AnalyticsChipProps extends HTMLAttributes<HTMLDivElement> {
  change: number;
  children: ReactElement;
  display?: string | number;
  title?: string;
  tooltip: ReactElement;
  unit: 'percentage' | 'number';
}

const AnalyticsChip: FC<AnalyticsChipProps> = memo(
  ({ change, children, className, display, title, tooltip, unit, ...props }): ReactElement => {
    const status =
      change > 0 ? 'positive'
      : change < 0 ? 'negative'
      : 'equal';

    const statusIcon =
      status === 'positive' ? Increase
      : status === 'negative' ? Decrease
      : null;

    const statusText =
      status === 'positive' ? '+'
      : status === 'negative' ? ''
      : 'No change'; // Add a neutral text for equal status

    return (
      <div
        className={cn(
          'relative flex h-[150px] min-w-[300px] max-w-[500px] flex-1 flex-grow items-center justify-between rounded-xl border bg-surface1 p-6 lg:h-[200px] lg:min-w-[500px] lg:max-w-[550px]',
          className,
        )}
        {...props}
      >
        <div className='flex h-full flex-col justify-between pr-8'>
          <h4 className='whitespace-nowrap text-lg text-text/75'>{title ?? 'Unknown title'}</h4>
          <p className='text-2xl font-black'>{display ?? 'No data found'}</p>
          <span
            className={`flex gap-2 text-xs ${
              status === 'positive' ? 'text-success'
              : status === 'negative' ? 'text-failure'
              : 'text-text/80'
            }`}
          >
            {statusIcon && <img src={statusIcon} alt={status} className='h-4 w-4' />}
            {statusText}
            {status !== 'equal' && change}
            {status !== 'equal' && unit === 'percentage' ? '%' : ''}
          </span>
        </div>
        <div className='h-[90px] min-w-[90px] flex-grow'>{children}</div>
        <AntToolTip className='absolute right-4 top-4' placement='bottom' title={tooltip}>
          <QuestionCircleOutlined className='text-xl text-success' />
        </AntToolTip>
      </div>
    );
  },
);
AnalyticsChip.displayName = 'AnalyticsChip';

interface AnalyticsGraphProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  tooltip: ReactElement;
}

const AnalyticsGraph: FC<AnalyticsGraphProps> = memo(
  ({ title, tooltip, children, className, ...props }): ReactElement => {
    return (
      <div className='h-[400px] min-w-[300px] overflow-x-auto overflow-y-hidden bg-surface1 p-6'>
        <div className='mb-4 flex max-h-fit w-full items-center justify-between'>
          <h4 className='h-fit text-lg text-text'>{title}</h4>
          <AntToolTip placement='bottom' title={tooltip}>
            <QuestionCircleOutlined className='text-xl text-success' />
          </AntToolTip>
        </div>
        <div className={className} {...props}>
          {children}
        </div>
      </div>
    );
  },
);
AnalyticsGraph.displayName = 'AnalyticsGraph';

interface AnalyticsTextBlockProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
}

const AnalyticsTextBlock: FC<AnalyticsTextBlockProps> = memo(
  ({ title, children, className, ...props }): ReactElement => {
    return (
      <div className='flex h-[400px] min-w-[300px] flex-col overflow-auto overflow-x-auto overflow-y-hidden rounded-xl bg-surface1 p-6'>
        <h4 className='mb-4 text-lg text-text'>{title}</h4>
        <div className={className} {...props}>
          {children}
        </div>
      </div>
    );
  },
);
AnalyticsTextBlock.displayName = 'AnalyticsTextBlock';

export { AnalyticsChip, AnalyticsGraph, AnalyticsTextBlock };
