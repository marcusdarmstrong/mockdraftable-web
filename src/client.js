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
import searchDefaults from './redux/search-defaults';
import { doSearch, updateModalType } from './redux/actions';

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
  const search = document.location.search.substring(1);
  const data = decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"');
  const args = data === '' ? {} : JSON.parse(`{"${data}"}`);
  if (document.location.pathname === '/search') {
    store.dispatch(doSearch({
      beginYear: Number(args.beginYear) || searchDefaults.beginYear,
      endYear: Number(args.endYear) || searchDefaults.endYear,
      page: Number(args.page) || searchDefaults.page,
      sortOrder: args.sort || searchDefaults.sortOrder,
      measurableId: args.measurable,
    }, args.position || 'ATH'));
  }
};

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('react-container'),
);
