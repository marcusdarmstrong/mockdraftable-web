// @flow

import type { State } from '../types/state';
import { selectDistributionStats } from '../redux/actions';

const name = 'POSITION';

const url = (state: State) => {
  if (state.page === name) {
    let newUrl = '/positions';
    if (state.selectedPositionId !== 'ATH') {
      newUrl = `${newUrl}?position=${state.selectedPositionId}`;
    }
    return newUrl;
  }
  return null;
};

const title = (state: State) => {
  if (state.page === name) {
    return `${state.positions[state.selectedPositionId].plural} - MockDraftable`;
  }
  return null;
};

const actions = (path: string, args: { [string]: string }) =>
  path === '/positions' ? [selectDistributionStats(args.position || 'ATH')] : null;

export { url, title, actions, name };
