// @flow

import React from 'react';
import { connect } from 'react-redux';

import Link from './link';
import type { Player, Position, PositionId } from '../types/domain';
import type { PlayerPageState } from '../types/state';

type Props = {
  selectedPlayer: Player,
  selectedPositionId: PositionId,
  positions: Array<Position>,
};

const AboutSection = ({ selectedPlayer, selectedPositionId, positions }: Props) => (
  <div>
    <h3>About</h3>
    <dl>
      <dt>Draft Class:</dt>
      <dd>
        <Link
          href={`/search?beginYear=${selectedPlayer.draft}&endYear=${selectedPlayer.draft}`}
        >
          {selectedPlayer.draft}
        </Link>
      </dd>
      <dt>Position:</dt>
      <dd className="h4">
        <div className="list-inline">
          {positions.map(p => (
            <Link
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
            </Link>
          ))}
        </div>
      </dd>
      {selectedPlayer.school && <dt>School:</dt>}
      {selectedPlayer.school && <dd>{selectedPlayer.school}</dd>}
    </dl>
  </div>
);

export default connect((state: PlayerPageState) => ({
  selectedPlayer: state.players[state.selectedPlayerId],
  selectedPositionId: state.selectedPositionId,
  positions: state.players[state.selectedPlayerId].positions.all
    .map(i => state.positions[i]),
}))(AboutSection);
