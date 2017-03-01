// @flow

import React from 'react';
import { connect } from 'react-redux';

import type { Player, Position, PositionId } from '../types/domain';
import type { State } from '../types/state';

type Props = {
  selectedPlayer: Player,
  selectedPositionId: PositionId,
  positions: Array<Position>,
};

const AboutSection = ({ selectedPlayer, selectedPositionId, positions }: Props) =>
  <div>
    <h3>About</h3>
    <dl>
      <dt>Draft Class:</dt>
      <dd>{selectedPlayer.draft}</dd>
      <dt>Position:</dt>
      <dd className="h4">
        <div className="list-inline">
          {positions.map(p =>
            <a
              href={
                selectedPlayer.positions.primary === p.id
                  ? `/player/${selectedPlayer.id}`
                  : `/player/${selectedPlayer.id}?position=${p.id}`
              }
              key={p.key}
              className="list-inline-item btn btn-sm"
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
      {selectedPlayer.school && <dt>School:</dt>}
      {selectedPlayer.school && <dd>{selectedPlayer.school}</dd>}
    </dl>
  </div>;

export default connect((state: State) => ({
  selectedPlayer: state.players[state.selectedPlayerId],
  selectedPositionId: state.selectedPositionId,
  positions: state.players[state.selectedPlayerId].positions.all
    .map(i => state.positions[i]),
}))(AboutSection);
