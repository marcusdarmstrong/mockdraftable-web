// @flow

import React from 'react';
import type { UserId } from '../types/state';
import api from '../api/client';

type Props = {
  loginUser: (UserId) => void,
};

class LoginForm extends React.Component {
  state: {
    email: string,
    password: string,
    error: ?string,
  } = {
    email: '',
    password: '',
    error: null,
  };

  props: Props;

  handleEmailChange = (e: SyntheticInputEvent) => {
    this.setState({ email: e.target.value });
  };

  handlePasswordChange = (e: SyntheticInputEvent) => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = async (e: SyntheticInputEvent) => {
    e.preventDefault();
    if (this.state.email === '') {
      this.setState({ error: 'Please provide an email.' });
      return;
    }
    if (this.state.password === '') {
      this.setState({ error: 'Please provide a password.' });
      return;
    }

    const loginResponse = await api.loginUser(this.state.email, this.state.password);

    if (loginResponse.success) {
      this.props.loginUser(loginResponse.userId);
    } else {
      this.setState({ error: loginResponse.error });
    }
  };

  render() {
    return (
      <div className="mb-2">
        {this.state.error && (
          <div className="mt-2 alert alert-danger">{this.state.error}</div>
        )}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" autoFocus className="form-control form-control-lg" id="email" value={this.state.email} onChange={this.handleEmailChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control form-control-lg" id="password" value={this.state.password} onChange={this.handlePasswordChange} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-block">Log In</button>
        </form>
      </div>
    );
  }
}

export default LoginForm;
