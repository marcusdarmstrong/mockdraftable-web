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
import type { State, ModalType } from '../types/state';
import { updateModalType } from '../actions';
import EmbededPlayer from './embeded-player';
import EmbedCode from './embed-code';
import PositionPage from './position-page';

type Props = {
  isPlayerPage: boolean,
  isSearchPage: boolean,
  isHomePage: boolean,
  isPositionPage: boolean,
  modalType: ModalType,
  closeModal: () => void,
  embed: boolean,
  positionName: string,
};

export default connect(
  (state: State) => ({
    isPlayerPage: !!state.selectedPlayerId,
    isSearchPage: !!state.searchOptions,
    isHomePage: !state.selectedPlayerId && !state.searchOptions && !state.positionDetail,
    isPositionPage: state.positionDetail,
    embed: state.embed,
    modalType: state.modalType,
    positionName: state.positions[state.selectedPositionId].plural,
  }),
  (dispatch: Dispatch<Action>) => ({
    closeModal: () => dispatch(updateModalType('None')),
  }),
)(({
  isPlayerPage,
  isSearchPage,
  isHomePage,
  modalType,
  closeModal,
  embed,
  isPositionPage,
  positionName,
}: Props) => {
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
    {isPositionPage && <PositionPage positionName={positionName} />}
    {/* eslint-disable jsx-a11y/no-static-element-interactions */}
    {modalType !== 'None' && <div className="modal-backdrop show" onClick={() => closeModal()} />}
    {/* eslint-enable jsx-a11y/no-static-element-interactions */}
    {!embed &&
      <div className="col-12 col-md-6 offset-md-3">
        <p className="text-muted text-center mt-2">
          <small>
            &copy; MockDraftable, 2011-2017.
            <br />
            MockDraftable is developed in the open by <a href="https://twitter.com/mockdraftable">Marcus Armstrong</a>, on <a href="https://github.com/marcusdarmstrong/mockdraftable-web">GitHub</a>.
            Feel free to submit any issues you find with the site, or to contribute to the project.
          </small>
        </p>
      </div>
    }
  </div>);
});
