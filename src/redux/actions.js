// @flow

import type { Dispatch } from 'redux';
import type { ThunkAction } from 'redux-thunk';

import type { Player, PlayerId, PositionId, Comparisons, Percentiles, MeasurableKey, DistributionStatistics } from '../types/domain';
import type { Api } from '../types/api';
import type { UserId, State, SearchOptions, SearchResults, ModalType, EmbedPage } from '../types/state';

export const UPDATE_SELECTED_PLAYER = 'UPDATE_SELECTED_PLAYER';
export const UPDATE_SELECTED_POSITION = 'UPDATE_SELECTED_POSITION';
export const UPDATE_SEARCH_OPTIONS = 'UPDATE_SEARCH_OPTIONS';
export const LOAD_PLAYER = 'LOAD_PLAYER';
export const LOAD_COMPARISONS = 'LOAD_COMPARISONS';
export const LOAD_PERCENTILES = 'LOAD_PERCENTILES';
export const UPDATE_SEARCH_RESULTS = 'UPDATE_SEARCH_RESULTS';
export const UPDATE_IS_SEARCHING = 'UPDATE_IS_SEARCHING';
export const UPDATE_MODAL_TYPE = 'UPDATE_MODAL_TYPE';
export const UPDATE_TYPE_AHEAD_IS_SEARCHING = 'UPDATE_TYPE_AHEAD_IS_SEARCHING';
export const UPDATE_TYPE_AHEAD_RESULTS = 'UPDATE_TYPE_AHEAD_RESULTS';
export const UPDATE_EMBED_PAGE = 'UPDATE_EMBED_PAGE';
export const LOAD_DISTRIBUTION_STATISTICS = 'LOAD_DISTRIBUTION_STATISTICS';
export const UPDATE_LOGGED_IN_USER = 'UPDATE_LOGGED_IN_USER';

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

export const updateSearchResults = (newResults: SearchResults) => ({
  type: UPDATE_SEARCH_RESULTS,
  results: newResults,
});

export type UpdateSearchResultsAction = {
  type: 'UPDATE_SEARCH_RESULTS',
  results: SearchResults,
};

export const updateIsSearching = (isSearching: boolean) => ({
  type: 'UPDATE_IS_SEARCHING',
  isSearching,
});

export type UpdateIsSearchingAction = {
  type: 'UPDATE_IS_SEARCHING',
  isSearching: boolean,
};

export const updateModalType = (modalType: ModalType) => ({
  type: 'UPDATE_MODAL_TYPE',
  modalType,
});

export type UpdateModalTypeAction = {
  type: 'UPDATE_MODAL_TYPE',
  modalType: ModalType,
};

export const updateTypeAheadIsSearching = (isSearching: boolean) => ({
  type: 'UPDATE_TYPE_AHEAD_IS_SEARCHING',
  isSearching,
});

export type UpdateTypeAheadIsSearchingAction = {
  type: 'UPDATE_TYPE_AHEAD_IS_SEARCHING',
  isSearching: boolean,
};

export const updateTypeAheadResults = (results: Array<PlayerId>) => ({
  type: 'UPDATE_TYPE_AHEAD_RESULTS',
  results,
});

export type UpdateTypeAheadResultsAction = {
  type: 'UPDATE_TYPE_AHEAD_RESULTS',
  results: Array<PlayerId>,
};

export const updateEmbedPage = (state: EmbedPage) => ({
  type: 'UPDATE_EMBED_PAGE',
  state,
});

export type UpdateEmbedPageAction = {
  type: 'UPDATE_EMBED_PAGE',
  state: EmbedPage,
};

export const updateLoggedInUserId = (userId: ?UserId) => ({
  type: UPDATE_LOGGED_IN_USER,
  userId,
});

export type UpdateLoggedInUserIdAction = {
  type: 'UPDATE_LOGGED_IN_USER',
  userId: ?UserId,
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

export const loadDistributionStatistics =
  (positionId: PositionId, measurableKey: MeasurableKey, stats: DistributionStatistics) => ({
    type: LOAD_DISTRIBUTION_STATISTICS,
    positionId,
    measurableKey,
    stats,
  });

export type LoadDistributionStatisticsAction = {
  type: 'LOAD_DISTRIBUTION_STATISTICS',
  positionId: PositionId,
  measurableKey: MeasurableKey,
  stats: DistributionStatistics,
};

export type Action =
  UpdateSelectedPlayerAction
  | UpdateSelectedPositionAction
  | UpdateSearchOptionsAction
  | UpdateSearchResultsAction
  | UpdateIsSearchingAction
  | UpdateModalTypeAction
  | UpdateTypeAheadIsSearchingAction
  | UpdateTypeAheadResultsAction
  | UpdateEmbedPageAction
  | UpdateLoggedInUserIdAction
  | LoadPlayerAction
  | LoadComparisonsAction
  | LoadPercentilesAction
  | LoadDistributionStatisticsAction
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

export const doSearch = (options: SearchOptions, positionId: PositionId) =>
  async (dispatch: Dispatch<Action>, getState: () => State, api: Api) => {
    dispatch(updateIsSearching(true));
    dispatch(updateSearchOptions(options));
    dispatch(updateSelectedPosition(positionId));
    const results = await api.fetchSearchResults(options, positionId);
    const newState = getState();
    if (newState.page === 'SEARCH' && newState.searchOptions === options) {
      await Promise.all(
        results.players.map(id => dispatch(loadPlayerIfNeeded(id)))
          .concat(results.players.map(id => dispatch(loadPercentilesIfNeeded(id, positionId)))),
      );
      dispatch(updateSearchResults(results));
      dispatch(updateIsSearching(false));
    }
  };

export const selectNewSearch = (options: SearchOptions) =>
  async (dispatch: Dispatch<Action>, getState: () => State) => {
    await dispatch(doSearch(options, getState().selectedPositionId));
  };

export const selectDistributionStats = (positionId: PositionId) =>
  async (dispatch: Dispatch<Action>, getState: () => State, api: Api) => {
    const results = await api.fetchDistributionStats(positionId);
    Object.entries(results)
      .forEach(entry =>
        dispatch(
          loadDistributionStatistics(
            positionId,
            ((Number(entry[0])): MeasurableKey),
            ((entry[1]: any): DistributionStatistics),
          ),
        ),
      );
    dispatch(updateSelectedPosition(positionId));
  };

export const selectPosition = (positionId: PositionId) =>
  async (dispatch: Dispatch<Action>, getState: () => State) => {
    const state = getState();
    if (state.page === 'PLAYER') {
      await dispatch(selectPlayer(state.selectedPlayerId, positionId));
    } else if (state.page === 'SEARCH') {
      await dispatch(doSearch(Object.assign({}, state.searchOptions, { page: 1 }), positionId));
    } else {
      await dispatch(selectDistributionStats(positionId));
    }
  };

export const selectTypeAheadSearch = (search: string) =>
  async (dispatch: Dispatch<Action>, getState: () => State, api: Api) => {
    dispatch(updateTypeAheadIsSearching(true));
    const results = await api.fetchTypeAheadResults(search);
    if (getState().typeAheadSearching) {
      await Promise.all(results.map(id => dispatch(loadPlayerIfNeeded(id))));
      dispatch(updateTypeAheadResults(results));
      dispatch(updateTypeAheadIsSearching(false));
    }
  };

export const logout = () =>
  async (dispatch: Dispatch<Action>, getState: () => State, api: Api) => {
    dispatch(updateLoggedInUserId(null));
    await api.logout();
  };
