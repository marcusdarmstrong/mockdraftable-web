// @flow

import React from 'react';

type Props = {
  title: string,
  url: string,
};

export default class Page extends React.Component {
  componentWillReceiveProps(nextProps: Props) {
    if (this.props.url !== nextProps.url) {
      if (window && history && history.pushState) {
        window.history.pushState({}, nextProps.title, nextProps.url);
        window.document.title = nextProps.title;
      } else if (window) {
        window.location = nextProps.url;
      }
    }
  }

  render() { return null; }
}
