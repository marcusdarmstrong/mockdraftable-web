// @flow

import { Sorts } from '../types/domain';
import type { State, SearchOptions } from '../types/state';
import { doSearch } from '../redux/actions';

const name = 'SEARCH';

const url = (state: State) => {
  if (state.page === name) {
    const { beginYear, endYear, sortOrder, page } = state.searchOptions;
    let newUrl = `/search?position=${state.selectedPositionId}`;
    newUrl = `${newUrl}&beginYear=${beginYear}&endYear=${endYear}&sort=${sortOrder}&page=${page}`;
    if (state.searchOptions.measurableId) {
      newUrl = `${newUrl}&measurable=${state.searchOptions.measurableId}`;
    }
    return newUrl;
  }
  return null;
};

const title = (state: State) => (state.page === name) ? 'Advanced Search - MockDraftable' : null;

const actions = (path: string, args: { [string]: string }) => {
  if (path === '/search') {
    const options: SearchOptions = {
      beginYear: Number(args.beginYear) || 1999,
      endYear: Number(args.endYear) || 2018,
      sortOrder: (args.sort === Sorts.ASC) ? Sorts.ASC : Sorts.DESC,
      page: Number(args.page) || 1,
    };

    if (args.measurable) {
      options.measurableId = args.measurable;
    }
    return [doSearch(options, args.position || 'ATH')];
  }
  return null;
};

export { url, title, actions, name };
