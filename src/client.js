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
import searchDefaults from './search-defaults';
import { selectNewSearch, updateSelectedPosition } from './actions';

const store = createStore(
  reducer,
  window.INITIAL_STATE,
  applyMiddleware(batcher, thunk.withExtraArgument(clientApi)),
);

window.onpopstate = () => {
  const search = document.location.search.substring(1);
  const data = decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"');
  const args = JSON.parse(`{"${data}"}`);
  if (document.location.pathname === '/search') {
    store.dispatch(updateSelectedPosition(args.position || 'ATH'));
    store.dispatch(selectNewSearch(Object.assign({}, searchDefaults, args)));
  }
};

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('react-container'),
);
