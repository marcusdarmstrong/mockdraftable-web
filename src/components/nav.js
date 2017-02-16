// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { Position } from '../types/domain';

type Props = {
  title: string,
  selectedPosition: Position;
};

const showModal = () => false;

const Nav = ({ title, selectedPosition }: Props) => (
  <nav className="navbar navbar-light fixed-top bg-faded navbar-toggleable-xl">
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
  title: state.selectedPlayerId ? state.players.get(state.selectedPlayerId).name : 'MockDraftable',
  selectedPosition: state.positions.get(state.selectedPositionId),
}))(Nav);
