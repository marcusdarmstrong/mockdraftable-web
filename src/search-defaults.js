// @flow

import { Sorts } from './types/domain';
import type { SearchOptions } from './types/state';

const searchDefaults: SearchOptions = {
  beginYear: 1999,
  endYear: 2017,
  page: 1,
  sortOrder: Sorts.DESC,
};

export default searchDefaults;
