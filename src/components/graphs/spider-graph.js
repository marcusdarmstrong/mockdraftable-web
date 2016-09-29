// @flow

import React from 'react';
import type { Point } from '../../types/graphing';
import round from '../../util/round';

type Props = {
  points: Point[],
  factors: number[],
  className: string,
  scale: number,
  offset: number,
};

export default ({ points, factors, className, scale, offset }: Props) => {
  let i = 0;
  const pointStrings = [];
  for (const factor of factors) {
    const x = round((factor * points[i].x) + scale + offset, 2);
    const y = round((factor * points[i++].y) + scale + offset, 2);
    pointStrings.push(`${x},${y}`);
  }

  return <polygon className={className} points={pointStrings.join(' ')} />;
};
