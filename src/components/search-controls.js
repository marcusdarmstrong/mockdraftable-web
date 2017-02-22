// @flow

import React from 'react';

import { Sorts } from '../types/domain';
import type { Sort, MeasurableId } from '../types/domain';
import { allMeasurables } from '../measurables';

type Props = {
  selectedMeasurable?: MeasurableId,
  selectedSortOrder: Sort,
  selectMeasurable: (?MeasurableId) => void,
  toggleSortOrder: () => void,
};

const defaultVal = 'name';

const SearchControls = ({
  selectedMeasurable,
  selectMeasurable,
  selectedSortOrder,
  toggleSortOrder,
}: Props) => <div>
  <div className="form-inline justify-content-start mb-2">
    <label className="mr-2 mb-0" htmlFor="measurable-selector">Sort By</label>
    <select
      id="measurable-selector"
      className="custom-select"
      onChange={
        ({ target }) => selectMeasurable((target.value === defaultVal) ? undefined : target.value)
      }
      defaultValue={selectedMeasurable || defaultVal}
    >
      <option value={defaultVal}>Name</option>
      {allMeasurables.map(m => <option key={m.key} value={m.id}>{m.name}</option>)}
    </select>
    {selectedSortOrder === Sorts.DESC
      ? (<div className="btn-group ml-auto">
        <button type="button" className="btn btn-secondary active">{'\u2B06'}</button>
        <button type="button" className="btn btn-secondary" onClick={toggleSortOrder}>
          {'\u2B07'}
        </button>
      </div>)
      : (<div className="btn-group ml-auto">
        <button type="button" className="btn btn-secondary" onClick={toggleSortOrder}>
          {'\u2B06'}
        </button>
        <button type="button" className="btn btn-secondary active">{'\u2B07'}</button>
      </div>)
    }
  </div>
</div>;

SearchControls.defaultProps = {
  selectedMeasurable: undefined,
};

export default SearchControls;
