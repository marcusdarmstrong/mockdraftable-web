// @flow

import type { State } from '../types/state';
import { selectPlayer } from '../redux/actions';

const name = 'PLAYER';

const url = (state: State) => {
  if (state.page === name && !state.embedPage) {
    let newUrl = `/player/${state.selectedPlayerId}`;
    if (state.selectedPositionId !== state.players[state.selectedPlayerId].positions.primary) {
      newUrl = `${newUrl}?position=${state.selectedPositionId}`;
    }
    return newUrl;
  }
  return null;
};

const title = (state: State) => {
  if (state.page === name && !state.embedPage) {
    return `${state.players[state.selectedPlayerId].name} - MockDraftable`;
  }
  return null;
};

const urlPattern = /\/player\/([a-z0-9-]*)/;

const actions = (path: string, args: { [string]: string }) => {
  const match = path.match(urlPattern);
  if (match && match[1]) {
    return [selectPlayer(match[1], args.position)];
  }
  return null;
};

export { url, title, actions, name };
