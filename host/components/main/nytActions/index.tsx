import React, { FC } from 'react';
import { Row, Button, Card, Badge } from 'antd';
import { QuestionCircleOutlined, OrderedListOutlined } from '@ant-design/icons';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

import { Countdown } from './countdown';

type NytActionsProps = {
  needsUpdate: boolean;
}

const NytActionsComponents: FC<NytActionsProps> = ({
  needsUpdate
}) => {
  const breakpoint = useBreakpoint();

  const playPrompt = (!breakpoint.md)
    ? 'Play'
    : `Play Today's Puzzle`

  const leaderboardPrompt = (!breakpoint.md)
    ? 'Scores'
    : `See Today's Leaderboard`

  return (
    <Row className="nytActionsRow" style={{ margin: '0.5em 0' }}>
      <Badge.Ribbon
        text="Leaderboard Needs Update Today"
        color="red"
        style={{ opacity: needsUpdate ? 1 : 0 }}
      >
        <Card
          title="Time Until Next Crossword"
          style={{ width: '100%' }}
          actions={[
            <Button
              key="play"
              icon={<QuestionCircleOutlined />}
              href="//www.nytimes.com/crosswords/game/mini"
              target="_blank"
              type="link"
            >
              {playPrompt}
            </Button>,
            <Button
              key="leaderboard"
              icon={<OrderedListOutlined />}
              href="//www.nytimes.com/puzzles/leaderboards"
              target="_blank"
              type="link"
            >
              {leaderboardPrompt}
            </Button>
          ]}
        >
          <Countdown />
        </Card>
      </Badge.Ribbon>
    </Row>
  );
}


export { NytActionsComponents }