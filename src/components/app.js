// @flow

import React from 'react';
import { connect } from 'react-redux';

import Nav from './nav';
import PositionSelector from './position-selector';
import Modal from './modal';
import PlayerPage from './player-page';
import HomePage from './home-page';
import SearchPage from './search-page';
import Typeahead from './typeahead';
import type { ModalType } from '../types/state';
import { updateModalType } from '../actions';

type Props = {
  isPlayerPage: boolean,
  isSearchPage: boolean,
  isHomePage: boolean,
  modalType: ModalType,
  closeModal: () => void,
};

export default connect(state => ({
  isPlayerPage: !!state.selectedPlayerId,
  isSearchPage: !!state.searchOptions,
  isHomePage: !state.selectedPlayerId && !state.searchOptions,
  modalType: state.modalType,
}), dispatch => ({
  closeModal: () => dispatch(updateModalType('None')),
}))(({ isPlayerPage, isSearchPage, isHomePage, modalType, closeModal }: Props) =>
  <div>
    {modalType !== 'None' && (
      <Modal
        title={modalType === 'TypeAhead' ? 'Search for a player by name' : 'Select a position'}
        closeModal={closeModal}
      >
        {modalType === 'PositionSelector' && <PositionSelector />}
        {modalType === 'TypeAhead' && <Typeahead />}
      </Modal>
    )}
    <Nav />
    {isPlayerPage && <PlayerPage />}
    {isSearchPage && <SearchPage />}
    {isHomePage && <HomePage />}
    {/* eslint-disable jsx-a11y/no-static-element-interactions */}
    {modalType !== 'None' && <div className="modal-backdrop show" onClick={() => closeModal()} />}
    {/* eslint-enable jsx-a11y/no-static-element-interactions */}
  </div>,
);
