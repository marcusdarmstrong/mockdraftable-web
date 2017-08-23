// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Action } from '../redux/actions';
import type { Position, PositionId } from '../types/domain';
import { selectPosition as buildSelectPositionAction } from '../redux/actions';
import type { State } from '../types/state';

type Props = {
  selectedPosition: Position,
  positions: Array<Position>,
  selectPosition: PositionId => () => void,
};

const PositionSelector = ({ selectedPosition, positions, selectPosition }: Props) => {
  const parentPositions = positions.filter(
    position =>
      (selectedPosition.key.toString().startsWith(position.key.toString()) || position.id === 'ATH')
      && position.key !== selectedPosition.key,
  );
  const childPositions = positions.filter(
    position =>
      (((position.key.toString().length === selectedPosition.key.toString().length + 1)
        && position.key.toString().startsWith(selectedPosition.key.toString()))
          || (selectedPosition.id === 'ATH' && position.key < 10))
      && position.key !== selectedPosition.key,
  );

  return (<div>
    {parentPositions.map(position => (
      <div key={position.id} className="mb-2">
        <button
          type="button"
          className="btn mr-2"
          onClick={selectPosition(position.id)}
          style={{
            borderColor: position.color,
            color: position.color,
            backgroundColor: '#fff',
          }}
        >
          {position.abbreviation}
        </button>
        {position.name}
      </div>
    ))}
    <div className="mb-2">
      <button
        type="button"
        className="btn mr-2 active"
        style={{
          backgroundColor: selectedPosition.color,
          color: '#fff',
        }}
      >
        {selectedPosition.abbreviation}
      </button>
      <span className="h6">{selectedPosition.name}</span>
    </div>
    {childPositions.map(position => (
      <div key={position.id} className="ml-2 mb-2">
        {'\u21b3'}
        <button
          type="button"
          className="btn mr-2 ml-2"
          onClick={selectPosition(position.id)}
          style={{
            borderColor: position.color,
            color: position.color,
            backgroundColor: '#fff',
          }}
        >
          {position.abbreviation}
        </button>
        {position.name}
      </div>
    ))}
  </div>);
};

export default connect((state: State) => ({
  selectedPosition: state.positions[state.selectedPositionId],
  positions: Object.values(state.positions),
}), (dispatch: Dispatch<Action>) => ({
  selectPosition: positionId => () => {
    dispatch(buildSelectPositionAction(positionId));
  },
}))(PositionSelector);

