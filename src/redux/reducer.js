// @flow

import type { State } from '../types/state';
import type { Action } from './actions';
import * as actions from './actions';

const reducer = (previousState: State, action: Action): State => {
  if (action.type === actions.LOAD_PLAYER) {
    return Object.assign(
      ({}: any),
      previousState,
      { players: Object.assign({}, previousState.players, { [action.player.id]: action.player }) },
    );
  }
  if (action.type === actions.LOAD_COMPARISONS) {
    return Object.assign(
      ({}: any),
      previousState,
      {
        comparisons: Object.assign({}, previousState.comparisons, {
          [action.playerId]: Object.assign({}, previousState.comparisons[action.playerId], {
            [action.positionId]: action.comparisons,
          }),
        }),
      },
    );
  }
  if (action.type === actions.LOAD_PERCENTILES) {
    return Object.assign(
      ({}: any),
      previousState,
      {
        percentiles: Object.assign({}, previousState.percentiles, {
          [action.playerId]: Object.assign({}, previousState.percentiles[action.playerId], {
            [action.positionId]: action.percentiles,
          }),
        }),
      },
    );
  }
  if (action.type === actions.UPDATE_SELECTED_PLAYER) {
    return Object.assign(
      ({}: any),
      previousState,
      {
        page: 'PLAYER',
        selectedPlayerId: action.playerId,
        selectedPositionId: action.positionId,
        modalType: previousState.modalType === 'TypeAhead' ? 'None' : previousState.modalType,
        typeAheadResults: [],
        typeAheadSearching: false,
      },
    );
  }
  if (action.type === actions.UPDATE_SELECTED_POSITION) {
    return Object.assign(({}: any), previousState, {
      page: 'POSITION',
      selectedPositionId: action.positionId,
    });
  }
  if (action.type === actions.UPDATE_SEARCH_OPTIONS) {
    return Object.assign(
      ({}: any),
      previousState,
      {
        page: 'SEARCH',
        searchOptions: action.options,
        isSearching: true,
        searchResults: {
          hasNextPage: false,
          players: [],
        },
        selectedPositionId: action.positionId,
      },
    );
  }
  if (action.type === actions.UPDATE_SEARCH_RESULTS) {
    return Object.assign(
      ({}: any),
      previousState, {
        searchResults: action.results,
        isSearching: false,
      },
    );
  }
  if (action.type === actions.UPDATE_MODAL_TYPE) {
    return Object.assign(({}: any), previousState, {
      modalType: action.modalType,
      typeAheadResults: [],
      typeAheadSearching: false,
    });
  }
  if (action.type === actions.UPDATE_TYPE_AHEAD_IS_SEARCHING) {
    if (action.isSearching) {
      return Object.assign(({}: any), previousState, {
        typeAheadSearching: true,
        typeAheadResults: [],
      });
    }
    return Object.assign(({}: any), previousState, {
      typeAheadSearching: false,
    });
  }
  if (action.type === actions.UPDATE_TYPE_AHEAD_RESULTS) {
    return Object.assign(
      ({}: any),
      previousState,
      { typeAheadResults: action.results, typeAheadSearching: false },
    );
  }
  if (action.type === actions.UPDATE_EMBED_PAGE) {
    return Object.assign(({}: any), previousState, { embed: true, embedPage: action.state });
  }
  if (action.type === actions.LOAD_DISTRIBUTION_STATISTICS) {
    return Object.assign(
      ({}: any),
      previousState,
      {
        distributionStatistics: Object.assign(
          {},
          previousState.distributionStatistics,
          {
            [action.positionId]: Object.assign(
              {},
              previousState.distributionStatistics[action.positionId],
              {
                [action.measurableKey]: action.stats,
              },
            ),
          },
        ),
      },
    );
  }
  if (action.type === actions.UPDATE_LOGGED_IN_USER) {
    return Object.assign(({}: any), previousState, { loggedInUserId: action.userId });
  }
  if (action.type === actions.UPDATE_PAGE) {
    return Object.assign(({}: any), previousState, { page: action.page });
  }
  return previousState;
};

export default reducer;

