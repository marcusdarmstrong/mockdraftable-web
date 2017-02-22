// @flow

import React from 'react';

type Props = {
  currentPage: number,
  hasNextPage: boolean,
  selectPage: number => void,
};

const SearchPaging = ({ currentPage, hasNextPage, selectPage }: Props) =>
  (<div className="btn-toolbar justify-content-between mb-2">
    <div className="btn-group mr-2">
      {currentPage <= 1
        ? <button type="button" className="btn btn-secondary" disabled>{'\u2190'}</button>
        : <button
          type="button"
          className="btn btn-secondary"
          onClick={() => selectPage(currentPage - 1)}
        >
          {'\u2190'}
        </button>
      }
    </div>
    <div className="btn-group">
      {currentPage >= 3 &&
        <button type="button" className="btn btn-secondary" onClick={() => selectPage(1)}>1</button>
      }
      {currentPage >= 4 &&
        <button type="button" className="btn btn-secondary" disabled>{'\u2026'}</button>
      }
      {currentPage >= 2 &&
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => selectPage(currentPage - 1)}
        >
          {currentPage - 1}
        </button>
      }
      <button type="button" className="btn btn-secondary active">{currentPage}</button>
      {hasNextPage &&
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => selectPage(currentPage + 1)}
        >
          {currentPage + 1}
        </button>
      }
    </div>
    <div className="btn-group ml-2">
      <button
        type="button"
        className="btn btn-secondary"
        disabled={!hasNextPage}
        onClick={() => selectPage(currentPage + 1)}
      >
        {'\u2192'}
      </button>
    </div>
  </div>);

export default SearchPaging;
