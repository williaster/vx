import React from 'react';
import Show from '../components/Show';
import StackedAreas from '../components/tiles/Stacked-Areas';

export default () => {
  return (
    <Show
      component={StackedAreas}
      title="Stacked Areas"
      margin={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 10,
      }}
    >
      {`import React from 'react';
import { AreaStack } from '@vx/shape';
import { SeriesPoint } from '@vx/shape/lib/types';
import { GradientOrangeRed } from '@vx/gradient';
import browserUsage, { BrowserUsage } from '@vx/mock-data/lib/mocks/browserUsage';
import { scaleTime, scaleLinear } from '@vx/scale';
import { timeParse } from 'd3-time-format';
import { ShowProvidedProps } from '../../types';

type BrowserNames = keyof BrowserUsage;

const data = browserUsage;
const keys = Object.keys(data[0]).filter(k => k !== 'date') as BrowserNames[];
const parseDate = timeParse('%Y %b %d');

const getDate = (d: BrowserUsage) => (parseDate(d.date) as Date).valueOf();
const getY0 = (d: SeriesPoint<BrowserUsage>) => d[0] / 100;
const getY1 = (d: SeriesPoint<BrowserUsage>) => d[1] / 100;

export default ({ width, height, margin, events = false }: ShowProvidedProps) => {
  if (width < 10) return null;

  // bounds
  const yMax = height - margin.top - margin.bottom;
  const xMax = width - margin.left - margin.right;

  // scales
  const xScale = scaleTime<number>({
    range: [0, xMax],
    domain: [Math.min(...data.map(getDate)), Math.max(...data.map(getDate))],
  });
  const yScale = scaleLinear<number>({
    range: [yMax, 0],
  });

  return (
    <svg width={width} height={height}>
      <GradientOrangeRed id="OrangeRed" />
      <rect x={0} y={0} width={width} height={height} fill="#f38181" rx={14} />
      <AreaStack
        top={margin.top}
        left={margin.left}
        keys={keys}
        data={data}
        x={d => xScale(getDate(d.data))}
        y0={d => yScale(getY0(d))}
        y1={d => yScale(getY1(d))}
      >
        {({ stacks, path }) =>
          stacks.map(stack => (
            <path
              key={\`stack-\${stack.key}\`}
              d={path(stack)}
              stroke="transparent"
              fill="url(#OrangeRed)"
              onClick={() => {
                if (events) alert(\`\${stack.key}\`);
              }}
            />
          ))
        }
      </AreaStack>
    </svg>
  );
};
`}
    </Show>
  );
};
