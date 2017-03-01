// @flow

import React from 'react';

export type Props = {
  href: string,
  title?: string,
  className?: string,
  children: Element<any>,
  callback: (string) => void,
};

export default class Link extends React.Component {
  static defaultProps = {
    className: '',
    title: '',
  }

  props: Props;

  click = (event: SyntheticEvent) => {
    event.preventDefault();
    this.props.callback(this.props.href);
  }

  render() {
    return (<a href={this.props.href} onClick={this.click} className={this.props.className}>
      {this.props.children}
    </a>);
  }
}
