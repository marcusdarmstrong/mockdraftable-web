// @flow

import React from 'react';
import { connect } from 'react-redux';

import type { PlayerId, PositionId } from '../types/domain';
import type { PlayerPageState } from '../types/state';

type Props = {
  selectedPlayerId: PlayerId,
  selectedPositionId: PositionId,
};

const EmbedCode = ({ selectedPlayerId, selectedPositionId }: Props) => (
  <div>
    <p>To embed this player information onto your site, just use one of these html snippets</p>
    <h6>To highlight the player&apos;s spider graph, use:</h6>
    <pre>{`<iframe src="https://www.mockdraftable.com/embed/${selectedPlayerId}?position=${selectedPositionId}&page=GRAPH" width="480" height="651" frameborder="0" scrolling="no"></iframe>`}</pre>
    <h6>To highlight the player&apos;s measurements, use:</h6>
    <pre>{`<iframe src="https://www.mockdraftable.com/embed/${selectedPlayerId}?position=${selectedPositionId}&page=MEASURABLES" width="480" height="651" frameborder="0" scrolling="no"></iframe>`}</pre>
    <h6>To highlight the player&apos;s comparisons, use:</h6>
    <pre>{`<iframe src="https://www.mockdraftable.com/embed/${selectedPlayerId}?position=${selectedPositionId}&page=COMPARISONS" width="480" height="651" frameborder="0" scrolling="no"></iframe>`}</pre>
  </div>
);

export default connect((state: PlayerPageState) => ({
  selectedPlayerId: state.selectedPlayerId,
  selectedPositionId: state.selectedPositionId,
}))(EmbedCode);
