import React, {Component} from 'react';
import { Group } from '@vx/group';
import { BoxPlot } from '@vx/stats';
import { LinearGradient } from '@vx/gradient';
import { scaleBand, scaleLinear } from '@vx/scale';
import { withTooltip, Tooltip, defaultStyles as defaultTooltipStyles } from '@vx/tooltip';
import { PatternLines } from '@vx/pattern';
import {PredictiveModel} from "../../../../../../models/app/PredictiveModel";

const compute = require( 'compute.io' );

// accessors
const quantile = (arr: number[], q: number) => {
  const sorted = arr.sort();
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
};

const _round = (num: number) => num; //Math.round((num * 1000)) / 1000;
const thetas = (model: PredictiveModel) => model.entry_collection.split('#').length + 1;
const min = (models: PredictiveModel[]) => _round(Math.min(...models.map(m => m.mse)));
const max = (models: PredictiveModel[]) => _round(Math.max(...models.map(m => m.mse)));
const median = (models: PredictiveModel[]) => compute.median(models.map(m => _round(m.mse)));
const firstQuartile = (models: PredictiveModel[]) => quantile(models.map(m => _round(m.mse)), .25);
const thirdQuartile = (models: PredictiveModel[]) => quantile(models.map(m => _round(m.mse)), .75);

interface TooltipData {
  name?: string;
  min?: number;
  median?: number;
  max?: number;
  firstQuartile?: number;
  thirdQuartile?: number;
}

class ModelResults extends Component<any, TooltipData> {

  render(): React.ReactNode {
    const {
      models,
      width,
      height,
      tooltipOpen,
      tooltipLeft,
      tooltipTop,
      tooltipData,
      showTooltip,
      hideTooltip,
    } = this.props;

    // bounds
    const xMax = width;
    const yMax = height - 120;

    // scales
    const xScale = scaleBand<string>({
      range: [0, xMax],
      round: true,
      domain: models.map(thetas),
      padding: 0.4,
    });

    const allValues = models.map((m: PredictiveModel) => Math.round((m.mse * 1000)) / 1000)

    const minYValue = Math.min(...allValues);
    const maxYValue = Math.max(...allValues);

    const yScale = scaleLinear<number>({
      range: [yMax, 0],
      round: true,
      domain: [minYValue, maxYValue],
    });

    const boxWidth = xScale.bandwidth();
    const constrainedWidth = Math.min(40, boxWidth);

    const groupBy = (items: PredictiveModel[]) => items.reduce(
      (result: any, item) => ({
        ...result,
        [thetas(item)]: [
          ...(result[thetas(item)] || []),
          item,
        ],
      }),
      {},
    );

    const groupedModels: PredictiveModel[][] = Object.values(groupBy(models));

    return width < 10 ? null : (
      <div style={{ position: 'relative' }}>
        <h4>Mean Square Error</h4>
        <svg width={width} height={height}>
          <LinearGradient id="statsplot" to="#8b6ce7" from="#87f2d4" />
          <rect x={0} y={0} width={width} height={height} fill="url(#statsplot)" rx={14} />
          <PatternLines
            id="hViolinLines"
            height={3}
            width={3}
            stroke="#ced4da"
            strokeWidth={1}
            //fill="rgba(0,0,0,0.3)"
            orientation={['horizontal']}
          />
          <Group top={40}>
            {groupedModels.map((d: PredictiveModel[], i: number) => (
              <g key={i}>
                <BoxPlot
                  min={Math.max(min(d), 0.001)}
                  max={max(d)}
                  left={xScale(thetas(d[0]).toString())! + 0.3 * constrainedWidth}
                  firstQuartile={Math.max(firstQuartile(d), 0.001)}
                  thirdQuartile={thirdQuartile(d)}
                  median={median(d)}
                  boxWidth={constrainedWidth * 0.4}
                  fill="#FFFFFF"
                  fillOpacity={0.3}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                  valueScale={yScale}
                  //outliers={outliers(d)}
                  boxProps={{
                    onMouseOver: () => {
                      showTooltip({
                        tooltipTop: yScale(median(d))! + 40,
                        tooltipLeft: xScale(thetas(d[0]).toString())! + constrainedWidth + 5,
                        tooltipData: {
                          max: max(d),
                          median: median(d),
                          min: min(d),
                          firstQuartile: firstQuartile(d),
                          thirdQuartile: thirdQuartile(d),
                          models: d.length.toString(),
                          name: `${thetas(d[0])} gradable components`,
                        },
                      });
                    },
                    onMouseLeave: () => {
                      hideTooltip();
                    },
                  }}
                />
              </g>
            ))}
          </Group>
        </svg>

        {tooltipOpen && tooltipData && (
          <Tooltip
            top={tooltipTop}
            left={tooltipLeft}
            style={{ ...defaultTooltipStyles, backgroundColor: '#283238', color: 'white' }}
          >
            <div>
              <strong>{tooltipData.name}</strong>
            </div>
            <div style={{ marginTop: '5px', fontSize: '12px' }}>
              {<div>max: {_round(tooltipData.max)}</div>}
              {<div>third quartile: {_round(tooltipData.thirdQuartile)}</div>}
              {<div>median: {_round(tooltipData.median)}</div>}
              {<div>first quartile: {_round(tooltipData.firstQuartile)}</div>}
              {<div>min: {_round(tooltipData.min).toString()}</div>}
              {<div>models: {_round(tooltipData.models)}</div>}
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
}

export default withTooltip(ModelResults);