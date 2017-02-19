// @flow

import { connect } from 'react-redux';
import React from 'react';

import Comparison from './comparison';
import type { Player, Position } from '../types/domain';
import type { MeasurablePercentile } from '../types/graphing';

type Comparable = {
  player: Player,
  playerPosition: Position,
  percentiles: Array<MeasurablePercentile>,
  score: number,
};

type Props = {
  comparisons: Array<Comparable>,
  selectedPosition: Position,
};

const ComparisonList = ({ comparisons, selectedPosition }: Props) =>
  <div className="list-group">
    {comparisons && comparisons.map(comp => <Comparison
      key={comp.player.key}
      name={comp.player.name}
      playerPosition={comp.playerPosition}
      selectedPosition={selectedPosition}
      id={comp.player.id}
      percentiles={comp.percentiles}
      percentage={comp.score}
    />)}
  </div>;

export default connect(state => ({
  selectedPosition: state.positions[state.selectedPositionId],
  comparisons:
    state.comparisons[state.selectedPlayerId][state.selectedPositionId]
      .map(({ playerId, score }) => ({
        score,
        player: state.players[playerId],
        playerPosition: state.positions[state.players[playerId].positions.primary],
        percentiles:
          state.percentiles[playerId][state.selectedPositionId]
            .map(({ measurableKey, percentile }) => ({
              percentile,
              measurable: {
                id: measurableKey,
                name: state.measurables[measurableKey].name,
              },
            })),
      })),
}))(ComparisonList);
