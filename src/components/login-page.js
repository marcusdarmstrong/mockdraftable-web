// @flow

import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import type { Action } from '../redux/actions';
import LoginForm from './login-form';
import SignUpForm from './sign-up-form';
import type { UserId } from '../types/state';
import { selectLoggedInUserId, updateModalType } from '../redux/actions';

type Props = {
  loginUser: (UserId) => void,
};

type State = {
  isLogin: boolean,
};

class LoginPage extends React.Component<Props, State> {
  state: State = {
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
  (dispatch: Dispatch<Action>) => ({
    loginUser: userId => dispatch([selectLoggedInUserId(userId), updateModalType('None')]),
  }),
)(LoginPage);
