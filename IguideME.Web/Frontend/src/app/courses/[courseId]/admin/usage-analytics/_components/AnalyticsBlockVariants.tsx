import { type FC, type HTMLAttributes, memo, type ReactElement } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip as AntToolTip } from 'antd';

import Decrease from '@/app/courses/[courseId]/admin/usage-analytics/_assets/Decrease.svg';
import Increase from '@/app/courses/[courseId]/admin/usage-analytics/_assets/Increase.svg';
import { cn } from '@/lib/cn';

interface AnalyticsChipProps extends HTMLAttributes<HTMLDivElement> {
  change: number;
  children: ReactElement;
  display?: string | number;
  title?: string;
  unit: 'percentage' | 'number';
}

const AnalyticsChip: FC<AnalyticsChipProps> = memo(
  ({ change, children, className, display, title, unit, ...props }): ReactElement => {
    const positive = change >= 0;
    return (
      <div
        className={cn(
          'bg-surface1 flex h-[150px] min-w-[300px] max-w-[500px] flex-1 flex-grow items-center justify-between rounded-xl p-6',
          className,
        )}
        {...props}
      >
        <div className='flex h-full flex-col justify-between pr-8'>
          <h4 className='text-text/75 text-lg'>{title ?? '...'}</h4>
          <p className='text-2xl font-black'>{display ?? '?'}</p>
          <span className={`flex gap-2 text-xs ${positive ? 'text-success' : 'text-failure'}`}>
            {positive ?
              <img src={Increase} alt='Increase' className='h-4 w-4' />
            : <img src={Decrease} alt='Decrease' className='h-4 w-4' />}
            {positive ? '+' : ''}
            {change}
            {unit === 'percentage' ? '%' : ''}
          </span>
        </div>
        <div className='h-[90px] min-w-[90px] flex-grow'>{children}</div>
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
      <div className='bg-surface1 h-[400px] min-w-[300px] overflow-x-auto overflow-y-hidden p-6'>
        <div className='mb-4 flex max-h-fit w-full items-center justify-between'>
          <h4 className='text-text h-fit text-lg'>{title}</h4>
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
      <div className='bg-surface1 flex h-[400px] min-w-[300px] flex-col overflow-auto overflow-x-auto overflow-y-hidden rounded-xl p-6'>
        <h4 className='text-text mb-4 text-lg'>{title}</h4>
        <div className={className} {...props}>
          {children}
        </div>
      </div>
    );
  },
);
AnalyticsTextBlock.displayName = 'AnalyticsTextBlock';

export { AnalyticsChip, AnalyticsGraph, AnalyticsTextBlock };