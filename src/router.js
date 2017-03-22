// @flow

import * as playerRoute from './routes/player-route';
import * as searchRoute from './routes/search-route';
import * as positionRoute from './routes/position-route';
import * as embedRoute from './routes/embed-route';
import * as homeRoute from './routes/home-route';

import type { State } from './types/state';

const routeConfig = [playerRoute, searchRoute, embedRoute, positionRoute, homeRoute];

const actionsConfig = routeConfig.map(r => r.actions);
const urlConfig = routeConfig.map(r => r.url);
const titleConfig = routeConfig.map(r => r.title);

const getTitle = (state: State) =>
  titleConfig.reduce((accum, val) => accum || val.apply(null, [state]), null);

const translateUrl = (path: string, args: { [string]: string }) =>
  actionsConfig.reduce((accum, val) => accum || val.apply(null, [path, args]), null);

const translateState = (state: State) =>
  urlConfig.reduce((accum, val) => accum || val.apply(null, [state]), null);

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
