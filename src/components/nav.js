import React from 'react';

type Props = {
  title: string,
};

export default ({ title }: Props) => (
  <nav className="navbar navbar-light navbar-fixed-top bg-faded">
    <a className="navbar-nav" href="/"><img src="/public/icon.png" alt="MockDraftable" /></a>
    <span className="navbar-brand">{title}</span>
    <button type="button" className="btn btn-primary pull-xs-right">OT</button>
  </nav>
);
