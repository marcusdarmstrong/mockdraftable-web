// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Action } from '../actions';
import AboutSection from './about-section';
import MeasurablesSection from './measurables-section';
import ComparisonSection from './comparison-section';
import { updateModalType } from '../actions';
import PlayerBar from './player-bar';

type Props = {
  showEmbedModal: () => void,
};

/* eslint-disable jsx-a11y/no-static-element-interactions */
const PlayerPage = ({ showEmbedModal }: Props) =>
  <div>
    <PlayerBar />
    <div className="window container-fluid col-12 col-lg-10 offset-lg-1">
      <div className="row flex-md-row-reverse">
        <div className="col-12 col-md-7">
          <MeasurablesSection />
        </div>
        <div className="col-12 col-md-5">
          <AboutSection />
          <ComparisonSection />
        </div>
        <p className="col-12 text-center">
          <small>Want to display this data on your site? <span className="btn-link" onClick={showEmbedModal}>Get the code to embed!</span></small>
        </p>
      </div>
    </div>
  </div>
;
/* eslint-enable jsx-a11y/no-static-element-interactions */

export default connect(() => ({}), (dispatch: Dispatch<Action>) => ({
  showEmbedModal: () => { dispatch(updateModalType('Embed')); },
}))(PlayerPage);
