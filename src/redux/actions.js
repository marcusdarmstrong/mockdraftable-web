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
export const LOAD_MULTIPLE_PLAYERS = 'LOAD_MULTIPLE_PLAYERS';
export const LOAD_MULTIPLE_PERCENTILES = 'LOAD_MULTIPLE_PERCENTILES';
export const UPDATE_SEARCH_RESULTS = 'UPDATE_SEARCH_RESULTS';
export const UPDATE_MODAL_TYPE = 'UPDATE_MODAL_TYPE';
export const UPDATE_TYPE_AHEAD_IS_SEARCHING = 'UPDATE_TYPE_AHEAD_IS_SEARCHING';
export const UPDATE_TYPE_AHEAD_RESULTS = 'UPDATE_TYPE_AHEAD_RESULTS';
export const UPDATE_EMBED_PAGE = 'UPDATE_EMBED_PAGE';
export const LOAD_DISTRIBUTION_STATISTICS = 'LOAD_DISTRIBUTION_STATISTICS';
export const UPDATE_LOGGED_IN_USER = 'UPDATE_LOGGED_IN_USER';
export const UPDATE_PAGE = 'UPDATE_PAGE';

export const updateSelectedPlayer = (id: PlayerId, positionId: PositionId) => ({
  type: UPDATE_SELECTED_PLAYER,
  playerId: id,
  positionId,
});

export type UpdateSelectedPlayerAction = {
  type: 'UPDATE_SELECTED_PLAYER',
  playerId: PlayerId,
  positionId: PositionId,
};

export const updateSelectedPosition = (positionId: PositionId) => ({
  type: UPDATE_SELECTED_POSITION,
  positionId,
});

export type UpdateSelectedPositionAction = {
  type: 'UPDATE_SELECTED_POSITION',
  positionId: PositionId,
};

export const updateSearchOptions = (newOptions: SearchOptions, positionId: PositionId) => ({
  type: UPDATE_SEARCH_OPTIONS,
  options: newOptions,
  positionId,
});

export type UpdateSearchOptionsAction = {
  type: 'UPDATE_SEARCH_OPTIONS',
  options: SearchOptions,
  positionId: PositionId,
};

export const updateSearchResults = (newResults: SearchResults) => ({
  type: UPDATE_SEARCH_RESULTS,
  results: newResults,
});

