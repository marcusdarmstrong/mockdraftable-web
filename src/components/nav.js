// @flow

import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import type { Action } from '../redux/actions';
import type { State, ModalType } from '../types/state';
import Page from './page';
import Link from './link';
import { updateModalType } from '../redux/actions';
import { translateState, getTitle } from '../router';

type Props = {
  title: string,
  url: string,
  showModal: ModalType => void,
  isSearch: boolean,
  isPositionDetail: boolean,
  isContributor: boolean,
  isAddPlayer: boolean,
};

type CompState = {
  isCollapsed: boolean,
};

class Nav extends React.Component<Props, CompState> {
  state: CompState = {
    isCollapsed: true,
  };

  props: Props;

  toggleCollapsed = () => {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  };

  render() {
    const { isAddPlayer, isSearch, isPositionDetail } = this.props;
    const { title, url, showModal, isContributor } = this.props;
    const itemClass = 'nav-item nav-link';
    const activeItemClass = `${itemClass} active`;
    let collapseClasses = 'collapse navbar-collapse ml-2';
    collapseClasses = this.state.isCollapsed ? collapseClasses : `${collapseClasses} show`;
    const togglerClasses = 'navbar-toggler navbar-toggler-right';

    return (
      <nav className="navbar navbar-dark fixed-top bg-faded navbar-expand-sm">
        <button className={togglerClasses} type="button" onClick={this.toggleCollapsed}>
          <span className="navbar-toggler-icon" />
        </button>
        <Page title={title} url={url} />
        <Link className="navbar-brand mr-auto p-0" href="/">
          <img src="/public/icon-white.png" alt="MockDraftable" />
          MockDraftable
        </Link>
        <div className={collapseClasses} id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <Link className={isSearch ? activeItemClass : itemClass} href="/search">Advanced Search</Link>
            <Link className={isPositionDetail ? activeItemClass : itemClass} href="/positions">
              Position Data
            </Link>
            {isContributor &&
              <Link className={isAddPlayer ? activeItemClass : itemClass} href="/add-player">Add Player</Link>
            }
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
    title: getTitle(state) || 'MockDraftable',
    url: translateState(state),
    isSearch: state.page === 'SEARCH',
    isPositionDetail: state.page === 'POSITION',
    isAddPlayer: state.page === 'ADD_PLAYER',
    isContributor: state.isContributor,
  }),
  (dispatch: Dispatch<Action>) => ({
    showModal: component => dispatch(updateModalType(component)),
  }),
)(Nav);
