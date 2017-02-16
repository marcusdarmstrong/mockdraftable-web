// @flow

import { Map } from 'immutable';
import type { State } from './types/state';
import type { Action } from './actions';
import * as actions from './actions';

export default (previousState: State, action: Action): State => {
  if (action.type === actions.LOAD_PLAYER) {
    return Object.assign(
      {},
      previousState,
      { players: previousState.players.set(action.player.id, action.player) },
    );
  }
  if (action.type === actions.LOAD_COMPARISONS) {
    return Object.assign(
      {},
      previousState,
      {
        comparisons: previousState.comparisons.set(
          action.playerId,
          previousState.comparisons.get(action.playerId, Map())
            .set(action.positionId, action.comparisons),
        ),
      },
    );
  }
  if (action.type === actions.LOAD_PERCENTILES) {
    return Object.assign(
      {},
      previousState,
      {
        percentiles: previousState.percentiles.set(
          action.playerId,
          previousState.percentiles.get(action.playerId, Map())
            .set(action.positionId, action.percentiles),
        ),
      },
    );
  }
  if (action.type === actions.UPDATE_SELECTED_PLAYER) {
    return Object.assign({}, previousState, { selectedPlayerId: action.playerId });
  }
  if (action.type === actions.UPDATE_SELECTED_POSITION) {
    return Object.assign({}, previousState, { selectedPositionId: action.positionId });
  }
  if (action.type === actions.UPDATE_SEARCH_OPTIONS) {
    return Object.assign({}, previousState, { search: action.options });
  }
  return previousState;
};
