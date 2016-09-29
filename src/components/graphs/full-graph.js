// @flow

import React from 'react';
import SpiderGraph from './spider-graph';
import Axis from './axis';
import generatePointsAndFactors from '../../logic';
import type { MeasurablePercentile } from '../../types/graphing';
import round from '../../util/round';

type Props = {
  percentiles: MeasurablePercentile[];
};

const scale = 200;
const offset = 10;

export default ({ percentiles }: Props) => {
  const { points, factors } = generatePointsAndFactors(percentiles, scale);
  const count = points.length;
  const pointList = points.map(p => p.point);

  let i = 0;
  const circles = [];
  for (const factor of factors) {
    const x = round((factor * pointList[i].x) + scale + offset, 2);
    const y = round((factor * pointList[i].y) + scale + offset, 2);
    circles.push(<g className="percentileMarker" key={`g${i}`}>
      <circle key={`c${i}`} cx={x} cy={y} r={offset} />
      <text key={`t${i}`} x={x} y={y}>{points[i++].percentile}</text>
    </g>);
  }

  return (<figure className="spider">
    <svg
      preserveAspectRatio="xMinYMin meet"
      viewBox={`0 0 ${2 * (scale + offset)} ${2 * (scale + offset)}`}
    >
      {[0.2, 0.4, 0.6, 0.8].map(f =>
        <SpiderGraph
          key={f}
          className="grid"
          points={pointList}
          factors={Array(count).fill(f)}
          scale={scale}
          offset={offset}
        />
      )}
      <SpiderGraph
        className="divider"
        points={pointList}
        factors={Array(count).fill(1.0)}
        scale={scale}
        offset={offset}
      />
      {points.map(p =>
        <Axis
          key={p.measurable.id}
          id={p.measurable.id}
          name={p.measurable.name}
          offset={offset}
          scale={scale}
          point={p.point}
        />
      )}
      <SpiderGraph
        className="graph"
        points={pointList}
        factors={factors}
        scale={scale}
        offset={offset}
      />
      {circles}
    </svg>
  </figure>);
};
