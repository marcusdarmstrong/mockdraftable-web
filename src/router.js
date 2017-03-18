// @flow

import { Sorts } from './types/domain';
import { HttpError } from './packages/http';
import {
  selectPlayer,
  updateSelectedPosition,
  selectNewSearch,
  updateEmbedPage,
  selectDistributionStats,
} from './redux/actions';
import type { Action } from './redux/actions';

export default async (path: string, args: {[string]: string}): Promise<Action[]> => {
  if (path === '/search') {
    const actions = [];
    if (args.position) {
      actions.push(updateSelectedPosition(args.position));
    }
    // TODO: Sanitize years
    if (args.measurable) {
      actions.push(selectNewSearch({
        beginYear: Number(args.beginYear) || 1999,
        endYear: Number(args.endYear) || 2017,
        measurableId: args.measurable,
        sortOrder: (args.sort === Sorts.ASC) ? Sorts.ASC : Sorts.DESC,
        page: Number(args.page) || 1,
      }));
    } else {
      actions.push(selectNewSearch({
        beginYear: Number(args.beginYear) || 1999,
        endYear: Number(args.endYear) || 2017,
        sortOrder: (args.sort === Sorts.ASC) ? Sorts.ASC : Sorts.DESC,
        page: Number(args.page) || 1,
      }));
    }
    return actions;
  } else if (path.startsWith('/player/')) {
    const segments = path.split('/');
    if (segments.length < 3) {
      throw new HttpError(404, path);
    }

    return [selectPlayer(segments[2], args.position)];
  } else if (path.startsWith('/embed/')) {
    const segments = path.split('/');
    if (segments.length < 3) {
      throw new HttpError(404, path);
    }

    let page = 'GRAPH';
    if (args.page === 'MEASURABLES') {
      page = 'MEASURABLES';
    } else if (args.page === 'COMPARISONS') {
      page = 'COMPARISONS';
    }

    return [selectPlayer(segments[2], args.position), updateEmbedPage(page)];
  } else if (path === '/positions') {
    return [selectDistributionStats(args.position || 'ATH')];
  } else if (path === '/') {
    return [];
  }
  throw new HttpError(404, path);
};
