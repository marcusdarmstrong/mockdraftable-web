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

import batcher from './redux-batcher';
import type { BatchedAction } from './redux-batcher';

import type { State } from './types/state';
import layout from './layout';
import App from './components/app';
import reducer from './reducer';
import init from './init';
import translate from './router';
import { measurablesByKey } from './measurables';
import { positions } from './positions';
import serverApi from './api/server';
import bundles from './bundles.json';
import { HttpRedirect } from './http';

init().then((stores) => {
  const app = express();

  const api = serverApi(stores);

  app.set('x-powered-by', false);
  app.set('port', (process.env.PORT || 5000));
  app.use(compression());
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

  app.get('.well-known/acme-challenge/XH4Lt6PqOCVWwifNvHuR90st0fyShGjWaBDDwoUjrJc', (req: $Request, res) => {
    res.send('XH4Lt6PqOCVWwifNvHuR90st0fyShGjWaBDDwoUjrJc.i8Z5Sr5IA3VD1phPjT0oWE2bVrnLwpaGPE9KjcK9M_I');
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
    }, applyMiddleware(batcher, thunk.withExtraArgument(api)));
    try {
      await store.dispatch(await translate(req.path, req.query));
    } catch (e) {
      if (e instanceof HttpRedirect) {
        res.redirect(e.code, e.location);
        return;
      }
    }
    const jsBundleName = bundles.js_bundle_name || 'public/bundle.js';
    const cssBundleName = bundles.css_bundle_name || 'public/bundle.css';
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
}).catch((e) => { console.log(e.stack); });
