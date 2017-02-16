// @flow

import React from 'react';
import SpiderGraph from './spider-graph';
import generateGraphData from '../../logic';
import type { MeasurablePercentile } from '../../types/graphing';
import type { Color } from '../../types/domain';

const scale = 25;
const offset = 1;

type Props = {
  percentiles: Array<MeasurablePercentile>,
  overlay: string,
  color: Color,
};

export default ({ percentiles, overlay, color }: Props) => {
  const { points, factors } = generateGraphData(percentiles, scale);

  return (<figure className="spark-graph mb-0">
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
        color={color}
      />
      <text x={scale + offset} y={scale + offset} className="spark-text">{overlay}</text>
    </svg>
  </figure>);
};
