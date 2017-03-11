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
  isSearch: boolean,
  isPositionDetail: boolean,
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

class Nav extends React.Component {
  state: {
    isCollapsed: boolean,
  } = {
    isCollapsed: true,
  };

  props: Props;

  toggleCollapsed = () => {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  };

  render() {
    const { title, url, isSearch, isPositionDetail, showModal } = this.props;
    const itemClass = 'nav-item nav-link';
    const activeItemClass = `${itemClass} active`;
    let collapseClasses = 'collapse navbar-collapse ml-2';
    collapseClasses = this.state.isCollapsed ? collapseClasses : `${collapseClasses} show`;
    const togglerClasses = 'navbar-toggler navbar-toggler-right';

    return (
      <nav className="navbar navbar-inverse fixed-top bg-faded navbar-toggleable-sm">
        <button className={togglerClasses} type="button" onClick={this.toggleCollapsed}>
          <span className="navbar-toggler-icon" />
        </button>
        <Page title={`${title} - MockDraftable`} url={url} />
        <a className="navbar-brand mr-auto p-0" href="/">
          <img src="/public/icon-white.png" alt="MockDraftable" />
          MockDraftable
        </a>
        <div className={collapseClasses} id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className={isSearch ? activeItemClass : itemClass} href="/search">Advanced Search</a>
            <a className={isPositionDetail ? activeItemClass : itemClass} href="/positions">
              Position Data
            </a>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-search navbar-toggler-right"
          onClick={() => { showModal('TypeAhead'); }}
        >
          <svg width="25" height="25" viewBox="5 0 65 65" className="search">
            <circle cx="30" cy="30" r="15" />
            <line x1="40" y1="40" x2="60" y2="60" />
          </svg>
        </button>
      </nav>
    );
  }
}

export default connect(
  (state: State) => ({
    title: state.selectedPlayerId ? state.players[state.selectedPlayerId].name : 'MockDraftable',
    url: constructUrl(state),
    isSearch: !!state.searchOptions,
    isPositionDetail: state.positionDetail,
  }),
  (dispatch: Dispatch<Action>) => ({
    showModal: component => dispatch(updateModalType(component)),
  }),
)(Nav);
