// @flow

import { Sorts } from './types/domain';
import { HttpRedirect, HttpError, throw404 } from './http';
import { selectPlayer, updateSelectedPosition, updateSearchOptions } from './actions';
import getPlayerByOldId from './services/players/get-player-by-old-id';
import type { Action } from './actions';

export default async (path: string, args: {[string]: string}): Promise<Action[]> => {
  if (path === '/search') {
    const actions = [];
    if (args.position) {
      actions.push(updateSelectedPosition(args.position));
    }
    // TODO: Sanitize years
    if (args.measurable) {
      actions.push(updateSearchOptions({
        beginYear: Number(args.beginYear),
        endYear: Number(args.endYear),
        measurableId: args.measurable,
        sortOrder: (args.sort === Sorts.DESC) ? Sorts.DESC : Sorts.ASC,
        page: Number(args.page) || 1,
      }));
    } else {
      actions.push(updateSearchOptions({
        beginYear: Number(args.beginYear),
        endYear: Number(args.endYear),
        sortOrder: (args.sort === Sorts.DESC) ? Sorts.DESC : Sorts.ASC,
        page: Number(args.page) || 1,
      }));
    }
    return actions;
  } else if (path.startsWith('/player/')) {
    const segments = path.split('/');
    if (segments.length < 3) {
      throw new HttpError(404, path);
    }
    const possibleOldId = Number(segments[2]);
    if (!isNaN(possibleOldId)) {
      const newPlayer = await getPlayerByOldId(possibleOldId) || throw404(path);
      throw new HttpRedirect(301, `/player/${newPlayer.url}`);
    }

    return [selectPlayer(segments[2], args.position)];
  } else if (path.startsWith('/embed/')) {
    // TODO
  } else if (path.startsWith('/players/')) {
    throw new HttpRedirect(301, '/search');
  } else if (path.startsWith('/player_embed/')) {
    const segments = path.split('/');
    if (segments.length < 3) {
      throw new HttpError(404, path);
    }
    const oldId = parseInt(segments[2], 10);
    if (isNaN(oldId) || oldId < 1) {
      throw new HttpError(404, path);
    }
    const newPlayer = await getPlayerByOldId(oldId) || throw404(path);

    throw new HttpRedirect(301, `/embed/${newPlayer.url}`);
  } else if (path === '/') {
    return [];
  }
  throw new HttpError(404, path);

  /* 'player/:oldid'
  'players/:year'
  'position/:id'
  'player_embed/:oldid'
  'player_embed/:oldid/show/graph' */
};
