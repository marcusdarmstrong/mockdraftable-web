// @flow

import type { Dispatch } from 'redux';
import type { ThunkAction } from 'redux-thunk';

import type { Player, PlayerId, PositionId, Comparisons, Percentiles } from './types/domain';
import type { Api } from './types/api';
import type { State, SearchOptions } from './types/state';

export const UPDATE_SELECTED_PLAYER = 'UPDATE_SELECTED_PLAYER';
export const UPDATE_SELECTED_POSITION = 'UPDATE_SELECTED_POSITION';
export const UPDATE_SEARCH_OPTIONS = 'UPDATE_SEARCH_OPTIONS';
export const LOAD_PLAYER = 'LOAD_PLAYER';
export const LOAD_COMPARISONS = 'LOAD_COMPARISONS';
export const LOAD_PERCENTILES = 'LOAD_PERCENTILES';

export const updateSelectedPlayer = (id: PlayerId) => ({
  type: UPDATE_SELECTED_PLAYER,
  playerId: id,
});

export type UpdateSelectedPlayerAction = {
  type: 'UPDATE_SELECTED_PLAYER',
  playerId: PlayerId,
};

export const updateSelectedPosition = (positionId: PositionId) => ({
  type: UPDATE_SELECTED_POSITION,
  positionId,
});

export type UpdateSelectedPositionAction = {
  type: 'UPDATE_SELECTED_POSITION',
  positionId: PositionId,
};

export const updateSearchOptions = (newOptions: SearchOptions) => ({
  type: UPDATE_SEARCH_OPTIONS,
  options: newOptions,
});

export type UpdateSearchOptionsAction = {
  type: 'UPDATE_SEARCH_OPTIONS',
  options: SearchOptions,
};

export const loadPlayer = (player: Player) => ({
  type: LOAD_PLAYER,
  player,
});

export type LoadPlayerAction = {
  type: 'LOAD_PLAYER',
  player: Player,
};

export const loadComparisons =
  (playerId: PlayerId, positionId: PositionId, comparisons: Comparisons) => ({
    type: LOAD_COMPARISONS,
    playerId,
    positionId,
    comparisons,
  });

export type LoadComparisonsAction = {
  type: 'LOAD_COMPARISONS',
  playerId: PlayerId,
  positionId: PositionId,
  comparisons: Comparisons,
};

export const loadPercentiles =
  (playerId: PlayerId, positionId: PositionId, percentiles: Percentiles) => ({
    type: LOAD_PERCENTILES,
    playerId,
    positionId,
    percentiles,
  });

export type LoadPercentilesAction = {
  type: 'LOAD_PERCENTILES',
  playerId: PlayerId,
  positionId: PositionId,
  percentiles: Percentiles,
};

export type Action =
  UpdateSelectedPlayerAction
  | UpdateSelectedPositionAction
  | UpdateSearchOptionsAction
  | LoadPlayerAction
  | LoadComparisonsAction
  | LoadPercentilesAction
  | ThunkAction;

export const selectPlayer = (id: PlayerId, positionIdOverride: ?PositionId) =>
  async (dispatch: Dispatch<Action>, getState: () => State, api: Api) => {
    const state = getState();
    const player = state.players[id] || await api.fetchPlayer(id);
    const positionId = positionIdOverride || player.positions.primary;
    const comparisons = ((state.comparisons[id] || {})[positionId])
      || await api.fetchComparisons(id, positionId);

    await Promise.all([
      dispatch(loadPlayer(player)),
      dispatch(loadComparisons(
        id,
        positionId,
        comparisons,
      )),
      dispatch(loadPercentiles(
        id,
        positionId,
        ((state.percentiles[id] || {})[positionId])
          || await api.fetchPercentiles(id, positionId),
      )),
    ].concat(comparisons.map(async c => [
      dispatch(loadPlayer(state.players[c.playerId] || await api.fetchPlayer(c.playerId))),
      dispatch(loadPercentiles(
        c.playerId,
        positionId,
        ((state.percentiles[c.playerId] || {})[positionId])
          || await api.fetchPercentiles(c.playerId, positionId),
      )),
    ])));
    dispatch(updateSelectedPosition(positionId));
    dispatch(updateSelectedPlayer(id));
  };

export const selectNewSearch = (options: SearchOptions) =>
  async (dispatch: Dispatch<Action>, getState: () => State, api: Api) => {
    await api.fetchSearchResults(options, getState().selectedPositionId);
    dispatch(updateSearchOptions(options));
  };
