// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Action } from '../actions';
import type { MeasurablePercentile } from '../types/graphing';
import type { EmbedPage } from '../types/state';
import type { Player, Position, MeasurableKey, Measurable } from '../types/domain';
import FullGraph from './graphs/full-graph';
import Measurables from './measurables';
import { format } from '../measurables';
import { updateEmbedPage as doUpdateEmbedPage } from '../actions';
import ComparisonSection from './comparison-section';

type Props = {
  selectedPlayer: Player,
  selectedPosition: Position,
  measurables: { [key: MeasurableKey]: Measurable },
  percentiles: Array<MeasurablePercentile>,
  embedPage: EmbedPage,
  updateEmbedPage: EmbedPage => void,
};

const EmbededPlayer = ({
  selectedPlayer,
  selectedPosition,
  percentiles,
  measurables,
  embedPage,
  updateEmbedPage,
}: Props) => {
  const keyedMeasurements = selectedPlayer.measurements
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

  /* eslint-disable jsx-a11y/href-no-hash */
  return (<div className="card" style={{ width: '480px' }}>
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
            ? <a className="nav-link active" href="#">Graph</a>
            : <a className="nav-link" href="#" onClick={updateEmbedPage('GRAPH')}>Graph</a>
          }
        </li>
        <li className="nav-item">
          {embedPage === 'MEASURABLES'
            ? <a className="nav-link active" href="#">Measurables</a>
            : <a className="nav-link" href="#" onClick={updateEmbedPage('MEASURABLES')}>Measurables</a>
          }
        </li>
        <li className="nav-item">
          {embedPage === 'COMPARISONS'
            ? <a className="nav-link active" href="#">Comparisons</a>
            : <a className="nav-link" href="#" onClick={updateEmbedPage('COMPARISONS')}>Comparisons</a>
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
  state => ({
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
  (dispatch: Dispatch<Action>) => ({
    updateEmbedPage: state => () => dispatch(doUpdateEmbedPage(state)),
  }),
)(EmbededPlayer);
