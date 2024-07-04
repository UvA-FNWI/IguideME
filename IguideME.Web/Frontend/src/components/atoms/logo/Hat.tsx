import { memo, type FC, type SVGProps } from 'react';

interface HatProps extends SVGProps<SVGSVGElement> {}

const Hat: FC<HatProps> = memo((props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      shapeRendering='geometricPrecision'
      textRendering='geometricPrecision'
      version='1.1'
      viewBox='0 0 543 451'
      {...props}
    >
      <path
        fillOpacity='1'
        className='fill-text stroke-text'
        strokeDasharray='none'
        strokeWidth='0'
        d='M100.017 266.122v91.977l169.282 85.122 169.283-85.122v-91.977L269.3 356.182'
      />
      <path
        fillOpacity='1'
        className='fill-text stroke-text'
        strokeDasharray='none'
        strokeWidth='0'
        d='M540.218 152.148L269.3 4.558 5.682 152.147l263.617 140.38 223.68-121.52 10.109 7.833v164.513l37.13-.043'
      />
    </svg>
  );
});
Hat.displayName = 'Hat';
export default Hat;
