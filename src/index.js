// @flow

import express from 'express';
import path from 'path';
import compression from 'compression';
import favicon from 'serve-favicon';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import layout from './layout';
import App from './components/app';
import reducer from './state';

const app = express();

app.set('port', (process.env.PORT || 5000));
app.use(compression());
app.use('/public', express.static(path.join(__dirname, '..', 'public'), {
  maxAge: 1000 * 60 * 60 * 24 * 365, // one year
}));
app.use(favicon(`${__dirname}/../public/favicon.ico`));
app.get('/', (req, res) => {
  const state = {};
  const store = createStore(reducer, state);
  const jsBundleName = process.env.JS_BUNDLE_NAME || 'public/bundle.js';
  const cssBundleName = process.env.CSS_BUNDLE_NAME || 'public/bundle.css';
  res.send(
    layout(
      'MockDraftable',
      renderToString(<App store={store} />),
      state,
      jsBundleName,
      cssBundleName,
    )
  );
});

app.listen(app.get('port'));
