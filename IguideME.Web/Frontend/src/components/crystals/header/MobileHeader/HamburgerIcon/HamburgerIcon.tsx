import { cn } from '@/utils/cn';
import { FC, memo, ReactElement } from 'react';
import styles from './hamburgerIcon.module.css';

type HamburgerIconProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const HamburgerIcon: FC<HamburgerIconProps> = memo(({ open, setOpen }): ReactElement => {
  return (
    <button
      aria-controls='Main Navigation'
      aria-expanded={open}
      aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
      className={cn(styles.hamburger_icon, 'min-h-12 min-w-12')}
      onClick={() => setOpen(!open)}
    >
      <svg className='fill-textAlt' viewBox='0 0 100 100'>
        <rect width={80} height={10} x={10} y={open ? 45 : 25} rx={5} />
        <rect width={80} height={10} x={10} y={45} rx={5} />
        <rect width={80} height={10} x={10} y={open ? 45 : 65} rx={5} />
      </svg>
    </button>
  );
});
export default HamburgerIcon;
