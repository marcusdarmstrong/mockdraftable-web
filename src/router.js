// @flow

import * as playerRoute from './routes/player-route';
import * as searchRoute from './routes/search-route';
import * as positionRoute from './routes/position-route';
import * as embedRoute from './routes/embed-route';
import * as homeRoute from './routes/home-route';
import * as addPlayerRoute from './routes/add-player-route';

import type { State } from './types/state';
import type { Action } from './redux/actions';

const routeConfig = [
  playerRoute,
  searchRoute,
  embedRoute,
  positionRoute,
  homeRoute,
  addPlayerRoute,
];

const actionsConfig = routeConfig.map(r => r.actions);
const urlConfig = routeConfig.map(r => r.url);
const titleConfig = routeConfig.map(r => r.title);

// I feel like this should be somewhere in lodash, but alas.
function findResult<A>(funcs: Array<(...*) => A>, ...args: *): ?A {
  return funcs.reduce((res, func) => res || func(...args), null);
}

const getTitle = (state: State): string =>
  findResult(titleConfig, state) || 'MockDraftable';

const translateUrl = (path: string, args: { [string]: string }): Array<Action> =>
  findResult(actionsConfig, path, args) || [];

const translateState = (state: State): ?string => findResult(urlConfig, state);

// This would ideally depend on a polyfill for this functionality, but it didn't
// seem like there were any really reasonable solutions here, sadly.
const parseUrl = (urlstring: string) => {
  const components = urlstring.split('?');
  if (components.length === 1) {
    return { path: components[0], args: {} };
  }
  const search = components[1];
  const data = decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"');
  const args = data === '' ? {} : JSON.parse(`{"${data}"}`);
  return {
    path: components[0],
    args,
  };
};

export { translateUrl, translateState, getTitle, parseUrl };
