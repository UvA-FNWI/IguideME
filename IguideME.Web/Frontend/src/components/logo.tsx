import { type FC, memo, type SVGProps } from 'react';

type LogoProps = SVGProps<SVGSVGElement>;

const Logo: FC<LogoProps> = memo((props) => {
  return (
    <svg
      viewBox='0 0 167 45'
      shapeRendering='geometricPrecision'
      textRendering='geometricPrecision'
      xmlSpace='preserve'
      width={250}
      height={40}
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <text
        dx={0}
        dy={0}
        fontFamily="'e13h8ylUAWB1:::Roboto'"
        fontSize={36.275}
        fontWeight={700}
        strokeWidth={0}
        className='fill-foreground stroke-foreground'
        x={-1.161}
        y={35.349}
      >
        <tspan y={35.349} fontWeight={700} strokeWidth={0}>
          Iguide
        </tspan>
      </text>
      <style>
        {
          '@font-face{font-family:"e13h8ylUAWB1:::Roboto";font-style:normal;font-weight:700;src:url(data:font/ttf;charset=utf-8;base64,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)format("truetype")}'
        }
      </style>
      <g
        style={{
          shapeRendering: 'geometricPrecision',
          textRendering: 'geometricPrecision',
        }}
        className='fill-foreground stroke-foreground'
        transform='matrix(.07901 0 0 .08241 95.74 -.376)'
      >
        <path
          style={{
            fillOpacity: 1,
            strokeWidth: 0,
            strokeDasharray: 'none',
          }}
          className='fill-foreground stroke-foreground'
          d='M100.017 266.122v91.977l169.282 85.122 169.283-85.122v-91.977L269.3 356.182'
        />
        <path
          style={{
            fillOpacity: 1,
            strokeWidth: 0,
            strokeDasharray: 'none',
          }}
          className='fill-foreground stroke-foreground'
          d='M540.218 152.148 269.3 4.558 5.682 152.147l263.617 140.38 223.68-121.52 10.109 7.833v164.513l37.13-.043'
        />
      </g>
      <text
        fontFamily="'e13h8ylUAWB1:::Roboto'"
        fontSize={36.275}
        fontWeight={700}
        strokeWidth={0}
        className='fill-foreground stroke-foreground'
        x={138}
        y={35.349}
      >
        <tspan>E</tspan>
      </text>
    </svg>
  );
});
Logo.displayName = 'Logo';

const Hat: FC<LogoProps> = memo((props) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      shapeRendering='geometricPrecision'
      textRendering='geometricPrecision'
      version='1.1'
      viewBox='0 0 543 451'
      transform='translate(-5, 0)'
      {...props}
    >
      <path
        fillOpacity='1'
        className='fill-foreground stroke-foreground'
        strokeDasharray='none'
        strokeWidth='0'
        d='M100.017 266.122v91.977l169.282 85.122 169.283-85.122v-91.977L269.3 356.182'
      />
      <path
        fillOpacity='1'
        className='fill-foreground stroke-foreground'
        strokeDasharray='none'
        strokeWidth='0'
        d='M540.218 152.148L269.3 4.558 5.682 152.147l263.617 140.38 223.68-121.52 10.109 7.833v164.513l37.13-.043'
      />
    </svg>
  );
});
Hat.displayName = 'Hat';

export { Hat, Logo };
