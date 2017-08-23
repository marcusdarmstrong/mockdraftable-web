// @flow

import React from 'react';

type Props = {
  title: string,
  url: string,
};

let hasReplaced = false;
const updateHistory = (title, url) => {
  if (hasReplaced) {
    window.history.pushState({}, title, url);
  } else {
    window.history.replaceState({}, title, url);
    hasReplaced = true;
  }
};

export default class Page extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return typeof window !== 'undefined' && (
      this.props.url !== nextProps.url
        && `${window.location.pathname}${window.location.search}` !== nextProps.url
    );
  }

  props: Props;

  render() {
    if (typeof window !== 'undefined' && history && history.pushState) {
      updateHistory(this.props.title, this.props.url);
      window.document.title = this.props.title;
      window.scrollTo(0, 0);
    } else if (typeof window !== 'undefined') {
      window.location = this.props.url;
    }
    return null;
  }
}
