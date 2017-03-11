// @flow

import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import type { Action } from '../actions';
import type { State, ModalType } from '../types/state';
import Page from './page';
import { updateModalType } from '../actions';


type Props = {
  title: string,
  url: string,
  showModal: ModalType => void,
};

const constructUrl = (state: State) => {
  if (state.selectedPlayerId) {
    let url = `/player/${state.selectedPlayerId}`;
    if (state.selectedPositionId !== state.players[state.selectedPlayerId].positions.primary) {
      url = `${url}?position=${state.selectedPositionId}`;
    }
    return url;
  } else if (state.searchOptions) {
    const { beginYear, endYear, sortOrder, page } = state.searchOptions;
    let url = `/search?position=${state.selectedPositionId}`;
    url = `${url}&beginYear=${beginYear}&endYear=${endYear}&sort=${sortOrder}&page=${page}`;
    if (state.searchOptions.measurableId) {
      url = `${url}&measurable=${state.searchOptions.measurableId}`;
    }
    return url;
  } else if (state.positionDetail) {
    let url = '/positions';
    if (state.selectedPositionId !== 'ATH') {
      url = `${url}?position=${state.selectedPositionId}`;
    }
    return url;
  }
  return '/';
};

const Nav = ({ title, url, showModal }: Props) => (
  <nav className="navbar navbar-inverse fixed-top bg-faded navbar-toggleable-xl">
    <Page title={`${title} - MockDraftable`} url={url} />
    <a className="navbar-nav" href="/"><img src="/public/icon-white.png" alt="MockDraftable" /></a>
    <span className="navbar-brand mr-auto">MockDraftable</span>
    <button
      type="button"
      className="btn btn-search"
      onClick={() => { showModal('TypeAhead'); }}
    >
      <svg width="23" height="23" viewBox="5 0 65 65" className="search">
        <circle cx="30" cy="30" r="15" />
        <line x1="40" y1="40" x2="60" y2="60" />
      </svg>
    </button>
  </nav>
);

export default connect(
  (state: State) => ({
    title: state.selectedPlayerId ? state.players[state.selectedPlayerId].name : 'MockDraftable',
    url: constructUrl(state),
  }),
  (dispatch: Dispatch<Action>) => ({
    showModal: component => dispatch(updateModalType(component)),
  }),
)(Nav);
