// @flow

import type { State } from '../types/state';
import { selectPlayer, updateEmbedPage } from '../redux/actions';
import { name } from './player-route';

const url = (state: State) => {
  if (state.page === name && state.embedPage) {
    let newUrl = `/embed/${state.selectedPlayerId}?page=${state.embedPage}`;
    if (state.selectedPositionId !== state.players[state.selectedPlayerId].positions.primary) {
      newUrl = `${newUrl}&position=${state.selectedPositionId}`;
    }
    return newUrl;
  }
  return null;
};

const title = (state: State) => {
  if (state.page === name && state.embedPage) {
    return `${state.players[state.selectedPlayerId].name} - MockDraftable`;
  }
  return null;
};

const urlPattern = /\/embed\/([a-z0-9-]*)/;

const actions = (path: string, args: { [string]: string }) => {
  const match = path.match(urlPattern);
  if (match && match[1]) {
    let page = 'GRAPH';
    if (args.page === 'MEASURABLES') {
      page = 'MEASURABLES';
    } else if (args.page === 'COMPARISONS') {
      page = 'COMPARISONS';
    }

    return [selectPlayer(match[1], args.position), updateEmbedPage(page)];
  }
  return null;
};

export { url, title, actions, name };
