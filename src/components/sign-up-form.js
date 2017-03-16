// @flow

import React from 'react';
import type { UserId } from '../types/state';
import api from '../api/client';

export const EMAIL_REX =
  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

type Props = {
  loginUser: (UserId) => void,
};

class SignUpForm extends React.Component {
  state: {
    email: string,
    password: string,
    error: ?string,
    emailError: ?boolean,
    emailErrorMessage: ?string,
  } = {
    email: '',
    password: '',
    error: null,
    emailError: null,
    emailErrorMessage: null,
  };

  props: Props;

  handleEmailChange = async (e: SyntheticInputEvent) => {
    const email = e.target.value;
    this.setState({ email });

    const isInvalidEmail = !EMAIL_REX.test(email);
    if (isInvalidEmail) {
      this.setState({
        emailError: true,
        emailErrorMessage: 'Double check that email address.',
      });
    } else {
      const userInfo = await api.doesUserExist(email);
      if (this.state.email === email) {
        if (userInfo.userId) {
          this.setState({
            emailError: true,
            emailErrorMessage: 'Sorry, that email address is taken.',
          });
        } else {
          this.setState({ emailError: false, emailErrorMessage: null });
        }
      }
    }
  };

  handlePasswordChange = (e: SyntheticInputEvent) => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = async (e: SyntheticInputEvent) => {
    e.preventDefault();
    if (this.state.email === '' || !EMAIL_REX.test(this.state.email)) {
      this.setState({ error: 'Please provide a valid email.' });
      return;
    }
    if (this.state.password === '') {
      this.setState({ error: 'Please provide a password.' });
      return;
    }

    const loginResponse = await api.createUser(this.state.email, this.state.password);

    if (loginResponse.userId) {
      this.props.loginUser(loginResponse.userId);
    } else {
      this.setState({ error: loginResponse.error });
    }
  };

  render() {
    let emailTextNode = (
      <small className="form-text text-muted">
        {"We'll never share your email with anyone else."}
      </small>
    );

    if (this.state.emailError === false) {
      emailTextNode = (
        <small className="form-text text-success">
          {'Looks good.'}
        </small>
      );
    } else if (this.state.emailError === true) {
      emailTextNode = (
        <small className="form-text text-danger">
          {this.state.emailErrorMessage}
        </small>
      );
    }

    return (
      <div className="mb-2">
        {this.state.error && (
          <div className="alert alert-danger">{this.state.error}</div>
        )}
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" autoFocus className="form-control form-control-lg" id="email" value={this.state.email} onChange={this.handleEmailChange} />
            {emailTextNode}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control form-control-lg" id="password" value={this.state.password} onChange={this.handlePasswordChange} />
          </div>
          <button type="submit" className="btn btn-primary btn-lg btn-block">Sign Up</button>
        </form>
      </div>
    );
  }
}

export default SignUpForm;
