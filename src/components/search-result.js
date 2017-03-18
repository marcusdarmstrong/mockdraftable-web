// @flow

import React from 'react';
import SparkGraph from './graphs/spark-graph';
import type { Position } from '../types/domain';
import type { MeasurablePercentile } from '../types/graphing';

type Props = {
  name: string,
  playerPosition: Position,
  selectedPosition: Position,
  id: string,
  percentiles: Array<MeasurablePercentile>,
  measurable?: string,
  school?: string,
  draft: number,
};

const SearchResult =
  ({ name, playerPosition, selectedPosition, id, percentiles, measurable, school, draft }: Props) =>
    <a
      href={`/player/${id}?position=${selectedPosition.id}`}
      className="list-group-item list-group-item-action justify-content-between"
    >
      <div className="list-group-item-text">
        <h5 className="list-group-item-heading mb-0">{name}</h5>
        <span
          className="badge"
          title={playerPosition.name}
          style={{ backgroundColor: playerPosition.color, color: '#fff' }}
        >
          {playerPosition.abbreviation}
        </span>
        <span className="align-middle ml-2">{school && `${school}, `}{draft}</span>
      </div>
      <SparkGraph percentiles={percentiles} overlay={measurable} color={selectedPosition.color} />
    </a>;

SearchResult.defaultProps = {
  measurable: undefined,
  school: undefined,
};

export default SearchResult;
