// @flow

import { positions } from '../positions';
import { measurablesByKey } from '../measurables';
import type { PositionEligibilityStore } from '../types/domain';
import type { State } from '../types/state';

const defaultState = (positionEligibilityStore: PositionEligibilityStore): State => {
  const validPositions = positions.filter(pos => !!positionEligibilityStore.get(pos.id));
  const posById = validPositions.reduce((a, pos) => Object.assign({}, a, { [pos.id]: pos }), {});
  return {
    page: 'HOME',
    measurables: measurablesByKey,
    positions: posById,
    comparisons: {},
    percentiles: {},
    players: {},
    selectedPositionId: 'ATH',
    modalType: 'None',
    embed: false,
    distributionStatistics: {},
    loggedInUserId: null,
  };
};

export default defaultState;
