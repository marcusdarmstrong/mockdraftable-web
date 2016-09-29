// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import App from './components/app';
import { reducer } from './state';

const state = window.INITIAL_STATE;
const store = createStore(reducer, state);

ReactDOM.render(
  <App store={store} />,
  document.getElementById('react-container')
);
