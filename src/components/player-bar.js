// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import { updateModalType } from '../actions';

import type { Action } from '../actions';
import type { Position } from '../types/domain';
import type { State } from '../types/state';

type Props = {
  selectedPlayerName: string,
  selectedPosition: Position,
  openPositionSelector: () => void,
};

const PlayerBar = ({ selectedPlayerName, selectedPosition, openPositionSelector }: Props) =>
  <div className="row fixed-top p-2 pl-3 pr-3 mb-2 playerbar">
    <div className="col-12 d-flex justify-content-start col-lg-10 offset-lg-1">
      <div className="mb-0 mt-1 h3 align-bottom playerbar-name">
        {selectedPlayerName}
      </div>
      <div className="ml-auto">
        <button
          type="button"
          className="btn"
          onClick={() => openPositionSelector('PositionSelector')}
          style={{
            backgroundColor: selectedPosition.color,
            color: '#fff',
          }}
        >
          {selectedPosition.abbreviation}
        </button>
      </div>
    </div>
  </div>
;

export default connect(
  (state: State) => ({
    selectedPlayerName: state.players[state.selectedPlayerId].name,
    selectedPosition: state.positions[state.selectedPositionId],
  }),
  (dispatch: Dispatch<Action>) => ({
    openPositionSelector: () => dispatch(updateModalType('PositionSelector')),
  }),
)(PlayerBar);
