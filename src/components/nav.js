// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { Position } from '../types/domain';
import Page from './page';

type Props = {
  title: string,
  selectedPosition: Position;
  url: string,
};

const showModal = () => false;

const constructUrl = (state) => {
  if (state.selectedPlayerId) {
    let url = `/player/${state.selectedPlayerId}`;
    if (state.selectedPositionId !== state.players[state.selectedPlayerId].positions.primary) {
      url = `${url}?position=${state.selectedPositionId}`;
    }
    return url;
  } else if (state.searchOptions) {
    const { beginYear, endYear, sortOrder, page } = state.searchOptions;
    let url = '/search?';
    url = `${url}beginYear=${beginYear}&endYear=${endYear}&sortOrder=${sortOrder}&page=${page}`;
    if (state.searchOptions.measurableId) {
      url = `${url}&measurableId=${state.searchOptions.measurableId}`;
    }
    return url;
  }
  return '/';
};

const Nav = ({ title, selectedPosition, url }: Props) => (
  <nav className="navbar navbar-light fixed-top bg-faded navbar-toggleable-xl">
    <Page title={`${title} - MockDraftable`} url={url} />
    <a className="navbar-nav" href="/"><img src="/public/icon.png" alt="MockDraftable" /></a>
    <span className="navbar-brand mr-auto">{title}</span>
    <form className="form-inline">
      <button
        type="button"
        className="btn"
        onClick={showModal}
        style={{
          backgroundColor: selectedPosition.color,
          color: '#fff',
        }}
      >
        {selectedPosition.abbreviation}
      </button>
    </form>
  </nav>
);

export default connect(state => ({
  title: state.selectedPlayerId ? state.players[state.selectedPlayerId].name : 'MockDraftable',
  selectedPosition: state.positions[state.selectedPositionId],
  url: constructUrl(state),
}))(Nav);
