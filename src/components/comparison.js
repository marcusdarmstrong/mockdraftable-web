// @flow

import React from 'react';
import Link from './link';
import SparkGraph from './graphs/spark-graph';
import type { Position } from '../types/domain';
import type { MeasurablePercentile } from '../types/graphing';

type Props = {
  name: string,
  playerPosition: Position,
  selectedPosition: Position,
  id: string,
  percentiles: Array<MeasurablePercentile>,
  percentage: number,
  school?: string,
  draft: number,
};

const Comparison =
  ({ name, playerPosition, selectedPosition, id, percentiles, percentage, school, draft }: Props) =>
    (
      <Link href={`/player/${id}`} className="list-group-item list-group-item-action d-flex justify-content-between">
        <div className="list-group-item-text mt-1">
          <h5 className="list-group-item-heading text-dark mb-0">{name}</h5>
          <span
            className="badge"
            title={playerPosition.name}
            style={{ backgroundColor: playerPosition.color, color: '#fff' }}
          >
            {playerPosition.abbreviation}
          </span>
          <span className="align-middle ml-2">{school !== undefined && `${school},`} {draft}</span>
        </div>
        <SparkGraph percentiles={percentiles} overlay={`${percentage}%`} color={selectedPosition.color} />
      </Link>
    );

Comparison.defaultProps = {
  school: undefined,
};

export default Comparison;
