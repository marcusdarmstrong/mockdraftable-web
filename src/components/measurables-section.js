// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { MeasurablePercentile } from '../types/graphing';
import type { Position, Measurement, Measurable, MeasurableKey } from '../types/domain';
import FullGraph from './graphs/full-graph';
import Measurables from './measurables';
import { format } from '../measurables';

type Props = {
  percentiles: Array<MeasurablePercentile>,
  measurements: Array<Measurement>,
  displayPosition: Position,
  measurables: { [key: MeasurableKey]: Measurable },
};

const MeasurablesSection = ({ measurements, percentiles, displayPosition, measurables }: Props) => {
  let nonCombine = false;
  const keyedMeasurements = measurements.reduce(
    (accum, { measurableKey, measurement, source }) => {
      const isNonCombine = source !== 1;
      nonCombine = nonCombine || isNonCombine;
      return Object.assign({}, accum, {
        [measurableKey]: format(measurement, measurables[measurableKey], isNonCombine),
      });
    },
    {},
  );
  const zippedMeasurements = percentiles.map(mwp => ({
    ...mwp,
    display: keyedMeasurements[mwp.measurable.id],
  }));
  return (<div>
    <h3>Measurables</h3>
    <h6 className="text-muted">Percentiles vs. {displayPosition.plural}</h6>
    <FullGraph percentiles={percentiles} color={displayPosition.color} />
    <Measurables measurements={zippedMeasurements} />
    {nonCombine &&
      <p className="text-center"><small>* Measurement from source other than the NFL Combine</small></p>
    }
  </div>);
};

export default connect(state => ({
  displayPosition: state.positions[state.selectedPositionId],
  measurements: state.players[state.selectedPlayerId].measurements,
  measurables: state.measurables,
  percentiles: state.percentiles[state.selectedPlayerId][state.selectedPositionId]
    .map(({ measurableKey, percentile }) => ({
      percentile,
      measurable: {
        id: measurableKey,
        name: state.measurables[measurableKey].name,
      },
    })),
}))(MeasurablesSection);
