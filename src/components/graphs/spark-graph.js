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
  overlay?: string,
  color: Color,
};

const SparkGraph = ({ percentiles, overlay, color }: Props) => {
  const { points, factors } = generateGraphData(percentiles, scale);

  const totalOffset = scale + offset;

  return (<figure className="spark-graph mb-0">
    <svg
      preserveAspectRatio="xMinYMin meet"
      viewBox={`0 0 ${2 * (totalOffset)} ${2 * (totalOffset)}`}
    >
      <SpiderGraph
        className="graph"
        points={points.map(mwp => mwp.point)}
        factors={factors}
        scale={scale}
        offset={offset}
        color={color}
      />
      {overlay && <text x={totalOffset} y={totalOffset} className="spark-text">{overlay}</text>}
    </svg>
  </figure>);
};

SparkGraph.defaultProps = {
  overlay: undefined,
};

export default SparkGraph;
