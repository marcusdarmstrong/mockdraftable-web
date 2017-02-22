// @flow

import fetch from 'isomorphic-fetch';

import type { Api } from '../types/api';
import type { PlayerId, PositionId } from '../types/domain';
import type { SearchOptions } from '../types/state';

const clientApi: Api = {
  fetchPlayer: async (id: PlayerId) =>
    (await fetch(`./api/player?id=${id}`)).json(),
  fetchComparisons: async (id: PlayerId, pos: PositionId) =>
    (await fetch(`./api/comparisons?id=${id}&pos=${pos}`)).json(),
  fetchPercentiles: async (id: PlayerId, pos: PositionId) =>
    (await fetch(`./api/percentiles?id=${id}&pos=${pos}`)).json(),
  fetchSearchResults: async (opts: SearchOptions, pos: PositionId) =>
    (await fetch(`./api/search?opts=${JSON.stringify(opts)}&pos=${pos}`)).json(),
};

export default clientApi;
