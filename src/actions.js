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
export const UPDATE_SEARCH_RESULTS = 'UPDATE_SEARCH_RESULTS';

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

export const updateSearchResults = (newResults: Array<PlayerId>) => ({
  type: UPDATE_SEARCH_RESULTS,
  results: newResults,
});

export type UpdateSearchResultsAction = {
  type: 'UPDATE_SEARCH_RESULTS',
  results: Array<PlayerId>,
};

export type LoadPlayerAction = {
  type: 'LOAD_PLAYER',
  player: Player,
};

export const loadPlayer = (player: Player): LoadPlayerAction => ({
  type: LOAD_PLAYER,
  player,
});

export type LoadComparisonsAction = {
  type: 'LOAD_COMPARISONS',
  playerId: PlayerId,
  positionId: PositionId,
  comparisons: Comparisons,
};

export const loadComparisons =
  (playerId: PlayerId, positionId: PositionId, comparisons: Comparisons): LoadComparisonsAction =>
    ({
      type: LOAD_COMPARISONS,
      playerId,
      positionId,
      comparisons,
    });

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
  | UpdateSearchResultsAction
  | LoadPlayerAction
  | LoadComparisonsAction
  | LoadPercentilesAction
  | ThunkAction;

type Dispatcher = Dispatch<Action>;

const loadPlayerIfNeeded = (id: PlayerId) =>
  async (dispatch: Dispatcher, getState: () => State, api: Api) => {
    const state = getState();
    if (!state.players[id]) {
      dispatch(loadPlayer(await api.fetchPlayer(id)));
    }
  };

const loadPercentilesIfNeeded = (id: PlayerId, pos: PositionId) =>
  async (dispatch: Dispatcher, getState: () => State, api: Api) => {
    const state = getState();
    if (!state.percentiles[id] || !state.percentiles[id][pos]) {
      dispatch(loadPercentiles(id, pos, await api.fetchPercentiles(id, pos)));
    }
  };

const loadComparisonsIfNeeded = (id: PlayerId, pos: PositionId) =>
  async (dispatch: Dispatcher, getState: () => State, api: Api) => {
    const state = getState();
    if (!state.comparisons[id] || !state.comparisons[id][pos]) {
      dispatch(loadComparisons(id, pos, await api.fetchComparisons(id, pos)));
    }
  };

export const selectPlayer = (id: PlayerId, positionIdOverride: ?PositionId) =>
  async (dispatch: Dispatch<Action>, getState: () => State) => {
    await dispatch(loadPlayerIfNeeded(id));
    const player = getState().players[id];
    const positionId = positionIdOverride || player.positions.primary;
    await dispatch(loadComparisonsIfNeeded(id, positionId));
    const comparisons = getState().comparisons[id][positionId];

    await Promise.all(
      [dispatch(loadPercentilesIfNeeded(id, positionId))]
        .concat(comparisons.map(c => dispatch(loadPlayerIfNeeded(c.playerId))))
        .concat(comparisons.map(c => dispatch(loadPercentilesIfNeeded(c.playerId, positionId)))),
    );

    dispatch(updateSelectedPosition(positionId));
    dispatch(updateSelectedPlayer(id));
  };

export const selectNewSearch = (options: SearchOptions) =>
  async (dispatch: Dispatch<Action>, getState: () => State, api: Api) => {
    const pos = getState().selectedPositionId;
    const playerIds = await api.fetchSearchResults(options, pos);
    await Promise.all(
      playerIds.map(id => dispatch(loadPlayerIfNeeded(id)))
        .concat(playerIds.map(id => dispatch(loadPercentilesIfNeeded(id, pos)))),
    );
    dispatch(updateSearchOptions(options));
    dispatch(updateSearchResults(playerIds));
  };
