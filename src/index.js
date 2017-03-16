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
import { updateLoggedInUserId } from './actions';
import layout from './layout';
import App from './components/app';
import reducer from './reducer';
import init from './init';
import translate from './router';
import { measurablesByKey } from './measurables';
import { positions } from './positions';
import serverApi from './api/server';
import bundles from './bundles.json';
import { HttpRedirect, HttpError } from './http';
import {
  setAuthTokenCookieForUserId,
  readAuthTokenFromCookies,
  deleteAuthTokenFromCookies,
} from './auth-token';


const isRequestNotHttps = (req: $Request) => req.header('x-forwarded-proto') !== 'https';
const requireHttps = isNotHttps => (req: $Request, res, next) => {
  if (isNotHttps(req)) {
    res.redirect(301, `https://${req.hostname}${req.url}`);
  } else {
    next();
  }
};


init().then((stores) => {
  const app = express();

  const api = serverApi(stores);

  app.set('x-powered-by', false);
  app.use(responseTime());
  app.set('port', (process.env.PORT || 5000));
  app.use(compression());

  const env = process.env.NODE_ENV || 'development';
  if (env === 'production') {
    app.use(requireHttps(isRequestNotHttps));
  }

  app.use(cookieParser());

  app.use('/public', express.static(`${__dirname}/../public`, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // one year
  }));
  app.use(favicon(`${__dirname}/../public/favicon.ico`));

  app.get('/api/search', async (req: $Request, res) => {
    res.send(JSON.stringify(await api.fetchSearchResults(
      JSON.parse(req.query.opts),
      req.query.pos,
    )));
  });
  app.get('/api/player', async (req: $Request, res) => {
    res.send(JSON.stringify(await api.fetchPlayer(req.query.id)));
  });
  app.get('/api/comparisons', async (req: $Request, res) => {
    res.send(JSON.stringify(await api.fetchComparisons(req.query.id, req.query.pos)));
  });
  app.get('/api/percentiles', async (req: $Request, res) => {
    res.send(JSON.stringify(await api.fetchPercentiles(req.query.id, req.query.pos)));
  });
  app.get('/api/typeahead', async (req: $Request, res) => {
    res.send(JSON.stringify(await api.fetchTypeAheadResults(req.query.search)));
  });
  app.get('/api/stats', async (req: $Request, res) => {
    res.send(JSON.stringify(await api.fetchDistributionStats(req.query.pos)));
  });
  app.get('/api/does-user-exist', async (req: $Request, res) => {
    res.send(JSON.stringify(await api.doesUserExist(req.query.email)));
  });
  app.get('/api/logout', async (req: $Request, res) => {
    deleteAuthTokenFromCookies(res);
    res.send(JSON.stringify(await api.logout()));
  });

  app.use(bodyParser.json());
  app.post('/api/login', async (req: $Request, res) => {
    if (!req.body
      || typeof req.body.email !== 'string'
      || typeof req.body.password !== 'string'
    ) {
      throw new HttpError(400, '/api/login requires a email and password');
    }
    const result = await api.loginUser(req.body.email, req.body.password);
    if (result.userId) {
      setAuthTokenCookieForUserId(res, result.userId);
    }
    res.send(JSON.stringify(result));
  });

  app.post('/api/create-user', async (req: $Request, res) => {
    const result = await api.createUser(req.body.email, req.body.password);
    if (result.userId) {
      setAuthTokenCookieForUserId(res, result.userId);
    }
    res.send(JSON.stringify(result));
  });

  const validPositions = positions.filter(pos => !!stores.positionEligibilityStore.get(pos.id));
  const posById = validPositions.reduce((a, pos) => Object.assign({}, a, { [pos.id]: pos }), {});

  app.get('*', async (req: $Request, res) => {
    const store: Store<State, BatchedAction> = createStore(reducer, {
      measurables: measurablesByKey,
      positions: posById,
      comparisons: {},
      percentiles: {},
      players: {},
      selectedPositionId: 'ATH',
      modalType: 'None',
      embed: false,
      positionDetail: false,
      distributionStatistics: {},
      loggedInUserId: null,
    }, applyMiddleware(batcher, thunk.withExtraArgument(api)));
    try {
      store.dispatch(updateLoggedInUserId(readAuthTokenFromCookies(req)));
      await store.dispatch(await translate(req.path, req.query));
    } catch (e) {
      if (e instanceof HttpRedirect) {
        res.redirect(e.code, e.location);
        return;
      }
    }
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
  });

  const port = app.get('port').toString();
  app.listen(port);
  console.log(`MockDraftable now listening on ${port}`);
}).catch((e: Error) => { console.log(e.stack); });
