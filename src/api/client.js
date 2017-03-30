// @flow

import fetch from 'isomorphic-fetch';

import type { Api } from '../types/api';
import type { PlayerId, PositionId } from '../types/domain';
import type { SearchOptions } from '../types/state';

const clientApi: Api = {
  fetchPlayer: async (id: PlayerId) =>
    (await fetch(`/api/player?id=${id}`)).json(),
  fetchComparisons: async (id: PlayerId, pos: PositionId) =>
    (await fetch(`/api/comparisons?id=${id}&pos=${pos}`)).json(),
  fetchSearchResults: async (opts: SearchOptions, pos: PositionId) =>
    (await fetch(`/api/search?opts=${JSON.stringify(opts)}&pos=${pos}`)).json(),
  fetchTypeAheadResults: async (search: string) =>
    (await fetch(`/api/typeahead?search=${search}`)).json(),
  fetchDistributionStats: async (pos: PositionId) =>
    (await fetch(`/api/stats?pos=${pos}`)).json(),
  fetchMultiplePlayers: async (ids: Array<PlayerId>) =>
    (await fetch(`/api/multiple-players?ids=${JSON.stringify(ids)}`)).json(),
  fetchMultiplePercentiles: async (ids: Array<PlayerId>, pos: PositionId) =>
    (await fetch(`/api/multiple-percentiles?ids=${JSON.stringify(ids)}&pos=${pos}`)).json(),
  loginUser: async (email: string, password: string) =>
    (await fetch('/api/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        email,
        password,
      }),
    })).json(),
  createUser: async (email: string, password: string) =>
    (await fetch('/api/create-user', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        email,
        password,
      }),
    })).json(),
  doesUserExist: async (email: string) =>
    (await fetch(`/api/does-user-exist?email=${email}`)).json(),
  logout: async () =>
    (await fetch('/api/logout', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
    })).json(),
};

export default clientApi;
