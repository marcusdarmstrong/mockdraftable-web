// @flow

import React from 'react';
import { range } from 'lodash';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';

import type { State } from '../types/state';
import type { School, PlayerId } from '../types/domain';
import api from '../api/client';
import { selectPlayer, loadSchools } from '../redux/actions';
import type { AddPlayerDetails } from '../types/api';
import type { Action } from '../redux/actions';

type Props = {
  schools: Array<School>;
  selectNewPlayer: (PlayerId) => void,
  loadSchool: (School) => void,
};

class AddPlayerPage extends React.Component {
  state: AddPlayerDetails = {
    firstName: '',
    lastName: '',
    draftYear: 2017,
    schoolKey: 0,
    newSchoolName: null,
  };

  props: Props;

  handleFirstName = (e: SyntheticInputEvent) => {
    this.setState({ firstName: e.target.value });
  };

  handleLastName = (e: SyntheticInputEvent) => {
    this.setState({ lastName: e.target.value });
  };

  handleDraftYear = (e: SyntheticInputEvent) => {
    this.setState({ draftYear: Number(e.target.value) });
  };

  handleSchool = (e: SyntheticInputEvent) => {
    this.setState({ schoolKey: Number(e.target.value) });
  };

  handleNewSchool = (e: SyntheticInputEvent) => {
    this.setState({ newSchoolName: e.target.value });
  };

  handleSubmit = async (e: SyntheticInputEvent) => {
    e.preventDefault();
    const details = this.state;
    const response = await api.addPlayer(details);
    if (response.success) {
      await this.props.selectNewPlayer(response.playerId);
    }
  };

  render() {
    return (
      <div className="window container-fluid col-12 col-lg-10 offset-lg-1">
        <div className="row">
          <div className="col-12 col-lg-6 offset-lg-3">
            <h3>Add a Player</h3>
            <form onSubmit={this.handleSubmit}>
              <div className="form-group row">
                <label htmlFor="first-name" className="col-4 col-form-label">First Name</label>
                <div className="col-8">
                  <input className="form-control" type="text" id="first-name" onChange={this.handleFirstName} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="last-name" className="col-4 col-form-label">Last Name</label>
                <div className="col-8">
                  <input className="form-control" type="text" id="last-name" onChange={this.handleLastName} />
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="draft-year" className="col-4 col-form-label">Draft Year</label>
                <div className="col-8">
                  <select className="form-control" id="draft-year" defaultValue="2017" onChange={this.handleDraftYear}>
                    {range(1999, 2017 + 1)
                      .map(year => <option key={year} value={year}>{year}</option>)
                    }
                  </select>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="school" className="col-4 col-form-label">School</label>
                <div className="col-8">
                  <select className="form-control" id="draft-year" defaultValue="None" onChange={this.handleSchool}>
                    <option value="0">None</option>
                    <option value="-1">Add new School</option>
                    {this.props.schools
                      .map(({ id, name }) => <option key={id} value={id}>{name}</option>)
                    }
                  </select>
                </div>
              </div>
              {this.state.schoolKey === -1 &&
                <div className="form-group row">
                  <label htmlFor="new-school-name" className="col-4 col-form-label">New School</label>
                  <div className="col-8">
                    <input className="form-control" type="text" id="new-school-name" onChange={this.handleNewSchool} />
                  </div>
                </div>
              }
              <input type="submit" className="btn btn-outline-primary" value="Add Player" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state: State) => ({ schools: state.schools }),
  (dispatch: Dispatch<Action>) => ({
    selectNewPlayer: id => dispatch(selectPlayer(id)),
    loadSchool: school => dispatch(loadSchools([school])),
  }),
)(AddPlayerPage);
