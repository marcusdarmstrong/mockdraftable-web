// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { MeasurablePercentile } from '../types/graphing';
import type { Position, Measurement, Measurable, MeasurableKey } from '../types/domain';
import { Units } from '../types/domain';
import FullGraph from './graphs/full-graph';
import Measurables from './measurables';

type Props = {
  percentiles: Array<MeasurablePercentile>,
  measurements: Array<Measurement>,
  displayPosition: Position,
  measurables: Map<MeasurableKey, Measurable>,
};

const d = (measurement, measurable: ?Measurable) => {
  const unit = measurable ? measurable.unit : undefined;
  if (unit === Units.INCHES) {
    return `${measurement}"`;
  } else if (unit === Units.SECONDS) {
    return `${measurement}s`;
  } else if (unit === Units.POUNDS) {
    return `${measurement} lbs`;
  } else if (unit === Units.REPS) {
    return `${measurement} reps`;
  }
  return measurement;
};

const MeasurablesSection = ({ measurements, percentiles, displayPosition, measurables }: Props) => {
  const keyedMeasurements = measurements.reduce((a, { measurableKey, measurement }) =>
    Object.assign({}, a, { [measurableKey]: d(measurement, measurables.get(measurableKey)) }),
    {},
  );
  const zippedMeasurements = percentiles.map(mwp => ({
    ...mwp,
    display: keyedMeasurements[mwp.measurable.id],
  }));
  return (<div>
    <h3>Measurables</h3>
    <h6 className="text-muted">Percentiles vs. {displayPosition.name}s</h6>
    <FullGraph percentiles={percentiles} color={displayPosition.color} />
    <Measurables measurements={zippedMeasurements} />
  </div>);
};

export default connect(state => ({
  displayPosition: state.positions.get(state.selectedPositionId),
  measurements: state.players.get(state.selectedPlayerId).measurements,
  measurables: state.measurables,
  percentiles: state.percentiles
    .get(state.selectedPlayerId)
    .get(state.selectedPositionId)
    .map(({ measurableKey, percentile }) => ({
      percentile,
      measurable: {
        id: measurableKey,
        name: state.measurables.get(measurableKey).name,
      },
    })),
}))(MeasurablesSection);
