// @flow

import React from 'react';
import SpiderGraph from './spider-graph';
import generateGraphData from '../../logic';
import type { MeasurablePercentile } from '../../types/graphing';

const scale = 25;
const offset = 1;

type Props = {
  percentiles: MeasurablePercentile[],
  comparison: string,
};

export default ({ percentiles, comparison }: Props) => {
  const { points, factors } = generateGraphData(percentiles, scale);

  return (<figure className="spark-graph pull-xs-right">
    <svg
      preserveAspectRatio="xMinYMin meet"
      viewBox={`0 0 ${2 * (scale + offset)} ${2 * (scale + offset)}`}
    >
      <SpiderGraph
        className="graph"
        points={points.map(mwp => mwp.point)}
        factors={factors}
        scale={scale}
        offset={offset}
      />
      <text x={scale + offset} y={scale + offset} className="spark-text">{comparison}</text>
    </svg>
  </figure>);
};
