// @flow

import React from 'react';
import type { Point } from '../../types/graphing';
import round from '../../util/round';

type Props = {
  id: number,
  name: string,
  scale: number,
  offset: number,
  point: Point,
};

const generateLine = (scale, offset, point: Point) => {
  const scaleFactor = scale + offset;
  const xDest = round(point.x + scaleFactor, 2);
  const yDest = round(point.y + scaleFactor, 2);
  return `M${xDest} ${yDest}L ${scaleFactor} ${scaleFactor} Z`;
};

export default ({ id, name, scale, offset, point }: Props) => (<g>
  <path id={`m${id}`} d={generateLine(scale, offset, point)} />
  <text className="measurable" dy="-.25em">
    <textPath spacing="auto" startOffset={offset * 2} xlinkHref={`#m${id}`}>{name}</textPath>
  </text>
</g>);
