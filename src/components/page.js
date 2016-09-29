import React from 'react';

export default class Page extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (window && history && history.pushState) {
      window.history.pushState({}, nextProps.title, nextProps.url);
      window.document.title = nextProps.title;
    } else if (window) {
      window.location = nextProps.url;
    }
  }

  render() { return null; }
}
