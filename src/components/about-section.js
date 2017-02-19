// @flow

import React from 'react';
import { connect } from 'react-redux';

import type { PlayerId, Position, PositionId } from '../types/domain';

type Props = {
  selectedPlayerId: PlayerId,
  selectedPositionId: PositionId,
  positions: Array<Position>,
  draft: number,
  school?: string,
};

const buttonClasses = 'list-inline-item btn btn-sm';

const AboutSection = ({ selectedPlayerId, selectedPositionId, positions, draft, school }: Props) =>
  <div>
    <h3>About</h3>
    <dl>
      <dt>Draft Class:</dt>
      <dd>{draft}</dd>
      <dt>Position:</dt>
      <dd className="h4">
        <div className="list-inline">
          {positions.map(p =>
            <a
              href={`/player/${selectedPlayerId}?position=${p.id}`}
              key={p.key}
              className={buttonClasses}
              style={
                selectedPositionId === p.id ?
                {
                  backgroundColor: p.color,
                  color: '#FFF',
                } : {
                  borderColor: p.color,
                  color: p.color,
                }
              }
              title={p.name}
            >
              {p.abbreviation}
            </a>,
          )}
        </div>
      </dd>
      {school && <dt>School:</dt>}
      {school && <dd>{school}</dd>}
    </dl>
  </div>;

AboutSection.defaultProps = {
  school: undefined,
};

export default connect(state => ({
  selectedPlayerId: state.selectedPlayerId,
  selectedPositionId: state.selectedPositionId,
  positions: state.players[state.selectedPlayerId].positions.all
    .map(i => state.positions[i]),
  draft: state.players[state.selectedPlayerId].draft,
  school: state.players[state.selectedPlayerId].school,
}))(AboutSection);
