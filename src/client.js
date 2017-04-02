// @flow

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { mousetrap, Mousetrap, bindShortcuts } from 'redux-shortcuts';
import thunk from 'redux-thunk';
import batcher from './packages/redux-batcher';
import App from './components/app';
import reducer from './redux/reducer';
import clientApi from './api/client';
import { updateModalType } from './redux/actions';
import { translateUrl, parseUrl } from './router';

const store = createStore(
  reducer,
  window.INITIAL_STATE,
  applyMiddleware(batcher, thunk.withExtraArgument(clientApi)),
);

bindShortcuts(
  [['s'], () => updateModalType('TypeAhead'), true],
  [['esc'], () => updateModalType('None')],
)(store.dispatch);

mousetrap.stopCallback = (e, element, combo, sequence) => {
  if (combo === 'esc') {
    return false;
  }
  return Mousetrap.stopCallback(e, element, combo, sequence);
};

window.onpopstate = () => {
  const url = parseUrl(`${document.location.pathname}${document.location.search}`);
  store.dispatch(translateUrl(url.path, url.args));
};

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('react-container'),
);
