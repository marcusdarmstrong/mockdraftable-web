// @flow

import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import type { Action } from '../actions';

import Nav from './nav';
import PositionSelector from './position-selector';
import Modal from './modal';
import PlayerPage from './player-page';
import HomePage from './home-page';
import SearchPage from './search-page';
import Typeahead from './typeahead';
import type { ModalType } from '../types/state';
import { updateModalType } from '../actions';
import EmbededPlayer from './embeded-player';
import EmbedCode from './embed-code';

type Props = {
  isPlayerPage: boolean,
  isSearchPage: boolean,
  isHomePage: boolean,
  modalType: ModalType,
  closeModal: () => void,
  embed: boolean,
};

export default connect(
  state => ({
    isPlayerPage: !!state.selectedPlayerId,
    isSearchPage: !!state.searchOptions,
    isHomePage: !state.selectedPlayerId && !state.searchOptions,
    embed: state.embed,
    modalType: state.modalType,
  }),
  (dispatch: Dispatch<Action>) => ({
    closeModal: () => dispatch(updateModalType('None')),
  }),
)(({ isPlayerPage, isSearchPage, isHomePage, modalType, closeModal, embed }: Props) => {
  if (embed) {
    return <EmbededPlayer />;
  }
  let title = 'Select a position';
  if (modalType === 'TypeAhead') {
    title = 'Search for a player by name';
  } else if (modalType === 'Embed') {
    title = 'Embed this player';
  }
  return (<div>
    {modalType !== 'None' && (
      <Modal
        title={title}
        closeModal={closeModal}
      >
        {modalType === 'PositionSelector' && <PositionSelector />}
        {modalType === 'TypeAhead' && <Typeahead />}
        {modalType === 'Embed' && <EmbedCode />}
      </Modal>
    )}
    <Nav />
    {isPlayerPage && <PlayerPage />}
    {isSearchPage && <SearchPage />}
    {isHomePage && <HomePage />}
    {/* eslint-disable jsx-a11y/no-static-element-interactions */}
    {modalType !== 'None' && <div className="modal-backdrop show" onClick={() => closeModal()} />}
    {/* eslint-enable jsx-a11y/no-static-element-interactions */}
  </div>);
});
