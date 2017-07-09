// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { MeasurablePercentile } from '../types/graphing';
import type { PlayerPageState, EmbedPage } from '../types/state';
import type { Player, Position, MeasurableKey, Measurable } from '../types/domain';
import FullGraph from './graphs/full-graph';
import Measurables from './measurables';
import { format } from '../measurables';
import ComparisonSection from './comparison-section';
import Link from './link';

type Props = {
  selectedPlayer: Player,
  selectedPosition: Position,
  measurables: { [key: MeasurableKey]: Measurable },
  percentiles: Array<MeasurablePercentile>,
  embedPage: EmbedPage,
};

const EmbededPlayer = ({
  selectedPlayer,
  selectedPosition,
  percentiles,
  measurables,
  embedPage,
}: Props) => {
  const keyedMeasurements: { [MeasurableKey]: string } = selectedPlayer.measurements
    .reduce((a, { measurableKey, measurement }) =>
      Object.assign({}, a, { [measurableKey]: format(measurement, measurables[measurableKey]) }),
      {},
    );

  const zippedMeasurements = percentiles.map(mwp => ({
    ...mwp,
    display: keyedMeasurements[mwp.measurable.id],
  }));

  let body = <div />;
  if (embedPage === 'GRAPH') {
    body = (
      <div className="card-block">
        <FullGraph percentiles={percentiles} color={selectedPosition.color} />
      </div>
    );
  } else if (embedPage === 'COMPARISONS') {
    body = (
      <div className="card-block">
        <ComparisonSection count={5} />
      </div>
    );
  } else {
    body = (
      <div className="card-block">
        <Measurables measurements={zippedMeasurements} />
      </div>
    );
  }

  const baseUrl = `/embed/${selectedPlayer.id}?position=${selectedPosition.id}&page=`;

  /* eslint-disable jsx-a11y/href-no-hash */
  return (<div className="card mx-auto" style={{ maxWidth: '480px', height: '651px' }}>
    <div className="card-header">
      <h4 className="card-title mb-1">
        {selectedPlayer.name}
        <span
          className="badge float-right"
          style={{ backgroundColor: selectedPosition.color }}
        >
          {selectedPosition.abbreviation}
        </span>
      </h4>
    </div>
    {body}
    <div className="card-footer text-muted">
      <ul className="nav nav-pills card-footer-pills">
        <li className="nav-item">
          {embedPage === 'GRAPH'
            ? <span className="nav-link active" href="#">Graph</span>
            : <Link className="nav-link" href={`${baseUrl}GRAPH`}>Graph</Link>
          }
        </li>
        <li className="nav-item">
          {embedPage === 'MEASURABLES'
            ? <span className="nav-link active" href="#">Measurables</span>
            : <Link className="nav-link" href={`${baseUrl}MEASURABLES`}>Measurables</Link>
          }
        </li>
        <li className="nav-item">
          {embedPage === 'COMPARISONS'
            ? <span className="nav-link active" href="#">Comparisons</span>
            : <Link className="nav-link" href={`${baseUrl}COMPARISONS`}>Comparisons</Link>
          }
        </li>
      </ul>
      <p className="mb-0 mt-1 text-center">
        <small>See more player measurables at
        <a href="http://www.mockdraftable.com" target="_new"> MockDraftable.com</a></small>
      </p>
    </div>
  </div>);
  /* eslint-enable jsx-a11y/href-no-hash */
};

export default connect(
  (state: PlayerPageState) => ({
    selectedPlayer: state.players[state.selectedPlayerId],
    selectedPosition: state.positions[state.selectedPositionId],
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
    embedPage: state.embedPage,
  }),
)(EmbededPlayer);
