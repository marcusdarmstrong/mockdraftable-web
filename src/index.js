// @flow

import 'babel-polyfill';
import express from 'express';
import type { $Request } from 'express';

import compression from 'compression';
import favicon from 'serve-favicon';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore, applyMiddleware } from 'redux';
import type { Store } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import responseTime from 'response-time';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import batcher from './redux-batcher';
import type { BatchedAction } from './redux-batcher';

import type { State } from './types/state';
import type { LoginResponse } from './types/api';
import { updateLoggedInUserId } from './actions';
import layout from './layout';
import App from './components/app';
import reducer from './reducer';
import init from './init';
import translate from './router';
import serverApi from './api/server';
import bundles from './bundles.json';
import { HttpError, errorHandler, asyncCatch } from './http';
import {
  setAuthTokenCookieForUserId,
  readAuthTokenFromCookies,
  deleteAuthTokenFromCookies,
} from './auth-token';
import requireHttps from './require-https';
import defaultState from './default-state';
import errorPage from './error';

init().then((stores) => {
  const app = express();

  const api = serverApi(stores);

  app.set('trust proxy');
  app.set('x-powered-by', false);
  app.use(responseTime());
  app.set('port', (process.env.PORT || 5000));
  app.use(compression());

  const env = process.env.NODE_ENV || 'development';
  if (env === 'production') {
    app.use(requireHttps);
  }

  app.use(cookieParser());

  app.use('/public', express.static(`${__dirname}/../public`, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // one year
  }));
  app.use(favicon(`${__dirname}/../public/favicon.ico`));

  app.get('/api/search', asyncCatch(async (req: $Request, res) => {
    res.json(await api.fetchSearchResults(
      JSON.parse(req.query.opts),
      req.query.pos,
    ));
  }));
  app.get('/api/player', asyncCatch(async (req: $Request, res) => {
    res.json(await api.fetchPlayer(req.query.id));
  }));
  app.get('/api/comparisons', asyncCatch(async (req: $Request, res) => {
    res.json(await api.fetchComparisons(req.query.id, req.query.pos));
  }));
  app.get('/api/percentiles', asyncCatch(async (req: $Request, res) => {
    res.json(await api.fetchPercentiles(req.query.id, req.query.pos));
  }));
  app.get('/api/typeahead', asyncCatch(async (req: $Request, res) => {
    res.json(await api.fetchTypeAheadResults(req.query.search));
  }));
  app.get('/api/stats', asyncCatch(async (req: $Request, res) => {
    res.json(await api.fetchDistributionStats(req.query.pos));
  }));
  app.get('/api/does-user-exist', asyncCatch(async (req: $Request, res) => {
    res.json(await api.doesUserExist(req.query.email));
  }));
  app.get('/api/logout', asyncCatch(async (req: $Request, res) => {
    deleteAuthTokenFromCookies(res);
    res.json(await api.logout());
  }));

  app.use(bodyParser.json());
  app.post('/api/login', asyncCatch(async (req: $Request, res) => {
    if (!req.body
      || typeof req.body.email !== 'string'
      || typeof req.body.password !== 'string'
    ) {
      throw new HttpError(400, '/api/login requires a email and password');
    }
    const result: LoginResponse = await api.loginUser(req.body.email, req.body.password);
    if (result.success) {
      setAuthTokenCookieForUserId(res, result.userId);
    }
    res.json(result);
  }));

  app.post('/api/create-user', asyncCatch(async (req: $Request, res) => {
    if (!req.body
      || typeof req.body.email !== 'string'
      || typeof req.body.password !== 'string'
    ) {
      throw new HttpError(400, '/api/createUser requires a email and password');
    }

    const result: LoginResponse = await api.createUser(req.body.email, req.body.password);
    if (result.success) {
      setAuthTokenCookieForUserId(res, result.userId);
    }
    res.json(result);
  }));

  app.get('*', asyncCatch(async (req: $Request, res) => {
    const store: Store<State, BatchedAction> = createStore(
      reducer,
      defaultState(stores.positionEligibilityStore),
      applyMiddleware(batcher, thunk.withExtraArgument(api)),
    );

    store.dispatch(updateLoggedInUserId(readAuthTokenFromCookies(req)));

    const actions = await translate(req.path, req.query);
    await store.dispatch(actions);

    const jsBundleName: string = bundles.js_bundle_name || 'public/bundle.js';
    const cssBundleName: string = bundles.css_bundle_name || 'public/bundle.css';
    res.send(
      layout(
        'MockDraftable',
        renderToString(<Provider store={store}><App /></Provider>),
        store.getState(),
        jsBundleName,
        cssBundleName,
      ),
    );
  }));

  app.use(errorHandler(errorPage));

  const port = app.get('port').toString();
  app.listen(port, () => { console.log(`MockDraftable now listening on ${port}`); });
});

