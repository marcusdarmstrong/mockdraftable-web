// @flow

import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import type { Action } from '../redux/actions';

import Nav from './nav';
import PositionSelector from './position-selector';
import Modal from './modal';
import PlayerPage from './player-page';
import HomePage from './home-page';
import SearchPage from './search-page';
import Typeahead from './typeahead';
import type { State, ModalType } from '../types/state';
import { updateModalType, logout as doLogout } from '../redux/actions';
import EmbededPlayer from './embeded-player';
import EmbedCode from './embed-code';
import PositionPage from './position-page';
import LoginPage from './login-page';
import AddPlayerPage from './add-player-page';

type Props = {
  isPlayerPage: boolean,
  isSearchPage: boolean,
  isHomePage: boolean,
  isPositionPage: boolean,
  isAddPlayerPage: boolean,
  modalType: ModalType,
  closeModal: () => void,
  openLoginModal: () => void,
  logout: () => void,
  embed: boolean,
  positionName: string,
  isUserLoggedIn: boolean,
};

export default connect(
  (state: State) => ({
    isPlayerPage: state.page === 'PLAYER',
    isSearchPage: state.page === 'SEARCH',
    isHomePage: state.page === 'HOME',
    isPositionPage: state.page === 'POSITION',
    isAddPlayerPage: state.page === 'ADD_PLAYER',
    embed: state.embed,
    modalType: state.modalType,
    positionName: state.positions[state.selectedPositionId].plural,
    isUserLoggedIn: !!state.loggedInUserId,
  }),
  (dispatch: Dispatch<Action>) => ({
    closeModal: () => dispatch(updateModalType('None')),
    openLoginModal: () => dispatch(updateModalType('Login')),
    logout: () => dispatch(doLogout()),
  }),
)(({
  isPlayerPage,
  isSearchPage,
  isHomePage,
  isAddPlayerPage,
  modalType,
  closeModal,
  openLoginModal,
  logout,
  embed,
  isPositionPage,
  positionName,
  isUserLoggedIn,
}: Props) => {
  if (embed) {
    return <EmbededPlayer />;
  }
  let title = 'Select a position';
  if (modalType === 'TypeAhead') {
    title = 'Search for a player by name';
  } else if (modalType === 'Embed') {
    title = 'Embed this player';
  } else if (modalType === 'Login') {
    title = 'Contributor login';
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
        {modalType === 'Login' && <LoginPage />}
      </Modal>
    )}
    <Nav />
    {isPlayerPage && <PlayerPage />}
    {isSearchPage && <SearchPage />}
    {isHomePage && <HomePage />}
    {isPositionPage && <PositionPage positionName={positionName} />}
    {isAddPlayerPage && <AddPlayerPage />}
    {/* eslint-disable jsx-a11y/no-static-element-interactions */}
    {modalType !== 'None' && <div className="modal-backdrop show" onClick={() => closeModal()} />}
    {/* eslint-enable jsx-a11y/no-static-element-interactions */}
    {!embed &&
      <div className="col-12 col-md-6 offset-md-3">
        <p className="text-muted text-center mt-2">
          <small>
            &copy; MockDraftable, 2011-2017.
            <br />
            {isUserLoggedIn
              ? <button className="btn btn-link btn-sm" onClick={logout}>Log out</button>
              : <button className="btn btn-link btn-sm" onClick={openLoginModal}>
                Contributor Login
              </button>
            }
            <br />
            MockDraftable is developed in the open by <a href="https://twitter.com/mockdraftable">Marcus Armstrong</a>, on <a href="https://github.com/marcusdarmstrong/mockdraftable-web">GitHub</a>.
            Feel free to submit any issues you find with the site, or to contribute to the project.
          </small>
        </p>
      </div>
    }
  </div>);
});