export type UpdateSearchResultsAction = {
  type: 'UPDATE_SEARCH_RESULTS',
  results: SearchResults,
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

export const updatePage = (page: string) => ({
  type: UPDATE_PAGE,
  page,
});

export type UpdatePageAction = {
  type: 'UPDATE_PAGE',
  page: string,
};

export type LoadPlayerAction = {
  type: 'LOAD_PLAYER',
  player: Player,
};

export const loadPlayer = (player: Player): LoadPlayerAction => ({
  type: LOAD_PLAYER,
  player,
});

export type LoadMultiplePlayersAction = {
  type: 'LOAD_MULTIPLE_PLAYERS',
  players: Array<Player>,
};

export const loadMultiplePlayers = (players: Array<Player>): LoadMultiplePlayersAction => ({
  type: LOAD_MULTIPLE_PLAYERS,
  players,
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

export const loadMultiplePercentiles =
  (percentiles: { [PlayerId]: Percentiles }, positionId: PositionId) => ({
    type: LOAD_MULTIPLE_PERCENTILES,
    percentiles,
    positionId,
  });

export type LoadMultiplePercentilesAction = {
  type: 'LOAD_MULTIPLE_PERCENTILES',
  percentiles: { [PlayerId]: Percentiles },
  positionId: PositionId,
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
  | UpdateModalTypeAction
  | UpdateTypeAheadIsSearchingAction
  | UpdateTypeAheadResultsAction
  | UpdateEmbedPageAction
  | UpdateLoggedInUserIdAction
  | LoadPlayerAction
  | LoadComparisonsAction
  | LoadDistributionStatisticsAction
  | LoadMultiplePlayersAction
  | LoadMultiplePercentilesAction
  | ThunkAction;

type Dispatcher = Dispatch<Action>;

const loadPlayerIfNeeded = (id: PlayerId) =>
  async (dispatch: Dispatcher, getState: () => State, api: Api) => {
    const state = getState();
    if (!state.players[id]) {
      dispatch(loadPlayer(await api.fetchPlayer(id)));
    }
  };

const loadComparisonsIfNeeded = (id: PlayerId, pos: PositionId) =>
  async (dispatch: Dispatcher, getState: () => State, api: Api) => {
    const state = getState();
    if (!state.comparisons[id] || !state.comparisons[id][pos]) {
      dispatch(loadComparisons(id, pos, await api.fetchComparisons(id, pos)));
    }
  };

const getMissingPercentiles = (state, positionId, playerIds) =>
  playerIds.reduce((accum, playerId) => {
    if (!state.percentiles[playerId] || !state.percentiles[playerId][positionId]) {
      accum.push(playerId);
    }
    return accum;
  }, []);

const getMissingPlayers = (state, playerIds) =>
  playerIds.reduce((accum, playerId) => {
    if (!state.players[playerId]) {
      accum.push(playerId);
    }
    return accum;
  }, []);

export const selectPlayer = (id: PlayerId, positionIdOverride: ?PositionId) =>
  async (dispatch: Dispatch<Action>, getState: () => State, api: Api) => {
    await dispatch(loadPlayerIfNeeded(id));
    const player = getState().players[id];
    const positionId = positionIdOverride || player.positions.primary;
    await dispatch(loadComparisonsIfNeeded(id, positionId));
    const state = getState();
    const comparisons = state.comparisons[id][positionId];

    const allPlayerIds = comparisons.map(c => c.playerId);
    const missingPlayers = getMissingPlayers(state, allPlayerIds);
    const missingPercentiles = getMissingPercentiles(state, positionId, allPlayerIds.concat(id));

    const [players, percentiles] = await Promise.all([
      api.fetchMultiplePlayers(missingPlayers),
      api.fetchMultiplePercentiles(missingPercentiles, positionId),
    ]);

    dispatch(loadMultiplePlayers(players));
    dispatch(loadMultiplePercentiles(percentiles, positionId));

    dispatch(updateSelectedPlayer(id, positionId));
  };

export const doSearch = (options: SearchOptions, positionId: PositionId) =>
  async (dispatch: Dispatch<Action>, getState: () => State, api: Api) => {
    dispatch(updateSearchOptions(options, positionId));
    const results = await api.fetchSearchResults(options, positionId);
    const newState = getState();
    if (newState.page === 'SEARCH' && newState.searchOptions === options) {
      const missingPlayers = getMissingPlayers(newState, results.players);
      const missingPercentiles = getMissingPercentiles(newState, positionId, results.players);

      const [players, percentiles] = await Promise.all([
        api.fetchMultiplePlayers(missingPlayers),
        api.fetchMultiplePercentiles(missingPercentiles, positionId),
      ]);

      dispatch(loadMultiplePlayers(players));
      dispatch(loadMultiplePercentiles(percentiles, positionId));
      dispatch(updateSearchResults(results));
    }
  };

export const selectNewSearch = (options: SearchOptions) =>
  async (dispatch: Dispatch<Action>, getState: () => State) => {
    await dispatch(doSearch(options, getState().selectedPositionId));
  };

export const selectDistributionStats = (positionId: PositionId) =>
  async (dispatch: Dispatch<Action>, getState: () => State, api: Api) => {
    const results = await api.fetchDistributionStats(positionId);
    Object.entries(results).forEach(entry =>
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
      dispatch(
        loadMultiplePlayers(
          await api.fetchMultiplePlayers(getMissingPlayers(getState(), results)),
        ),
      );
      dispatch(updateTypeAheadResults(results));
    }
  };

export const logout = () =>
  async (dispatch: Dispatch<Action>, getState: () => State, api: Api) => {
    dispatch(updateLoggedInUserId(null));
    await api.logout();
  };
