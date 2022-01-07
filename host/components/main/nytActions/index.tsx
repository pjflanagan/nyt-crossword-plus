import React, { FC, useState } from 'react';
import { Row, Button, Card, Badge } from 'antd';
import { QuestionCircleOutlined, OrderedListOutlined } from '@ant-design/icons';

import { Countdown } from './countdown';

const NytActionsComponents: FC = () => {
  const [needsUpdate, _setNeedsUpdate] = useState(false);
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
              {`Play Today's Puzzle`}
            </Button>,
            <Button
              key="leaderboard"
              icon={<OrderedListOutlined />}
              href="//www.nytimes.com/puzzles/leaderboards"
              target="_blank"
              type="link"
            >
              {`See Today's Leaderboard`}
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