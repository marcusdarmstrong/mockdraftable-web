// @flow

import React from 'react';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import type { Action } from '../redux/actions';
import { translateUrl, parseUrl } from '../router';

export type Props = {
  href: string,
  title?: string,
  className?: string,
  children: React$Element<any>,
  callback: (string) => void,
  style?: { [string]: string },
};

class Link extends React.Component<Props> {
  static defaultProps = {
    className: '',
    title: '',
    style: {},
  }

  props: Props;

  click = (event: SyntheticEvent<HTMLInputElement>) => {
    if (event.ctrlKey || event.metaKey) { return; }
    event.preventDefault();
    this.props.callback(this.props.href);
  }

  render() {
    return (
      <a
        href={this.props.href}
        onClick={this.click}
        className={this.props.className}
        title={this.props.title}
        style={this.props.style}
      >
        {this.props.children}
      </a>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch: Dispatch<Action>) => ({
    callback: (href) => {
      const url = parseUrl(href);
      dispatch(translateUrl(url.path, url.args));
    },
  }),
)(Link);
