// @flow

import React from 'react';
import { connect } from 'react-redux';
import LoginForm from './login-form';
import SignUpForm from './sign-up-form';
import type { UserId } from '../types/state';
import { updateLoggedInUserId, updateModalType } from '../actions';

type Props = {
  loginUser: (UserId) => void,
};

class LoginPage extends React.Component {
  state: {
    isLogin: boolean,
  } = {
    isLogin: true,
  };

  props: Props;

  toggleIsLogin = () => {
    this.setState({ isLogin: !this.state.isLogin });
  };

  render() {
    if (this.state.isLogin) {
      return (
        <div>
          <ul className="nav nav-tabs nav-justified mb-2">
            <li className="nav-item">
              <span className="nav-link active">Log In</span>
            </li>
            <li className="nav-item">
              <button className="nav-link btn-link btn-block" onClick={this.toggleIsLogin}>Sign Up</button>
            </li>
          </ul>
          <LoginForm loginUser={this.props.loginUser} />
        </div>
      );
    }
    return (
      <div>
        <ul className="nav nav-tabs nav-justified mb-2">
          <li className="nav-item">
            <button className="nav-link btn-link btn-block" onClick={this.toggleIsLogin}>Log In</button>
          </li>
          <li className="nav-item">
            <span className="nav-link active">Sign Up</span>
          </li>
        </ul>
        <SignUpForm loginUser={this.props.loginUser} />
      </div>
    );
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    loginUser: userId => dispatch([updateLoggedInUserId(userId), updateModalType('None')]),
  }),
)(LoginPage);
