// @flow

import React from 'react';
import type { Point } from '../../types/graphing';
import round from '../../util/round';
import type { Color } from '../../types/domain';

type Props = {
  points: Point[],
  factors: number[],
  className: string,
  scale: number,
  offset: number,
  color?: Color,
};

const SpiderGraph = ({ points, factors, className, scale, offset, color }: Props) => {
  let i = 0;
  const pointStrings = [];
  factors.forEach((factor) => {
    const x = round((factor * points[i].x) + scale + offset, 2);
    const y = round((factor * points[i].y) + scale + offset, 2);
    pointStrings.push(`${x},${y}`);
    i += 1;
  });

  return color ? (<polygon
    className={className}
    points={pointStrings.join(' ')}
    style={{ fill: color, stroke: color }}
  />) : <polygon className={className} points={pointStrings.join(' ')} />;
};

SpiderGraph.defaultProps = {
  color: undefined,
};

export default SpiderGraph;
