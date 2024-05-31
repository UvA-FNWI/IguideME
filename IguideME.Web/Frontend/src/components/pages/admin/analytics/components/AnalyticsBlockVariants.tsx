import Decrease from '../assets/decrease.svg';
import Increase from '../assets/increase.svg';
import { cn } from '@/utils/cn';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Tooltip as AntToolTip } from 'antd';
import { type FC, type HTMLAttributes, type ReactElement, memo } from 'react';

interface AnalyticsChipProps {
  change: number;
  children: ReactElement;
  display?: string | number;
  title?: string;
  unit: 'percentage' | 'number';
}

const AnalyticsChip: FC<AnalyticsChipProps> = memo(({ change, children, display, title, unit }): ReactElement => {
  const positive = change >= 0;
  return (
    <div className='flex h-[150px] w-[300px] items-center justify-between rounded-xl bg-surface1 p-6'>
      <div className='flex h-full flex-col justify-between'>
        <h4 className='text-lg text-text/75'>{title ?? '...'}</h4>
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
      <div className='h-[90px] w-[90px]'>{children}</div>
    </div>
  );
});
AnalyticsChip.displayName = 'AnalyticsChip';

interface AnalyticsGraphProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  tooltip: ReactElement;
}

const AnalyticsGraph: FC<AnalyticsGraphProps> = memo(
  ({ title, tooltip, children, className, ...props }): ReactElement => {
    return (
      <div className={cn('h-[400px] bg-surface1 p-6', className)} {...props}>
        <div className='mb-4 flex max-h-fit w-full items-center justify-between'>
          <h4 className='h-fit text-lg text-text'>{title}</h4>
          <AntToolTip placement='bottom' title={tooltip}>
            <QuestionCircleOutlined className='text-xl text-success' />
          </AntToolTip>
        </div>
        {children}
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
      <div className={cn('flex h-[400px] flex-col overflow-auto rounded-xl bg-surface1 p-6', className)} {...props}>
        <h4 className='mb-4 text-lg text-text'>{title}</h4>
        <div className='flex-grow'>{children}</div>
      </div>
    );
  },
);
AnalyticsTextBlock.displayName = 'AnalyticsTextBlock';

export { AnalyticsChip, AnalyticsGraph, AnalyticsTextBlock };
