// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Player, PositionId, Position } from '../types/domain';
import type { State } from '../types/state';
import type { Action } from '../redux/actions';
import { selectTypeAheadSearch } from '../redux/actions';

type Props = {
  updateSearch: string => void,
  searchResults: Array<Player>,
  positions: { [PositionId]: Position }
};

const TypeAhead = ({ updateSearch, searchResults, positions }: Props) => <div>
  <input
    type="text"
    className="form-control form-control-lg"
    placeholder="Player Name..."
    onChange={(event: SyntheticInputEvent) => updateSearch(event.target.value)}
    autoFocus
  />
  <div className="list-group mt-2">
    {searchResults.map(p =>
      <a
        key={p.id}
        href={`/player/${p.id}`}
        className="list-group-item list-group-item-action justify-content-between"
      >
        <div className="list-group-item-text">
          <h5 className="list-group-item-heading mb-0">{p.name}</h5>
          <span
            className="badge"
            title={positions[p.positions.primary].name}
            style={{ backgroundColor: positions[p.positions.primary].color, color: '#fff' }}
          >
            {positions[p.positions.primary].abbreviation}
          </span>
          <span className="align-middle ml-2">{p.school && `${p.school},`} {p.draft}</span>
        </div>
      </a>,
    )}
  </div>
</div>;

export default connect(
  (state: State) => ({
    searchResults: state.typeAheadResults
      ? state.typeAheadResults.map(id => state.players[id])
      : [],
    positions: state.positions,
  }),
  (dispatch: Dispatch<Action>) => ({
    updateSearch: search => dispatch(selectTypeAheadSearch(search)),
  }),
)(TypeAhead);
