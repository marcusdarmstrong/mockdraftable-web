// @flow

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import batcher from './redux-batcher';
import App from './components/app';
import reducer from './reducer';
import clientApi from './api/client';

const store = createStore(
  reducer,
  window.INITIAL_STATE,
  applyMiddleware(batcher, thunk.withExtraArgument(clientApi)),
);

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('react-container'),
);
