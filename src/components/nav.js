// @flow

import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import type { Action } from '../actions';
import type { Position } from '../types/domain';
import type { ModalType } from '../types/state';
import Page from './page';
import { updateModalType } from '../actions';


type Props = {
  title: string,
  selectedPosition: Position,
  showPosition: boolean,
  url: string,
  showModal: ModalType => void,
};

const constructUrl = (state) => {
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
  }
  return '/';
};

const Nav = ({ title, selectedPosition, url, showPosition, showModal }: Props) => (
  <nav className="navbar navbar-light fixed-top bg-faded navbar-toggleable-xl">
    <Page title={`${title} - MockDraftable`} url={url} />
    <a className="navbar-nav" href="/"><img src="/public/icon.png" alt="MockDraftable" /></a>
    <span className="navbar-brand mr-auto">{title}</span>
    {showPosition && <form className="form-inline">
      <button
        type="button"
        className="btn"
        onClick={() => showModal('PositionSelector')}
        style={{
          backgroundColor: selectedPosition.color,
          color: '#fff',
        }}
      >
        {selectedPosition.abbreviation}
      </button>
    </form>}
  </nav>
);

export default connect(
  state => ({
    title: state.selectedPlayerId ? state.players[state.selectedPlayerId].name : 'MockDraftable',
    selectedPosition: state.positions[state.selectedPositionId],
    url: constructUrl(state),
    showPosition: !!state.selectedPlayerId,
  }),
  (dispatch: Dispatch<Action>) => ({
    showModal: component => dispatch(updateModalType(component)),
  }),
)(Nav);
