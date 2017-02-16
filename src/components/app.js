// @flow

import React from 'react';
import { connect } from 'react-redux';

import Nav from './nav';
import PositionSwitcher from './position-switcher';
import Modal from './modal';
import PlayerPage from './playerpage';
import HomePage from './homepage';
import SearchPage from './searchpage';
import Typeahead from './typeahead';

type Props = {
  isPlayerPage: boolean,
  isSearchPage: boolean,
  isHomePage: boolean,
};

export default connect(state => ({
  isPlayerPage: !!state.selectedPlayerId,
  isSearchPage: !!state.searchOptions,
  isHomePage: !state.selectedPlayerId && !state.searchOptions,
}))(({ isPlayerPage, isSearchPage, isHomePage }: Props) =>
  <div>
    <Modal>
      <PositionSwitcher />
      <Typeahead />
    </Modal>
    <Nav />
    {isPlayerPage && <PlayerPage />}
    {isSearchPage && <SearchPage />}
    {isHomePage && <HomePage />}
  </div>,
);
